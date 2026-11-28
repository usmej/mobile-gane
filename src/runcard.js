// Run card: builds a shareable 1080x1350 PNG locally. No network, no analytics.
import { getPortrait } from './portraits.js';
import { getSkin } from './skins.js';

const INK = '#1B1420', CREAM = '#FFF4E0', GREEN = '#4EE06A', YELLOW = '#FFD23F';
const W = 1080, H = 1350;

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function loadImage(src) {
  return new Promise((res) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = src;
  });
}

function strokeFill(ctx, text, x, y, fill, lw) {
  ctx.lineJoin = 'round';
  ctx.lineWidth = lw;
  ctx.strokeStyle = INK;
  ctx.strokeText(text, x, y);
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
}

// Shrink font until text fits maxW.
function fitFont(ctx, text, family, size, maxW) {
  let s = size;
  for (; s > 24; s -= 4) {
    ctx.font = `${s}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
  }
  return s;
}

async function buildCard({ winner, level, coinsEarned, multiplier, skinId }) {
  try {
    await Promise.all([
      document.fonts.load('80px "Lilita One"'),
      document.fonts.load('900 40px Nunito'),
    ]);
  } catch (e) { /* fall back to system fonts */ }

  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 24;
  ctx.strokeRect(12, 12, W - 24, H - 24);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  const BUNGEE = "'Lilita One', 'Arial Black', sans-serif";
  const FREDOKA = "Nunito, 'Arial Rounded MT Bold', system-ui, sans-serif";

  // Title
  ctx.font = `120px ${BUNGEE}`;
  const wMass = ctx.measureText('ROOSTER ').width;
  const wDash = ctx.measureText('RUSH').width;
  const x0 = W / 2 - (wMass + wDash) / 2;
  ctx.textAlign = 'left';
  strokeFill(ctx, 'ROOSTER', x0, 200, GREEN, 18);
  strokeFill(ctx, 'RUSH', x0 + wMass, 200, YELLOW, 18);
  ctx.textAlign = 'center';

  // Portrait
  if (skinId) {
    try {
      const url = getPortrait(getSkin(skinId));
      const img = url ? await loadImage(url) : null;
      if (img) {
        const box = 440;
        const r = Math.min(box / img.width, box / img.height);
        const w = img.width * r, h = img.height * r;
        ctx.drawImage(img, (W - w) / 2, 250 + (box - h) / 2, w, h);
      }
    } catch (e) { /* skip portrait */ }
  }

  // Headline
  const name = String(winner || 'YOU').toUpperCase();
  const verb = name === 'YOU' ? 'CLEARED' : 'CLEARED';
  const head = `${name} ${verb} LEVEL ${level}!`;
  const size = fitFont(ctx, head, BUNGEE, 84, W - 140);
  ctx.font = `${size}px ${BUNGEE}`;
  ctx.fillStyle = INK;
  ctx.fillText(head, W / 2, 800);

  // Coins
  const coinTxt = `${Math.round(Number(coinsEarned) || 0).toLocaleString('en-US')} COINS  ×${multiplier || 1}`;
  ctx.font = `110px ${BUNGEE}`;
  strokeFill(ctx, coinTxt, W / 2, 980, YELLOW, 16);

  // Date
  ctx.font = `700 52px ${FREDOKA}`;
  ctx.fillStyle = INK;
  ctx.fillText(today(), W / 2, 1100);

  // Footer
  ctx.font = `700 44px ${FREDOKA}`;
  ctx.fillText('Play free: usmej.github.io/mobile-gane', W / 2, 1250);

  return new Promise((res) => c.toBlob(res, 'image/png'));
}

export async function shareRunCard(opts = {}) {
  try {
    const blob = await buildCard(opts);
    if (!blob) return;
    const file = new File([blob], 'rooster-rush-run.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: 'Rooster Rush' });
      return;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rooster-rush-run.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (e) {
    // user cancelled or share unavailable: do nothing
  }
}
