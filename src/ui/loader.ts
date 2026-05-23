import type * as THREE from 'three';

const PHASES = [
  'INITIALIZING SYSTEMS',
  'LOADING PLANETARY TEXTURES',
  'CALIBRATING ORBITS',
  'SCANNING FOR HAND INPUT',
  'READY',
];

export function wireLoader(manager: THREE.LoadingManager): Promise<void> {
  const fill = document.getElementById('loader-fill') as HTMLDivElement | null;
  const text = document.getElementById('loader-text') as HTMLDivElement | null;
  const loader = document.getElementById('loader');

  return new Promise(resolve => {
    let phase = 0;
    const phaseTimer = setInterval(() => {
      phase = Math.min(phase + 1, PHASES.length - 2);
      if (text) text.textContent = PHASES[phase] + '...';
    }, 400);

    manager.onProgress = (_url, loaded, total) => {
      const pct = total > 0 ? (loaded / total) * 100 : 0;
      if (fill) fill.style.width = pct + '%';
    };

    manager.onLoad = () => {
      clearInterval(phaseTimer);
      if (fill) fill.style.width = '100%';
      if (text) text.textContent = PHASES[PHASES.length - 1];
      setTimeout(() => {
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => loader.remove(), 800);
        }
        resolve();
      }, 350);
    };

    manager.onError = url => {
      console.error('Asset failed to load:', url);
    };
  });
}
