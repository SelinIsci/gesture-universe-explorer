export type PlanetName =
  | 'SUN'
  | 'MERCURY'
  | 'VENUS'
  | 'EARTH'
  | 'MARS'
  | 'JUPITER'
  | 'SATURN'
  | 'URANUS'
  | 'NEPTUNE';

export interface Planet {
  name: PlanetName;
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

export const PLANET_DATA: Planet[] = [
  {
    name: 'SUN',
    subtitle: 'G-Type Main Sequence Star',
    type: 'STAR',
    typeColor: '#ffc94d',
    diameter: '1,392,700 km',
    distance: '0 AU',
    period: '—',
    temp: '5,778 K',
    desc: 'The gravitational anchor of our solar system. Fusing 600 million tons of hydrogen per second, it has sustained life on Earth for 4.6 billion years.',
    size: 15,
    dist: 0,
    file: 'sun.jpg',
    speed: 0,
  },
  {
    name: 'MERCURY',
    subtitle: 'The Smallest Planet',
    type: 'TERRESTRIAL',
    typeColor: '#aaa',
    diameter: '4,879 km',
    distance: '0.39 AU',
    period: '88 days',
    temp: '430°C / −180°C',
    desc: 'A scorched world of extreme temperature swings. Despite being closest to the Sun, Venus is hotter. Mercury has no atmosphere to retain heat.',
    size: 2,
    dist: 35,
    file: 'mercury.jpg',
    speed: 0.008,
  },
  {
    name: 'VENUS',
    subtitle: "Earth's Twin",
    type: 'TERRESTRIAL',
    typeColor: '#e8c97a',
    diameter: '12,104 km',
    distance: '0.72 AU',
    period: '225 days',
    temp: '465°C',
    desc: "A hellscape under a thick CO₂ atmosphere. Surface pressure is 90× Earth's. Clouds of sulfuric acid hide a volcanic landscape.",
    size: 3.8,
    dist: 55,
    file: 'venus.jpg',
    speed: 0.006,
  },
  {
    name: 'EARTH',
    subtitle: 'The Blue Marble',
    type: 'TERRESTRIAL',
    typeColor: '#4d9fff',
    diameter: '12,742 km',
    distance: '1.00 AU',
    period: '365.25 days',
    temp: '15°C avg',
    desc: 'The only known harbor of life in the universe. 71% ocean coverage and a protective magnetosphere make it uniquely hospitable.',
    size: 4.5,
    dist: 80,
    file: 'earth.jpg',
    speed: 0.005,
  },
  {
    name: 'MARS',
    subtitle: 'The Red Planet',
    type: 'TERRESTRIAL',
    typeColor: '#ff6b4a',
    diameter: '6,779 km',
    distance: '1.52 AU',
    period: '687 days',
    temp: '−60°C avg',
    desc: 'Home to Olympus Mons, the tallest volcano in the solar system at 22 km. Mars once had liquid water — perhaps even ancient microbial life.',
    size: 3.2,
    dist: 110,
    file: 'mars.jpg',
    speed: 0.004,
  },
  {
    name: 'JUPITER',
    subtitle: 'The Giant',
    type: 'GAS GIANT',
    typeColor: '#c8a46e',
    diameter: '139,820 km',
    distance: '5.20 AU',
    period: '11.9 years',
    temp: '−110°C',
    desc: "The solar system's largest planet — 1,300 Earths could fit inside. The Great Red Spot is a storm larger than Earth, raging for 350+ years.",
    size: 11,
    dist: 160,
    file: 'jupiter.jpg',
    speed: 0.002,
  },
  {
    name: 'SATURN',
    subtitle: 'Lord of the Rings',
    type: 'GAS GIANT',
    typeColor: '#e8d5a0',
    diameter: '116,460 km',
    distance: '9.58 AU',
    period: '29.5 years',
    temp: '−140°C',
    desc: "Its iconic ring system spans 282,000 km but is only ~10 m thick. Saturn's density is so low it would float on water.",
    size: 9.5,
    dist: 230,
    file: 'saturn.jpg',
    speed: 0.0015,
    hasRings: true,
  },
  {
    name: 'URANUS',
    subtitle: 'The Ice Giant',
    type: 'ICE GIANT',
    typeColor: '#7de8f0',
    diameter: '50,724 km',
    distance: '19.2 AU',
    period: '84 years',
    temp: '−195°C',
    desc: 'Rotates on its side with a 98° axial tilt — likely from an ancient collision. Its blue-green hue comes from methane absorbing red light.',
    size: 7.5,
    dist: 300,
    file: 'uranus.jpg',
    speed: 0.001,
  },
  {
    name: 'NEPTUNE',
    subtitle: 'The Windiest World',
    type: 'ICE GIANT',
    typeColor: '#4d6fff',
    diameter: '49,244 km',
    distance: '30.1 AU',
    period: '165 years',
    temp: '−200°C',
    desc: 'Wind speeds reach 2,100 km/h — the fastest in the solar system. Its largest moon Triton orbits retrograde, likely a captured Kuiper Belt object.',
    size: 7,
    dist: 360,
    file: 'neptune.jpg',
    speed: 0.0008,
  },
];

export const isStar = (p: Planet): boolean => p.type === 'STAR';
