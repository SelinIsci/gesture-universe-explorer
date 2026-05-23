// Faz 2 will populate this module by porting PLANET_DATA from the original
// index.html prototype into a typed structure. Kept as an explicit empty
// scaffold so the import graph is locked in during Faz 1.

export interface Planet {
  name: string;
  subtitle: string;
  type: 'STAR' | 'TERRESTRIAL' | 'GAS GIANT' | 'ICE GIANT';
  typeColor: string;
  diameter: string;
  distance: string;
  period: string;
  temp: string;
  desc: string;
  size: number;
  dist: number;
  file: string;
  speed: number;
  hasRings?: boolean;
}

export const PLANET_DATA: Planet[] = [];
