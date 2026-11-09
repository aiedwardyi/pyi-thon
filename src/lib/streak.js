const pad = (n) => String(n).padStart(2, "0");

export const dayKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function shiftDay(key, delta) {
  const [y, m, d] = key.split("-").map(Number);
  return dayKey(new Date(y, m - 1, d + delta));
}

const counted = (days, key) => days[key]?.reps > 0;

export function streakStats(days, today) {
  let current = 0;
  for (let key = counted(days, today) ? today : shiftDay(today, -1); counted(days, key); key = shiftDay(key, -1)) current += 1;
  let best = 0;
  let run = 0;
  let prev = null;
  for (const key of Object.keys(days).filter((k) => counted(days, k)).sort()) {
    run = prev && shiftDay(prev, 1) === key ? run + 1 : 1;
    best = Math.max(best, run);
    prev = key;
  }
  return { current, best, today: { reps: days[today]?.reps || 0, clean: days[today]?.clean || 0 } };
}

export function heatLevel(reps) {
  return reps <= 0 ? 0 : reps < 3 ? 1 : reps < 6 ? 2 : reps < 10 ? 3 : 4;
}

// 12 week columns, Mon-Sun down each; today sits in the last column and later days are future.
export function heatCells(days, today) {
  const [y, m, d] = today.split("-").map(Number);
  const weekday = (new Date(y, m - 1, d).getDay() + 6) % 7;
  const start = shiftDay(today, -(weekday + 77));
  return Array.from({ length: 84 }, (_, i) => {
    const key = shiftDay(start, i);
    return { key, reps: days[key]?.reps || 0, clean: days[key]?.clean || 0, future: key > today };
  });
}
