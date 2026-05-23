import * as THREE from 'three';
import { PLANET_DATA, type Planet } from '../data/planets';
import { MOONS } from '../data/moons';
import type { PlanetInstance } from '../state';

const TEXTURE_BASE = 'textures/';

export function createPlanets(scene: THREE.Scene, manager: THREE.LoadingManager): PlanetInstance[] {
  const tl = new THREE.TextureLoader(manager);

  return PLANET_DATA.map((d: Planet): PlanetInstance => {
    const group = new THREE.Group();
    const tex = tl.load(TEXTURE_BASE + d.file);
    const mat =
      d.name === 'SUN'
        ? new THREE.MeshBasicMaterial({ map: tex })
        : new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85, metalness: 0.05 });

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(d.size, 64, 64), mat);
    mesh.position.x = d.dist;
    if (d.name === 'SUN') mesh.layers.enable(1); // bloom layer
    group.add(mesh);

    if (d.hasRings) {
      const rt = tl.load(TEXTURE_BASE + 'saturn_ring.png');
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(d.size * 1.5, d.size * 2.5, 64),
        new THREE.MeshBasicMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, opacity: 0.75 }),
      );
      ring.rotation.x = Math.PI / 2;
      mesh.add(ring);
    }

    // Moons for this planet
    const moons: PlanetInstance['moons'] = [];
    for (const m of MOONS.filter(mm => mm.parent === d.name)) {
      let moonMat: THREE.Material;
      if (m.file) {
        moonMat = new THREE.MeshStandardMaterial({ map: tl.load(TEXTURE_BASE + m.file), roughness: 0.9 });
      } else {
        moonMat = new THREE.MeshStandardMaterial({ color: m.color ?? 0x999999, roughness: 0.9 });
      }
      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(m.size, 24, 24), moonMat);
      const phase = Math.random() * Math.PI * 2;
      moonMesh.position.set(Math.cos(phase) * m.orbitRadius, (m.tilt ?? 0) * m.orbitRadius, Math.sin(phase) * m.orbitRadius);
      mesh.add(moonMesh);
      moons.push({ mesh: moonMesh, orbitRadius: m.orbitRadius, orbitSpeed: m.orbitSpeed, rotSpeed: m.rotSpeed, phase });
    }

    // Orbit ring around the Sun
    if (d.dist > 0) {
      const oc = new THREE.EllipseCurve(0, 0, d.dist, d.dist, 0, Math.PI * 2, false, 0);
      const op = oc.getPoints(128);
      const og = new THREE.BufferGeometry().setFromPoints(op);
      const om = new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.06 });
      const ol = new THREE.Line(og, om);
      ol.rotation.x = Math.PI / 2;
      scene.add(ol);
    }

    scene.add(group);
    return { data: d, group, mesh, moons };
  });
}
