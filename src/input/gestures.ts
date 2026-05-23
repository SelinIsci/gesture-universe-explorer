/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three';

declare global {
  // Loaded from CDN script tags in index.html
  const Hands: any;
  const Camera: any;
  const HAND_CONNECTIONS: any;
  function drawConnectors(ctx: CanvasRenderingContext2D, landmarks: any, conns: any, opts: any): void;
  function drawLandmarks(ctx: CanvasRenderingContext2D, landmarks: any, opts: any): void;
}

export const SWIPE_THRESHOLD = 0.15;
export const SWIPE_COOLDOWN_MS = 700;
export const PINCH_MIN = 0.05;
export const PINCH_MAX = 0.3;
export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 3.5;
export const ZOOM_LERP = 0.1;
export const DETECTION_CONF = 0.55;
export const TRACKING_CONF = 0.55;
export const PINCH_HOLD_MS = 800;
export const PINCH_HOLD_THRESHOLD = 0.06;

export interface GestureCallbacks {
  onSwipe(direction: -1 | 1): void;
  onZoom(zoom: number): void;
  onPinchHold(): void;
  onOpenPalm(): void;
  onHandActive(active: boolean): void;
  onError(message: string): void;
}

export function startGestures(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  cb: GestureCallbacks,
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    cb.onError('Canvas 2D context unavailable.');
    return;
  }

  if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
    cb.onError('MediaPipe scripts failed to load.');
    return;
  }

  let lx = 0.5;
  let canSwipe = true;
  let pinchHoldStart = 0;
  let pinchHoldFired = false;

  const hands = new Hands({
    locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
  });
  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: DETECTION_CONF,
    minTrackingConfidence: TRACKING_CONF,
  });

  hands.onResults((results: any) => {
    canvas.width = 200;
    canvas.height = 150;
    ctx.save();
    ctx.clearRect(0, 0, 200, 150);
    ctx.drawImage(results.image, 0, 0, 200, 150);

    if (results.multiHandLandmarks?.length > 0) {
      const hand = results.multiHandLandmarks[0];
      drawConnectors(ctx, hand, HAND_CONNECTIONS, { color: 'rgba(0,242,255,0.7)', lineWidth: 1.5 });
      drawLandmarks(ctx, hand, { color: '#ff4d6d', radius: 2, lineWidth: 1 });
      cb.onHandActive(true);

      const x = hand[8].x;
      const dx = x - lx;
      if (canSwipe && Math.abs(dx) > SWIPE_THRESHOLD) {
        cb.onSwipe(dx > 0 ? -1 : 1);
        canSwipe = false;
        setTimeout(() => (canSwipe = true), SWIPE_COOLDOWN_MS);
      }

      const pinch = Math.hypot(hand[4].x - hand[8].x, hand[4].y - hand[8].y);
      const target = THREE.MathUtils.mapLinear(pinch, PINCH_MIN, PINCH_MAX, ZOOM_MIN, ZOOM_MAX);
      cb.onZoom(THREE.MathUtils.clamp(target, ZOOM_MIN, ZOOM_MAX));

      // Pinch-and-hold → detail mode
      if (pinch < PINCH_HOLD_THRESHOLD) {
        if (pinchHoldStart === 0) {
          pinchHoldStart = performance.now();
          pinchHoldFired = false;
        } else if (!pinchHoldFired && performance.now() - pinchHoldStart > PINCH_HOLD_MS) {
          cb.onPinchHold();
          pinchHoldFired = true;
        }
      } else {
        pinchHoldStart = 0;
        pinchHoldFired = false;
      }

      // Open palm: all four fingers extended (tip.y < pip.y)
      if (isOpenPalm(hand)) {
        cb.onOpenPalm();
      }

      lx = x;
    } else {
      cb.onHandActive(false);
      pinchHoldStart = 0;
      pinchHoldFired = false;
    }
    ctx.restore();
  });

  try {
    const cam = new Camera(video, {
      onFrame: async () => {
        await hands.send({ image: video });
      },
      width: 640,
      height: 480,
    });
    cam.start();
  } catch (e) {
    cb.onError('Camera access denied or unavailable. Use keyboard controls.');
  }
}

function isOpenPalm(hand: any): boolean {
  // Finger tip > pip (lower y on normalized image means higher in frame).
  // Tips: 8 (index), 12 (middle), 16 (ring), 20 (pinky). PIPs: 6, 10, 14, 18.
  const tips = [8, 12, 16, 20];
  const pips = [6, 10, 14, 18];
  for (let i = 0; i < tips.length; i++) {
    if (hand[tips[i]].y >= hand[pips[i]].y) return false;
  }
  // Thumb tip 4 should be well separated from index base (5)
  const thumbDist = Math.hypot(hand[4].x - hand[5].x, hand[4].y - hand[5].y);
  return thumbDist > 0.08;
}
