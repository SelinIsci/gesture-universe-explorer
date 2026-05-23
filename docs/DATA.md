# Data Model

## `PLANET_DATA`

A flat array in [`index.html`](../index.html) (line ~462) describing the nine objects rendered in the solar system. Each entry mixes UI text and scene parameters in one object; the refactor will keep this shape but move it to `src/data/planets.ts` with a TypeScript interface.

```ts
interface Planet {
  // UI text
  name: string;          // "EARTH"
  subtitle: string;      // "The Blue Marble"
  type: string;          // "TERRESTRIAL" | "STAR" | "GAS GIANT" | "ICE GIANT"
  typeColor: string;     // CSS color used for the type badge and accent
  diameter: string;      // "12,742 km"
  distance: string;      // "1.00 AU"
  period: string;        // "365.25 days"  (or "—" for the Sun)
  temp: string;          // "15°C avg"
  desc: string;          // longer prose for the info panel

  // Scene parameters
  size: number;          // sphere radius in world units (not to real scale)
  dist: number;          // orbital radius from the Sun in world units
  file: string;          // texture filename under textures/  e.g. "earth.jpg"
  speed: number;         // radians per frame applied to the orbital group
  hasRings?: boolean;    // true → adds Saturn-style ring child mesh
}
```

The scene units are intentionally *not* to scale. Real distances would put Neptune so far from the Sun that planets would be invisible specks. The current values were tuned by eye for legibility.

## Moons (planned)

`src/data/moons.ts` will introduce a parallel structure for parented satellites:

```ts
interface Moon {
  parent: string;        // planet name, e.g. "JUPITER"
  name: string;          // "Europa"
  size: number;          // radius in world units
  orbitRadius: number;   // distance from the parent planet's center
  orbitSpeed: number;    // radians per frame
  rotSpeed: number;      // self-rotation
  color?: string;        // fallback tint if no texture file
  file?: string;         // optional texture under textures/moons/
}
```

Initial set:

| Parent  | Moons                                  |
| ------- | -------------------------------------- |
| EARTH   | Moon (already present in prototype)    |
| MARS    | Phobos, Deimos                         |
| JUPITER | Io, Europa, Ganymede, Callisto         |
| SATURN  | Titan                                  |

Moons are attached as children of their parent's `mesh`, so they inherit the parent's orbital group rotation around the Sun "for free" — only their own local rotation needs to be advanced each frame.

## Trivia (planned)

`src/data/trivia.ts` powers the detail-mode panel. One entry per planet:

```ts
interface Trivia {
  planet: string;                  // matches Planet.name
  facts: string[];                 // 3–5 short "did you know" lines
  atmosphere?: {                   // optional bar-chart data
    [gas: string]: number;         // percent, sums ≈ 100
  };
  notableFeatures?: string[];      // ["Olympus Mons", "Valles Marineris"]
}
```

## Asteroid belt (planned)

The belt is procedurally generated, not data-driven — see `src/scene/asteroids.ts`. Generation parameters:

| Parameter         | Initial value      |
| ----------------- | ------------------ |
| Inner radius      | 125 world units    |
| Outer radius      | 145 world units    |
| Instance count    | 2 500              |
| Y-jitter          | ±3 world units     |
| Size range        | 0.05 – 0.25 units  |
| Group rotation    | `0.0003 rad/frame` |

Asteroids share one `MeshStandardMaterial` and one icosahedron geometry through a `THREE.InstancedMesh` to keep draw calls at one.
