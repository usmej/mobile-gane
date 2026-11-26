// Every tuning number in one place. Tweak here, not in the logic files.
export const CONFIG = {
  // Track
  trackHalfWidth: 3,
  bossArena: 40,            // extra track after the finish line

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
  winBaseCoins: 10,
  winCoinsPerLevel: 3,
  gemEveryNLevels: 5,
  maxMultiplier: 10,
};

export function massToScale(mass) {
  const s = CONFIG.minScale + Math.cbrt(Math.max(1, mass)) * CONFIG.scalePerCbrt;
  return Math.min(CONFIG.maxScale, s);
}

export function speedForLevel(level) {
  return Math.min(CONFIG.maxSpeed, CONFIG.runSpeed + (level - 1) * CONFIG.speedPerLevel);
}
