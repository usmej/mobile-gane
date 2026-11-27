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
  if (rng() < 0.3 + Math.min(0.2, level * 0.01)) {
    const roll = rng();
    const value = roll < 0.75 ? 2 : level >= 6 && roll >= 0.93 ? 4 : 3;
    return { op: 'x', value };
  }
  const extra = Math.min(12, Math.max(0, level - 1));
  const worldBonus = Math.min(CONFIG.maxGateWorldBonus,
    Math.floor((level - 1) / CONFIG.levelsPerWorld) * CONFIG.gateAddPerWorld);
  return { op: '+', value: rng.int(3, 8 + level + extra) + Math.floor(mass * 0.15) + worldBonus };
}
function badGate(rng, level, mass) {
  const roll = rng();
  if (roll < 0.3) {
    const value = level >= 10 && roll >= 0.27 ? 4 : level >= 4 && roll >= 0.22 ? 3 : 2;
    return { op: '÷', value };
  }
  const extra = Math.min(8, Math.max(0, level - 1));
  return { op: '-', value: Math.max(2, rng.int(level === 1 ? 3 : 2, 6 + level + extra) + Math.floor(mass * 0.25)) };
}

/**
 * Level item shapes (d = distance from start):
 *  { type:'gate',  d, left:{op,value}, right:{op,value} }
 *  { type:'food',  d, x, good:bool, value }
 *  { type:'coin',  d, x }
 *  { type:'gem',   d, x }
 *  { type:'saw',   d, x, amp, speed, damage }
 *  { type:'hammer', d, damage, speed }
 *  { type:'pad',    d, x }
 *  { type:'wall',  d, x, width, value }
 */
export function worldLabel(level) {
  const index = Math.max(0, level - 1);
  return 'WORLD ' + (Math.floor(index / CONFIG.levelsPerWorld) + 1) + '-' + (index % CONFIG.levelsPerWorld + 1);
}

function sampleGateRoutes(items, level, onStrongGate, routeCount = CONFIG.routeBalance.samples, awardCombo = true) {
  const gates = items.filter((item) => item.type === 'gate').sort((a, b) => a.d - b.d);
  const rng = makeRng(level + 39521);
  const survivors = [];
  let strong = 0;
  for (let route = 0; route <= routeCount; route++) {
    let mass = CONFIG.startMass, combo = 0;
    for (const gate of gates) {
      if (route === 0 && onStrongGate) onStrongGate(gate, mass);
      const options = [gate.left, gate.right].map(({ op, value }) => {
        const streak = isGoodOp(op) ? combo + 1 : 0;
        return { streak, mass: applyOp(mass, op, value) + (awardCombo && streak >= 2 ? streak * CONFIG.comboBonusMass : 0) };
      }).sort((a, b) => a.mass - b.mass);
      const next = options[route === 0 || rng() < CONFIG.routeBalance.preferStrongGate ? 1 : 0];
      mass = next.mass;
      combo = next.streak;
      if (mass <= 0) break;
    }
    if (route === 0) strong = Math.max(0, mass);
    else if (mass > 0) survivors.push(mass);
  }
  survivors.sort((a, b) => a - b);
  return { typical: survivors[Math.floor(survivors.length / 2)] ?? 0, strong };
}

