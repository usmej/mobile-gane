// Inline SVG icons: flat fill + ink stroke. Return strings.
const INK = '#1B1420';
const svg = (vb, body, cls = 'ico') =>
  `<svg class="${cls}" viewBox="0 0 ${vb} ${vb}" width="1em" height="1em" aria-hidden="true" focusable="false" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">${body}</svg>`;

export const coin = () => svg(24,
  `<circle cx="12" cy="12" r="9.5" fill="#FFD23F"/>` +
  `<text x="12" y="16.6" text-anchor="middle" font-family="Bungee,Arial Black,sans-serif" font-size="13" fill="#E0A800" stroke="none">G</text>`);

export const gem = () => svg(24,
  `<path d="M12 2.5 21 12 12 21.5 3 12Z" fill="#B04BFF"/>` +
  `<path d="M8 8.2 12 12l4-3.8" fill="none" stroke-width="1.8"/>`);

export const speakerOn = () => svg(24,
  `<rect x="3" y="9" width="5" height="6" fill="#FFF4E0" stroke-width="2.5"/>` +
  `<path d="M8 9l6-4v14l-6-4Z" fill="#FFF4E0" stroke-width="2.5"/>` +
  `<path d="M17.5 8.5a5 5 0 0 1 0 7" fill="none" stroke-width="2.5"/>`);

export const speakerOff = () => svg(24,
  `<rect x="2" y="9" width="5" height="6" fill="#FFF4E0" stroke-width="2.5"/>` +
  `<path d="M7 9l6-4v14l-6-4Z" fill="#FFF4E0" stroke-width="2.5"/>` +
  `<path d="M16.5 9.5l5 5M21.5 9.5l-5 5" fill="none" stroke="#FF3B5C" stroke-width="3"/>`);

export const lock = () => svg(24,
  `<path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke-width="3"/>` +
  `<rect x="5" y="11" width="14" height="10" rx="2" fill="#FFD23F"/>`);

export const bossFace = () => svg(24,
  `<path d="M3.5 3.5 8 6.6h8l4.5-3.1-1 8.2H4.5Z" fill="#FF3B5C" stroke-width="2.5"/>` +
  `<rect x="4" y="9" width="16" height="12" fill="#FF3B5C" stroke-width="2.5"/>` +
  `<path d="M7 12.5l3.5 1.2M17 12.5l-3.5 1.2" fill="none" stroke-width="2"/>` +
  `<path d="M8.5 18h7" fill="none" stroke-width="2"/>`);

export const closeX = () => svg(24,
  `<path d="M5 5l14 14M19 5L5 19" fill="none" stroke-width="4"/>`);

export const drip = () =>
  `<svg class="drip" viewBox="0 0 20 34" width="20" height="34" aria-hidden="true" stroke="${INK}" stroke-width="3" stroke-linejoin="round"><path d="M3 2h14v8c0 3-2 4-2 8a5 5 0 0 1-10 0c0-4-2-5-2-8Z" fill="#4EE06A"/></svg>`;

export const hand = () =>
  `<svg class="hint-hand" viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><path d="M9 3.5a1.8 1.8 0 0 1 3.6 0V10l1.4-.4a1.7 1.7 0 0 1 2 1.2l.4-.2a1.7 1.7 0 0 1 2.2 1.1l.1.5a1.7 1.7 0 0 1 1.7 1.8L19 17c-.3 2.8-1.6 4.5-4.5 4.5H12c-2 0-3-1-4-2.5L4.6 14a1.6 1.6 0 0 1 2.6-1.8L9 14Z" fill="#FFF4E0"/></svg>`;

export const arrows = () =>
  `<svg class="hint-arrows" viewBox="0 0 64 24" width="64" height="24" aria-hidden="true" stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"><path d="M22 12H4M10 5 3 12l7 7" fill="none"/><path d="M42 12h18M54 5l7 7-7 7" fill="none"/></svg>`;
