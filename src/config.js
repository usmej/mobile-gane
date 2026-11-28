// Every tuning number in one place. Tweak here, not in the logic files.
export const CONFIG = {
  // Track
  trackHalfWidth: 3,
  bossArena: 55,            // extra track after the finish line (boss + bonus stairs)

  // Movement
  runSpeed: 13,             // units / second at level 1
  speedPerLevel: 0.35,
  maxSpeed: 21,
  // Level pace: after maxSpeed, speed keeps creeping up slowly, and from level 4 each level
  // rolls a pace so runs don't feel the same. Seeded by level, so a level always plays the same.
  pace: {
    firstLevel: 4,
    lateSpeedPerLevel: 0.05,   // extra speed per level once maxSpeed is reached
    lateMaxSpeed: 23.5,
    hardCap: 25.5,             // never faster than this, whatever the pace
    // kind: share of levels, speed multiplier (ramp goes from `from` to `to` across the level)
    kinds: {
      normal: { weight: 0.52, mult: 1 },
      turbo:  { weight: 0.18, mult: 1.15, label: 'TURBO LEVEL!' },
      chill:  { weight: 0.14, mult: 0.86, label: 'CHILL LEVEL' },
      ramp:   { weight: 0.16, from: 0.9, to: 1.22, label: 'IT GETS FASTER!' },
    },
  },
  steerPerPixel: 0.022,     // world units per dragged pixel
  steerSmoothing: 14,       // higher = snappier

  // Blob
  startMass: 10,
  minScale: 0.55,
  scalePerCbrt: 0.17,       // scale = minScale + cbrt(mass) * scalePerCbrt (still proportional to mass)
  maxScale: 1.9,            // capped so a huge character never blocks the view of what's coming

  // Levels
  levelLengthBase: 230,
  levelLengthPerLevel: 14,
  levelLengthMax: 1400,
  levelsPerWorld: 5,
  lengthBonusPerWorld: 35,
  gateAddPerWorld: 2,
  maxGateWorldBonus: 20,
  routeBalance: {
    firstLevel: 4,
    samples: 64,
    preferStrongGate: 0.55,
    firstBossHp: 76,
    hpPerLevel: 5,
    hpCurve: 0.58,
    maxHpFloor: 12000,
    hpBand: 1.12,
    strongRouteWeight: 0.3,
    recoveryGateGap: 9,
    recoveryMassMargin: 4,
  },
  firstItemAt: 30,
  rowSpacingMin: 22,
  rowSpacingMax: 32,

  // Hit boxes
  pickupRadius: 0.9,
  pickupPaths: {
    firstLevel: 4, waveLevel: 6, motionLevel: 11,
    spacing: 3.6, swing: 0.55, cycleDistance: 27,
    jumpCoinClearance: 0.9, jumpCoinHeight: 1.8,
  },
  magnet: { minLevel: 5, duration: 6, radius: 4, pullSpeed: 32, collectDistance: 0.5, lead: 4, pickupHeight: 1.1 },
  sawDamageCooldown: 0.6,
  wallHitRadiusCap: 1.2,   // walls use at most this radius for side reach, so big blobs can still dodge
  jumpPad: {
    minLevel: 4,
    lead: 7,
    width: 1.7,
    depth: 1.35,
    thickness: 0.12,
    duration: 1.2,
    peak: 3,
    clearance: 0.5,
    landingSquash: -0.45,
  },

  timedJump: {
    firstLevel: 6,
    firstDistance: 70,     // first barrier ~4-5 s into the run, after the NEW! cue (was 16 = 0.5 s)
    endBuffer: 45,
    obstacleBuffer: 9,
    interval: 95,
    height: 0.7,
    depth: 1.1,
    damageRatio: 0.24,
    coachLeadSeconds: 0.45, // first-ever barrier: show JUMP NOW! this long before reaching it
  },

  // Swinging hammer
  hammer: {
    minLevel: 3,
    introductionRow: 1,
    hazardShare: 0.35,
    damageRatio: 0.3,
    minSpeed: 1.4,
    maxSpeed: 2.4,
    speedPerLevel: 0.05,
    amplitude: 1.2,
    pivotHeight: 3.55,
    armLength: 2.75,
    postWidth: 0.28,
    handleWidth: 0.18,
    headWidth: 1.25,
    headHeight: 0.7,
    headDepth: 0.9,
    bandWidth: 0.25,
    cooldown: 0.6,
  },

  // Economy (earned by playing only — no real money)
  comboBonusMass: 2,
  winBaseCoins: 10,
  winCoinsPerLevel: 3,
  gemEveryNLevels: 5,
  maxMultiplier: 10,

  // Double-red gate pairs: both choices are bad, pick the smaller loss
  doubleBad: {
    minLevel: 2,          // never on level 1
    start: 0.10,          // chance per gate pair on level 2
    perLevel: 0.025,      // +2.5% per level after that
    max: 0.30,            // capped at 30% (reached around level 10)
    maxLossRatio: 0.4,    // a '-N' in a double-red pair never takes more than 40% of expected mass
  },

  // Boss size readability (FB-003)
  bossMinSizeGap: 0.06,   // at least 6% bigger/smaller than the player when not tied
  bossMaxRatio: 2.2,      // never more than 2.2x / less than 1/2.2x the player's core size

  // Bonus stairs finale (x1 → x10 after the boss)
  finaleSteps: 10,
  finaleGap: 5,             // distance from the boss to the first step
  finaleStepDepth: 3,
  finaleStepRise: 0.55,
  finaleSpeed: 9,
  finaleFirstStepCost: 2,   // rung costs triple: 2, 6, 18, 54, ...
  finaleMassPerLevel: 4,    // bonus mass for beating the boss, from level 2 on...
  finaleMaxMassBonus: 160,  // ...capped

  // Boss fight (tap the weak spots when you reach the boss)
  bossFight: {
    duration: 7,             // seconds to empty the boss bar (miss it = lose)
    spotLife: 0.9,           // a weak spot jumps elsewhere after this long
    spotsAtOnce: 2,
    fightHp: 100,            // fight bar; reaching 0 = PERFECT
    damagePerHit: 14,
    perfectBonusRatio: 0.5,  // bonus mass = mass * ratio * hitRatio
    loseDuration: 2.2,       // how long the hopeless fight lasts when too small
    minSpotPx: 64,
  },
  // Real-money purchases. Off on the website until the app-store build ships (docs/PAYMENTS.md).
  // Add ?shoptest to the URL to try the whole flow with a fake store (no real money).
  payments: { enabled: false },
  // Quiet assist (flow research): after N losses in a row on one level, start with extra mass
  // = bossHp * bossHpShare per step (max maxSteps). Never announced.
  assist: { afterLosses: 3, bossHpShare: 0.06, maxSteps: 3 },
  // "Keep going" after a loss: pay gems to continue from where you lost.
  // cost = (base + level*perLevel + size*perMass), doubled for each extra continue in the same run.
  continue: { base: 1, perLevel: 0.25, perMass: 0.02, maxCost: 60, minMass: 10 },
  intro: { leadSeconds: 1.2 },  // pause this many seconds of travel before a first-time item
};

