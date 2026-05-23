# Security Notes

This is a client-side, single-page web app with no backend, no user accounts, no persistence, and no analytics. The attack surface is intentionally small. This document captures the threat model and the deliberate trade-offs made.

## Attack surface

| Surface                        | Status                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| User-supplied input fields     | None. The only inputs are webcam frames (consumed locally) and keyboard events.                        |
| Network requests at runtime    | Texture files from `public/textures/` (same origin) + MediaPipe WASM/JS from jsdelivr CDN at load time. |
| Data persistence               | None. No `localStorage`, `sessionStorage`, `IndexedDB`, or cookies are used.                            |
| Third-party scripts            | MediaPipe Hands, camera_utils, drawing_utils (jsdelivr). Google Fonts CSS.                             |
| Camera access                  | Gated by the browser permission prompt. Frames never leave the device.                                 |

## XSS

The Dossier panel ([`src/ui/detailPanel.ts`](../src/ui/detailPanel.ts)) builds HTML via a template literal and assigns to `innerHTML`. All interpolated values come from hardcoded TypeScript modules ([`src/data/planets.ts`](../src/data/planets.ts), [`src/data/trivia.ts`](../src/data/trivia.ts)) and are not user-controlled, so there is no direct XSS vector today.

As defense in depth, every interpolated string is now passed through a small `esc()` HTML escaper, and `typeColor` is validated against a `^#[0-9a-fA-F]{3,8}$` allowlist before being interpolated into a `style` attribute. This protects against a future change that loads trivia from a remote JSON file or an untrusted source.

## Supply chain

MediaPipe is loaded from `https://cdn.jsdelivr.net/npm/@mediapipe/*` script tags in [`index.html`](../index.html) **without Subresource Integrity (SRI) hashes**. The trade-off: MediaPipe's locateFile callback fetches additional WASM and JS chunks from the same CDN at runtime, so pinning the bootstrap scripts with SRI does not pin the deeper dependency tree. Three.js is pulled via npm and bundled by Vite — its supply-chain story is the standard npm-audit one.

Mitigations if higher assurance is needed later:

- Self-host MediaPipe assets under `public/mediapipe/` and update `locateFile` to point there.
- Add a Content Security Policy via a `<meta http-equiv="Content-Security-Policy" ...>` tag restricting `script-src`, `style-src`, and `img-src` to known origins.

## Camera and microphone

Only the camera is requested, via the browser's standard permission flow (initiated by MediaPipe's `Camera` helper). The microphone is not requested. Video frames are processed entirely in-browser and are not transmitted to any external server.

## Reporting issues

For coordinated disclosure, please open a GitHub security advisory rather than a public issue.
