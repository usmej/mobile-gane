import * as THREE from 'three';

// Boss mesh factory. Group origin is on the floor, front faces +Z (toward the player).
// Returns { group, body, height } where body is the squashable main mesh.

const std = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: 0.5, ...o });

function add(group, mesh, x, y, z, shadow = true) {
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  group.add(mesh);
  return mesh;
}

function crown(group, size, y, radius, color = 0xffd23f) {
  const mat = std(color, { metalness: 0.6, roughness: 0.3, flatShading: true });
  add(group, new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.05, size * 0.3, 8), mat), 0, y, 0);
  const n = 5;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    add(group, new THREE.Mesh(new THREE.ConeGeometry(size * 0.14, size * 0.42, 5), mat),
      Math.cos(a) * radius * 0.85, y + size * 0.34, Math.sin(a) * radius * 0.85);
  }
  add(group, new THREE.Mesh(new THREE.SphereGeometry(size * 0.1, 8, 6), std(0xff2d55)), 0, y + size * 0.2, radius * 1.02, false);
}

function hornedGremlin(size) {
  const g = new THREE.Group();
  const body = add(g, new THREE.Mesh(new THREE.IcosahedronGeometry(size, 1), std(0xe0245e, { roughness: 0.4, flatShading: true })), 0, size, 0);
  const hornMat = std(0x222222, { flatShading: true });
  for (const s of [-1, 1]) {
    const h = add(g, new THREE.Mesh(new THREE.ConeGeometry(size * 0.25, size * 0.8, 6), hornMat), s * size * 0.55, size * 1.8, 0);
    h.rotation.z = -s * 0.4;
  }
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfff200 });
  const browMat = std(0x222222);
  for (const s of [-1, 1]) {
    add(g, new THREE.Mesh(new THREE.SphereGeometry(size * 0.18, 10, 8), eyeMat), s * size * 0.35, size * 1.2, size * 0.85, false);
    const brow = add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.4, size * 0.08, size * 0.1), browMat), s * size * 0.35, size * 1.48, size * 0.9, false);
    brow.rotation.z = s * 0.45;
  }
  // jagged teeth
  const toothMat = std(0xffffff, { flatShading: true });
  for (let i = -2; i <= 2; i++) {
    const t = add(g, new THREE.Mesh(new THREE.ConeGeometry(size * 0.07, size * 0.2, 4), toothMat), i * size * 0.14, size * 0.62, size * 0.93, false);
    t.rotation.x = Math.PI;
  }
  return { group: g, body, height: size * 2.3 };
}

function megaCube(size) {
  const g = new THREE.Group();
  const s = size * 1.7;
  const body = add(g, new THREE.Mesh(new THREE.BoxGeometry(s, s, s), std(0x8a3ffc, { roughness: 0.35, flatShading: true })), 0, s / 2, 0);
  crown(g, size, s + size * 0.15, size * 0.55);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const browMat = std(0x1a0a2e);
  for (const sx of [-1, 1]) {
    add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.36, size * 0.36, size * 0.06), eyeMat), sx * size * 0.4, s * 0.62, s / 2 + 0.02, false);
    add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.16, size * 0.16, size * 0.06), pupilMat), sx * size * 0.4, s * 0.6, s / 2 + size * 0.05, false);
    const brow = add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.5, size * 0.1, size * 0.12), browMat), sx * size * 0.4, s * 0.62 + size * 0.28, s / 2 + size * 0.06, false);
    brow.rotation.z = sx * 0.5; // grumpy: inner ends lower
  }
  add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.7, size * 0.1, size * 0.06), browMat), 0, s * 0.25, s / 2 + 0.02, false);
  return { group: g, body, height: s + size * 0.9 };
}

