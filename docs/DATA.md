# Data Model

All catalog data lives in [`src/data/`](../src/data/). Each file exports both a flat array (for iteration order) and, where lookups by name are needed, a `Map` keyed by `PlanetName`.

## `PlanetName`

A string union exported from [`src/data/planets.ts`](../src/data/planets.ts):

```ts
type PlanetName =
  | 'SUN' | 'MERCURY' | 'VENUS' | 'EARTH' | 'MARS'
  | 'JUPITER' | 'SATURN' | 'URANUS' | 'NEPTUNE';
```

Using the union (instead of `string`) catches typos in `MOONS[].parent` and `TRIVIA[].planet` at compile time.

## `Planet`

```ts
interface Planet {
  // UI text
  name: PlanetName;
  subtitle: string;
  type: 'STAR' | 'TERRESTRIAL' | 'GAS GIANT' | 'ICE GIANT';
  typeColor: string;          // CSS hex color used for badge + accent
  diameter: string;
  distance: string;
  period: string;
  temp: string;
  desc: string;

  // Scene parameters
  size: number;               // sphere radius in world units (stylized, not to scale)
  dist: number;               // orbital radius from the Sun in world units
  file: string;               // texture filename under public/textures/
  speed: number;              // radians per frame applied to the orbital group
  hasRings?: boolean;         // true → adds Saturn-style ring child mesh
}

const isStar = (p: Planet): boolean => p.type === 'STAR';
```

The exported `isStar()` predicate is used by `scene/planets.ts` to pick between `MeshBasicMaterial` (unlit) for the Sun and `MeshStandardMaterial` (lit) for everything else.

Scene units are intentionally **not** to scale — real Neptune at 30 AU would be a single pixel. Values were tuned by eye for legibility.

## `Moon`

```ts
interface Moon {
  parent: PlanetName;
  name: string;
  size: number;
  orbitRadius: number;        // distance from parent's center
  orbitSpeed: number;
  rotSpeed: number;
  color?: number;             // fallback hex tint when no texture file
  file?: string;              // optional texture under public/textures/
  tilt?: number;              // small y-offset multiplier for orbital inclination
}

const MOONS_BY_PARENT: Map<PlanetName, Moon[]>;
```

Currently shipped moons:

| Parent  | Moons                                          |
| ------- | ---------------------------------------------- |
| EARTH   | Moon (textured)                                |
| MARS    | Phobos, Deimos (color-only)                    |
| JUPITER | Io, Europa, Ganymede, Callisto (color-only)    |
| SATURN  | Titan (color-only)                             |

Moons are attached as children of their parent's `mesh`, so they inherit the parent's orbital group rotation around the Sun "for free" — only their own local rotation needs to be advanced each frame.

## `Trivia`

```ts
interface Trivia {
  planet: PlanetName;
  facts: string[];                          // 3–5 short "did you know" lines
  atmosphere?: Record<string, number>;      // gas → percent
  notableFeatures?: string[];
}

const TRIVIA_BY_PLANET: Map<PlanetName, Trivia>;
```

`detailPanel.ts` reads `TRIVIA_BY_PLANET.get(planetName)` and renders the result. All interpolated values are passed through an HTML escaper before reaching `innerHTML`; see [`SECURITY.md`](SECURITY.md) for the rationale.

## Asteroid belt

The belt is procedurally generated, not data-driven. See [`src/scene/asteroids.ts`](../src/scene/asteroids.ts) for the generation parameters:

| Parameter         | Value              |
| ----------------- | ------------------ |
| Inner radius      | 125 world units    |
| Outer radius      | 145 world units    |
| Instance count    | 2 500              |
| Y-jitter          | ±3 world units     |
| Size range        | 0.05 – 0.25 units  |
| Group rotation    | `0.0003 rad/frame` |

Asteroids share one `MeshStandardMaterial` and one icosahedron geometry through a `THREE.InstancedMesh` to keep the belt at a single draw call.
