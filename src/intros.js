// First-encounter "pause and explain" copy. The game pauses just before a new thing
// appears for the first time and shows one of these cards (see main.js / ui.showIntro).
import * as I from './icons.js';

const registry = new Map();

export function registerIntro(type, { title, how, icon } = {}) {
  registry.set(type, { key: type, title: String(title || ''), how: String(how || ''), icon: icon || '' });
}

export function getIntro(type) {
  return registry.get(type) || null;
}

// Map a level item to its intro key (null when the item has no intro).
export function introKeyFor(item) {
  if (!item) return null;
  if (item.type === 'gate') return item.doubleBad ? 'doubleBad' : 'gate';
  if (item.type === 'food') return item.sweep ? 'movingFood' : item.good ? 'food' : 'mold';
  return registry.has(item.type) ? item.type : null;
}

// ---- tiny inline icons (same ink-outline look as icons.js) ----
const INK = '#1B1420';
const svg = (body) =>
  `<svg class="ico" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
const T = (x, y, s, fill) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="'Lilita One',Arial Black,sans-serif" font-size="${s}" fill="${fill}" stroke="none">`;

const ICON = {
  gate: svg(`<rect x="2.5" y="4" width="8.5" height="16" rx="2" fill="#1FA2FF"/><rect x="13" y="4" width="8.5" height="16" rx="2" fill="#FF3B5C"/>${T(6.7, 15, 9, '#fff')}+</text>${T(17.3, 15, 9, '#fff')}-</text>`),
  doubleBad: svg(`<rect x="2.5" y="4" width="8.5" height="16" rx="2" fill="#FF3B5C"/><rect x="13" y="4" width="8.5" height="16" rx="2" fill="#FF3B5C"/>${T(6.7, 15, 9, '#fff')}-</text>${T(17.3, 15, 9, '#fff')}-</text>`),
  food: svg(`<circle cx="9" cy="9" r="4.5" fill="#4EE06A"/><circle cx="15" cy="10" r="4.5" fill="#4EE06A"/><circle cx="12" cy="6.5" r="4.5" fill="#4EE06A"/><path d="M12 12v8" stroke="#2FAE4F" stroke-width="4" fill="none"/>`),
  mold: svg(`<circle cx="12" cy="13" r="8" fill="#A8D46F"/><circle cx="9" cy="11" r="1.8" fill="#6E8B4E" stroke="none"/><circle cx="14.5" cy="15" r="2" fill="#6E8B4E" stroke="none"/><path d="M12 5c0-2 1-3 3-3" fill="none"/>`),
  movingFood: svg(`<circle cx="12" cy="12" r="6" fill="#4EE06A"/><path d="M2 20h4M18 4h4M3 4h3M18 20h3" fill="none"/>`),
  coin: I.coin(),
  gem: I.gem(),
  wall: svg(`<rect x="2.5" y="5" width="19" height="14" rx="2" fill="#8A8FA8"/><path d="M2.5 12h19M9 5v7M15 12v7" fill="none"/>`),
  saw: svg(`<circle cx="12" cy="12" r="8" fill="#C9CEE0"/><path d="M12 1.5l2 3.5-2 1.5-2-1.5zM12 22.5l-2-3.5 2-1.5 2 1.5zM1.5 12l3.5-2 1.5 2-1.5 2zM22.5 12l-3.5 2-1.5-2 1.5-2z" fill="#FF3B5C"/><circle cx="12" cy="12" r="2.5" fill="#1B1420"/>`),
  hammer: svg(`<path d="M12 3v11" stroke-width="3.5" fill="none"/><rect x="5" y="14" width="14" height="7" rx="2" fill="#8A8FA8"/>`),
  pad: svg(`<path d="M3 18h18" fill="none"/><rect x="4" y="14" width="16" height="4" rx="2" fill="#FFD23F"/><path d="M12 11V4M8.5 7.5 12 4l3.5 3.5" fill="none"/>`),
  barrier: svg(`<path d="M3 10h18v6H3z" fill="#FFD23F"/><path d="M7 10l-3 6M12 10l-3 6M17 10l-3 6M21 11l-2 5" fill="none"/><path d="M5 16v5M19 16v5" fill="none"/>`),
  magnet: svg(`<path d="M5 20v-9a7 7 0 0 1 14 0v9h-5v-9a2 2 0 0 0-4 0v9z" fill="#FF3B5C"/><path d="M5 20h5M14 20h5" stroke="#fff" fill="none"/>`),
  bossFight: I.bossFace(),
};

registerIntro('gate', {
  title: 'Math Gates',
  how: 'Blue gates make you bigger. Red gates make you smaller. Pick the bigger result!',
  icon: ICON.gate,
});
registerIntro('doubleBad', {
  title: 'Double Red',
  how: 'Both sides hurt! Pick the smaller loss.',
  icon: ICON.doubleBad,
});
registerIntro('food', {
  title: 'Healthy Food',
  how: 'Yummy food makes you bigger. Run into it to eat it!',
  icon: ICON.food,
});
registerIntro('mold', {
  title: 'Moldy Food',
  how: 'Yuck! Moldy food makes you smaller. Steer around it.',
  icon: ICON.mold,
});
registerIntro('movingFood', {
  title: 'Sliding Food',
  how: 'This food slides side to side. Line up and catch it!',
  icon: ICON.movingFood,
});
registerIntro('coin', {
  title: 'Coins',
  how: 'Grab coins to spend in the shop.',
  icon: ICON.coin,
});
registerIntro('gem', {
  title: 'Gems',
  how: 'Gems are rare and shiny. Grab them for special skins!',
  icon: ICON.gem,
});
registerIntro('wall', {
  title: 'Big Wall',
  how: 'Smash it if your number is bigger than the wall. If not, steer around!',
  icon: ICON.wall,
});
registerIntro('saw', {
  title: 'Spinning Saw',
  how: 'It slides side to side and it hurts. Dodge it!',
  icon: ICON.saw,
});
registerIntro('hammer', {
  title: 'Swinging Hammer',
  how: 'It swings across the track. Time your pass!',
  icon: ICON.hammer,
});
registerIntro('pad', {
  title: 'Jump Pad',
  how: 'Drive over it to launch over the next danger.',
  icon: ICON.pad,
});
registerIntro('barrier', {
  title: 'Striped Barrier',
  how: 'Tap JUMP or press Space just before the stripes!',
  icon: ICON.barrier,
});
registerIntro('magnet', {
  title: 'Coin Magnet',
  how: 'Grab it to pull coins in for a few seconds.',
  icon: ICON.magnet,
});
registerIntro('bossFight', {
  title: 'Boss Fight!',
  how: "Tap the yellow weak spots fast and empty the boss's bar before time runs out! Run out of time and the boss wins.",
  icon: ICON.bossFight,
});