function donutTyrant(size) {
  const g = new THREE.Group();
  const R = size * 0.85;
  const r = size * 0.42;
  const cy = R + r;
  // torus lies in the XY plane (axis along Z): upright, ring faces +Z
  const body = add(g, new THREE.Mesh(new THREE.TorusGeometry(R, r, 10, 20), std(0xd9a066, { flatShading: true })), 0, cy, 0);
  const frost = add(g, new THREE.Mesh(new THREE.TorusGeometry(R, r * 1.12, 10, 20, Math.PI * 1.35), std(0xff6fb5, { roughness: 0.25, flatShading: true })), 0, cy, 0, false);
  frost.rotation.z = -Math.PI * 0.175; // center the frosted arc over the top
  // sprinkles on the frosting
  const colors = [0xffffff, 0xffe14a, 0x4ad8ff, 0x7dff6a, 0x9b5cff];
  const geo = new THREE.BoxGeometry(size * 0.2, size * 0.06, size * 0.06);
  for (let i = 0; i < 16; i++) {
    const a = Math.PI * (0.02 + 0.96 * ((i * 0.618) % 1)) + 0; // top half
    const b = ((i * 1.37) % 1) * Math.PI * 1.2 - Math.PI * 0.1; // mostly front-facing
    const rr = r * 1.14;
    const rad = R + rr * Math.cos(b);
    const sp = new THREE.Mesh(geo, std(colors[i % colors.length], { roughness: 0.3 }));
    sp.position.set(Math.cos(a) * rad, cy + Math.sin(a) * rad, rr * Math.sin(b));
    sp.rotation.set(i, i * 2.1, i * 0.7);
    g.add(sp);
  }
  // eyes on the ring
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const browMat = std(0x4a1d0a);
  for (const sx of [-1, 1]) {
    const a = Math.PI / 2 + sx * 0.62;
    const ex = Math.cos(a) * R, ey = cy + Math.sin(a) * R;
    add(g, new THREE.Mesh(new THREE.SphereGeometry(size * 0.2, 10, 8), eyeMat), ex, ey, r * 1.0, false);
    add(g, new THREE.Mesh(new THREE.SphereGeometry(size * 0.09, 8, 6), pupilMat), ex, ey, r * 1.0 + size * 0.15, false);
    const brow = add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.45, size * 0.09, size * 0.1), browMat), ex, ey + size * 0.28, r * 1.05, false);
    brow.rotation.z = -sx * 0.5;
  }
  return { group: g, body, height: 2 * (R + r * 1.12) };
}

function slimeKing(size) {
  const g = new THREE.Group();
  const sy = 0.85;
  const body = add(g, new THREE.Mesh(new THREE.SphereGeometry(size, 16, 12),
    std(0x3ddc4b, { roughness: 0.15, transparent: true, opacity: 0.82, flatShading: false })), 0, size * sy, 0);
  body.scale.y = 1; // squash handled by caller; shape set via geometry below
  body.geometry.scale(1, sy, 1);
  // inner darker core blob for depth
  add(g, new THREE.Mesh(new THREE.SphereGeometry(size * 0.45, 10, 8), std(0x1b8f2a, { transparent: true, opacity: 0.6 })), 0, size * 0.6, -size * 0.1, false);
  crown(g, size, size * sy * 2 + size * 0.02, size * 0.5);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  for (const sx of [-1, 1]) {
    add(g, new THREE.Mesh(new THREE.SphereGeometry(size * 0.2, 10, 8), eyeMat), sx * size * 0.35, size * 1.15, size * 0.78, false);
    add(g, new THREE.Mesh(new THREE.SphereGeometry(size * 0.09, 8, 6), pupilMat), sx * size * 0.33, size * 1.13, size * 0.78 + size * 0.15, false);
  }
  // drippy mouth
  const mouthMat = std(0x0e4d17);
  add(g, new THREE.Mesh(new THREE.BoxGeometry(size * 0.8, size * 0.2, size * 0.08), mouthMat), 0, size * 0.62, size * 0.88, false);
  const dripMat = std(0x66ff73, { transparent: true, opacity: 0.85 });
  for (let i = -2; i <= 2; i++) {
    const len = size * (0.18 + 0.1 * ((i + 2) % 3));
    const d = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(size * 0.05, len, 3, 6), dripMat), i * size * 0.17, size * 0.52 - len / 2, size * 0.92, false);
    d.rotation.x = 0;
  }
  return { group: g, body, height: size * sy * 2 + size * 0.7 };
}

function rosterBox(group, size, color, dimensions, position) {
  return add(group, new THREE.Mesh(
    new THREE.BoxGeometry(...dimensions.map((n) => n * size)),
    std(color, { flatShading: true })
  ), ...position.map((n) => n * size));
}

function rosterEyes(group, size, y, z) {
  for (const x of [-0.24, 0.24]) {
    rosterBox(group, size, '#FFF4E0', [0.32, 0.32, 0.10], [x, y, z]);
    rosterBox(group, size, '#1B1420', [0.12, 0.16, 0.04], [x + 0.025, y, z + 0.07]);
  }
}

