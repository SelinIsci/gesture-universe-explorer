import type { Planet } from './data/planets';
import type * as THREE from 'three';

export type Mode = 'orbit' | 'detail';

export interface PlanetInstance {
  data: Planet;
  group: THREE.Group;
  mesh: THREE.Mesh;
  moons: { mesh: THREE.Mesh; orbitRadius: number; orbitSpeed: number; rotSpeed: number; phase: number }[];
}

export interface AppState {
  idx: number;
  zoom: number;
  zoomTarget: number;
  mode: Mode;
  autoRotate: boolean;
  planets: PlanetInstance[];
}

export function createState(): AppState {
  return {
    idx: 0,
    zoom: 1.0,
    zoomTarget: 1.0,
    mode: 'orbit',
    autoRotate: true,
    planets: [],
  };
}
