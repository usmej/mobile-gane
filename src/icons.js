// Inline SVG icons: one 2.5 ink stroke, flat fill, one small white highlight crescent (~40%) top-left.
// All return strings; sized with font-size (1em).
const INK = '#1B1420';
const svg = (body, cls = 'ico') =>
  `<svg class="${cls}" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;
// highlight crescent: a short rounded stroke, white @ 40%
const hl = (d) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`;

export const coin = () => svg(
  `<circle cx="12" cy="12" r="9.5" fill="#FFD23F"/>` +
  `<circle cx="12" cy="12" r="5.6" fill="none" stroke="#D9A800" stroke-width="2"/>` +
  hl('M4.9 9.3A7.6 7.6 0 0 1 9.3 4.9'));

export const gem = () => svg(
  `<path d="M12 2.5 21 12 12 21.5 3 12Z" fill="#B04BFF"/>` +
  `<path d="M8 8.4 12 12l4-3.6" fill="none"/>` +
  hl('M5.8 10.6 9.4 6.6'));

export const speakerOn = () => svg(
  `<path d="M4 9.5h3.5l5-4v13l-5-4H4Z" fill="#FFF4E0"/>` +
  `<path d="M16.5 9a4.5 4.5 0 0 1 0 6" fill="none"/>` +
  hl('M8 9.2l3-2.4'));

export const speakerOff = () => svg(
  `<path d="M3 9.5h3.5l5-4v13l-5-4H3Z" fill="#FFF4E0"/>` +
  `<path d="M15.5 9.5l5 5M20.5 9.5l-5 5" fill="none"/>` +
  hl('M7 9.2l3-2.4'));

export const lock = () => svg(
  `<path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none"/>` +
  `<rect x="5" y="11" width="14" height="10" rx="2" fill="#FFD23F"/>` +
  hl('M7.6 14.6v2.4'));

export const bossFace = () => svg(
  `<path d="M3.5 3.5 8 6.6h8l4.5-3.1-1 8.2H4.5Z" fill="#FF3B5C"/>` +
  `<rect x="4" y="9" width="16" height="12" rx="1" fill="#FF3B5C"/>` +
  `<path d="M7 12.5l3.5 1.2M17 12.5l-3.5 1.2" fill="none"/>` +
  `<path d="M8.5 18h7" fill="none"/>` +
  hl('M6.4 15.4v2'));

export const closeX = () => svg(
  `<path d="M5.5 5.5l13 13M18.5 5.5l-13 13" fill="none"/>`);

export const check = () => svg(
  `<path d="M5 12.5l4.5 4.5L19 7.5" fill="none"/>`);

// Menu tile icons
export const skin = () => svg(
  `<circle cx="12" cy="13" r="8.5" fill="#4EE06A"/>` +
  `<circle cx="9" cy="12" r="1.2" fill="${INK}" stroke="none"/><circle cx="15" cy="12" r="1.2" fill="${INK}" stroke="none"/>` +
  `<path d="M9.5 15.6c1.4 1.2 3.6 1.2 5 0" fill="none" stroke-width="2"/>` +
  hl('M6.4 10.6a6.6 6.6 0 0 1 3.4-3.4'));

export const medal = () => svg(
  `<path d="M7 2.5h4l1.2 6.5H8.4Z" fill="#1FA2FF"/><path d="M17 2.5h-4L11.8 9h3.8Z" fill="#1FA2FF"/>` +
  `<circle cx="12" cy="15.5" r="6" fill="#FFD23F"/>` +
  `<circle cx="12" cy="15.5" r="2.8" fill="none" stroke="#D9A800" stroke-width="2"/>` +
  hl('M7.4 14a5 5 0 0 1 2.6-2.8'));

export const trophy = () => svg(
  `<path d="M7 5H3.8c0 3.4 1.3 5 3.4 5.4M17 5h3.2c0 3.4-1.3 5-3.4 5.4" fill="none"/>` +
  `<path d="M7 3.5h10v6a5 5 0 0 1-10 0Z" fill="#FFD23F"/>` +
  `<path d="M12 14.5v3" fill="none"/>` +
  `<path d="M8 20.5l.8-3h6.4l.8 3Z" fill="#D9A800"/>` +
  hl('M9.4 6.2v3'));

export const gift = () => svg(
  `<rect x="4" y="11" width="16" height="9.5" rx="2" fill="#FFF4E0"/>` +
  `<rect x="10.3" y="11" width="3.4" height="9.5" fill="#1FA2FF"/>` +
  `<rect x="3" y="7.5" width="18" height="4" rx="1.5" fill="#FFF4E0"/>` +
  `<path d="M12 7.5C9.6 7.5 8 6 8.7 4.7c.9-1.5 3 0 3.3 2.8Zm0 0c2.4 0 4-1.5 3.3-2.8-.9-1.5-3 0-3.3 2.8Z" fill="#1FA2FF"/>` +
  hl('M6.2 14.6v3'));

export const drip = () =>
  `<svg class="drip" viewBox="0 0 20 34" width="20" height="34" aria-hidden="true" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"><path d="M3 2h14v8c0 3-2 4-2 8a5 5 0 0 1-10 0c0-4-2-5-2-8Z" fill="#4EE06A"/></svg>`;

export const hand = () =>
  `<svg class="hint-hand" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M9 3.5a1.8 1.8 0 0 1 3.6 0V10l1.4-.4a1.7 1.7 0 0 1 2 1.2l.4-.2a1.7 1.7 0 0 1 2.2 1.1l.1.5a1.7 1.7 0 0 1 1.7 1.8L19 17c-.3 2.8-1.6 4.5-4.5 4.5H12c-2 0-3-1-4-2.5L4.6 14a1.6 1.6 0 0 1 2.6-1.8L9 14Z" fill="#FFF4E0"/></svg>`;

// Arrows: ink under-stroke + cream top stroke so they read over any 3D background.
export const arrows = () => {
  const d1 = 'M22 12H5M11 5 4 12l7 7';
  const d2 = 'M42 12h17M53 5l7 7-7 7';
  return `<svg class="hint-arrows" viewBox="0 0 64 24" width="64" height="24" aria-hidden="true" stroke-linejoin="round" stroke-linecap="round" fill="none">` +
    `<path d="${d1}${d2}" stroke="${INK}" stroke-width="8"/><path d="${d1}${d2}" stroke="#FFF4E0" stroke-width="3"/></svg>`;
};
