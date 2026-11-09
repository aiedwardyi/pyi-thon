import assert from "node:assert/strict";

import { migrateProgress, recordPass } from "../src/lib/progress.js";
import { dayKey, heatCells, heatLevel, shiftDay, streakStats } from "../src/lib/streak.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const SETS = [{ id: 1, reps: [{}, {}] }];
const day = (reps = 1, clean = 0) => ({ reps, clean });

run("dayKey uses local time and shiftDay crosses month and year", () => {
  assert.equal(dayKey(new Date(2026, 0, 5, 23, 59)), "2026-01-05");
  assert.equal(dayKey(new Date(2026, 0, 5, 0, 0)), "2026-01-05");
  assert.equal(shiftDay("2026-03-01", -1), "2026-02-28");
  assert.equal(shiftDay("2025-12-31", 1), "2026-01-01");
});

run("no days means no streak", () => {
  assert.deepEqual(streakStats({}, "2026-05-10"), { current: 0, best: 0, today: { reps: 0, clean: 0 } });
});

run("a pass today counts as a one day streak", () => {
  const stats = streakStats({ "2026-05-10": day(2, 1) }, "2026-05-10");
  assert.equal(stats.current, 1);
  assert.deepEqual(stats.today, { reps: 2, clean: 1 });
});

run("yesterday keeps the streak alive until a full day is missed", () => {
  const days = { "2026-05-08": day(), "2026-05-09": day() };
  assert.equal(streakStats(days, "2026-05-10").current, 2);
  assert.equal(streakStats(days, "2026-05-11").current, 0);
});

run("a gap resets the current streak but not the best", () => {
  const days = { "2026-05-01": day(), "2026-05-02": day(), "2026-05-03": day(), "2026-05-07": day(), "2026-05-08": day() };
  const stats = streakStats(days, "2026-05-08");
  assert.equal(stats.current, 2);
  assert.equal(stats.best, 3);
});

run("days with zero reps do not count", () => {
  assert.equal(streakStats({ "2026-05-09": day(0), "2026-05-10": day() }, "2026-05-10").current, 1);
});

run("streaks run across month and year ends", () => {
  const days = { "2025-12-30": day(), "2025-12-31": day(), "2026-01-01": day() };
  assert.equal(streakStats(days, "2026-01-01").current, 3);
});

run("local midnight starts a new day", () => {
  const days = { [dayKey(new Date(2026, 4, 9, 23, 59, 59))]: day() };
  const justAfter = dayKey(new Date(2026, 4, 10, 0, 0, 1));
  assert.equal(justAfter, "2026-05-10");
  assert.equal(streakStats(days, justAfter).current, 1);
  assert.equal(streakStats(days, justAfter).today.reps, 0);
});

run("recordPass counts reps and clean per day", () => {
  let progress = migrateProgress(null, SETS);
  assert.deepEqual(progress.days, {});
  progress = recordPass(progress, SETS[0], 0, "clean", "2026-05-10").progress;
  progress = recordPass(progress, SETS[0], 1, "solved", "2026-05-10").progress;
  assert.deepEqual(progress.days, { "2026-05-10": { reps: 2, clean: 1 } });
});

run("reward.dayStreak is set only on the first pass of a day", () => {
  let progress = migrateProgress(null, SETS);
  progress.days = { "2026-05-09": day() };
  const first = recordPass(progress, SETS[0], 0, "done", "2026-05-10");
  assert.equal(first.reward.dayStreak, 2);
  assert.equal(recordPass(first.progress, SETS[0], 1, "done", "2026-05-10").reward.dayStreak, 0);
});

run("old v2 saves load with empty days and keep existing days", () => {
  assert.deepEqual(migrateProgress({ version: 2, xp: 5 }, SETS).days, {});
  assert.deepEqual(migrateProgress({ version: 2, days: [] }, SETS).days, {});
  assert.deepEqual(migrateProgress({ version: 2, days: { "2026-05-10": day(3, 1) } }, SETS).days, { "2026-05-10": day(3, 1) });
  assert.deepEqual(migrateProgress({ completedLevels: [1] }, SETS).days, {});
});

run("heatCells is 12 weeks Mon-Sun with today in the last column", () => {
  const cells = heatCells({ "2026-05-10": day(4, 2) }, "2026-05-10");
  assert.equal(cells.length, 84);
  assert.equal(cells[0].key, "2026-02-16");
  assert.equal(new Date(2026, 1, 16).getDay(), 1);
  const lastColumn = cells.slice(77);
  assert.equal(lastColumn[6].key, "2026-05-10");
  assert.equal(lastColumn[6].future, false);
  assert.equal(lastColumn[6].reps, 4);
  const midweek = heatCells({}, "2026-05-13");
  assert.deepEqual(midweek.slice(77).map((cell) => cell.future), [false, false, false, true, true, true, true]);
});

run("heatLevel buckets reps into five shades", () => {
  assert.deepEqual([0, 1, 2, 3, 5, 6, 9, 10, 40].map(heatLevel), [0, 1, 1, 2, 2, 3, 3, 4, 4]);
});
