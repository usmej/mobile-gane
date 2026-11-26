import * as THREE from 'three';

// pattern: 'solid' | 'stripes' | 'dots' | 'checker' | 'rainbow' | 'glow'
export const SKINS = [
  { id: 'classic',  name: 'Gloop', price: 0,   currency: 'coins', color: '#5be37a', color2: '#2fae4f', pattern: 'solid' },
  { id: 'bubble',   name: 'Bubblegum', price: 50,  currency: 'coins', color: '#ff8ad8', color2: '#ff4fb8', pattern: 'solid' },
  { id: 'sus',      name: 'Traffic Cone',      price: 90,  currency: 'coins', color: '#ff4d4d', color2: '#a81f2d', pattern: 'stripes' },
  { id: 'drip',     name: 'Pool Noodle',      price: 150, currency: 'coins', color: '#3aa7ff', color2: '#0b3d91', pattern: 'dots' },
  { id: 'rizz',     name: 'Grandma\'s Jello',     price: 220, currency: 'coins', color: '#b86bff', color2: '#ffd6f6', pattern: 'stripes' },
  { id: 'ohio',     name: 'Ohio',      price: 300, currency: 'coins', color: '#9bd12b', color2: '#3b2a14', pattern: 'checker' },
  { id: 'sigma',    name: 'Sigma',   price: 400, currency: 'coins', color: '#2b2f3a', color2: '#7be0ff', pattern: 'checker' },
  { id: 'mango',    name: 'Mango',     price: 520, currency: 'coins', color: '#ffb02e', color2: '#ff6a1a', pattern: 'dots' },
  { id: 'splat',    name: 'Sticker Sheet',  price: 650, currency: 'coins', color: '#ffe14a', color2: '#ff3d81', pattern: 'rainbow' },
  { id: 'cap',      name: 'Highlighter',    price: 800, currency: 'coins', color: '#39ffb0', color2: '#00ffd0', pattern: 'glow' },
  { id: 'mewing',   name: 'Mewing',    price: 5,   currency: 'gems',  color: '#7ff5e0', color2: '#1fb8a6', pattern: 'glow' },
  { id: 'grape',    name: 'Grape Soda',   price: 12,  currency: 'gems',  color: '#7a3cff', color2: '#ff6bf0', pattern: 'rainbow' },
  { id: 'aura',     name: 'Aura Farmer',    price: 20,  currency: 'gems',  color: '#ffd23f', color2: '#ff9d00', pattern: 'glow' },
  { id: 'goated',   name: '3AM',  price: 30,  currency: 'gems',  color: '#1a1245', color2: '#c58cff', pattern: 'dots' },
];

export function getSkin(id) {
  return SKINS.find((s) => s.id === id) || SKINS[0];
}

const textureCache = new Map();

function drawPattern(skin) {
  const S = 256;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = skin.color;
  g.fillRect(0, 0, S, S);
  if (skin.pattern === 'stripes') {
    g.fillStyle = skin.color2;
    const n = 8, h = S / n;
    for (let i = 0; i < n; i += 2) g.fillRect(0, i * h, S, h);
  } else if (skin.pattern === 'dots') {
    g.fillStyle = skin.color2;
    const n = 4, cell = S / n;
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        g.beginPath();
        g.arc((x + 0.5) * cell + (y % 2 ? cell / 2 : 0) - (y % 2 ? 0 : 0), (y + 0.5) * cell, cell * 0.28, 0, Math.PI * 2);
        g.fill();
        if (y % 2) { // wrap the offset dot
          g.beginPath();
          g.arc((x + 0.5) * cell - cell / 2, (y + 0.5) * cell, cell * 0.28, 0, Math.PI * 2);
          g.fill();
        }
      }
    }
  } else if (skin.pattern === 'checker') {
    g.fillStyle = skin.color2;
    const n = 8, cell = S / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if ((x + y) % 2) g.fillRect(x * cell, y * cell, cell, cell);
  } else if (skin.pattern === 'rainbow') {
    const n = 8, h = S / n;
    for (let i = 0; i < n; i++) {
      g.fillStyle = `hsl(${Math.round((i / n) * 360)}, 90%, 60%)`;
      g.fillRect(0, i * h, S, h + 1);
    }
  }
  return c;
}

function getTexture(skin) {
  if (textureCache.has(skin.id)) return textureCache.get(skin.id);
  let tex = null;
  try {
    tex = new THREE.CanvasTexture(drawPattern(skin));
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  } catch (e) {
    tex = null;
  }
  textureCache.set(skin.id, tex);
  return tex;
}

export function makeSkinMaterial(skin) {
  skin = skin || SKINS[0];
  const opts = { color: new THREE.Color(skin.color), roughness: 0.35, metalness: 0.05 };
  if (skin.pattern === 'glow') {
    opts.emissive = new THREE.Color(skin.color2);
    opts.emissiveIntensity = 0.6;
  } else if (skin.pattern !== 'solid') {
    const tex = getTexture(skin);
    if (tex) {
      opts.map = tex;
      opts.color = new THREE.Color('#ffffff');
    }
  }
  return new THREE.MeshStandardMaterial(opts);
}

const swatchCache = new Map();

export function skinSwatchCSS(skin) {
  skin = skin || SKINS[0];
  if (swatchCache.has(skin.id)) return swatchCache.get(skin.id);
  let css = skin.color;
  try {
    const c = drawPattern(skin);
    if (skin.pattern === 'glow') {
      const g = c.getContext('2d');
      g.strokeStyle = skin.color2;
      g.lineWidth = 36;
      g.strokeRect(0, 0, c.width, c.height);
    }
    css = `url(${c.toDataURL('image/png')}) center / cover`;
  } catch (e) { /* no canvas: flat color */ }
  swatchCache.set(skin.id, css);
  return css;
}
