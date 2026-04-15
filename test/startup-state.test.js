import assert from "node:assert/strict";

import { LEVELS } from "../src/data/levels.js";
import { buildInitialAppState } from "../src/lib/startupState.js";

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

function withMockLocalStorage(fn) {
  const previousWindow = globalThis.window;
  const store = new Map();

  globalThis.window = {
    localStorage: {
      getItem: (key) => (store.has(key) ? store.get(key) : null),
      setItem: (key, value) => store.set(key, String(value)),
      removeItem: (key) => store.delete(key),
    },
  };

  try {
    fn(store);
  } finally {
    if (previousWindow === undefined) {
      delete globalThis.window;
    } else {
      globalThis.window = previousWindow;
    }
  }
}

run("saved sessions bootstrap straight into the game view", () => {
  withMockLocalStorage((store) => {
    store.set("pyithon-lang", "ko");
    store.set("pyithon-progress", JSON.stringify({
      completedLevels: [1, 2, 3],
      currentLevel: 5,
      streak: 2,
      bestStreak: 4,
      totalXP: 300,
      hasStarted: true,
    }));

    const state = buildInitialAppState({
      qaConfig: null,
      supportedLanguages: { en: {}, ko: {} },
    });

    assert.equal(state.showWelcome, false);
    assert.equal(state.currentLevel, 5);
    assert.equal(state.code, LEVELS[5].starterCode);
    assert.deepEqual(state.completedLevels, [1, 2, 3]);
    assert.equal(state.streak, 2);
    assert.equal(state.bestStreak, 4);
    assert.equal(state.totalXP, 300);
    assert.equal(state.lang, "ko");
  });
});

run("QA startup seeds the requested level before first render", () => {
  withMockLocalStorage((store) => {
    store.set("pyithon-progress", JSON.stringify({
      completedLevels: [1],
      currentLevel: 1,
      streak: 1,
      bestStreak: 1,
      totalXP: 100,
      hasStarted: true,
    }));

    const qaCode = "print('ready')";
    const state = buildInitialAppState({
      qaConfig: {
        enabled: true,
        levelId: 6,
        lang: "ko",
        offline: true,
        skipWelcome: true,
        autoRun: false,
        code: qaCode,
        completedLevels: [1, 2, 3, 4, 5, 6],
      },
      supportedLanguages: { en: {}, ko: {} },
    });

    assert.equal(state.showWelcome, false);
    assert.equal(state.currentLevel, 5);
    assert.equal(state.code, qaCode);
    assert.equal(state.lang, "ko");
    assert.equal(state.offlineMode, true);
    assert.deepEqual(state.completedLevels, [1, 2, 3, 4, 5, 6]);
    assert.equal(state.streak, 0);
    assert.equal(state.bestStreak, 0);
    assert.equal(state.totalXP, 0);
  });
});
