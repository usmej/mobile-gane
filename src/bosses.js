import * as THREE from 'three';

// Boss mesh factory. Group origin is on the floor, front faces +Z (toward the player).
// Returns { group, body, height, name } where body is the single main core mesh
// (callers measure it with Box3 and rescale the whole group, so sizes are baked into
// the geometry here, never into group.scale). Eight original hybrid-creature bosses.

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

// 1. Blue-grey shark standing upright on sneakers.
function squaloScarpettone(size) {
  const c = mk(size);
  const skin = '#6F8FA8', dark = '#4C6B86';
  c.shoe(-0.4);
  c.shoe(0.4);
  for (const x of [-0.4, 0.4]) c.cyl(skin, 0.15, 0.17, 0.5, x, 0.5, 0.05);
  const body = c.sph(skin, 0.8, 0, 1.22, 0, { scale: [1, 1.1, 0.9] });
  c.sph(CREAM, 0.62, 0, 1.08, 0.3, { scale: [0.95, 1.0, 0.55] });
  // dorsal fin + side fins + tail
  c.cone(dark, 0.3, 0.7, 0, 2.2, -0.2, { rot: [-0.35, 0, 0] });
  for (const s of [-1, 1]) {
    c.cone(dark, 0.22, 0.75, s * 0.95, 1.0, 0.05, { rot: [0, 0, -s * 1.9] });
  }
  c.cone(dark, 0.3, 0.7, 0, 0.55, -0.85, { rot: [-2.2, 0, 0] });
  for (const s of [-1, 1]) {
    c.eye(s * 0.34, 1.58, 0.62, 0.17, -s);
    c.box(INK, 0.3, 0.07, 0.06, s * 0.34, 1.84, 0.6, { rot: [0, 0, s * 0.35], shadow: false });
  }
  // toothy grin
  c.box(INK, 1.0, 0.24, 0.1, 0, 1.0, 0.68, { shadow: false });
  for (let i = -3; i <= 3; i++) {
    c.cone(CREAM, 0.07, 0.18, i * 0.13, 1.06, 0.74, { rot: [Math.PI, 0, 0], shadow: false });
    if (Math.abs(i) < 3) c.cone(CREAM, 0.06, 0.14, i * 0.13 + 0.065, 0.93, 0.74, { shadow: false });
  }
  return { group: c.g, body, height: 2.55 * size };
}

// 2. Green crocodile whose body is a fat bomber plane.
function coccodrilloBombardone(size) {
  const c = mk(size);
  const green = '#C9D33A', dark = '#6E7A1E', snout = '#4FAE4B';
  const body = c.sph(green, 0.8, 0, 1.0, 0, { scale: [1, 1, 1.5] });
  c.sph(CREAM, 0.6, 0, 0.82, 0.2, { scale: [0.8, 0.8, 1.3] });
  // wings, tail plane, tail fin
  c.box(dark, 2.9, 0.1, 0.7, 0, 1.0, 0.0, { rot: [0, 0, 0.04] });
  c.box(dark, 1.1, 0.08, 0.4, 0, 1.2, -1.15);
  c.box(dark, 0.1, 0.8, 0.55, 0, 1.75, -1.1, { rot: [0.25, 0, 0] });
  // wheels
  for (const s of [-1, 1]) c.cyl(INK, 0.2, 0.2, 0.16, s * 0.45, 0.2, 0.3, { rot: [0, 0, Math.PI / 2] });
  // croc snout with teeth
  c.box(snout, 0.9, 0.3, 1.0, 0, 1.0, 1.15);
  c.box('#2E7D3A', 0.8, 0.2, 0.95, 0, 0.74, 1.1);
  c.box(INK, 0.78, 0.05, 0.9, 0, 0.86, 1.12, { shadow: false });
  for (let i = -3; i <= 3; i++) {
    c.cone(CREAM, 0.06, 0.16, i * 0.12, 0.93, 1.55, { rot: [Math.PI, 0, 0], shadow: false });
    c.cone(CREAM, 0.05, 0.13, i * 0.12 + 0.06, 0.8, 1.52, { shadow: false });
  }
  for (const s of [-1, 1]) c.sph(INK, 0.045, s * 0.2, 1.1, 1.64, { flat: false, shadow: false });
  // propeller
  c.sph(INK, 0.1, 0, 1.0, 1.72, { flat: false });
  c.box(INK, 0.14, 1.3, 0.05, 0, 1.0, 1.76, { rot: [0, 0, 0.5] });
  c.box(INK, 1.3, 0.14, 0.05, 0, 1.0, 1.76, { rot: [0, 0, 0.5] });
  // bulging croc eyes on top
  for (const s of [-1, 1]) c.eye(s * 0.34, 1.68, 0.55, 0.19, -s);
  return { group: c.g, body, height: 2.2 * size };
}

