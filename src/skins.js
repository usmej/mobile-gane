import * as THREE from 'three';
import { BOSS_SKINS } from './bosses.js';

// pattern: 'solid' | 'stripes' | 'dots' | 'checker' | 'rainbow' | 'glow'
// shape (optional, default 'blob'): 'blob' | 'log' | 'boss' | 'character'
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
  // P2-01 — added by Person 2 / ChatGPT
  { id: 'midmochi', name: 'Mid Mochi', price: 900, currency: 'coins', color: '#ffe8f0', color2: '#70275d', pattern: 'dots' },
  { id: 'lavaloaf', name: 'Lowkey Lava Loaf', price: 1150, currency: 'coins', color: '#ff8b30', color2: '#441529', pattern: 'stripes' },
  { id: 'picklelag', name: 'Pickle Lag', price: 1450, currency: 'coins', color: '#bafa48', color2: '#264629', pattern: 'checker' },
  { id: 'crumbclout', name: 'Crumb Clout', price: 1950, currency: 'coins', color: '#ffc67d', color2: '#632c13', pattern: 'dots' },
  { id: 'moonnoodle', name: 'Moon Noodle', price: 45, currency: 'gems', color: '#e2dcff', color2: '#4720a3', pattern: 'stripes' },
  { id: 'glowsnack', name: 'Glow Snack', price: 60, currency: 'gems', color: '#66f7ed', color2: '#213c94', pattern: 'glow' },
  { id: 'drum', name: 'Triple T', price: 0, currency: 'coins', color: '#A0662E', color2: '#6E4220', pattern: 'solid', shape: 'log' },
  { id: 'echo-verdoso', name: 'Eco Verde, El Saltarín', price: 480, currency: 'coins', color: '#48C874', color2: '#274562', pattern: 'glow', shape: 'character' },
  { id: 'radio-rospo', name: 'Radio Rospo', price: 720, currency: 'coins', color: '#F4BD47', color2: '#7E3161', pattern: 'checker', shape: 'character' },
  { id: 'biscotto-cosmico', name: 'Biscotto Cosmico', price: 950, currency: 'coins', color: '#BE82E9', color2: '#FFF1A8', pattern: 'dots', shape: 'character' },
  { id: 'spaghetto-turbo', name: 'Spaghetto Turbo', price: 1250, currency: 'coins', color: '#ED6C43', color2: '#F6D46B', pattern: 'stripes', shape: 'character' },
  ...BOSS_SKINS,
];

export function canUnlockSkin(save, skin) {
  return skin.shape !== 'boss' || save.defeatedBossSkins?.includes(skin.id) === true;
}

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

// FB-004: materials are cached per skin id, so switching skins reuses instances
// instead of leaking a new WebGL material on every equip.
const materialCache = new Map();

export function makeSkinMaterial(skin) {
  skin = skin || SKINS[0];
  if (materialCache.has(skin.id)) return materialCache.get(skin.id);
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
  const mat = new THREE.MeshStandardMaterial(opts);
  materialCache.set(skin.id, mat);
  return mat;
}

const swatchCache = new Map();

export function skinSwatchCSS(skin) {
  skin = skin || SKINS[0];
  if (swatchCache.has(skin.id)) return swatchCache.get(skin.id);
  let css = skin.color;
  try {
    const c = skin.shape === 'log' ? drawLogSide(skin) : drawPattern(skin);
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

// ---------- Triple T (original living-log hero) ----------
const INK = '#1B1420';

// Deterministic pseudo-random so the bark looks the same every time.
function rng(seed) { let a = seed; return () => { a = (a * 1664525 + 1013904223) % 4294967296; return a / 4294967296; }; }

// Bark side texture: warm base, darker vertical streaks, a couple of knots.
export function drawLogSide(skin) {
  skin = skin || getSkin('drum');
  const W = 512, H = 256;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = skin.color; g.fillRect(0, 0, W, H);
  const r = rng(7);
  g.fillStyle = skin.color2;
  for (let i = 0; i < 34; i++) {
    const x = r() * W, w = 4 + r() * 8, y = r() * H * 0.7, h = 50 + r() * 140;
    g.fillRect(x, y, w, h);
  }
  g.strokeStyle = INK; g.lineWidth = 3; g.globalAlpha = 0.5;
  for (let i = 0; i < 14; i++) {
    const x = r() * W, y = r() * H * 0.6, h = 30 + r() * 80;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3, y + h); g.stroke();
  }
  g.globalAlpha = 1;
  for (const [kx, ky] of [[90, 170], [400, 200], [250, 225]]) {
    g.fillStyle = skin.color2; g.beginPath(); g.ellipse(kx, ky, 16, 11, 0, 0, Math.PI * 2); g.fill();
    g.strokeStyle = INK; g.lineWidth = 3; g.stroke();
    g.fillStyle = INK; g.beginPath(); g.ellipse(kx, ky, 6, 4, 0, 0, Math.PI * 2); g.fill();
  }
  return c;
}

// Top cap: tree growth rings, tan and cream with ink outline.
export function drawLogTop() {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d');
  g.fillStyle = '#E8C98F'; g.fillRect(0, 0, S, S);
  const rings = [[0.47, '#FFF4E0'], [0.37, '#E8C98F'], [0.27, '#FFF4E0'], [0.17, '#E8C98F'], [0.07, '#A0662E']];
  for (const [rad, col] of rings) {
    g.fillStyle = col; g.beginPath(); g.arc(S / 2, S / 2, S * rad, 0, Math.PI * 2); g.fill();
    g.strokeStyle = INK; g.lineWidth = rad > 0.4 ? 7 : 3; g.stroke();
  }
  return c;
}

let logMats = null;
// Returns [side, top, bottom] materials for a CylinderGeometry (flat, no emissive).
export function makeLogMaterials(skin) {
  if (logMats) return logMats;
  const mk = (canvas, fallback) => {
    const o = { color: new THREE.Color(fallback), roughness: 0.85, metalness: 0 };
    try {
      const t = new THREE.CanvasTexture(canvas());
      t.colorSpace = THREE.SRGBColorSpace;
      o.map = t; o.color = new THREE.Color('#ffffff');
    } catch (e) { /* flat color fallback */ }
    return new THREE.MeshStandardMaterial(o);
  };
  const side = mk(() => drawLogSide(skin), '#A0662E');
  const top = mk(drawLogTop, '#E8C98F');
  const bottom = new THREE.MeshStandardMaterial({ color: new THREE.Color('#6E4220'), roughness: 0.85, metalness: 0 });
  logMats = [side, top, bottom];
  return logMats;
}
