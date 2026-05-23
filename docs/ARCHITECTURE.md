# Architecture

## Current state (single-file prototype)

The entire application lives in [`index.html`](../index.html) — a single document containing the HUD markup, all CSS, and one `<script>` block that owns data, scene, input, and UI. External dependencies (Three.js r128, MediaPipe Hands) are loaded from CDNs.

```
gesture-universe-explorer/
├── index.html          # ~910 lines: HTML + CSS + JS
└── textures/           # planet, moon, and Saturn-ring textures
```

The script is organized into roughly these regions (top to bottom):

1. **`PLANET_DATA`** — array of nine objects describing each celestial body. Each entry carries both UI-facing fields (`name`, `subtitle`, `type`, `diameter`, `distance`, `period`, `temp`, `desc`, `typeColor`) and scene-facing fields (`size`, `dist`, `file`, `speed`, optional `hasRings`).
2. **Three.js bootstrap** — scene, perspective camera, WebGL renderer with ACES tone mapping, ambient + point lighting, 15 000-point starfield, exponential fog.
3. **Planet construction** — `PLANET_DATA.map(...)` builds a `THREE.Group` per planet containing a textured sphere. Earth gets a moon child mesh; Saturn gets a ring child mesh. Orbit-ring lines are added directly to the scene.
4. **UI state and helpers** — `idx`, `zoom`, `lx`, `canSwipe`, the `updateInfoPanel()` function, focus-flash, nav-dots, and the UTC clock.
5. **MediaPipe integration** — `Hands` instance, `onResults` callback that draws the hand on the preview canvas and derives swipe/pinch gestures from landmarks 4 and 8.
6. **Animation loop** — per-frame: pulse the Sun light, advance per-planet orbital and self rotation, lerp the camera toward the focused planet.
7. **Resize + loader** — window resize handler and a cosmetic 2-second loader.

## Target structure (refactored)

The plan is to convert the prototype into a Vite + TypeScript ES-module project:

```
gesture-universe-explorer/
├── index.html              # minimal root + <script type="module" src="/src/main.ts">
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── textures/           # moved from ./textures
└── src/
    ├── main.ts             # entrypoint: wires modules together
    ├── data/
    │   ├── planets.ts      # PLANET_DATA + types
    │   ├── moons.ts        # Galilean, Phobos/Deimos, Titan, Moon
    │   └── trivia.ts       # per-planet "did you know" facts
    ├── scene/
    │   ├── scene.ts        # renderer, lights, fog, stars
    │   ├── planets.ts      # planet mesh factory
    │   ├── moons.ts        # moon factory
    │   ├── asteroids.ts    # InstancedMesh asteroid belt
    │   └── postprocess.ts  # EffectComposer + selective bloom
    ├── input/
    │   ├── gestures.ts     # MediaPipe wrapper + gesture state machine
    │   └── keyboard.ts     # fallback nav (arrows / +/− / D / Esc / Space)
    ├── ui/
    │   ├── infoPanel.ts
    │   ├── navDots.ts
    │   ├── hud.ts          # top bar, clock, status, orbit ring
    │   └── loader.ts       # real LoadingManager-driven progress
    └── styles/
        └── main.css        # extracted from the inline <style>
```

### Why this shape

- **`data/` vs `scene/`** — pure data is kept text-friendly and trivially diff-reviewable, separate from imperative scene-building.
- **`input/`** — a small abstraction layer so gestures and keyboard share a common command surface (`navigate(±1)`, `setZoom(z)`, `toggleDetail()`). The animation loop never talks to MediaPipe directly.
- **`ui/`** — DOM updates are factored out so the scene module never touches `document`. This is also where a future detail-mode panel will live.
- **`postprocess.ts`** — moving to a modern Three.js build unlocks `EffectComposer`, used for selective bloom on the Sun via layer masking.

## Rendering pipeline (current and target)

```
PLANET_DATA / moons.ts  ──►  planets.ts ─┐
                                          ├─►  scene graph  ──►  EffectComposer ──►  WebGL canvas
asteroids.ts ─────────────────────────────┘                      (target only)
                                                                       ▲
                                                                       │
                              gestures.ts / keyboard.ts ──►  state (idx, zoom, mode) ──►  animation loop
```

In the current single-file form, the EffectComposer stage is absent — the renderer draws directly to the canvas, and there is no selective bloom.

## State model

The application has a small mutable state surface, currently held as top-level `let` bindings:

| Variable    | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| `idx`       | Index of the currently focused planet in `PLANET_DATA`        |
| `zoom`      | Camera distance multiplier (lerped from pinch input)          |
| `lx`        | Last seen index-fingertip x (for swipe delta)                 |
| `canSwipe`  | Cooldown flag toggled by `setTimeout(..., 700)` after a swipe |

After refactor these become fields on a small `AppState` object passed into modules, and a new `mode` field (`"orbit" | "detail"`) is added to support the planet detail mode described in `GESTURES.md`.
