// Populated during Faz 3 (content expansion). See docs/DATA.md.

export interface Moon {
  parent: string;
  name: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotSpeed: number;
  color?: string;
  file?: string;
}

export const MOONS: Moon[] = [];
