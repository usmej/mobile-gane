import * as THREE from 'three';

// A camera-facing text sprite drawn on a canvas. Call .setText() to update.
export function makeLabel(text, { color = '#ffffff', stroke = '#1a1030', bg = null, height = 1 } = {}) {
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
  sprite.setText = (t) => {
    t = String(t);
    if (t === current) return;
    current = t;
    ctx.clearRect(0, 0, 256, 128);
    if (bg) {
      ctx.fillStyle = bg;
      roundRect(ctx, 8, 14, 240, 100, 30);
      ctx.fill();
    }
    const size = t.length > 4 ? 64 : 84;
    ctx.font = `900 ${size}px "Lilita One", "Arial Black", Impact, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 14;
    ctx.strokeStyle = stroke;
    ctx.strokeText(t, 128, 68);
    ctx.fillStyle = color;
    ctx.fillText(t, 128, 68);
    tex.needsUpdate = true;
  };
  sprite.setText(text);
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
