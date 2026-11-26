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
  levelLengthMax: 520,
  firstItemAt: 30,
  rowSpacingMin: 22,
  rowSpacingMax: 32,

  // Hit boxes
  pickupRadius: 0.9,
  sawDamageCooldown: 0.6,

  // Economy (earned by playing only — no real money)
  comboBonusMass: 2,
  winBaseCoins: 10,
  winCoinsPerLevel: 3,
  gemEveryNLevels: 5,
  maxMultiplier: 10,

  // Bonus stairs finale (x1 → x10 after the boss)
  finaleSteps: 10,
  finaleGap: 5,             // distance from the boss to the first step
  finaleStepDepth: 3,
  finaleStepRise: 0.55,
  finaleSpeed: 9,
  finaleStepCostRatio: 0.3, // each step costs this fraction of boss HP...
  finaleMinStepCost: 4,     // ...but at least this much mass
};

export function massToScale(mass) {
  const s = CONFIG.minScale + Math.cbrt(Math.max(1, mass)) * CONFIG.scalePerCbrt;
  return Math.min(CONFIG.maxScale, s);
}

export function speedForLevel(level) {
  return Math.min(CONFIG.maxSpeed, CONFIG.runSpeed + (level - 1) * CONFIG.speedPerLevel);
}
