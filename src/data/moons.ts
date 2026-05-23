export interface Moon {
  parent: string;
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotSpeed: number;
  color?: number;
  file?: string;
  tilt?: number;
}

export const MOONS: Moon[] = [
  { parent: 'EARTH', name: 'Moon', size: 1.2, orbitRadius: 9.5, orbitSpeed: 0.018, rotSpeed: 0.005, file: 'moon.jpg' },
  { parent: 'MARS', name: 'Phobos', size: 0.35, orbitRadius: 5.5, orbitSpeed: 0.035, rotSpeed: 0.02, color: 0x8a7a6e, tilt: 0.1 },
  { parent: 'MARS', name: 'Deimos', size: 0.25, orbitRadius: 7.5, orbitSpeed: 0.022, rotSpeed: 0.015, color: 0x7a6a5e, tilt: -0.15 },
  { parent: 'JUPITER', name: 'Io', size: 1.1, orbitRadius: 15, orbitSpeed: 0.022, rotSpeed: 0.01, color: 0xe8c870 },
  { parent: 'JUPITER', name: 'Europa', size: 1.0, orbitRadius: 19, orbitSpeed: 0.017, rotSpeed: 0.01, color: 0xd8d0b8 },
  { parent: 'JUPITER', name: 'Ganymede', size: 1.5, orbitRadius: 24, orbitSpeed: 0.012, rotSpeed: 0.01, color: 0x9a8878 },
  { parent: 'JUPITER', name: 'Callisto', size: 1.4, orbitRadius: 30, orbitSpeed: 0.008, rotSpeed: 0.01, color: 0x4a4238 },
  { parent: 'SATURN', name: 'Titan', size: 1.6, orbitRadius: 22, orbitSpeed: 0.01, rotSpeed: 0.008, color: 0xd8a868 },
];
