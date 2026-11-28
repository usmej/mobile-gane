import * as THREE from 'three';

// Boss mesh factory. Group origin is on the floor, front faces +Z (toward the player).
// Returns { group, body, height, name } where body is the single main core mesh
// (callers measure it with Box3 and rescale the whole group, so sizes are baked into
// the geometry here, never into group.scale). Eight original cartoon farm-animal bosses.

const INK = '#1B1420';
const CREAM = '#FFF4E0';

// Small builder context: every dimension is given in unit space and multiplied by `size`.
function mk(size) {
  const g = new THREE.Group();
  const S = size;
  const put = (geo, color, x, y, z, o = {}) => {
    const m = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color, roughness: 0.55, flatShading: o.flat !== false,
    }));
    m.position.set(x * S, y * S, z * S);
    if (o.order) m.rotation.order = o.order;
    if (o.rot) m.rotation.set(o.rot[0], o.rot[1], o.rot[2]);
    if (o.scale) m.scale.set(o.scale[0], o.scale[1], o.scale[2]);
    m.castShadow = o.shadow !== false;
    g.add(m);
    return m;
  };
  const c = {
    g, S,
    box: (col, w, h, d, x, y, z, o) => put(new THREE.BoxGeometry(w * S, h * S, d * S), col, x, y, z, o),
    sph: (col, r, x, y, z, o) => put(new THREE.SphereGeometry(r * S, 14, 10), col, x, y, z, o),
    ico: (col, r, x, y, z, o) => put(new THREE.IcosahedronGeometry(r * S, 1), col, x, y, z, o),
    cyl: (col, rt, rb, h, x, y, z, o) => put(new THREE.CylinderGeometry(rt * S, rb * S, h * S, 12), col, x, y, z, o),
    cone: (col, r, h, x, y, z, o) => put(new THREE.ConeGeometry(r * S, h * S, 6), col, x, y, z, o),
    tor: (col, R, t, arc, x, y, z, o) => put(new THREE.TorusGeometry(R * S, t * S, 6, 12, arc), col, x, y, z, o),
    cap: (col, r, len, x, y, z, o) => put(new THREE.CapsuleGeometry(r * S, len * S, 4, 8), col, x, y, z, o),
    // cream eye with ink pupil, facing +Z
    eye(x, y, z, r = 0.14, look = 0) {
      c.sph(CREAM, r, x, y, z, { flat: false, shadow: false });
      c.sph(INK, r * 0.55, x + look * r * 0.3, y, z + r * 0.65, { flat: false, shadow: false });
    },
    // chunky sneaker: sole, upper, toe cap, ink laces
    shoe(x, color = CREAM, z = 0.15) {
      c.box(INK, 0.56, 0.09, 0.96, x, 0.045, z);
      c.box(color, 0.52, 0.24, 0.9, x, 0.2, z);
      c.sph(CREAM, 0.27, x, 0.2, z + 0.34, { scale: [1, 0.7, 0.9] });
      for (let i = 0; i < 3; i++) c.box(INK, 0.34, 0.045, 0.05, x, 0.335, z - 0.05 + i * 0.12, { shadow: false });
    },
  };
  return c;
}

const PI = Math.PI;

// four stubby legs with ink hooves
function legs(c, col, xs, zs, h = 0.4, r = 0.15, sock = null) {
  for (const x of xs) for (const z of zs) {
    c.cyl(col, r, r * 1.1, h, x, h / 2 + 0.06, z);
    if (sock) c.cyl(sock, r * 1.12, r * 1.12, h * 0.35, x, 0.2, z, { shadow: false });
    c.box(INK, r * 2.1, 0.1, r * 2.3, x, 0.05, z + 0.03);
  }
}

// point on the surface of an ellipsoid (centre cx,cy,cz radii rx,ry,rz) above/at x,z (top) or side
function top(cx, cy, cz, rx, ry, rz, x, z, k = 0.96) {
  const t = Math.max(0, 1 - ((x - cx) / rx) ** 2 - ((z - cz) / rz) ** 2);
  return cy + ry * Math.sqrt(t) * k;
}
function sideX(cx, cy, cz, rx, ry, rz, y, z, sgn, k = 0.96) {
  const t = Math.max(0, 1 - ((y - cy) / ry) ** 2 - ((z - cz) / rz) ** 2);
  return cx + sgn * rx * Math.sqrt(t) * k;
}

