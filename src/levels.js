import { CONFIG } from './config.js';
import { themeForLevel } from './themes.js';

// Seeded RNG so level N is always the same level N.
export function makeRng(seed) {
  let a = seed >>> 0;
  const rng = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.range = (lo, hi) => lo + rng() * (hi - lo);
  rng.int = (lo, hi) => Math.floor(rng.range(lo, hi + 1));
  rng.pick = (arr) => arr[Math.floor(rng() * arr.length)];
  return rng;
}

export function applyOp(mass, op, value) {
  switch (op) {
    case '+': return mass + value;
    case '-': return mass - value;
    case 'x': return mass * value;
    case '÷': return Math.ceil(mass / value);
    default: return mass;
  }
}

export function isGoodOp(op) { return op === '+' || op === 'x'; }

function goodGate(rng, level, mass) {
  if (rng() < 0.3 + Math.min(0.2, level * 0.01)) return { op: 'x', value: rng() < 0.75 ? 2 : 3 };
  return { op: '+', value: rng.int(3, 8 + level) + Math.floor(mass * 0.15) };
}
function badGate(rng, level, mass) {
  if (rng() < 0.3) return { op: '÷', value: 2 };
  return { op: '-', value: Math.max(2, rng.int(3, 6 + level) + Math.floor(mass * 0.25)) };
}

/**
 * Level item shapes (d = distance from start):
 *  { type:'gate',  d, left:{op,value}, right:{op,value} }
 *  { type:'food',  d, x, good:bool, value }
 *  { type:'coin',  d, x }
 *  { type:'gem',   d, x }
 *  { type:'saw',   d, x, amp, speed, damage }
 *  { type:'wall',  d, x, width, value }
 */
export function generateLevel(level) {
  const rng = makeRng(level * 9973 + 17);
  const theme = themeForLevel(level);
  const length = Math.min(CONFIG.levelLengthMax, CONFIG.levelLengthBase + level * CONFIG.levelLengthPerLevel);
  const W = CONFIG.trackHalfWidth - 0.6;
  const items = [];

  // "Expected" mass if the player plays well — used to size walls & the boss.
  let best = CONFIG.startMass;
  let d = CONFIG.firstItemAt;
  let rowIndex = 0;
  const hazardChance = Math.min(0.45, 0.12 + level * 0.025);

  while (d < length - 25) {
    const r = rng();
    if (rowIndex % 3 === 0 || r < 0.28) {
      // Gate pair — mostly one good + one bad, sometimes two goods (pick the better one).
      const g = goodGate(rng, level, best);
      const other = rng() < 0.25 ? goodGate(rng, level, best) : badGate(rng, level, best);
      const goodLeft = rng() < 0.5;
      items.push({ type: 'gate', d, left: goodLeft ? g : other, right: goodLeft ? other : g });
      const a = applyOp(best, g.op, g.value);
      const b = isGoodOp(other.op) ? applyOp(best, other.op, other.value) : 0;
      best = Math.min(9999, Math.max(a, b));
    } else if (r < 0.28 + hazardChance) {
      if (rng() < 0.55) {
        const amp = rng.range(1.2, W);
        items.push({ type: 'saw', d, x: 0, amp, speed: rng.range(1.4, 2.4 + level * 0.05), damage: Math.max(3, Math.floor(best * 0.2)) });
        // reward coins around it
        for (let i = 0; i < 4; i++) items.push({ type: 'coin', d: d - 6 + i * 3, x: rng() < 0.5 ? -W : W });
      } else {
        const width = rng.range(1.6, 2.6);
        const x = rng.pick([-1, 0, 1]) * (CONFIG.trackHalfWidth - width / 2);
        const value = Math.max(3, Math.floor(best * rng.range(0.3, 0.6)));
        items.push({ type: 'wall', d, x, width, value });
        best -= value * 0.3; // a good player mostly dodges
      }
    } else {
      // Food line: healthy on one side, junk on the other, coins in between.
      const healthySide = rng.pick([-1, 1]);
      const n = rng.int(3, 5);
      for (let i = 0; i < n; i++) {
        const dd = d - 4 + i * 2.6;
        items.push({ type: 'food', d: dd, x: healthySide * rng.range(0.8, W), good: true, value: rng.int(1, 3) });
        items.push({ type: 'food', d: dd + 1.3, x: -healthySide * rng.range(0.8, W), good: false, value: rng.int(1, 3) });
      }
      best += n * 2;
      for (let i = 0; i < 5; i++) items.push({ type: 'coin', d: d - 4 + i * 2.2, x: 0 });
    }
    // occasional gem
    if (rng() < 0.08) items.push({ type: 'gem', d: d + 10, x: rng.range(-W, W) });
    d += rng.range(CONFIG.rowSpacingMin, CONFIG.rowSpacingMax);
    rowIndex++;
  }

  const bossHp = Math.max(8, Math.round(best * (0.45 + Math.min(0.15, level * 0.012))));
  return {
    level,
    theme,
    length,
    items: items.sort((a, b) => a.d - b.d),
    boss: { hp: bossHp, d: length + 12 },
  };
}
