import * as THREE from 'three';

export interface SceneBundle {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  sunLight: THREE.PointLight;
  manager: THREE.LoadingManager;
}

export function createScene(): SceneBundle {
  const manager = new THREE.LoadingManager();

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x00010a, 0.00018);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    5000,
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  document.body.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0x334466, 2.0));
  // decay=0 → no distance falloff (stylized). With Three.js r0.160's default
  // physical decay=2, planets past ~50 units would be almost unlit.
  const sunLight = new THREE.PointLight(0xfff4e0, 2.5, 0, 0);
  scene.add(sunLight);

  // Starfield
  const starPos: number[] = [];
  for (let i = 0; i < 15000; i++) {
    starPos.push(
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 4000,
      (Math.random() - 0.5) * 4000,
    );
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(starPos, 3),
  );
  scene.add(
    new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        sizeAttenuation: true,
      }),
    ),
  );

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer, sunLight, manager };
}
