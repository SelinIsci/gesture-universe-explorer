<div align="center">

#  Gesture Universe Explorer

**Navigate the solar system with your hands.**

A browser-based 3D solar system you steer with webcam hand gestures — swipe between planets, pinch to zoom, pinch-and-hold to dive into a Planetary Dossier. Built with Three.js and Google MediaPipe Hands.

<sub>Cyberpunk HUD · Real-time hand tracking · 9 planets · 8 moons · Asteroid belt · Selective bloom</sub>

</div>

---

##  Features

- **Nine celestial bodies** — Sun and all eight planets with textured spheres, orbital motion, and Saturn's rings.
- **Eight moons** — Earth's Moon (textured), Phobos & Deimos, the four Galilean satellites of Jupiter, and Titan.
- **Procedural asteroid belt** — 2,500 instanced asteroids between Mars and Jupiter, rendered as a single draw call.
- **Hand-gesture navigation** — swipe to change planet, pinch to zoom, pinch-and-hold to open detail mode, open palm to exit.
- **Keyboard fallback** — `←` `→` `+` `−` `D` `Esc` `Space` work whether or not you have a webcam.
- **Planetary Dossier** — detail-mode panel with trivia cards, atmospheric composition bars, and notable features per body.
- **Cinematic camera + bloom** — smooth lerped follow, focus flash on planet change, pulsing Sun light, and `UnrealBloomPass` on bright pixels.
- **Cyberpunk aesthetic** — scanlines, vignette, glowing accents, Space Mono + Rajdhani type pairing.
- **Responsive + accessible** — collapses cleanly under 720 px, honors `prefers-reduced-motion`.

## 🛠 Tech Stack

| Layer          | Tech                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------- |
| 3D rendering   | [Three.js](https://threejs.org/) (r0.160) + `EffectComposer` / `UnrealBloomPass`            |
| Hand tracking  | [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) |
| Build          | [Vite 5](https://vitejs.dev/) + [TypeScript 5](https://www.typescriptlang.org/) (strict)    |
| Fonts          | Space Mono · Rajdhani (Google Fonts)                                                        |

##  Quick Start

```powershell
npm install
npm run dev     # http://localhost:5173 with HMR
npm run build   # type-check + production bundle into dist/
```

Allow camera access when prompted. The HUD's `HAND STATUS` chip will switch from `◌ SEARCHING HAND` to `◉ HAND ACTIVE` once your hand is detected. Without a webcam the chip turns to `⌨ KEYBOARD ACTIVE` after a few seconds and all keyboard controls take over.

##  Controls

| Gesture                | Action                            | Keyboard           |
| ---------------------- | --------------------------------- | ------------------ |
| 👋 Swipe index finger  | Previous / next planet            | `←` / `→`          |
| 🤏 Pinch thumb + index | Zoom in / out                     | `+` / `−`          |
| 🤏✋ Pinch-and-hold    | Open Planetary Dossier            | `D` (toggle)       |
| ✋ Open palm           | Close Planetary Dossier           | `Esc`              |
| —                      | Pause / resume orbital motion     | `Space`            |

##  Project Structure

```
gesture-universe-explorer/
├── index.html              # shell + MediaPipe CDN tags + /src/main.ts
├── package.json
├── public/textures/        # planet, moon, and Saturn-ring maps
├── src/
│   ├── main.ts             # entrypoint
│   ├── state.ts            # AppState + PlanetInstance
│   ├── data/               # planets, moons, trivia (+ name-keyed lookup maps)
│   ├── scene/              # scene, planets, asteroids, postprocess
│   ├── input/              # gestures (MediaPipe), keyboard
│   ├── ui/                 # info panel, nav dots, HUD, loader, detail panel
│   └── styles/main.css
└── docs/                   # architecture, gestures, data, dev, security, credits, progress
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the module-by-module breakdown.

##  Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — module layout, rendering pipeline, state model
- [`docs/GESTURES.md`](docs/GESTURES.md) — gesture detection, tuning constants, how to add a new gesture
- [`docs/DATA.md`](docs/DATA.md) — `PlanetName` union, `Planet` / `Moon` / `Trivia` shapes, lookup maps
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — local setup, debugging, git workflow, project conventions
- [`docs/SECURITY.md`](docs/SECURITY.md) — threat model, XSS defense in depth, supply-chain notes
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — phased roadmap with task status
- [`docs/CREDITS.md`](docs/CREDITS.md) — library, font, and texture attributions

##  Contributing

This is a personal exploration project, but ideas, bug reports, and pull requests are welcome. Please open an issue first for non-trivial changes so we can align on direction.

##  License

MIT — see [`LICENSE`](LICENSE). Copyright © 2026 Selin İşci.

Planetary textures under `public/textures/` are derived from NASA imagery / Solar System Scope (CC-BY 4.0) and retain their own attribution requirements — see [`docs/CREDITS.md`](docs/CREDITS.md).

##  Credits

Built with Three.js and MediaPipe Hands. Planetary textures derived from NASA imagery — see [`docs/CREDITS.md`](docs/CREDITS.md) for full attributions.

<div align="center">
<sub>Made with curiosity. Point your camera at the cosmos. </sub>
</div>