// 3. Ballerina with a cappuccino cup for a head.
function tazzinaBallerina(size) {
  const c = mk(size);
  const skin = '#FFD3B8', pink = '#FF8FC0', tutu = '#FF6FB5';
  for (const s of [-1, 1]) {
    c.cyl(skin, 0.07, 0.06, 0.75, s * 0.2, 0.42, 0, { flat: false });
    c.cone(pink, 0.09, 0.22, s * 0.2, 0.11, 0.02, { rot: [Math.PI, 0, 0] });
    c.cap(skin, 0.06, 0.5, s * 0.62, 1.05, 0.05, { rot: [0, 0, s * 0.9], flat: false });
  }
  c.cyl(tutu, 0.3, 0.85, 0.26, 0, 0.88, 0);
  c.cyl(pink, 0.28, 0.4, 0.2, 0, 0.74, 0, { scale: [1, 1, 0.9] });
  c.cyl(pink, 0.22, 0.25, 0.35, 0, 1.0, 0);
  // saucer + cup head
  c.cyl('#FFFFFF', 0.95, 0.75, 0.1, 0, 1.17, 0);
  const body = c.cyl('#FFFFFF', 0.8, 0.55, 0.95, 0, 1.7, 0);
  c.cyl('#8B5A3C', 0.74, 0.74, 0.05, 0, 2.17, 0, { shadow: false });
  c.sph('#F3DFC2', 0.74, 0, 2.2, 0, { scale: [1, 0.32, 1] });
  c.sph(CREAM, 0.28, 0, 2.28, 0.05, { scale: [1, 0.4, 1], shadow: false });
  const h = c.S;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.22 * h, 0.07 * h, 6, 10, Math.PI), new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.55, flatShading: true }));
  handle.position.set(0.72 * h, 1.7 * h, 0);
  handle.rotation.z = -Math.PI / 2;
  handle.castShadow = true;
  c.g.add(handle);
  // face on the cup
  for (const s of [-1, 1]) {
    c.eye(s * 0.28, 1.8, 0.64, 0.12, 0);
    c.sph('#FF8FA8', 0.1, s * 0.5, 1.6, 0.6, { scale: [1, 0.7, 0.4], flat: false, shadow: false });
  }
  c.box(INK, 0.26, 0.07, 0.05, 0, 1.58, 0.66, { shadow: false });
  return { group: c.g, body, height: 2.5 * size };
}

