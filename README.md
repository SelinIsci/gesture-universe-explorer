<div align="center">

# 🪐 Gesture Universe Explorer

**Navigate the solar system with your hands.**

A browser-based 3D solar system you steer with webcam hand gestures — swipe between planets, pinch to zoom, all in real time. Built with Three.js and Google MediaPipe Hands.

<sub>Cyberpunk HUD · Real-time hand tracking · Zero installs to try</sub>

</div>

---

## ✨ Features

- **Nine celestial bodies** — the Sun and all eight planets, with textured spheres, orbital motion, and Saturn's iconic ring system.
- **Hand-gesture navigation** — swipe your index finger left or right to jump between worlds; pinch your thumb and index together to zoom.
- **Live HUD** — planetary stats, an animated nav rail, a UTC clock, and a mirrored camera preview with skeletal overlay.
- **Cyberpunk aesthetic** — scanlines, vignette, glowing accents, and a typeface mix of Space Mono and Rajdhani.
- **Cinematic camera** — smooth lerped follow, focus flash on planet change, and a pulsing Sun light.

### On the roadmap

- Galilean moons of Jupiter, the Martian moons Phobos & Deimos, and Titan
- A procedurally generated asteroid belt between Mars and Jupiter
- A *Detail Mode* dossier with trivia, atmospheric composition, and notable features — entered with a pinch-and-hold gesture
- Selective bloom on the Sun via post-processing
- A keyboard fallback for setups without a webcam

See [`docs/PROGRESS.md`](docs/PROGRESS.md) for the live tracker.

## 🛠 Tech Stack

| Layer            | Tech                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------- |
| 3D rendering     | [Three.js](https://threejs.org/)                                                       |
| Hand tracking    | [MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) |
| Build (planned)  | [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)            |
| Fonts            | Space Mono · Rajdhani (Google Fonts)                                                   |

## 🚀 Quick Start

### Current (single-file prototype)

No build step required. Serve the folder with any static server and open it in a modern browser:

```powershell
# Windows / PowerShell
python -m http.server 5500
# then visit http://localhost:5500
```

Allow camera access when prompted. The HUD's `HAND STATUS` chip will switch from `◌ SEARCHING HAND` to `◉ HAND ACTIVE` once your hand is detected.

### After refactor (planned)

```powershell
npm install
npm run dev     # http://localhost:5173 with HMR
npm run build   # production bundle into dist/
```

## 🎮 Controls

| Gesture                        | Action                            |
| ------------------------------ | --------------------------------- |
| 👋 Swipe index finger          | Previous / next planet            |
| 🤏 Pinch thumb + index         | Zoom in / out                     |
| 🤏✋ Pinch-and-hold *(planned)* | Enter planet detail mode          |
| ✋ Open palm *(planned)*       | Exit detail mode                  |

Planned keyboard fallback: `←` / `→` navigate, `+` / `−` zoom, `D` toggle detail, `Esc` exit, `Space` pause orbital motion.

## 📁 Project Structure

```
gesture-universe-explorer/
├── index.html          # current single-file prototype
├── textures/           # planet, moon, and Saturn-ring maps
├── docs/               # architecture, gestures, data, dev, credits, progress
└── README.md
```

The target structure after the Vite + TypeScript refactor lives in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## 📚 Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — current code organization and the refactored target structure
- [`docs/GESTURES.md`](docs/GESTURES.md) — gesture system internals, tuning constants, and planned gestures
- [`docs/DATA.md`](docs/DATA.md) — `PLANET_DATA` schema and planned moon / trivia models
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — local setup, debugging, and git workflow
- [`docs/PROGRESS.md`](docs/PROGRESS.md) — phased roadmap with task status
- [`docs/CREDITS.md`](docs/CREDITS.md) — library, font, and texture attributions

## 🤝 Contributing

This is a personal exploration project, but ideas, bug reports, and pull requests are welcome. Please open an issue first for non-trivial changes so we can align on direction.

## 📜 License

MIT — see [`LICENSE`](LICENSE) (to be added).

## 🙏 Credits

Built with Three.js and MediaPipe Hands. Planetary textures derived from NASA imagery — see [`docs/CREDITS.md`](docs/CREDITS.md) for full attributions.

<div align="center">
<sub>Made with curiosity. Point your camera at the cosmos. 🌌</sub>
</div>