// 1. Moolissa: spotted cow with a cowbell.
function moolissa(size) {
  const c = mk(size);
  const white = '#F5F5F5', pink = '#FF9FB8', black = '#2A2A33';
  legs(c, white, [-0.42, 0.42], [0.45, -0.6], 0.5, 0.17, black);
  const E = [0, 1.05, -0.05, 0.81, 0.77, 0.94];
  const body = c.sph(white, 0.85, 0, 1.05, -0.05, { scale: [0.95, 0.9, 1.1] });
  // black spots on top and sides
  for (const [x, z, r] of [[0.35, -0.3, 0.26], [-0.4, 0.15, 0.22], [0.15, 0.4, 0.17], [-0.15, -0.6, 0.2]]) {
    c.ico(black, r, x, top(...E, x, z) , z, { scale: [1, 0.45, 1], shadow: false });
  }
  for (const [y, z, sgn, r] of [[1.2, 0.1, 1, 0.27], [0.95, -0.4, -1, 0.3], [1.3, -0.45, 1, 0.2]]) {
    c.ico(black, r, sideX(...E, y, z, sgn), y, z, { scale: [0.45, 1, 1], shadow: false });
  }
  // head
  c.sph(white, 0.46, 0, 1.3, 0.9, { scale: [1, 1, 1.05] });
  c.sph(black, 0.2, -0.22, 1.62, 1.0, { scale: [1, 0.5, 1], shadow: false });
  c.sph(pink, 0.3, 0, 1.1, 1.28, { scale: [1.2, 0.8, 0.9], flat: false });
  for (const s of [-1, 1]) {
    c.sph(INK, 0.04, s * 0.11, 1.12, 1.52, { flat: false, shadow: false });
    c.eye(s * 0.24, 1.42, 1.22, 0.11, -s);
    c.cone(CREAM, 0.07, 0.32, s * 0.26, 1.8, 0.85, { rot: [0, 0, -s * 0.4] });
    c.sph(black, 0.15, s * 0.52, 1.52, 0.85, { scale: [1.6, 0.5, 0.8], rot: [0, 0, s * 0.3] });
  }
  c.box(INK, 0.28, 0.05, 0.05, 0, 0.97, 1.5, { shadow: false });
  // cowbell on a red collar
  c.box('#E8453C', 0.7, 0.1, 0.5, 0, 0.88, 1.0, { shadow: false });
  c.cyl('#E2B13C', 0.1, 0.18, 0.26, 0, 0.68, 1.12);
  c.sph(INK, 0.05, 0, 0.52, 1.12, { flat: false, shadow: false });
  // tail
  c.cap(white, 0.05, 0.6, 0, 1.0, -1.0, { rot: [-0.3, 0, 0] });
  c.sph(black, 0.14, 0, 0.62, -1.08);
  return { group: c.g, body, height: 2.1 * size };
}

