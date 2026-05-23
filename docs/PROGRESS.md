# Progress

Living tracker of where the refactor + content expansion stands. Update this file at the end of each phase.

Legend: ✅ done · 🟡 in progress · ⬜ not started · ⏸ paused

---

## Faz 0 — Safety net: git + docs + README

| #   | Task                                                                          | Status |
| --- | ----------------------------------------------------------------------------- | ------ |
| 0a  | `git init`, `.gitignore`, initial commit of the working single-file prototype | ✅     |
| 0b  | Generate `CLAUDE.md` (local-only, git-ignored)                                | ✅     |
| 0c  | `docs/` folder — ARCHITECTURE, GESTURES, DATA, DEVELOPMENT, CREDITS, PROGRESS | ✅     |
| 0d  | Professional `README.md`                                                      | ✅     |
| 0e  | Commit: `docs: add README, architecture docs, progress tracker`               | ✅     |

**Notes**

- `CLAUDE.md` and `.claude/` are listed in `.gitignore` per user request — they are not pushed to GitHub.
- Working branch: `main`. Initial commit: `e1cbf1e`.

---

## Faz 1 — Vite + TypeScript skeleton

| #   | Task                                                                           | Status |
| --- | ------------------------------------------------------------------------------ | ------ |
| 1a  | `package.json`, `tsconfig.json`, `vite.config.ts`                              | ✅     |
| 1b  | Move `textures/` → `public/textures/`                                          | ✅     |
| 1c  | Create empty module files under `src/` matching target structure               | ✅     |
| 1d  | Replace inline `<script>` and `<style>` with module entrypoint + extracted CSS | ✅     |
| 1e  | Smoke test — `tsc --noEmit` passes, `vite build` produces dist/                | ✅     |

---

## Faz 2 — Port existing behavior 1:1

| #   | Task                                                                       | Status |
| --- | -------------------------------------------------------------------------- | ------ |
| 2a  | Move `PLANET_DATA` → `src/data/planets.ts` with TypeScript interface       | ⬜     |
| 2b  | Port scene bootstrap → `src/scene/scene.ts`                                | ⬜     |
| 2c  | Port planet construction → `src/scene/planets.ts`                          | ⬜     |
| 2d  | Port MediaPipe + gestures → `src/input/gestures.ts` (with named constants) | ⬜     |
| 2e  | Port HUD modules → `src/ui/*.ts`                                           | ⬜     |
| 2f  | Wire real `THREE.LoadingManager` progress to the loader bar                | ⬜     |
| 2g  | Fix `/ 09` hardcoded denominator → `PLANET_DATA.length`                    | ⬜     |
| 2h  | Add visible error banner for texture / camera failures                     | ⬜     |
| 2i  | Smoke test: parity with the original prototype                             | ⬜     |

---

## Faz 3 — Content expansion

| #   | Task                                                                    | Status |
| --- | ----------------------------------------------------------------------- | ------ |
| 3a  | Moons: Galilean (Io, Europa, Ganymede, Callisto), Phobos, Deimos, Titan | ⬜     |
| 3b  | Asteroid belt as `InstancedMesh` between Mars and Jupiter               | ⬜     |
| 3c  | Pinch-and-hold → detail mode + "PLANETARY DOSSIER" panel                | ⬜     |
| 3d  | `src/data/trivia.ts` with 3–5 facts per planet                          | ⬜     |
| 3e  | Selective bloom on the Sun via `EffectComposer`                         | ⬜     |
| 3f  | Keyboard fallback (`←/→/+/−/D/Esc/Space`)                               | ⬜     |
| 3g  | "Open palm" gesture → exit detail mode                                  | ⬜     |

---

## Faz 4 — Polish

| #   | Task                                                                          | Status |
| --- | ----------------------------------------------------------------------------- | ------ |
| 4a  | Detail-mode entry/exit animation (fade + scale)                               | ⬜     |
| 4b  | Trivia card stagger animation                                                 | ⬜     |
| 4c  | Responsive layout for narrow viewports                                        | ⬜     |
| 4d  | Accessibility pass: ARIA labels, keyboard focus rings, prefers-reduced-motion | ⬜     |
| 4e  | `npm run build` passes, `dist/` deployable as static                          | ⬜     |

---

## Known issues / parking lot

Items spotted during planning that don't fit a single phase. Move into a phase when picked up.

- Camera preview canvas is mirrored via CSS, swipe direction is intentionally inverted — document this in code as a comment near the swipe block.
- `zoom` is not reset when the hand disappears; consider decaying back to `1.0` over ~2s of "no hand" state.
- Orbit-ring lines are static (children of scene, not of orbit groups). Acceptable, but worth noting.
- Three.js r128 is from 2021 — upgrade to current stable (r160+) during Faz 1.
- Loader text is currently sequential strings ("INITIALIZING SYSTEMS..."); after Faz 2f it should reflect actual texture load progress.
