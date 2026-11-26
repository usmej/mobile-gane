const MAX_STREAK = 7;

function localDay(timestamp) {
  const date = new Date(timestamp);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function isClaimable(lastDay, today) {
  return !Number.isFinite(lastDay) || lastDay < today;
}

export function canClaim(save) {
  return isClaimable(localDay(Number(save.lastDaily) || 0), localDay(Date.now()));
}

export function claim(save) {
  const now = Date.now();
  const date = new Date(now);
  const today = localDay(now);
  const lastDay = localDay(Number(save.lastDaily) || 0);
  if (!isClaimable(lastDay, today)) return { coins: 0, gems: 0 };

  const yesterday = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const previous = Math.max(0, Math.floor(Number(save.dailyStreak) || 0));
  const streak = lastDay === yesterday ? Math.min(MAX_STREAK, previous + 1) : 1;
  const coins = 50 + 25 * (streak - 1);
  const gems = streak === MAX_STREAK ? 3 : 0;

  save.lastDaily = now;
  save.dailyStreak = streak;
  save.coins = (Number(save.coins) || 0) + coins;
  save.gems = (Number(save.gems) || 0) + gems;
  return { coins, gems };
}