function fridgeDino(size) {
  const g = new THREE.Group();
  const body = rosterBox(g, size, '#62BCA8', [1.20, 1.45, 0.92], [0, 1.03, 0]);
  for (const x of [-0.35, 0.35]) {
    rosterBox(g, size, '#246E67', [0.35, 0.38, 0.62], [x, 0.19, 0.13]);
  }
  for (let i = 0; i < 3; i++) {
    add(g, new THREE.Mesh(new THREE.ConeGeometry(0.20 * size, 0.37 * size, 4),
      std('#FFD23F')), 0, (1.60 - i * 0.29) * size, (-0.52 - i * 0.12) * size);
  }
  rosterBox(g, size, '#1B1420', [0.12, 0.43, 0.10], [0.43, 0.82, 0.51]);
  rosterBox(g, size, '#246E67', [0.67, 0.29, 0.52], [0, 1.11, 0.56]);
  rosterEyes(g, size, 1.47, 0.52);
  return { group: g, body, height: 1.83 * size };
}

function toastOctopus(size) {
  const g = new THREE.Group();
  const body = rosterBox(g, size, '#A9572F', [1.52, 1.29, 0.64], [0, 0.99, 0]);
  rosterBox(g, size, '#F6BD71', [1.29, 1.07, 0.10], [0, 0.99, 0.35]);
  for (let i = 0; i < 8; i++) {
    const angle = ((i + 0.5) / 8) * Math.PI * 2;
    const arm = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(0.105 * size, 0.65 * size, 4, 8),
      std('#B96A43')), Math.cos(angle) * 0.56 * size, 0.30 * size, Math.sin(angle) * 0.35 * size);
    arm.rotation.z = -Math.cos(angle) * 1.12;
    arm.rotation.x = Math.sin(angle) * 1.12;
  }
  rosterEyes(g, size, 1.19, 0.46);
  rosterBox(g, size, '#1B1420', [0.32, 0.11, 0.07], [0, 0.89, 0.45]);
  return { group: g, body, height: 1.66 * size };
}

function bellCactus(size) {
  const g = new THREE.Group();
  const body = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(0.43 * size, 0.74 * size, 4, 8),
    std('#40A45D', { flatShading: true })), 0, 0.80 * size, 0);
  for (const side of [-1, 1]) {
    rosterBox(g, size, '#278046', [0.47, 0.24, 0.33], [side * 0.43, 0.77, 0]);
    rosterBox(g, size, '#278046', [0.23, 0.46, 0.33], [side * 0.61, 0.94, 0]);
  }
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.35 * size, 0.62 * size, 0.53 * size, 8),
    std('#FFD23F', { flatShading: true })), 0, 1.55 * size, 0);
  rosterBox(g, size, '#1B1420', [0.82, 0.13, 0.78], [0, 1.30, 0]);
  rosterEyes(g, size, 1.56, 0.48);
  return { group: g, body, height: 1.83 * size };
}

function scooterPigeon(size) {
  const g = new THREE.Group();
  const body = add(g, new THREE.Mesh(new THREE.SphereGeometry(size, 12, 8),
    std('#8798B6', { flatShading: true })), 0, 0.88 * size, 0);
  body.scale.set(0.64, 0.58, 0.66);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.43 * size, 12, 8),
    std('#566B90', { flatShading: true })), 0, 1.46 * size, 0.28 * size);
  const beak = add(g, new THREE.Mesh(new THREE.ConeGeometry(0.17 * size, 0.37 * size, 4),
    std('#FFAB39')), 0, 1.40 * size, 0.77 * size);
  beak.rotation.x = Math.PI / 2;
  rosterEyes(g, size, 1.59, 0.69);
  rosterBox(g, size, '#FF7658', [0.73, 0.16, 1.96], [0, 0.27, 0]);
  rosterBox(g, size, '#1B1420', [0.13, 0.95, 0.13], [0, 0.75, 0.88]);
  rosterBox(g, size, '#1B1420', [0.68, 0.12, 0.15], [0, 1.22, 0.88]);
  for (const z of [-0.76, 0.76]) {
    const wheel = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.18 * size, 0.18 * size,
      0.19 * size, 12), std('#1B1420')), 0, 0.18 * size, z * size);
    wheel.rotation.z = Math.PI / 2;
  }
  return { group: g, body, height: 1.89 * size };
}

const DESIGNS = [
  [fridgeDino, 'Frigorifero Dinosauro'],
  [toastOctopus, 'Toastopo Croccantino'],
  [bellCactus, 'Cactusso Campanello'],
  [scooterPigeon, 'Piccione Monopattino'],
  [hornedGremlin, 'Horned Gremlin'],
  [megaCube, 'Mega Cube'],
  [donutTyrant, 'Donut Tyrant'],
  [slimeKing, 'Slime King'],
];

export function makeBossMesh(level, size) {
  const count = DESIGNS.length;
  const idx = (((level | 0) - 1) % count + count) % count;
  const [build, name] = DESIGNS[idx];
  return { ...build(size), name };
}
