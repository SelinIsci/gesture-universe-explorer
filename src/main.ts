import * as THREE from 'three';
import './styles/main.css';

import { createAsteroidBelt } from './scene/asteroids';
import { createPlanets } from './scene/planets';
import { createComposer } from './scene/postprocess';
import { createScene } from './scene/scene';

import { startGestures } from './input/gestures';
import { attachKeyboard } from './input/keyboard';

import { hideDetail, isDetailVisible, showDetail } from './ui/detailPanel';
import {
  flash,
  setHandStatus,
  setKeyboardStatus,
  showErrorBanner,
  startClock,
} from './ui/hud';
import { updateInfoPanel } from './ui/infoPanel';
import { wireLoader } from './ui/loader';
import { buildNavDots } from './ui/navDots';

import { ZOOM_MAX, ZOOM_MIN } from './input/gestures';
import { createState } from './state';

const state = createState();

const { scene, camera, renderer, sunLight, manager } = createScene();
state.planets = createPlanets(scene, manager);
const belt = createAsteroidBelt(scene);
const composer = createComposer(renderer, scene, camera);

// UI
startClock();
buildNavDots(i => navigateTo(i));
updateInfoPanel(state.idx);
void wireLoader(manager);

// Gesture + keyboard wiring
const video = document.getElementById('input_video') as HTMLVideoElement;
const canvas = document.getElementById('output_canvas') as HTMLCanvasElement;
let lastHandSeen = performance.now();

startGestures(video, canvas, {
  onSwipe: dir => navigateTo(state.idx + dir),
  onZoom: z => {
    state.zoomTarget = z;
    lastHandSeen = performance.now();
  },
  onPinchHold: () => enterDetail(),
  onOpenPalm: () => exitDetail(),
  onHandActive: active => {
    if (active) {
      lastHandSeen = performance.now();
      setHandStatus(true);
    } else if (performance.now() - lastHandSeen > 3000) {
      setHandStatus(false);
      setKeyboardStatus(true);
    } else {
      setHandStatus(false);
    }
  },
  onError: msg => {
    showErrorBanner(msg);
    setKeyboardStatus(true);
  },
});

attachKeyboard({
  onNavigate: dir => navigateTo(state.idx + dir),
  onZoomStep: dir => {
    state.zoomTarget = THREE.MathUtils.clamp(
      state.zoomTarget + dir * 0.3,
      ZOOM_MIN,
      ZOOM_MAX,
    );
  },
  onToggleDetail: () => (isDetailVisible() ? exitDetail() : enterDetail()),
  onExitDetail: () => exitDetail(),
  onToggleAutoRotate: () => (state.autoRotate = !state.autoRotate),
});

function navigateTo(i: number): void {
  const clamped = THREE.MathUtils.clamp(i, 0, state.planets.length - 1);
  if (clamped === state.idx) return;
  state.idx = clamped;
  updateInfoPanel(clamped);
  flash();
  if (isDetailVisible()) showDetail(clamped);
}

function enterDetail(): void {
  state.mode = 'detail';
  showDetail(state.idx);
}

function exitDetail(): void {
  state.mode = 'orbit';
  hideDetail();
}

// Animation loop
const clock = new THREE.Clock();
const tmpVec = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

function animate(): void {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const t = clock.getElapsedTime();

  sunLight.intensity = 5.5 + Math.sin(t * 0.8) * 0.5;

  // Orbital + axial rotation
  for (const p of state.planets) {
    if (state.autoRotate && p.data.name !== 'SUN')
      p.group.rotation.y += p.data.speed;
    p.mesh.rotation.y += 0.005;

    // Moons (animate in local space around parent mesh)
    for (const m of p.moons) {
      m.phase += m.orbitSpeed;
      m.mesh.position.set(
        Math.cos(m.phase) * m.orbitRadius,
        m.mesh.position.y,
        Math.sin(m.phase) * m.orbitRadius,
      );
      m.mesh.rotation.y += m.rotSpeed;
    }
  }

  belt.update();

  // Smooth zoom toward target
  state.zoom = THREE.MathUtils.lerp(state.zoom, state.zoomTarget, 0.1);

  // Camera follow
  const target = state.planets[state.idx];
  if (target) {
    target.mesh.getWorldPosition(tmpTarget);
    const zoomFactor =
      state.mode === 'detail' ? 1.8 * state.zoom : 4.5 * state.zoom;
    tmpVec.set(
      tmpTarget.x,
      tmpTarget.y + target.data.size * 0.4,
      tmpTarget.z + target.data.size * zoomFactor,
    );
    camera.position.lerp(tmpVec, state.mode === 'detail' ? 0.04 : 0.06);
    camera.lookAt(tmpTarget);
  }

  composer.render(dt);
}
animate();