// 4. Monkey growing out of a giant banana peel.
function scimmiaBananosa(size) {
  const c = mk(size);
  const fur = '#8A5A3A', peel = '#FFD23F';
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = 0.55;
    c.box(peel, 0.55, 0.9, 0.1, Math.sin(a) * r, 0.5, Math.cos(a) * r, { order: 'YXZ', rot: [0.85, a, 0] });
    c.cone('#7A4A1E', 0.1, 0.18, Math.sin(a) * (r + 0.4), 0.2, Math.cos(a) * (r + 0.4), { order: 'YXZ', rot: [2.4, a, 0] });
  }
  c.cyl(peel, 0.4, 0.5, 0.4, 0, 0.75, 0);
  const body = c.sph(fur, 0.7, 0, 1.15, 0, { scale: [1, 1.05, 0.9] });
  c.sph('#F2C99A', 0.5, 0, 1.05, 0.3, { scale: [1, 1.05, 0.5], flat: false });
  for (const s of [-1, 1]) {
    c.cap(fur, 0.17, 0.5, s * 0.85, 1.2, 0.1, { rot: [0, 0, s * 0.55] });
    c.sph(fur, 0.2, s * 0.5, 1.7, 0, { flat: false });
    c.sph('#F2C99A', 0.12, s * 0.5, 1.7, 0.12, { flat: false, shadow: false });
  }
  c.sph(fur, 0.46, 0, 1.7, 0.05);
  c.sph('#F2C99A', 0.3, 0, 1.58, 0.32, { scale: [1.25, 0.95, 0.7], flat: false });
  for (const s of [-1, 1]) c.eye(s * 0.17, 1.82, 0.38, 0.12, 0);
  c.box(INK, 0.4, 0.09, 0.05, 0, 1.5, 0.53, { shadow: false });
  c.box(CREAM, 0.3, 0.06, 0.04, 0, 1.46, 0.54, { shadow: false });
  c.sph(INK, 0.04, -0.07, 1.6, 0.54, { flat: false, shadow: false });
  c.sph(INK, 0.04, 0.07, 1.6, 0.54, { flat: false, shadow: false });
  return { group: c.g, body, height: 2.2 * size };
}

// 5. Elephant made of cactus.
function cactofante(size) {
  const c = mk(size);
  const green = '#40A45D', dark = '#278046';
  for (const x of [-0.45, 0.45]) c.cyl(dark, 0.28, 0.3, 0.55, x, 0.28, 0.1);
  const body = c.sph(green, 0.85, 0, 1.12, 0, { scale: [1, 1.1, 0.95] });
  // big ears with pink insides
  for (const s of [-1, 1]) {
    c.cyl(dark, 0.62, 0.62, 0.12, s * 1.02, 1.3, 0.05, { order: 'YXZ', rot: [Math.PI / 2, s * 0.35, 0] });
    c.cyl('#FF9CC2', 0.45, 0.45, 0.04, s * 1.03, 1.3, 0.12, { order: 'YXZ', rot: [Math.PI / 2, s * 0.35, 0], shadow: false });
  }
  // trunk + tusks
  c.cap(dark, 0.2, 0.7, 0, 0.82, 0.92, { rot: [-0.3, 0, 0] });
  c.sph(dark, 0.22, 0, 0.45, 1.0, { flat: false });
  for (const s of [-1, 1]) c.cone(CREAM, 0.07, 0.4, s * 0.3, 0.88, 0.85, { rot: [1.9, 0, s * 0.2] });
  // spikes
  for (let i = 0; i < 16; i++) {
    const a = i * 2.4, y = 0.2 + (i / 16) * 0.7;
    const r = Math.sqrt(1 - y * y);
    const dx = Math.sin(a) * r, dz = Math.cos(a) * r;
    if (dz > 0.3 && y < 0.8) continue;
    c.cone(CREAM, 0.05, 0.22, dx * 0.9, 1.12 + y * 0.95, dz * 0.8, { rot: [dz * 1.3, 0, -dx * 1.3], shadow: false });
  }
  for (const s of [-1, 1]) c.eye(s * 0.34, 1.5, 0.72, 0.14, 0);
  // flower
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    c.sph('#FF6FB5', 0.11, Math.cos(a) * 0.17, 2.1, Math.sin(a) * 0.17 + 0.02, { flat: false, shadow: false });
  }
  c.sph('#FFD23F', 0.1, 0, 2.12, 0.02, { flat: false, shadow: false });
  return { group: c.g, body, height: 2.3 * size };
}

