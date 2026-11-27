const MAX_RECORDS = 5;

function isRun(run) {
  return run && Number.isInteger(run.level) && run.level > 0
    && Number.isFinite(run.coinsEarned) && run.coinsEarned >= 0
    && Number.isFinite(run.multiplier) && run.multiplier >= 1
    && typeof run.date === 'string' && Number.isFinite(Date.parse(run.date));
}

function compareRuns(a, b) {
  return b.coinsEarned - a.coinsEarned
    || b.multiplier - a.multiplier
    || b.level - a.level
    || Date.parse(a.date) - Date.parse(b.date);
}

export function topRuns(save) {
  if (!Array.isArray(save.records)) return [];
  return save.records.filter(isRun).sort(compareRuns).slice(0, MAX_RECORDS);
}

export function addRun(save, run) {
  if (!isRun(run)) return null;
  const entry = { level: run.level, coinsEarned: run.coinsEarned, multiplier: run.multiplier, date: run.date };
  save.records = [...topRuns(save), entry].sort(compareRuns).slice(0, MAX_RECORDS);
  const index = save.records.indexOf(entry);
  return index === -1 ? null : index + 1;
}
