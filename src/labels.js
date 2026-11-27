import * as THREE from 'three';

export const FONT = '"Lilita One", "Arial Black", sans-serif';

// Canvas texture whose draw(ctx, w, h) is re-run once webfonts have loaded.
export function makeTextTexture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const paint = () => { ctx.clearRect(0, 0, w, h); draw(ctx, w, h); tex.needsUpdate = true; };
  paint();
  try {
    if (document.fonts && document.fonts.load) {
      document.fonts.load('40px "Lilita One"').then(() => { paint(); }).catch(() => {});
    }
  } catch (e) { /* ignore */ }
  return tex;
}

// A camera-facing text sprite drawn on a canvas. Call .setText() to update.
export function makeLabel(text, { color = '#ffffff', stroke = '#1B1420', bg = null, height = 1, fit = false } = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(height * 2, height, 1);
  sprite.renderOrder = 10;

  let current = null;
  const draw = () => {
    ctx.clearRect(0, 0, 256, 128);
    if (bg) {
      ctx.fillStyle = bg;
      roundRect(ctx, 8, 14, 240, 100, 3);
      ctx.fill();
    }
    const t = current;
    const size = t.length > 4 ? 64 : 84;
    ctx.font = `${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    if (!bg) {
      ctx.lineWidth = 14;
      ctx.strokeStyle = stroke;
      ctx.strokeText(t, 128, 68);
    }
    ctx.fillStyle = color;
    if (fit) ctx.fillText(t, 128, 68, 224);
    else ctx.fillText(t, 128, 68);
    tex.needsUpdate = true;
  };
  sprite.setText = (t) => {
    t = String(t);
    if (t === current) return;
    current = t;
    draw();
  };
  sprite.setText(text);
  try {
    if (document.fonts && document.fonts.load) document.fonts.load('40px "Lilita One"').then(() => { if (current !== null) draw(); }).catch(() => {});
  } catch (e) { /* ignore */ }
  sprite.disposeLabel = () => { tex.dispose(); mat.dispose(); };
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