// 2. Oinkster: round pink pig with a curly tail and mud splotches.
function oinkster(size) {
  const c = mk(size);
  const pink = '#FF9FB8', dark = '#FF7FA0', mud = '#7A5230';
  legs(c, dark, [-0.45, 0.45], [0.4, -0.4], 0.3, 0.18);
  const E = [0, 0.95, 0, 0.945, 0.855, 0.9];
  const body = c.sph(pink, 0.9, 0, 0.95, 0, { scale: [1.05, 0.95, 1] });
  // snout
  c.cyl(dark, 0.27, 0.3, 0.22, 0, 0.88, 0.93, { rot: [PI / 2, 0, 0] });
  c.cyl(INK, 0.045, 0.045, 0.05, -0.1, 0.88, 1.05, { rot: [PI / 2, 0, 0], shadow: false });
  c.cyl(INK, 0.045, 0.045, 0.05, 0.1, 0.88, 1.05, { rot: [PI / 2, 0, 0], shadow: false });
  for (const s of [-1, 1]) {
    c.eye(s * 0.34, 1.32, 0.7, 0.13, -s);
    c.box(INK, 0.24, 0.06, 0.05, s * 0.34, 1.5, 0.72, { rot: [0, 0, s * 0.3], shadow: false });
    c.cone(dark, 0.22, 0.4, s * 0.5, 1.78, 0.4, { rot: [0.5, 0, -s * 0.6] });
    c.sph('#FF6F95', 0.1, s * 0.6, 1.05, 0.55, { scale: [1, 0.8, 0.4], flat: false, shadow: false });
  }
  c.box(INK, 0.4, 0.05, 0.05, 0, 0.66, 0.92, { rot: [0, 0, 0], shadow: false });
  // mud splotches
  for (const [x, z, r] of [[0.4, 0.1, 0.24], [-0.35, -0.3, 0.2], [0.1, -0.5, 0.17]]) {
    c.ico(mud, r, x, top(...E, x, z), z, { scale: [1, 0.4, 1], shadow: false });
  }
  c.ico(mud, 0.25, sideX(...E, 0.7, -0.1, -1), 0.7, -0.1, { scale: [0.4, 1, 1], shadow: false });
  c.ico(mud, 0.18, sideX(...E, 1.0, 0.3, 1), 1.0, 0.3, { scale: [0.4, 1, 0.9], shadow: false });
  // curly tail
  c.tor(pink, 0.12, 0.04, PI * 1.6, 0, 1.2, -0.93, { rot: [0, PI / 2, 0] });
  return { group: c.g, body, height: 2.1 * size };
}

// 3. Gruff: grumpy goat with curled horns and a goatee.
function gruff(size) {
  const c = mk(size);
  const fur = '#D8CFBC', dark = '#8E846F';
  legs(c, fur, [-0.35, 0.35], [0.35, -0.45], 0.5, 0.13, dark);
  const body = c.sph(fur, 0.8, 0, 1.0, 0, { scale: [0.9, 0.95, 1.05] });
  c.cone(fur, 0.12, 0.3, 0, 1.4, -0.85, { rot: [-0.6, 0, 0] });
  // head
  c.sph(fur, 0.4, 0, 1.52, 0.65, { scale: [0.95, 1.05, 1.05] });
  c.sph('#EDE6D6', 0.23, 0, 1.33, 1.0, { scale: [1, 0.85, 1], flat: false });
  c.sph(INK, 0.06, 0, 1.4, 1.2, { scale: [1.4, 0.8, 0.7], flat: false, shadow: false });
  // goatee
  c.cone('#EDE6D6', 0.1, 0.4, 0, 1.0, 1.05, { rot: [PI, 0, 0] });
  for (const s of [-1, 1]) {
    // yellow goat eye with a sideways pupil and a grumpy brow
    c.sph('#FFE066', 0.1, s * 0.2, 1.62, 0.95, { flat: false, shadow: false });
    c.box(INK, 0.14, 0.04, 0.04, s * 0.2, 1.62, 1.03, { shadow: false });
    c.box(INK, 0.24, 0.07, 0.06, s * 0.2, 1.76, 0.98, { rot: [0, 0, s * 0.45], shadow: false });
    c.sph(dark, 0.2, s * 0.62, 1.72, 0.6, { scale: [1.6, 0.4, 0.7], rot: [0, 0, -s * 0.3] });
  }
  c.box(INK, 0.3, 0.05, 0.05, -0.0, 1.22, 1.12, { rot: [0, 0, 0.0], shadow: false });
  // curled horns
  c.tor('#FFF4E0', 0.24, 0.065, PI * 1.35, -0.48, 1.95, 0.55, { rot: [0, 0, 0] });
  c.tor('#FFF4E0', 0.24, 0.065, PI * 1.35, 0.48, 1.95, 0.55, { rot: [0, PI, 0] });
  return { group: c.g, body, height: 2.3 * size };
}

