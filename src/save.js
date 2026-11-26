// localStorage save/load for Gloop Rush. Never throws.

const SAVE_KEY = 'gloop-rush-save-v1';

export const DEFAULT_SAVE = {
  coins: 0,
  gems: 0,
  level: 1,
  best: 1,
  ownedSkins: ['classic'],
  skin: 'classic',
  sound: true,
};

function freshDefaults() {
  const copy = {};
  for (const key of Object.keys(DEFAULT_SAVE)) {
    const value = DEFAULT_SAVE[key];
    copy[key] = Array.isArray(value) ? value.slice() : value;
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
    for (const key of Object.keys(parsed)) {
      const value = parsed[key];
      base[key] = Array.isArray(value) ? value.slice() : value;
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