export function massToScale(mass) {
  const s = CONFIG.minScale + Math.cbrt(Math.max(1, mass)) * CONFIG.scalePerCbrt;
  return Math.min(CONFIG.maxScale, s);
}

function baseSpeed(level) {
  const P = CONFIG.pace;
  const early = CONFIG.runSpeed + (level - 1) * CONFIG.speedPerLevel;
  if (early <= CONFIG.maxSpeed) return early;
  const capLevel = 1 + (CONFIG.maxSpeed - CONFIG.runSpeed) / CONFIG.speedPerLevel;
  return Math.min(P.lateMaxSpeed, CONFIG.maxSpeed + (level - capLevel) * P.lateSpeedPerLevel);
}

function rollPace(level) {
  if (level < CONFIG.pace.firstLevel) return 'normal';
  // small integer hash -> [0,1), stable per level
  let h = Math.imul(level ^ 0x9e3779b9, 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  const r = ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  let acc = 0;
  for (const [kind, k] of Object.entries(CONFIG.pace.kinds)) {
    acc += k.weight;
    if (r < acc) return kind;
  }
  return 'normal';
}

// Pace for a level: { kind: 'normal'|'turbo'|'chill'|'ramp', label }. The same special pace never
// shows up two levels in a row.
export function paceForLevel(level) {
  let kind = rollPace(level);
  if (kind !== 'normal' && rollPace(level - 1) === kind) kind = 'normal';
  return { kind, label: CONFIG.pace.kinds[kind].label || '' };
}

// Run speed at `progress` (0..1 along the track) on `level`.
export function speedForLevel(level, progress = 0) {
  const k = CONFIG.pace.kinds[paceForLevel(level).kind];
  const t = Math.max(0, Math.min(1, progress));
  const mult = k.from !== undefined ? k.from + (k.to - k.from) * t : k.mult;
  return Math.min(CONFIG.pace.hardCap, baseSpeed(level) * mult);
}