// 4. Baa-rbara: cloud of wool with a dark face and legs.
function baarbara(size) {
  const c = mk(size);
  const wool = '#FFF4E0', wool2 = '#FFFFFF', dark = '#4A3A3A';
  legs(c, dark, [-0.35, 0.35], [0.35, -0.4], 0.5, 0.1);
  const body = c.ico(wool, 0.8, 0, 1.05, 0);
  for (let i = 0; i < 18; i++) {
    const y = 1 - 2 * (i + 0.5) / 18, r = Math.sqrt(1 - y * y), phi = i * 2.4;
    const dx = Math.cos(phi) * r, dz = Math.sin(phi) * r;
    if (dz > 0.45 && y > -0.1 && y < 0.7) continue;
    if (y < -0.75) continue;
    c.ico(i % 2 ? wool2 : wool, 0.36, dx * 0.72, 1.05 + y * 0.7, dz * 0.72);
  }
  // dark face
  c.sph(dark, 0.38, 0, 1.12, 0.85, { scale: [0.95, 1.05, 1] });
  c.ico(wool2, 0.3, 0, 1.62, 0.7);
  for (const s of [-1, 1]) {
    c.eye(s * 0.18, 1.25, 1.1, 0.1, 0);
    c.sph(dark, 0.14, s * 0.46, 1.25, 0.78, { scale: [1.6, 0.5, 0.8], rot: [0, 0, -s * 0.4] });
  }
  c.sph('#6A5656', 0.1, 0, 1.08, 1.2, { scale: [1.3, 0.8, 0.7], flat: false, shadow: false });
  c.box(INK, 0.2, 0.04, 0.04, 0, 0.96, 1.18, { shadow: false });
  // pink bow
  for (const s of [-1, 1]) c.cone('#FF6FB5', 0.16, 0.28, s * 0.2, 1.95, 0.68, { rot: [0, 0, -s * PI / 2] });
  c.sph('#E84F9C', 0.08, 0, 1.95, 0.68, { flat: false });
  return { group: c.g, body, height: 2.3 * size };
}

// 5. Gobbles: turkey with a huge colourful tail fan and a red wattle.
function gobbles(size) {
  const c = mk(size);
  const brown = '#8A5A3A', brownD = '#6B4228';
  const cols = ['#E8453C', '#FF9A2E', '#FFD23F', '#6FBF73', '#3E8EDE', '#8A5CC8', '#FF6FB5'];
  // tail fan
  const n = 11;
  for (let i = 0; i < n; i++) {
    const a = (-0.5 + i / (n - 1)) * 2.5; // radians from straight up
    const col = cols[i % cols.length];
    c.sph(col, 0.7, Math.sin(a) * 1.1, 1.25 + Math.cos(a) * 1.0, -0.55, { scale: [0.24, 1, 0.1], rot: [0, 0, -a] });
    c.sph(CREAM, 0.17, Math.sin(a) * 1.75, 1.25 + Math.cos(a) * 1.58, -0.52, { scale: [1, 1, 0.4], shadow: false, flat: false });
    c.sph(INK, 0.07, Math.sin(a) * 1.75, 1.25 + Math.cos(a) * 1.58, -0.48, { flat: false, shadow: false });
  }
  for (const x of [-0.25, 0.25]) {
    c.cyl('#FF9A2E', 0.07, 0.07, 0.4, x, 0.25, 0.1, { flat: false });
    c.box('#FF9A2E', 0.3, 0.07, 0.42, x, 0.04, 0.22);
  }
  const body = c.sph(brown, 0.8, 0, 1.0, 0, { scale: [1, 1, 1.05] });
  c.sph('#D8A878', 0.55, 0, 0.9, 0.38, { scale: [1, 1, 0.5], flat: false });
  for (const s of [-1, 1]) c.sph(brownD, 0.5, s * 0.8, 1.0, -0.05, { scale: [0.25, 0.8, 0.9], rot: [0, 0, s * 0.2] });
  // head, beak and wattle
  c.cap(brown, 0.17, 0.35, 0, 1.6, 0.4, { rot: [0.3, 0, 0] });
  c.sph('#8EC5E8', 0.3, 0, 1.95, 0.55, { scale: [0.9, 1, 1] });
  c.cone('#FFD23F', 0.13, 0.4, 0, 1.88, 0.92, { rot: [PI / 2, 0, 0] });
  c.sph('#E8453C', 0.1, 0, 1.55, 0.85, { scale: [0.7, 1.6, 0.6], flat: false });
  c.sph('#E8453C', 0.09, 0.02, 2.0, 0.92, { scale: [0.7, 1, 1], flat: false });
  for (const s of [-1, 1]) {
    c.eye(s * 0.17, 2.03, 0.76, 0.09, 0);
    c.box(INK, 0.16, 0.05, 0.04, s * 0.17, 2.15, 0.78, { rot: [0, 0, s * 0.4], shadow: false });
  }
  return { group: c.g, body, height: 2.7 * size };
}

