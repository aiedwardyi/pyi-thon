import assert from "node:assert/strict";

import { advanceRep, isUnlocked, migrateProgress, recordMiss, recordPass, saveAttempt, startTopic, topicState } from "../src/lib/progress.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const SETS = [
  { id: 1, reps: [{}, {}, {}, {}] },
  { id: 2, reps: [{}, {}, {}, {}] },
  { id: 3, reps: [{}] },
  { id: 4, reps: [{}] },
];

run("migrateProgress maps old saves to the v2 shape", () => {
  const progress = migrateProgress({ completedLevels: [1, 2], currentLevel: 2, streak: 1, bestStreak: 4, totalXP: 300, hasStarted: true }, SETS);
  assert.equal(progress.version, 2);
  assert.equal(progress.current, 2);
  assert.equal(progress.xp, 300);
  assert.equal(progress.bestCombo, 4);
  assert.equal(progress.combo, 0);
  assert.equal(progress.hasStarted, true);
  assert.deepEqual(progress.topics[1], { rep: 4, outcomes: ["solved", "solved", "solved", "solved"], done: true });
  assert.equal(progress.topics[2].done, true);
  assert.equal(progress.topics[3], undefined);
});

run("migrateProgress handles empty and out-of-range saves", () => {
  assert.equal(migrateProgress(null, SETS).current, 0);
  assert.equal(migrateProgress({ currentLevel: 99 }, SETS).current, 3);
  const v2 = migrateProgress({ version: 2, current: 1, topics: { 2: { rep: 1, outcomes: ["clean"], done: false } }, xp: 30 }, SETS);
  assert.deepEqual(v2.topics[2], { rep: 1, outcomes: ["clean", null, null, null], done: false });
  assert.equal(v2.xp, 30);
});

run("old unlock rule carries over after migration", () => {
  const progress = migrateProgress({ completedLevels: [1, 2], currentLevel: 0 }, SETS);
  assert.equal(isUnlocked(progress, SETS, 2), true);
  assert.equal(isUnlocked(progress, SETS, 3), false);
});

run("next topic unlocks only when the set is done", () => {
  let progress = migrateProgress(null, SETS);
  assert.equal(isUnlocked(progress, SETS, 1), false);
  for (let rep = 0; rep < 3; rep += 1) {
    progress = recordPass(progress, SETS[0], rep, "clean").progress;
    const result = advanceRep(progress, SETS, 0);
    assert.equal(result.setDone, false);
    progress = result.progress;
  }
  assert.equal(isUnlocked(progress, SETS, 1), false);
  progress = recordPass(progress, SETS[0], 3, "clean").progress;
  const result = advanceRep(progress, SETS, 0);
  assert.equal(result.setDone, true);
  assert.equal(result.bonus, 50);
  assert.equal(result.progress.current, 1);
  assert.equal(isUnlocked(result.progress, SETS, 1), true);
  assert.equal(isUnlocked(result.progress, SETS, 2), false);
});

run("recordPass awards parts and tracks combo", () => {
  let progress = migrateProgress(null, SETS);
  const clean = recordPass(progress, SETS[0], 0, "clean");
  assert.equal(clean.reward.total, 30);
  assert.equal(clean.progress.combo, 1);
  progress = recordPass(clean.progress, SETS[0], 1, "clean").progress;
  assert.equal(progress.combo, 2);
  assert.equal(progress.bestCombo, 2);
  assert.equal(recordPass(progress, SETS[0], 2, "solved").reward.total, 20);
  assert.equal(recordPass(progress, SETS[0], 2, "done").reward.total, 5);
  assert.equal(recordMiss(progress).combo, 0);
  assert.equal(recordMiss(progress).bestCombo, 2);
});

run("replaying a done topic resets reps but keeps it done and skips the bonus", () => {
  let progress = migrateProgress({ completedLevels: [3] }, SETS);
  progress = startTopic(progress, SETS, 2);
  assert.deepEqual(topicState(progress, SETS[2]), { rep: 0, outcomes: [null], done: true });
  progress = recordPass(progress, SETS[2], 0, "clean").progress;
  assert.equal(advanceRep(progress, SETS, 2).bonus, 0);
});

run("drafts keep code, misses and hints across topic changes and reloads", () => {
  const attempt = { code: 'print("Hello")', misses: 2, hintStep: 3, started: true };
  let progress = startTopic(migrateProgress(null, SETS), SETS, 0);
  progress = saveAttempt(progress, SETS[0], 0, attempt);
  progress = startTopic(startTopic(progress, SETS, 1), SETS, 0);
  progress = migrateProgress(JSON.parse(JSON.stringify(progress)), SETS);
  assert.deepEqual(topicState(progress, SETS[0]).attempt, { ...attempt, rep: 0 });
  progress = advanceRep(progress, SETS, 0).progress;
  assert.equal(topicState(progress, SETS[0]).attempt, undefined);
  assert.equal(saveAttempt(progress, SETS[0], 0, attempt), progress);
});

run("a saved pass is credited once across reloads, days and changed outcomes", () => {
  const first = recordPass(migrateProgress(null, SETS), SETS[0], 0, "done", "2026-11-10");
  const restored = migrateProgress(JSON.parse(JSON.stringify(first.progress)), SETS);
  const duplicate = recordPass(restored, SETS[0], 0, "clean", "2026-11-11");
  assert.equal(duplicate.progress, restored);
  assert.equal(duplicate.reward.total, 0);
  assert.equal(duplicate.reward.outcome, "done");
  assert.equal(restored.xp, 5);
  assert.equal(restored.combo, 0);
  assert.deepEqual(restored.days, { "2026-11-10": { reps: 1, clean: 0 } });
});

run("explicit replay credits a new attempt once", () => {
  let progress = recordPass(migrateProgress(null, SETS), SETS[2], 0, "clean", "2026-11-10").progress;
  progress = advanceRep(progress, SETS, 2).progress;
  const before = progress.xp;
  progress = startTopic(progress, SETS, 2);
  progress = recordPass(progress, SETS[2], 0, "clean", "2026-11-11").progress;
  assert.equal(progress.xp, before + 30);
  assert.equal(recordPass(progress, SETS[2], 0, "clean").progress, progress);
});