// 6. Camel with a fridge for a torso.
function frigocammello(size) {
  const c = mk(size);
  const tan = '#D9A25E', tanDark = '#B47E3E';
  for (const x of [-0.45, 0.45]) {
    c.cyl(tan, 0.15, 0.17, 0.45, x, 0.2, 0.1);
    c.box(INK, 0.3, 0.1, 0.34, x, 0.05, 0.12);
  }
  const body = c.box('#E6EEF2', 1.5, 1.3, 0.95, 0, 1.0, 0);
  c.box('#B9C7D0', 1.5, 0.05, 0.97, 0, 1.42, 0, { shadow: false });
  c.box(INK, 0.08, 0.4, 0.1, 0.55, 1.15, 0.5, { shadow: false });
  c.box(INK, 0.08, 0.28, 0.1, 0.55, 1.65 - 0.05, 0.5, { shadow: false });
  c.box('#B9C7D0', 0.4, 0.2, 0.05, -0.35, 1.0, 0.48, { shadow: false });
  // humps on top of the fridge
  for (const x of [-0.3, 0.3]) c.sph(tan, 0.32, x, 1.72, -0.2, { scale: [1, 0.9, 1] });
  // camel neck + head
  c.cap(tan, 0.24, 0.35, 0, 1.85, 0.4, { rot: [0.25, 0, 0] });
  c.sph(tan, 0.42, 0, 2.0, 0.5, { scale: [1, 0.95, 1.05] });
  c.sph('#F2D6A8', 0.28, 0, 1.9, 0.82, { scale: [1.1, 0.85, 0.8], flat: false });
  for (const s of [-1, 1]) {
    c.sph(INK, 0.04, s * 0.1, 1.93, 1.03, { flat: false, shadow: false });
    c.eye(s * 0.22, 2.12, 0.82, 0.1, 0);
    c.cone(tanDark, 0.1, 0.28, s * 0.3, 2.38, 0.4, { rot: [0, 0, -s * 0.3] });
  }
  c.box(INK, 0.22, 0.05, 0.05, 0, 1.78, 1.0, { shadow: false });
  return { group: c.g, body, height: 2.5 * size };
}

// 7. Goose in a pilot helmet with a bomb strapped under it.
function ochettaEsplosiva(size) {
  const c = mk(size);
  const orange = '#FF9A2E', leather = '#8A5A3A';
  for (const x of [-0.35, 0.35]) {
    c.cyl(orange, 0.07, 0.07, 0.3, x, 0.18, 0.05, { flat: false });
    c.box(orange, 0.34, 0.07, 0.5, x, 0.035, 0.2);
  }
  const body = c.sph('#FFFFFF', 0.8, 0, 0.9, 0, { scale: [1, 1, 1.1] });
  for (const s of [-1, 1]) c.sph('#E8EEF2', 0.7, s * 0.82, 0.95, 0, { scale: [0.25, 0.8, 0.6], rot: [0, 0, s * 0.2] });
  c.cone('#E8EEF2', 0.3, 0.6, 0, 1.0, -0.95, { rot: [-2.0, 0, 0] });
  // neck + head
  c.cap('#FFFFFF', 0.28, 0.3, 0, 1.55, 0.15);
  c.sph('#FFFFFF', 0.45, 0, 1.78, 0.2);
  // helmet with goggles
  c.sph(leather, 0.5, 0, 1.85, 0.15, { scale: [1, 0.85, 1] });
  c.box(INK, 1.0, 0.07, 0.1, 0, 1.72, 0.52, { shadow: false });
  for (const s of [-1, 1]) {
    c.box(leather, 0.14, 0.4, 0.3, s * 0.47, 1.65, 0.12);
    c.cyl(INK, 0.19, 0.19, 0.1, s * 0.22, 2.0, 0.52, { rot: [Math.PI / 2, 0, 0] });
    c.cyl(CREAM, 0.13, 0.13, 0.12, s * 0.22, 2.0, 0.54, { rot: [Math.PI / 2, 0, 0], flat: false, shadow: false });
    c.eye(s * 0.2, 1.72, 0.52, 0.1, 0);
  }
  // big orange beak
  c.box(orange, 0.6, 0.16, 0.8, 0, 1.64, 0.85);
  c.box('#E87A12', 0.5, 0.1, 0.6, 0, 1.5, 0.78);
  c.box(INK, 0.5, 0.03, 0.6, 0, 1.57, 0.8, { shadow: false });
  // bomb strapped under the belly
  c.sph(INK, 0.3, 0, 0.32, 0.62);
  c.sph(CREAM, 0.07, -0.1, 0.42, 0.88, { flat: false, shadow: false });
  c.cyl(INK, 0.08, 0.1, 0.12, 0, 0.62, 0.62);
  c.cyl(CREAM, 0.02, 0.02, 0.18, 0, 0.74, 0.62, { flat: false, shadow: false });
  c.sph('#FF6A2E', 0.06, 0, 0.86, 0.62, { flat: false, shadow: false });
  c.box(CREAM, 0.9, 0.07, 0.12, 0, 0.5, 0.52, { rot: [0.5, 0, 0], shadow: false });
  return { group: c.g, body, height: 2.35 * size };
}