// 6. Quackers: fat white duck in a tiny yellow rain hat.
function quackers(size) {
  const c = mk(size);
  const white = '#FFFFFF', orange = '#FF9A2E';
  for (const s of [-1, 1]) {
    c.cyl(orange, 0.06, 0.06, 0.2, s * 0.35, 0.14, 0.4, { flat: false });
    c.sph(orange, 0.22, s * 0.35, 0.05, 0.6, { scale: [1.3, 0.2, 1.4] });
  }
  const body = c.sph(white, 0.85, 0, 0.95, 0, { scale: [1, 0.95, 1.05] });
  for (const s of [-1, 1]) c.sph('#E8EEF2', 0.55, s * 0.85, 1.0, -0.05, { scale: [0.25, 0.8, 1.0], rot: [0, 0, s * 0.2] });
  c.cone(white, 0.28, 0.5, 0, 1.35, -0.95, { rot: [-1.9, 0, 0] });
  // head
  c.sph(white, 0.52, 0, 1.68, 0.45);
  c.sph(orange, 0.34, 0, 1.55, 1.0, { scale: [1.25, 0.4, 1.3] });
  c.box(INK, 0.5, 0.03, 0.4, 0, 1.55, 1.02, { shadow: false });
  for (const s of [-1, 1]) {
    c.eye(s * 0.23, 1.8, 0.82, 0.11, 0);
    c.sph('#FF8FA8', 0.1, s * 0.42, 1.6, 0.75, { scale: [1, 0.7, 0.4], flat: false, shadow: false });
  }
  // rain hat (sou'wester): crown, brim, chin strap
  c.sph('#FFD23F', 0.5, 0, 2.02, 0.4, { scale: [1, 0.7, 1] });
  c.cyl('#FFD23F', 0.72, 0.72, 0.07, 0, 1.98, 0.5);
  c.sph('#E8453C', 0.07, 0, 2.38, 0.4, { flat: false });
  c.box(INK, 0.9, 0.03, 0.05, 0, 1.95, 0.9, { shadow: false });
  return { group: c.g, body, height: 2.5 * size };
}

// 7. Braydon: grey donkey with long ears and a big toothy grin.
function braydon(size) {
  const c = mk(size);
  const grey = '#9AA0A8', light = '#E8E4DC', dark = '#4A3A3A';
  legs(c, grey, [-0.4, 0.4], [0.5, -0.55], 0.5, 0.14, light);
  const body = c.sph(grey, 0.8, 0, 1.0, -0.05, { scale: [0.9, 0.9, 1.1] });
  c.cap(grey, 0.05, 0.6, 0, 0.95, -1.0, { rot: [-0.3, 0, 0] });
  c.sph(dark, 0.13, 0, 0.6, -1.1);
  // head
  c.sph(grey, 0.42, 0, 1.45, 0.85, { scale: [0.95, 1.1, 1] });
  c.sph(light, 0.31, 0, 1.2, 1.15, { scale: [1, 0.85, 1.1], flat: false });
  for (const s of [-1, 1]) {
    // long ears with pink insides
    c.cap(grey, 0.1, 0.55, s * 0.25, 2.1, 0.8, { rot: [0, 0, -s * 0.2] });
    c.cap('#FFB0C8', 0.05, 0.4, s * 0.25, 2.1, 0.88, { rot: [0, 0, -s * 0.2], shadow: false });
    c.eye(s * 0.24, 1.6, 1.08, 0.11, 0);
    c.box(INK, 0.2, 0.05, 0.04, s * 0.24, 1.76, 1.1, { rot: [0, 0, -s * 0.3], shadow: false });
    c.sph(INK, 0.04, s * 0.1, 1.28, 1.42, { flat: false, shadow: false });
  }
  // mane
  for (let i = 0; i < 4; i++) c.cone(dark, 0.07, 0.25, 0, 1.95 - i * 0.14, 0.45 - i * 0.18, { rot: [-0.3, 0, 0] });
  // big toothy grin
  c.box(INK, 0.6, 0.2, 0.06, 0, 1.0, 1.35, { shadow: false });
  for (const x of [-0.2, -0.07, 0.07, 0.2]) c.box(CREAM, 0.12, 0.17, 0.05, x, 1.0, 1.39, { shadow: false });
  return { group: c.g, body, height: 2.4 * size };
}

