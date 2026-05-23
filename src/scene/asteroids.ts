import * as THREE from 'three';

const INNER = 125;
const OUTER = 145;
const COUNT = 2500;
const Y_JITTER = 3;

export interface AsteroidBelt {
  group: THREE.Group;
  update(): void;
}

export function createAsteroidBelt(scene: THREE.Scene): AsteroidBelt {
  const geom = new THREE.IcosahedronGeometry(1, 0);
  const mat = new THREE.MeshStandardMaterial({ color: 0x6b5e52, roughness: 0.95, metalness: 0.05 });
  const mesh = new THREE.InstancedMesh(geom, mat, COUNT);

  const dummy = new THREE.Object3D();
  for (let i = 0; i < COUNT; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = INNER + Math.random() * (OUTER - INNER);
    dummy.position.set(Math.cos(angle) * r, (Math.random() - 0.5) * Y_JITTER * 2, Math.sin(angle) * r);
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    const s = 0.05 + Math.random() * 0.2;
    dummy.scale.setScalar(s);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;

  const group = new THREE.Group();
  group.add(mesh);
  scene.add(group);

  return {
    group,
    update() {
      group.rotation.y += 0.0003;
    },
  };
}
