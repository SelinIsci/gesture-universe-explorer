# Development Guide

## Prerequisites

- Node.js 20+ and npm 10+
- A modern Chromium- or Firefox-based browser with WebGL 2 and `getUserMedia` support
- A webcam (any resolution; MediaPipe downsamples internally) — optional, keyboard fallback works without one

## Setup

```powershell
npm install
npm run dev        # http://localhost:5173 with HMR (auto-opens)
npm run build      # type-check + production bundle into dist/
npm run preview    # serve the production bundle locally
npm run typecheck  # tsc --noEmit, no build
```

Vite serves `public/textures/` at `/textures/` — no further configuration needed.

## Granting camera permission

The first time the app runs, the browser asks for camera permission. If you accidentally deny it:

- **Chrome / Edge** — click the camera icon at the right end of the address bar and re-enable
- **Firefox** — `about:preferences#privacy` → Permissions → Camera → Settings

The HUD's `HAND STATUS` chip in the top right shows `◌ SEARCHING HAND` until a hand is detected, switches to `◉ HAND ACTIVE` when tracking, or `⌨ KEYBOARD ACTIVE` after 3 seconds of no hand or on camera error.

## Debugging tips

### Hand tracking

- The mirrored preview in the bottom-right shows landmark dots (red) and connectors (cyan). If those don't appear, MediaPipe isn't getting frames — check camera permission and that no other app has the camera locked.
- Swipes feel sluggish → reduce `SWIPE_COOLDOWN_MS` in [`src/input/gestures.ts`](../src/input/gestures.ts).
- Swipes trigger by accident → raise `SWIPE_THRESHOLD` from 0.15 toward 0.2.
- Zoom feels jumpy → raise `ZOOM_LERP` from 0.1 toward 0.2 for snappier response, or lower for buttery smoothing.
- Detail mode never opens → lengthen `PINCH_HOLD_MS` to 1200, or relax `PINCH_HOLD_THRESHOLD` upward.

### Three.js scene

- Textures look black → a `tl.load()` call failed silently. Open DevTools → Network and look for 404s on `textures/*`.
- Performance drop → reduce the 2500-instance asteroid belt count in [`src/scene/asteroids.ts`](../src/scene/asteroids.ts) or the 15000-point starfield in [`src/scene/scene.ts`](../src/scene/scene.ts).
- Sun looks dim → confirm `isStar(d)` returns `true` for it and that `MeshBasicMaterial` is picked in [`src/scene/planets.ts`](../src/scene/planets.ts). Basic material ignores lights.
- Planets look dim → check `PointLight` `decay` is `0` (stylized). Three.js r0.160 defaults it to `2` (physical) which leaves distant planets unlit.

### TypeScript

- `tsc --noEmit` runs as part of `npm run build`. Run it standalone with `npm run typecheck` to fail fast on type errors.
- `strict` mode is on. `any` is allowed only inside [`src/input/gestures.ts`](../src/input/gestures.ts) because MediaPipe's CDN scripts have no types.

## Git workflow

The repo lives on `main`. `CLAUDE.md`, `TEMP.md`, and the `.claude/` directory are git-ignored — they're local editor artifacts and should not be pushed.

Commit prefixes:

- `chore:` — repo plumbing, gitignore, deps
- `feat:` — new feature visible to the user
- `fix:` — bug fix
- `refactor:` — code restructure without behavior change
- `docs:` — README, docs/, code comments
- `style:` — CSS-only changes
- `perf:` — performance improvement
- `security:` — security-related change

## Project conventions

- **No DOM access outside `src/ui/`** — scene and input modules don't touch `document`.
- **Lookup by `PlanetName`** — use `MOONS_BY_PARENT.get(name)` / `TRIVIA_BY_PLANET.get(name)` rather than re-scanning the arrays.
- **Magic numbers live in constants** — gesture thresholds in [`src/input/gestures.ts`](../src/input/gestures.ts), asteroid-belt parameters at the top of [`src/scene/asteroids.ts`](../src/scene/asteroids.ts).
- **All HTML interpolation goes through `esc()` and `safeColor()`** in [`src/ui/detailPanel.ts`](../src/ui/detailPanel.ts), even for hardcoded data.
