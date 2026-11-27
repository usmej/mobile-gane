// Every tuning number in one place. Tweak here, not in the logic files.
export const CONFIG = {
  // Track
  trackHalfWidth: 3,
  bossArena: 55,            // extra track after the finish line (boss + bonus stairs)

  // Movement
  runSpeed: 13,             // units / second at level 1
  speedPerLevel: 0.35,
  maxSpeed: 21,
  steerPerPixel: 0.022,     // world units per dragged pixel
  steerSmoothing: 14,       // higher = snappier

  // Blob
  startMass: 10,
  minScale: 0.55,
  scalePerCbrt: 0.22,       // scale = minScale + cbrt(mass) * scalePerCbrt
  maxScale: 2.4,

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
};

export function massToScale(mass) {
  const s = CONFIG.minScale + Math.cbrt(Math.max(1, mass)) * CONFIG.scalePerCbrt;
  return Math.min(CONFIG.maxScale, s);
}

export function speedForLevel(level) {
  return Math.min(CONFIG.maxSpeed, CONFIG.runSpeed + (level - 1) * CONFIG.speedPerLevel);
}
