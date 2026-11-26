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

const DESIGNS = [hornedGremlin, megaCube, donutTyrant, slimeKing];

export function makeBossMesh(level, size) {
  const idx = (((level | 0) - 1) % 4 + 4) % 4;
  return DESIGNS[idx](size);
}
