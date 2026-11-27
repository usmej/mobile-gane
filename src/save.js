// localStorage save/load for Gloop Rush. Never throws.

const SAVE_KEY = 'gloop-rush-save-v1';

export const DEFAULT_SAVE = {
  coins: 0,
  gems: 0,
  level: 1,
  best: 1,
  ownedSkins: ['drum', 'classic'],
  defeatedBossSkins: [],
  skin: 'drum',              // FB-002: the drum mascot is the default character
  sound: true,
  lastDaily: 0,
  dailyStreak: 0,
  achievements: {},
  stats: {},
  tutorialDone: false,
  seenIntros: [],            // first-encounter explainers already shown (keys from intros.js)
  records: [],
};

function freshDefaults() {
  const copy = {};
  for (const key of Object.keys(DEFAULT_SAVE)) {
    const value = DEFAULT_SAVE[key];
    copy[key] = Array.isArray(value) ? value.slice() : value && typeof value === 'object' ? { ...value } : value;
  }
  return copy;
}

export function loadSave() {
  const base = freshDefaults();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return base;
    for (const [key, fallback] of Object.entries(base)) {
      if (!Object.prototype.hasOwnProperty.call(parsed, key)) continue;
      const value = parsed[key];
      if (Array.isArray(fallback)) {
        if (Array.isArray(value)) {
          base[key] = key === 'records' ? value.slice() : value.filter((id) => typeof id === 'string' && id.length > 0);
        }
      } else if (typeof fallback === 'number') {
        const number = typeof value === 'string' && value.trim() ? Number(value) : value;
        if (Number.isSafeInteger(number) && number >= fallback) base[key] = number;
      } else if (typeof fallback === 'object') {
        if (value && typeof value === 'object' && !Array.isArray(value)) base[key] = { ...value };
      } else if (typeof value === typeof fallback && value !== '') {
        base[key] = value;
      }
    }
    return base;
  } catch (err) {
    return base;
  }
}

export function writeSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (err) {
    // storage unavailable or full; ignore
  }
}

export function resetSave() {
  const fresh = freshDefaults();
  writeSave(fresh);
  return fresh;
}
