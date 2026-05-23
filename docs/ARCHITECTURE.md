# Architecture

## Current state — Vite + TypeScript modular project

The single-file prototype has been refactored into a Vite + TypeScript ES-module project. The original `index.html` is now a minimal shell that loads `/src/main.ts`. Three.js is pulled from npm and bundled; MediaPipe is loaded from jsdelivr CDN at runtime (see [`SECURITY.md`](SECURITY.md) for the rationale).

```
gesture-universe-explorer/
├── index.html              # minimal shell + MediaPipe CDN tags + /src/main.ts
├── package.json            # three, @mediapipe/*, vite, typescript
├── tsconfig.json           # strict, ES2022, bundler resolution
├── vite.config.ts
├── public/
│   └── textures/           # planet/moon/ring maps
└── src/
    ├── main.ts             # entrypoint — wires modules together
    ├── state.ts            # AppState shape + PlanetInstance
    ├── data/
    │   ├── planets.ts      # PLANET_DATA + PlanetName union + isStar predicate
    │   ├── moons.ts        # MOONS + MOONS_BY_PARENT lookup map
    │   └── trivia.ts       # TRIVIA + TRIVIA_BY_PLANET lookup map
    ├── scene/
    │   ├── scene.ts        # renderer, camera, lights, fog, stars, resize
    │   ├── planets.ts      # planet mesh factory (incl. moons + orbit rings)
    │   ├── asteroids.ts    # InstancedMesh asteroid belt
    │   └── postprocess.ts  # EffectComposer + UnrealBloomPass for the Sun
    ├── input/
    │   ├── gestures.ts     # MediaPipe wrapper, gesture state machine, tuning constants
    │   └── keyboard.ts     # ←/→/+/−/D/Esc/Space fallback
    ├── ui/
    │   ├── infoPanel.ts    # left-side planetary stats
    │   ├── navDots.ts      # bottom-left nav dots
    │   ├── hud.ts          # top bar, clock, hand status, focus flash, error banner
    │   ├── loader.ts       # LoadingManager-driven progress
    │   └── detailPanel.ts  # "PLANETARY DOSSIER" detail mode panel
    └── styles/
        └── main.css        # full HUD stylesheet (extracted from the prototype)
```

### Module responsibilities

- **`data/`** — pure data and lookup maps. No imperative scene-building.
- **`scene/`** — Three.js construction. Functions return `{ scene, camera, ... }` bundles or factory results. No DOM access.
- **`input/`** — MediaPipe and keyboard event sources. They produce semantic events (`onSwipe`, `onZoom`, `onPinchHold`, …) consumed by `main.ts`.
- **`ui/`** — DOM mutation only. Each module owns a specific section of the HUD.
- **`main.ts`** — wires everything together, holds the `AppState`, and runs the animation loop.

## Rendering pipeline

```
PLANET_DATA / MOONS_BY_PARENT  ──►  scene/planets.ts ─┐
                                                       ├─►  scene graph  ──►  EffectComposer ──►  WebGL canvas
scene/asteroids.ts (InstancedMesh) ────────────────────┘                       (UnrealBloomPass)

input/gestures.ts ──►                   ┐
input/keyboard.ts ──►  AppState ──► animation loop (main.ts) ──► camera lerp → composer.render(dt)
```

`EffectComposer` runs a `RenderPass` followed by an `UnrealBloomPass`. The Sun's mesh is set to layer 1 (`mesh.layers.enable(1)`) so future selective-bloom passes can be applied, though the current non-selective bloom pass is already strength-tuned to only glow the brightest pixels (the Sun) without washing planets out.

## State model

`AppState` lives in [`src/state.ts`](../src/state.ts) and is constructed once in `main.ts`:

| Field        | Type                          | Meaning                                                        |
| ------------ | ----------------------------- | -------------------------------------------------------------- |
| `idx`        | `number`                      | Index of the focused planet (defaults to Earth, index 3)       |
| `zoom`       | `number`                      | Current camera-distance multiplier (lerped each frame)         |
| `zoomTarget` | `number`                      | Target multiplier driven by gesture / keyboard input           |
| `mode`       | `'orbit' \| 'detail'`         | Detail mode swaps the info panel for the Dossier               |
| `autoRotate` | `boolean`                     | When false, planetary orbital motion pauses (`Space` to toggle) |
| `planets`    | `PlanetInstance[]`            | The constructed planet+moon meshes, populated at startup       |

A `PlanetInstance` bundles the `Planet` data, its orbital `THREE.Group`, the inner `THREE.Mesh`, and its array of moon descriptors with their orbital phases.

## Critical files

- [`src/main.ts`](../src/main.ts) — orchestration; first place to look for end-to-end flow.
- [`src/input/gestures.ts`](../src/input/gestures.ts) — gesture detection logic and tuning constants.
- [`src/scene/planets.ts`](../src/scene/planets.ts) — how planets and their moons are constructed.
- [`src/ui/detailPanel.ts`](../src/ui/detailPanel.ts) — the Dossier panel + HTML escaping helpers.