// 8. Big Neigh: big brown horse with a dark mane, the toughest look.
function bigNeigh(size) {
  const c = mk(size);
  const brown = '#8A4E2B', mane = '#2A1A12';
  legs(c, brown, [-0.42, 0.42], [0.55, -0.7], 0.55, 0.16, CREAM);
  const body = c.sph(brown, 0.85, 0, 1.1, -0.15, { scale: [0.9, 0.95, 1.15] });
  // tail
  c.cap(mane, 0.08, 0.5, 0, 1.2, -1.2, { rot: [-0.5, 0, 0] });
  c.ico(mane, 0.2, 0, 0.8, -1.4, { scale: [1, 1.6, 1] });
  // neck + head
  c.cap(brown, 0.3, 0.6, 0, 1.6, 0.6, { rot: [0.55, 0, 0] });
  c.sph(brown, 0.38, 0, 1.97, 0.95, { scale: [0.9, 1.15, 1.1] });
  c.sph('#E2B48A', 0.26, 0, 1.68, 1.25, { scale: [1, 0.9, 1.1], flat: false });
  c.sph(CREAM, 0.07, 0, 2.05, 1.3, { scale: [1, 2.2, 0.5], flat: false, shadow: false });
  for (const s of [-1, 1]) {
    c.eye(s * 0.24, 2.06, 1.2, 0.1, 0);
    c.box(INK, 0.22, 0.07, 0.04, s * 0.24, 2.2, 1.24, { rot: [0, 0, s * 0.45], shadow: false });
    c.sph(INK, 0.04, s * 0.1, 1.72, 1.5, { flat: false, shadow: false });
    c.cone(brown, 0.1, 0.3, s * 0.22, 2.45, 0.85, { rot: [0, 0, -s * 0.15] });
  }
  c.box(INK, 0.3, 0.04, 0.04, 0, 1.52, 1.35, { shadow: false });
  // mane along the neck + forelock
  for (let i = 0; i < 5; i++) c.ico(mane, 0.17, 0, 2.4 - i * 0.14, 0.78 - i * 0.18);
  c.cone(mane, 0.12, 0.4, 0, 2.35, 1.0, { rot: [2.2, 0, 0] });
  // golden horseshoe medal
  c.tor('#E2B13C', 0.14, 0.04, PI * 1.6, 0, 1.0, 0.88, { rot: [0, 0, PI * 0.7] });
  return { group: c.g, body, height: 2.9 * size };
}

const DESIGNS = [
  [moolissa, 'Moolissa', 'boss-cow', '#F5F5F5', '#2A2A33', 250],
  [oinkster, 'Oinkster', 'boss-pig', '#FF9FB8', '#7A5230', 400],
  [gruff, 'Gruff', 'boss-goat', '#D8CFBC', '#8E846F', 550],
  [baarbara, 'Baa-rbara', 'boss-sheep', '#FFF4E0', '#4A3A3A', 700],
  [gobbles, 'Gobbles', 'boss-turkey', '#8A5A3A', '#E8453C', 850],
  [quackers, 'Quackers', 'boss-duck', '#FFFFFF', '#FF9A2E', 1000],
  [braydon, 'Braydon', 'boss-donkey', '#9AA0A8', '#E8E4DC', 1200],
  [bigNeigh, 'Big Neigh', 'boss-horse', '#8A4E2B', '#2A1A12', 1400],
];

