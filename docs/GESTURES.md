# Gesture System

Hand tracking is done with [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker). The model returns 21 normalized landmarks per detected hand; this app uses two of them:

- **Landmark 4** — thumb tip
- **Landmark 8** — index-finger tip

`Hands` is configured with `maxNumHands: 1`, `modelComplexity: 1`, and detection / tracking confidence of `0.55`.

## Current gestures

### Swipe → Navigate between planets

Tracks the x-coordinate of landmark 8 across frames. On each frame:

```
dx = hand[8].x − lastX
if |dx| > 0.15 and not in cooldown:
    if dx > 0:  idx − 1   (previous planet)
    else:       idx + 1   (next planet)
    cooldown 700 ms
```

The webcam feed is rendered mirrored (`transform: scaleX(-1)`), so "moving your hand to the right" looks like a left-swipe on the preview — and it intentionally maps to the *previous* planet. Match the mental model of pushing the universe with your hand.

### Pinch → Zoom

```
pinch = distance(hand[4], hand[8])         # normalized 0–1
target = mapLinear(pinch, 0.05, 0.3, 0.5, 3.5)
zoom   = lerp(zoom, target, 0.1)
```

`zoom` is then multiplied into the camera's offset from the focused planet (`size * 4.5 * zoom`). When the hand leaves frame, the last `zoom` value persists — this is a known quirk.

## Planned gestures (target)

These are part of the post-refactor content expansion. None are implemented yet.

| Gesture                  | Action                              | Detection                                                 |
| ------------------------ | ----------------------------------- | --------------------------------------------------------- |
| **Pinch-and-hold**       | Enter detail mode for focused planet | `pinch < 0.06` held steady for 800 ms                     |
| **Open palm**            | Exit detail mode / zoom out to system | All five fingers extended (tip.y < pip.y for each finger) |
| **Thumbs up**            | Start auto-tour through all planets | Thumb extended, other four fingers curled                 |
| **Point with index**     | Re-focus on the indicated planet    | Only landmark 8 extended                                  |

## Keyboard fallback (planned)

Webcam access fails on some devices and is not always desirable. A keyboard layer is planned:

| Key       | Action                                         |
| --------- | ---------------------------------------------- |
| `←` / `→` | Previous / next planet                         |
| `+` / `−` | Zoom in / out                                  |
| `D`       | Toggle detail mode                             |
| `Esc`     | Exit detail mode                               |
| `Space`   | Pause / resume orbital animation               |

The HUD will indicate `KEYBOARD ACTIVE` when no hand has been seen for several seconds, or when camera permission is denied.

## Tuning constants

These currently live as magic numbers inside `onResults` in [`index.html`](../index.html). After refactor they move to a single `constants` block in `src/input/gestures.ts`:

| Constant               | Current value | Meaning                                             |
| ---------------------- | ------------- | --------------------------------------------------- |
| `SWIPE_THRESHOLD`      | `0.15`        | Minimum normalized x-delta to register a swipe      |
| `SWIPE_COOLDOWN_MS`    | `700`         | Lockout window after a swipe                        |
| `PINCH_MIN`            | `0.05`        | Distance treated as "fully pinched" (zoom out limit)|
| `PINCH_MAX`            | `0.30`        | Distance treated as "fully open" (zoom in limit)    |
| `ZOOM_MIN` / `ZOOM_MAX`| `0.5` / `3.5` | Camera distance multiplier range                    |
| `ZOOM_LERP`            | `0.1`         | Smoothing factor toward target zoom                 |
| `DETECTION_CONF`       | `0.55`        | MediaPipe minimum detection confidence              |
| `TRACKING_CONF`        | `0.55`        | MediaPipe minimum tracking confidence               |
