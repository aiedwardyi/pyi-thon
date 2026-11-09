export const XP = { solved: 20, firstTry: 10, done: 5, setDone: 50 };

export function emptyProgress() {
  return { version: 2, current: 0, topics: {}, xp: 0, combo: 0, bestCombo: 0, hasStarted: false };
}

function blankTopic(set) {
  return { rep: 0, outcomes: set.reps.map(() => null), done: false };
}

export function topicState(progress, set) {
  const saved = progress.topics[set.id];
  if (!saved) return blankTopic(set);
  const outcomes = set.reps.map((_, index) => saved.outcomes?.[index] ?? null);
  const rep = Math.min(Math.max(Number(saved.rep) || 0, 0), set.reps.length);
  return { rep, outcomes, done: Boolean(saved.done) };
}

function withTopic(progress, set, topic) {
  return { ...progress, topics: { ...progress.topics, [set.id]: topic } };
}

const clampIndex = (value, sets) => Math.min(Math.max(Number(value) || 0, 0), sets.length - 1);

export function migrateProgress(saved, sets) {
  if (!saved || typeof saved !== "object") return emptyProgress();
  if (saved.version === 2) {
    const progress = { ...emptyProgress(), ...saved, current: clampIndex(saved.current, sets) };
    const topics = {};
    for (const set of sets) if (saved.topics?.[set.id]) topics[set.id] = topicState(progress, set);
    return { ...progress, topics };
  }
  const completed = new Set(saved.completedLevels || []);
  const topics = {};
  for (const set of sets) {
    if (completed.has(set.id)) topics[set.id] = { rep: set.reps.length, outcomes: set.reps.map(() => "solved"), done: true };
  }
  return {
    ...emptyProgress(),
    current: clampIndex(saved.currentLevel, sets),
    topics,
    xp: Number(saved.totalXP) || 0,
    bestCombo: Number(saved.bestStreak) || 0,
    hasStarted: Boolean(saved.hasStarted),
  };
}

export function hasProgress(progress) {
  return progress.hasStarted || progress.xp > 0 || progress.current > 0 || progress.bestCombo > 0
    || Object.values(progress.topics).some((topic) => topic.done || topic.outcomes.some(Boolean));
}

export function unlockedUpTo(progress, sets) {
  let highest = 0;
  sets.forEach((set, index) => { if (progress.topics[set.id]?.done) highest = Math.max(highest, index + 1); });
  return Math.min(highest, sets.length - 1);
}

export function isUnlocked(progress, sets, index) {
  return index <= unlockedUpTo(progress, sets) || index === progress.current || Boolean(progress.topics[sets[index].id]?.done);
}

export function doneCount(progress, set) {
  const topic = topicState(progress, set);
  return topic.done && topic.rep >= set.reps.length ? set.reps.length : topic.outcomes.filter(Boolean).length;
}

export function startTopic(progress, sets, index) {
  const set = sets[index];
  const topic = topicState(progress, set);
  const next = topic.rep >= set.reps.length ? { ...blankTopic(set), done: topic.done } : topic;
  return { ...withTopic(progress, set, next), current: index, hasStarted: true };
}

export function recordMiss(progress) {
  return { ...progress, combo: 0 };
}

export function recordPass(progress, set, repIndex, outcome) {
  const parts = outcome === "clean"
    ? [{ key: "solved", xp: XP.solved }, { key: "firstTry", xp: XP.firstTry }]
    : outcome === "solved" ? [{ key: "solved", xp: XP.solved }] : [{ key: "done", xp: XP.done }];
  const total = parts.reduce((sum, part) => sum + part.xp, 0);
  const combo = outcome === "clean" ? progress.combo + 1 : 0;
  const topic = topicState(progress, set);
  const outcomes = topic.outcomes.map((value, index) => (index === repIndex ? outcome : value));
  const next = withTopic(progress, set, { ...topic, outcomes });
  return {
    progress: { ...next, xp: progress.xp + total, combo, bestCombo: Math.max(progress.bestCombo, combo), hasStarted: true },
    reward: { outcome, parts, total, combo },
  };
}

export function advanceRep(progress, sets, index) {
  const set = sets[index];
  const topic = topicState(progress, set);
  const rep = topic.rep + 1;
  if (rep < set.reps.length) return { progress: withTopic(progress, set, { ...topic, rep }), setDone: false, bonus: 0 };
  const bonus = topic.done ? 0 : XP.setDone;
  const next = withTopic(progress, set, { ...topic, rep: set.reps.length, done: true });
  return { progress: { ...next, xp: next.xp + bonus, current: Math.min(index + 1, sets.length - 1) }, setDone: true, bonus };
}