export function generateLevel(level) {
  const rng = makeRng(level * 9973 + 17);
  const theme = themeForLevel(level);
  const world = Math.ceil(level / CONFIG.levelsPerWorld);
  const length = Math.min(CONFIG.levelLengthMax,
    CONFIG.levelLengthBase + level * CONFIG.levelLengthPerLevel + (world - 1) * CONFIG.lengthBonusPerWorld);
  const W = CONFIG.trackHalfWidth - 0.6;
  const items = [];

  // "Expected" mass if the player plays well — used to size walls & the boss.
  let best = CONFIG.startMass;
  let d = CONFIG.firstItemAt;
  let rowIndex = 0;
  const hazardChance = Math.min(0.45, 0.12 + level * 0.025);

  while (d < length - 25) {
    const r = rng();
    const hammer = CONFIG.hammer;
    if (level === hammer.minLevel && rowIndex === hammer.introductionRow) {
      const speed = rng.range(hammer.minSpeed, hammer.maxSpeed + level * hammer.speedPerLevel);
      items.push({ type: 'hammer', d, damage: Math.max(3, Math.floor(best * hammer.damageRatio)), speed });
    } else if (rowIndex % 3 === 0 || r < 0.28) {
      const db = CONFIG.doubleBad;
      const pDouble = level < db.minLevel ? 0 : Math.min(db.max, db.start + (level - db.minLevel) * db.perLevel);
      if (rng() < pDouble) {
        // Double-red pair: both choices hurt, so the player picks the SMALLER loss.
        // A '-' gate is capped so a smart pick always survives.
        const cap = (gate) => (gate.op === '-' ? { op: '-', value: Math.max(1, Math.min(gate.value, Math.floor(best * db.maxLossRatio))) } : gate);
        const left = cap(badGate(rng, level, best));
        const right = cap(badGate(rng, level, best));
        items.push({ type: 'gate', d, left, right, doubleBad: true });
        best = Math.max(1, Math.max(applyOp(best, left.op, left.value), applyOp(best, right.op, right.value)));
      } else {
        // Gate pair — mostly one good + one bad, sometimes two goods (pick the better one).
        const g = goodGate(rng, level, best);
        const other = rng() < 0.25 ? goodGate(rng, level, best) : badGate(rng, level, best);
        const goodLeft = rng() < 0.5;
        items.push({ type: 'gate', d, left: goodLeft ? g : other, right: goodLeft ? other : g });
        const a = applyOp(best, g.op, g.value);
        const b = isGoodOp(other.op) ? applyOp(best, other.op, other.value) : 0;
        best = Math.min(9999, Math.max(a, b));
      }
    } else if (r < 0.28 + hazardChance) {
      const hazardRoll = rng();
      if (level >= hammer.minLevel && hazardRoll < hammer.hazardShare) {
        const speed = rng.range(hammer.minSpeed, hammer.maxSpeed + level * hammer.speedPerLevel);
        const damage = Math.max(3, Math.floor(best * hammer.damageRatio));
        items.push({ type: 'hammer', d, damage, speed });
      } else if (hazardRoll < 0.55) {
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
      if (level >= CONFIG.pickupPaths.firstLevel) {
        const pathRng = makeRng(Math.floor(d * 1000) + level * 7919);
        const patterns = level >= CONFIG.pickupPaths.motionLevel ? 4 : level >= CONFIG.pickupPaths.waveLevel ? 3 : 2;
        const pattern = pathRng.int(0, patterns - 1);
        const row = items.slice(-(2 * n + 5));
        const { spacing, swing } = CONFIG.pickupPaths;
        const lane = (i, count) => {
          if (pattern === 0) return healthySide * [-1, 0, 1, 0][i % 4];
          if (pattern === 1) return healthySide * [0, 1, 0, -1][i % 4];
          if (pattern === 2) return healthySide * Math.sin(i / (count - 1) * Math.PI * 2);
          return healthySide * (2 * i / (count - 1) - 1);
        };
        const span = W - swing;
        row.forEach((item, index) => {
          const food = item.type === 'food';
          const i = food ? Math.floor(index / 2) : index - 2 * n;
          const x = lane(i, food ? n : 5) * span;
          item.d = d - 5 + i * spacing + (food && !item.good ? 1.1 : 0);
          item.x = food && !item.good ? (x >= 0 ? -span : span) : x;
          if (pattern === 3 && food) item.sweep = (item.good ? 1 : -1) * swing;
        });
      }
    }
    // occasional gem
    if (rng() < 0.08) items.push({ type: 'gem', d: d + 10, x: rng.range(-W, W) });
    d += rng.range(CONFIG.rowSpacingMin, CONFIG.rowSpacingMax);
    rowIndex++;
  }

  if (level >= CONFIG.jumpPad.minLevel) {
    const hazards = items.filter(({ type }) => ['wall', 'saw', 'hammer'].includes(type));
    for (let i = 0; i < hazards.length; i += 2) {
      const hazard = hazards[i];
      items.push({
        type: 'pad',
        d: hazard.d - CONFIG.jumpPad.lead,
        x: hazard.type === 'wall' ? hazard.x : 0,
      });
    }
  }

  if (level >= CONFIG.magnet.minLevel) {
    const lead = CONFIG.magnet.lead;
    const coin = items.find((item) => item.type === 'coin' &&
      item.d > CONFIG.firstItemAt + lead &&
      items.every((other) => Math.abs(other.d - (item.d - lead)) > CONFIG.pickupRadius));
    items.push({ type: 'magnet', d: coin ? coin.d - lead : CONFIG.firstItemAt - lead, x: coin ? coin.x : 0 });
  }

  const jump = CONFIG.timedJump;
  if (level >= jump.firstLevel) {
    const count = Math.min(3, 1 + Math.floor((level - jump.firstLevel) / 5));
    let placed = 0;
    for (let pos = jump.firstDistance; pos <= length - jump.endBuffer && placed < count; pos++) {
      if (items.some(item => Math.abs(item.d - pos) < jump.obstacleBuffer)) continue;
      items.push({ type: 'barrier', d: pos });
      items.push({ type: 'coin', d: pos, x: 0, jumpReward: true });
      placed++;
      pos += jump.interval - 1;
    }
  }

  if (level >= CONFIG.routeBalance.firstLevel) {
    const gates = items.filter(item => item.type === 'gate').sort((a, b) => a.d - b.d);
    let previousDoubleBad = false;
    for (const [index, gate] of gates.entries()) {
      if (gate.doubleBad && (previousDoubleBad || index >= gates.length - 2)) {
        const side = index % 2 === 0 ? 'left' : 'right';
        gate[side] = { op: '+', value: Math.max(1, gate[side].value) };
        delete gate.doubleBad;
      }
      previousDoubleBad = Boolean(gate.doubleBad);
    }
  }

  let bossHp = Math.max(8, Math.round(best * (0.45 + Math.min(0.15, level * 0.012))));
  const balance = CONFIG.routeBalance;
  if (level >= balance.firstLevel) {
    // Repair the strongest route without assuming food pickups or combo bonuses.
    const { strong: baseRouteMass } = sampleGateRoutes(items, level, (gate, mass) => {
      const cap = Math.floor(mass * CONFIG.doubleBad.maxLossRatio);
      if (gate.doubleBad && gate.left.op === '-' && gate.right.op === '-') {
        gate.left.value = Math.min(cap, gate.left.value);
        gate.right.value = Math.min(cap, gate.right.value);
      }
    }, 0, false);
    const { typical, strong } = sampleGateRoutes(items, level);
    const offset = level - balance.firstLevel;
    const floor = Math.min(balance.maxHpFloor, Math.round(
      balance.firstBossHp + offset * balance.hpPerLevel + offset ** 2 * balance.hpCurve
    ));
    const target = Math.round(typical + Math.max(0, strong - typical) * balance.strongRouteWeight);
    const ceiling = Math.floor(floor * balance.hpBand);
    bossHp = Math.max(floor, Math.min(ceiling, target, strong));
    if (baseRouteMass < bossHp) {
      items.push({
        type: 'gate', d: length - balance.recoveryGateGap,
        left: { op: '+', value: bossHp - baseRouteMass + balance.recoveryMassMargin },
        right: { op: '÷', value: 2 },
      });
    }
  }
  return {
    level,
    theme,
    length,
    items: items.sort((a, b) => a.d - b.d),
    boss: { hp: bossHp, d: length + 12 },
  };
}