// Old boss skin ids (pre-farm roster) -> new id at the same index. Use to migrate saves.
export const RETIRED_BOSS_IDS = {
  'boss-squalo': 'boss-cow',
  'boss-coccodrillo': 'boss-pig',
  'boss-tazzina': 'boss-goat',
  'boss-scimmia': 'boss-sheep',
  'boss-cactofante': 'boss-turkey',
  'boss-frigocammello': 'boss-duck',
  'boss-ochetta': 'boss-donkey',
  'boss-alberello': 'boss-horse',
};

export const BOSS_SKINS = DESIGNS.map(([, name, id, color, color2, price], index) => ({
  id, name, color, color2, price, currency: 'coins', pattern: 'stripes',
  shape: 'boss', unlockLevel: index + 1,
}));

function ecoVerde(size) {
  const c = mk(size);
  const body = c.sph('#48C874', 0.85, 0, 1.1, 0);
  c.cyl('#274562', 0.45, 0.45, 0.12, 0, 1.6, 0.57, { rot: [Math.PI / 2, 0, 0] });
  for (const side of [-1, 1]) {
    c.eye(side * 0.32, 1.32, 0.82);
    c.box('#274562', 0.54, 0.24, 0.8, side * 0.62, 0.12, 0.17, { rot: [0, side * 0.3, 0] });
  }
  for (const x of [-0.18, 0, 0.18]) c.box(INK, 0.05, 0.25, 0.04, x, 0.85, 0.8);
  return { group: c.g, body };
}

function radioRospo(size) {
  const c = mk(size);
  const body = c.box('#F4BD47', 1.65, 1.25, 0.85, 0, 1.02, 0);
  c.box('#7E3161', 1.35, 0.5, 0.1, 0, 0.84, 0.48);
  for (const side of [-1, 1]) {
    c.eye(side * 0.46, 1.47, 0.53, 0.2);
    c.sph('#7E3161', 0.35, side * 0.64, 0.24, 0.15, { scale: [1, 0.65, 1.5] });
  }
  c.cyl(INK, 0.045, 0.055, 0.75, 0.55, 1.91, 0, { rot: [0, 0, -0.38] });
  return { group: c.g, body };
}

function biscottoCosmico(size) {
  const c = mk(size);
  const body = c.cyl('#BE82E9', 0.85, 0.85, 0.48, 0, 1.05, 0, { rot: [Math.PI / 2, 0, 0] });
  c.box('#FFF1A8', 2.22, 0.13, 0.48, 0, 0.85, 0.1, { rot: [0, 0, 0.33] });
  c.eye(-0.29, 1.34, 0.29);
  c.eye(0.29, 1.34, 0.29);
  for (const [x, y] of [[-0.49, 0.63], [0.47, 1.56], [0.21, 0.51]]) {
    c.sph('#502B79', 0.1, x, y, 0.25);
  }
  return { group: c.g, body };
}

function spaghettoTurbo(size) {
  const c = mk(size);
  const body = c.sph('#ED6C43', 0.78, 0, 0.94, 0, { scale: [1.1, 1, 0.9] });
  for (const side of [-1, 1]) {
    c.eye(side * 0.29, 1.19, 0.75);
    c.cyl(INK, 0.28, 0.28, 0.35, side * 0.78, 0.29, 0, { rot: [0, 0, Math.PI / 2] });
  }
  for (const [x, z] of [[-0.46, -0.22], [-0.24, 0.31], [0.08, -0.15], [0.38, 0.19]]) {
    c.cap('#F6D46B', 0.1, 0.61, x, 1.64, z, { rot: [0, 0, x * 1.6] });
  }
  return { group: c.g, body };
}

const CHARACTER_MODELS = {
  'echo-verdoso': ecoVerde,
  'radio-rospo': radioRospo,
  'biscotto-cosmico': biscottoCosmico,
  'spaghetto-turbo': spaghettoTurbo,
};

export function makeCharacterSkinMesh(id) {
  const design = DESIGNS.find(([, , skinId]) => skinId === id);
  const build = design?.[0] ?? CHARACTER_MODELS[id];
  return build(1);
}

export function makeBossMesh(level, size) {
  const count = DESIGNS.length;
  const idx = (((level | 0) - 1) % count + count) % count;
  const [build, name, skinId] = DESIGNS[idx];
  return { ...build(size), name, skinId };
}
