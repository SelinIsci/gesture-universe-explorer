# Gesture System

Hand tracking is done with [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker). The model returns 21 normalized landmarks per detected hand; this app uses a few specific ones:

- **Landmark 4** — thumb tip
- **Landmark 8** — index-finger tip
- **Landmarks 6/10/14/18 (PIPs) + 8/12/16/20 (tips)** — used to detect "open palm"

`Hands` is configured with `maxNumHands: 1`, `modelComplexity: 1`, and detection / tracking confidence of `0.55`. All MediaPipe wiring lives in [`src/input/gestures.ts`](../src/input/gestures.ts).

## Shipped gestures

### Swipe → Navigate between planets

Tracks the x-coordinate of landmark 8 across frames:

```
dx = hand[8].x − lastX
if |dx| > SWIPE_THRESHOLD (0.15) and not in cooldown:
    if dx > 0:  idx − 1   (previous planet)
    else:       idx + 1   (next planet)
    cooldown 700 ms
```

The webcam preview is mirrored (`transform: scaleX(-1)`), so "moving your hand to the right" looks like a left-swipe on the preview — and it intentionally maps to the *previous* planet. The mental model is "push the universe with your hand".

### Pinch → Zoom

```
pinch  = distance(hand[4], hand[8])             # normalized 0–1
target = mapLinear(pinch, 0.05, 0.3, 0.5, 3.5)  # PINCH_MIN..MAX → ZOOM_MIN..MAX
zoom   = lerp(zoom, clamp(target, ZOOM_MIN, ZOOM_MAX), 0.1)
```

`zoom` is then multiplied into the camera's offset from the focused planet (`size * 4.5 * zoom` in orbit mode, `size * 1.8 * zoom` in detail mode). When the hand leaves frame, the last `zoom` value persists.

### Pinch-and-hold → Enter detail mode

While `pinch < PINCH_HOLD_THRESHOLD` (0.06) for longer than `PINCH_HOLD_MS` (800 ms), the gesture fires `onPinchHold()` exactly once. Releasing or moving fingers apart resets the timer.

### Open palm → Exit detail mode

All four fingers extended (tip.y < pip.y) and the thumb separated from the index base by more than 0.08 in normalized space fires `onOpenPalm()`. While open-palm is detected continuously, the only consumer (`main.ts`) idempotently calls `hideDetail()`, so repeats are harmless.

## Keyboard fallback

If the camera permission is denied or no hand is seen for 3 seconds, the HUD switches to `⌨ KEYBOARD ACTIVE`. The keyboard mapping (always active in parallel):

| Key       | Action                            |
| --------- | --------------------------------- |
| `←` / `→` | Previous / next planet            |
| `+` / `−` | Zoom in / out (step ±0.3)         |
| `D`       | Toggle detail mode                |
| `Esc`     | Exit detail mode                  |
| `Space`   | Pause / resume orbital animation  |

## Tuning constants

Exported from [`src/input/gestures.ts`](../src/input/gestures.ts) — change in one place:

| Constant                | Value     | Meaning                                              |
| ----------------------- | --------- | ---------------------------------------------------- |
| `SWIPE_THRESHOLD`       | `0.15`    | Minimum normalized x-delta to register a swipe       |
| `SWIPE_COOLDOWN_MS`     | `700`     | Lockout window after a swipe                         |
| `PINCH_MIN`             | `0.05`    | Distance treated as "fully pinched" (zoom out limit) |
| `PINCH_MAX`             | `0.30`    | Distance treated as "fully open" (zoom in limit)     |
| `ZOOM_MIN` / `ZOOM_MAX` | `0.5/3.5` | Camera distance multiplier range                     |
| `ZOOM_LERP`             | `0.1`     | Smoothing factor toward target zoom                  |
| `PINCH_HOLD_MS`         | `800`     | Hold duration before entering detail mode            |
| `PINCH_HOLD_THRESHOLD`  | `0.06`    | Pinch distance treated as "held closed"              |
| `DETECTION_CONF`        | `0.55`    | MediaPipe minimum detection confidence               |
| `TRACKING_CONF`         | `0.55`    | MediaPipe minimum tracking confidence                |

`ZOOM_MIN` / `ZOOM_MAX` are also re-imported by `main.ts` to bound keyboard zoom-stepping, so the gesture and keyboard zoom ranges stay in sync.

## Adding a new gesture

1. Pick the detection condition (which landmarks, what threshold).
2. Add a new callback to `GestureCallbacks` in `gestures.ts`.
3. Implement the detection inside the existing `hands.onResults` block — guard against repeated firings with a debounce or a "fired once" flag, just like `pinchHoldFired`.
4. Wire it in `main.ts` to one of the existing actions, or add a new action there.
