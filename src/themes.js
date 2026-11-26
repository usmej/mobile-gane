// Level color themes (data only). Colors are '#rrggbb'.

export const THEMES = [
  {
    id: 'candy-pop',
    name: 'Candy Pop',
    sky: '#5a1f5c',
    fog: '#6e2a70',
    track: '#ff6fb5',
    trackAlt: '#e84d9c',
    edge: '#fff3fa',
    accent: '#7afcff',
    pattern: 'dots',
  },
  {
    id: 'toxic-slime',
    name: 'Toxic Slime',
    sky: '#3d9e2a',
    fog: '#4fb536',
    track: '#8cf23a',
    trackAlt: '#64c41f',
    edge: '#1d4d12',
    accent: '#e4ff5c',
    pattern: 'stripes',
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave',
    sky: '#2a1b6b',
    fog: '#3a2a85',
    track: '#ff7ad9',
    trackAlt: '#ff9be6',
    edge: '#b8f6ff',
    accent: '#ffe86b',
    pattern: 'checker',
  },
  {
    id: 'lava-drip',
    name: 'Lava Drip',
    sky: '#4a0f0a',
    fog: '#6b1a10',
    track: '#ff5a1f',
    trackAlt: '#e0401a',
    edge: '#fff2a8',
    accent: '#ff2e63',
    pattern: 'stripes',
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream',
    sky: '#4fa8d8',
    fog: '#6cbbe6',
    track: '#ffe3f1',
    trackAlt: '#c9f2e4',
    edge: '#9b6bff',
    accent: '#ff7aa8',
    pattern: 'checker',
  },
  {
    id: 'neon-grid',
    name: 'Neon Grid',
    sky: '#0b0220',
    fog: '#12052e',
    track: '#3a1a8c',
    trackAlt: '#5a2bb5',
    edge: '#00f0ff',
    accent: '#ff2bd6',
    pattern: 'plain',
  },
  {
    id: 'bubblegum-sky',
    name: 'Bubblegum Sky',
    sky: '#1f8fcf',
    fog: '#2c9ad8',
    track: '#ff8fd0',
    trackAlt: '#e66fc0',
    edge: '#ffffff',
    accent: '#ffd23f',
    pattern: 'dots',
  },
  {
    id: 'goblin-swamp',
    name: 'Goblin Swamp',
    sky: '#2b3a1f',
    fog: '#3a4a28',
    track: '#9bb04e',
    trackAlt: '#7d8f3c',
    edge: '#1c2611',
    accent: '#c07bff',
    pattern: 'plain',
  },
  // P2-02 — added by Person 2 / ChatGPT
  {

    id: 'midnight-arcade',

    name: 'Midnight Arcade',

    sky: '#170f2b',

    fog: '#1c1432',

    track: '#717581',

    trackAlt: '#8d909c',

    edge: '#f9df81',

    accent: '#c3a5f2',

    pattern: 'checker',

  },

  {

    id: 'pickle-planet',

    name: 'Pickle Planet',

    sky: '#263319',

    fog: '#2b381e',

    track: '#c5cf76',

    trackAlt: '#a3b34f',

    edge: '#424f21',

    accent: '#ecbe63',

    pattern: 'dots',

  },

  {

    id: 'sunset-drip',

    name: 'Sunset Drip',

    sky: '#51303d',

    fog: '#553441',

    track: '#f5b978',

    trackAlt: '#dc9b59',

    edge: '#633846',

    accent: '#fff0b5',

    pattern: 'stripes',

  },

  {

    id: 'cotton-candy-storm',

    name: 'Cotton Candy Storm',

    sky: '#322a49',

    fog: '#382e50',

    track: '#d1c9df',

    trackAlt: '#b4a9c9',

    edge: '#514568',

    accent: '#f5a8c5',

    pattern: 'checker',

  },
];

export function themeForLevel(level) {
  const n = Math.max(1, Math.floor(Number(level) || 1));
  return THEMES[(n - 1) % THEMES.length];
}
