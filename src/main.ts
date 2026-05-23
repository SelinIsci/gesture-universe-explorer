// Faz 1 smoke-test entrypoint.
// Renders a starfield + a spinning placeholder sphere to prove the Vite + Three.js
// + TypeScript stack is wired correctly. Faz 2 replaces this with the real scene
// graph ported from the original index.html prototype.

import * as THREE from 'three';
import './styles/main.css';

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x00010a, 0.00018);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  5000,
);
camera.position.set(0, 4, 22);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0x111133, 1.2));
const sunLight = new THREE.PointLight(0xfff4e0, 5, 2000);
scene.add(sunLight);

const starPos: number[] = [];
for (let i = 0; i < 8000; i++) {
  starPos.push(
    (Math.random() - 0.5) * 4000,
    (Math.random() - 0.5) * 4000,
    (Math.random() - 0.5) * 4000,
  );
}
const starGeo = new THREE.BufferGeometry();
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
scene.add(
  new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, sizeAttenuation: true }),
  ),
);

const placeholder = new THREE.Mesh(
  new THREE.SphereGeometry(4, 64, 64),
  new THREE.MeshStandardMaterial({ color: 0x4d9fff, roughness: 0.6, metalness: 0.1 }),
);
scene.add(placeholder);

const loader = document.getElementById('loader');
if (loader) {
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 600);
  }, 400);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();
function animate(): void {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
  placeholder.rotation.y += 0.005;
  sunLight.intensity = 4.5 + Math.sin(t * 0.8) * 0.5;
  renderer.render(scene, camera);
}
animate();
