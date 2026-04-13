import assert from "node:assert/strict";

import { loadProgress, saveProgress } from "../src/lib/storage.js";
import { DEFAULT_THEME_KEY, resolveStoredThemeKey } from "../src/theme/themes.js";

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

run("Tokyo Night is the default theme when no valid theme is stored", () => {
  assert.equal(DEFAULT_THEME_KEY, "tokyo");
  assert.equal(resolveStoredThemeKey(""), "tokyo");
  assert.equal(resolveStoredThemeKey("unknown-theme"), "tokyo");
});

run("stored theme preference wins over the Tokyo Night default", () => {
  assert.equal(resolveStoredThemeKey("light"), "light");
  assert.equal(resolveStoredThemeKey("gruvbox"), "gruvbox");
});

run("level progress is saved to browser localStorage", () => {
  withMockLocalStorage(() => {
    const progress = {
      completedLevels: [1, 2, 3],
      currentLevel: 3,
      streak: 2,
      bestStreak: 4,
      totalXP: 300,
    };

    saveProgress(progress);

    assert.deepEqual(loadProgress(), progress);
  });
});