// 8. Cartoon tree with a face in its trunk, standing on two sneakers.
function alberelloScarpato(size) {
  const c = mk(size);
  const bark = '#8A5A3A', barkDark = '#5E3A22', leaf = '#4FBF5A';
  c.shoe(-0.3, '#FF3B5C', 0.1);
  c.shoe(0.3, '#FF3B5C', 0.1);
  c.cyl(bark, 0.45, 0.55, 1.05, 0, 0.72, 0);
  for (const s of [-1, 1]) {
    c.cap(bark, 0.12, 0.5, s * 0.68, 1.1, 0, { rot: [0, 0, -s * 0.9] });
    c.ico(leaf, 0.22, s * 0.9, 1.4, 0);
  }
  // crown of leaves (core)
  const body = c.ico(leaf, 0.8, 0, 1.55, -0.02);
  c.ico('#3BA848', 0.4, -0.5, 1.95, 0.25);
  c.ico('#3BA848', 0.38, 0.5, 1.95, 0.2);
  c.ico('#6FD46E', 0.4, 0, 2.2, -0.1);
  for (const [x, y, z] of [[-0.45, 1.5, 0.62], [0.3, 1.75, 0.68], [0.6, 1.4, 0.5]]) c.sph('#FF3B5C', 0.1, x, y, z, { flat: false, shadow: false });
  // face in the trunk
  for (const s of [-1, 1]) {
    c.eye(s * 0.2, 0.92, 0.48, 0.14, -s);
    c.box(INK, 0.3, 0.07, 0.06, s * 0.2, 1.1, 0.5, { rot: [0, 0, -s * 0.35], shadow: false });
  }
  c.sph(INK, 0.22, 0, 0.58, 0.38, { scale: [1.2, 0.8, 0.5], flat: false, shadow: false });
  c.box(barkDark, 0.4, 0.04, 0.05, 0, 0.3, 0.47, { shadow: false });
  return { group: c.g, body, height: 2.5 * size };
}

const DESIGNS = [
  [squaloScarpettone, 'Squalo Scarpettone', 'boss-squalo', '#368BDC', '#FFF4E0', 250],
  [coccodrilloBombardone, 'Coccodrillo Bombardone', 'boss-coccodrillo', '#617D39', '#E8AA45', 400],
  [tazzinaBallerina, 'Tazzina Ballerina', 'boss-tazzina', '#FA8EBD', '#FFF4E0', 550],
  [scimmiaBananosa, 'Scimmia Bananosa', 'boss-scimmia', '#FFD23F', '#764827', 700],
  [cactofante, 'Cactofante', 'boss-cactofante', '#47B572', '#EF81AB', 850],
  [frigocammello, 'Frigocammello', 'boss-frigocammello', '#BFE7F3', '#BE8F53', 1000],
  [ochettaEsplosiva, 'Ochetta Esplosiva', 'boss-ochetta', '#FFF4E0', '#EF7043', 1200],
  [alberelloScarpato, 'Alberello Scarpato', 'boss-alberello', '#498747', '#8C562B', 1400],
];

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
