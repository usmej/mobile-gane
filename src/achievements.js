export const BADGES = [
  { id: 'first-win', name: 'First Gloop', desc: 'Win your first run.' },
  { id: 'level-5', name: 'Gloop School', desc: 'Reach level 5.' },
  { id: 'level-10', name: 'Track Regular', desc: 'Reach level 10.' },
  { id: 'level-20', name: 'Gloop Legend', desc: 'Reach level 20.' },
  { id: 'finale-10', name: 'Top Step', desc: 'Finish the bonus stairs with a x10 multiplier.' },
  { id: 'combo-5', name: 'Gate Gravy', desc: 'Pick five good gates in a row.' },
  { id: 'walls-10', name: 'Brick Snack', desc: 'Smash 10 walls.' },
  { id: 'pads-25', name: 'Air Gloop', desc: 'Launch from 25 jump pads.' },
  { id: 'skins-5', name: 'Closet Ooze', desc: 'Own 5 skins.' },
  { id: 'daily-7', name: 'Week of Goo', desc: 'Reach a seven-day daily streak.' },
  { id: 'clean-win', name: 'Spotless Slime', desc: 'Win without losing mass to gates, food, or hazards.' },
  { id: 'coins-1000', name: 'Coin Puddle', desc: 'Pick up 1,000 coins on the track.' },
];

export function track(save, event) {
  const stats = save.stats;
  if (event.type === 'win') {
    stats.wins = (stats.wins || 0) + 1;
    stats.bestMultiplier = Math.max(stats.bestMultiplier || 0, event.multiplier);
    if (event.clean) stats.cleanWin = true;
  }
  if (event.type === 'combo') stats.bestCombo = Math.max(stats.bestCombo || 0, event.count);
  if (event.type === 'wall') stats.walls = (stats.walls || 0) + 1;
  if (event.type === 'pad') stats.pads = (stats.pads || 0) + 1;
  if (event.type === 'coin') stats.coins = (stats.coins || 0) + 1;

  const best = Math.max(save.best || 1, save.level || 1);
  const eligible = [
    stats.wins >= 1 || save.best >= 2, best >= 5, best >= 10, best >= 20,
    stats.bestMultiplier >= 10, stats.bestCombo >= 5, stats.walls >= 10,
    stats.pads >= 25, save.ownedSkins.length >= 5, save.dailyStreak >= 7,
    stats.cleanWin, stats.coins >= 1000,
  ];
  return BADGES.filter((badge, index) => {
    if (!eligible[index] || Object.prototype.hasOwnProperty.call(save.achievements, badge.id)) return false;
    save.achievements[badge.id] = Date.now();
    return true;
  });
}
