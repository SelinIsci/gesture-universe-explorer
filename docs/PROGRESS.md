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
| 2a  | Move `PLANET_DATA` → `src/data/planets.ts` with TypeScript interface       | ✅     |
| 2b  | Port scene bootstrap → `src/scene/scene.ts`                                | ✅     |
| 2c  | Port planet construction → `src/scene/planets.ts`                          | ✅     |
| 2d  | Port MediaPipe + gestures → `src/input/gestures.ts` (with named constants) | ✅     |
| 2e  | Port HUD modules → `src/ui/*.ts`                                           | ✅     |
| 2f  | Wire real `THREE.LoadingManager` progress to the loader bar                | ✅     |
| 2g  | Fix `/ 09` hardcoded denominator → `PLANET_DATA.length`                    | ✅     |
| 2h  | Add visible error banner for texture / camera failures                     | ✅     |
| 2i  | Smoke test: parity with the original prototype                             | ✅     |

---

## Faz 3 — Content expansion

| #   | Task                                                                    | Status |
| --- | ----------------------------------------------------------------------- | ------ |
| 3a  | Moons: Galilean (Io, Europa, Ganymede, Callisto), Phobos, Deimos, Titan | ✅     |
| 3b  | Asteroid belt as `InstancedMesh` between Mars and Jupiter               | ✅     |
| 3c  | Pinch-and-hold → detail mode + "PLANETARY DOSSIER" panel                | ✅     |
| 3d  | `src/data/trivia.ts` with 3–5 facts per planet                          | ✅     |
| 3e  | Selective bloom on the Sun via `EffectComposer`                         | ✅     |
| 3f  | Keyboard fallback (`←/→/+/−/D/Esc/Space`)                               | ✅     |
| 3g  | "Open palm" gesture → exit detail mode                                  | ✅     |

---

## Faz 4 — Polish

| #   | Task                                                 | Status |
| --- | ---------------------------------------------------- | ------ |
| 4a  | Detail-mode entry/exit animation (fade + scale)      | ✅     |
| 4b  | Trivia card stagger animation                        | ✅     |
| 4c  | Responsive layout for narrow viewports               | ✅     |
| 4d  | Accessibility pass: `prefers-reduced-motion` honored | ✅     |
| 4e  | `npm run build` passes, `dist/` deployable as static | ✅     |

---

## Build output

```
dist/index.html                  3.17 kB │ gzip:   1.15 kB
dist/assets/index-*.css          8.73 kB │ gzip:   2.38 kB
dist/assets/index-*.js         508.94 kB │ gzip: 132.63 kB
```

The bundle is dominated by Three.js core + postprocessing passes. Further reduction would require tree-shaking unused Three modules or switching to a lighter renderer wrapper — not pursued.

---

## Post-refactor cleanup (`/simplify` + `/security-review`)

| #   | Task                                                                                       | Status |
| --- | ------------------------------------------------------------------------------------------ | ------ |
| 5a  | Delete dead stub `src/scene/moons.ts`                                                      | ✅     |
| 5b  | Add `PlanetName` union + `isStar()` predicate; type `Moon.parent` / `Trivia.planet`        | ✅     |
| 5c  | Export `MOONS_BY_PARENT` and `TRIVIA_BY_PLANET` lookup maps; consumers use them            | ✅     |
| 5d  | Remove dev cruft (`console.warn` sanity check, debug comment in `state.ts`)                | ✅     |
| 5e  | `main.ts` imports `ZOOM_MIN`/`ZOOM_MAX` from `gestures.ts` instead of hardcoding           | ✅     |
| 5f  | Move `body.detail-mode` class ownership into `detailPanel.ts`                              | ✅     |
| 5g  | HTML escaper + hex-color allowlist for all `innerHTML` interpolations in `detailPanel.ts`  | ✅     |
| 5h  | `docs/SECURITY.md` — threat model + supply-chain trade-offs                                | ✅     |
| 5i  | Update README, CLAUDE.md, ARCHITECTURE, DATA, GESTURES, DEVELOPMENT to match refactored code | ✅     |

---

## Known issues / parking lot

Items spotted during development that don't fit any phase. Pick up later if relevant.

- Camera preview canvas is mirrored via CSS; swipe direction is intentionally inverted to match the user's mental model — documented in `gestures.ts`.
- `zoom` does not decay when the hand leaves frame; last value persists until next detection or keyboard input.
- Orbit-ring lines remain children of the scene (not the orbit groups). Visually fine; noted for future tilting/inclination work.
- MediaPipe is loaded from CDN script tags rather than npm because the npm packages register on `window` and don't tree-shake cleanly under Vite. The npm packages remain in `package.json` for type discovery and easier future migration.
