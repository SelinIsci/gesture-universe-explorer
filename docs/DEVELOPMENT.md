# Development Guide

## Prerequisites

- A modern Chromium- or Firefox-based browser with WebGL 2 and `getUserMedia` support
- A webcam (any resolution; MediaPipe downsamples internally)
- (After refactor) Node.js 20+ and npm 10+

## Current setup — single-file prototype

There is no build step. You can either open `index.html` directly or serve the folder. Serving is recommended because some browsers restrict camera access on `file://` origins.

```powershell
# from the project root
python -m http.server 5500
# then open http://localhost:5500
```

Any other static server works equally well (`npx serve .`, `live-server`, etc.).

## Setup after refactor (planned)

```powershell
npm install
npm run dev      # Vite dev server with HMR, default http://localhost:5173
npm run build    # production bundle into dist/
npm run preview  # serve the production bundle locally
```

## Granting camera permission

The first time the app runs, the browser asks for camera permission. If you accidentally deny it:

- **Chrome / Edge** — click the camera icon at the right end of the address bar and re-enable
- **Firefox** — `about:preferences#privacy` → Permissions → Camera → Settings

The HUD's `HAND STATUS` chip in the top right shows `◌ SEARCHING HAND` until a hand is detected, then switches to `◉ HAND ACTIVE`.

## Debugging tips

### Hand tracking

- The mirrored preview in the bottom-right shows landmark dots (red) and connectors (cyan). If those don't appear, MediaPipe isn't getting frames — check camera permission and that no other app has the camera locked.
- Swipes feel sluggish → reduce `SWIPE_COOLDOWN_MS` in `onResults`.
- Swipes trigger by accident → raise `SWIPE_THRESHOLD` from 0.15 toward 0.2.
- Zoom feels jumpy → raise `ZOOM_LERP` from 0.1 toward 0.2 for snappier response, or lower it for buttery smoothing.

### Three.js scene

- Textures look black → the `tl.load()` call failed silently. Open DevTools → Network and look for 404s on `textures/*.jpg`.
- Performance drop on integrated GPUs → reduce starfield count (currently 15 000) or sphere segment count (currently `64, 64`).
- Sun appears dark → confirm the Sun's material is `MeshBasicMaterial` (it ignores lights by design); other planets need a working `PointLight` at origin.

### General

- DevTools → Performance tab: a healthy frame budget is < 16 ms with hand tracking active. MediaPipe will use 4–8 ms of that on most machines.
- The animation loop is `requestAnimationFrame`-driven, so backgrounded tabs throttle automatically.

## Git workflow

The repo is initialized with a single `main` branch. CLAUDE.md and the `.claude/` directory are git-ignored — they are local editor artifacts and should not be pushed to GitHub.

Suggested commit prefixes for this project:

- `chore:` — repo plumbing, gitignore, deps
- `feat:` — new feature visible to the user (new gesture, new planet detail)
- `fix:` — bug fix
- `refactor:` — code restructure without behavior change
- `docs:` — README, docs/, code comments
- `style:` — CSS-only changes
- `perf:` — performance improvement
