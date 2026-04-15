import { LEVELS } from "../data/levels.js";
import { loadProgress, safeLocalStorageGet } from "./storage.js";

function hasSavedSession(saved) {
  return Boolean(
    saved?.hasStarted
      || (saved?.completedLevels?.length > 0)
      || (saved?.currentLevel > 0)
      || (saved?.streak > 0)
      || (saved?.bestStreak > 0)
      || (saved?.totalXP > 0)
  );
}

function resolveCurrentLevelIndex(qaConfig, saved) {
  if (qaConfig?.enabled && qaConfig.levelId) {
    const qaLevelIndex = LEVELS.findIndex((level) => level.id === qaConfig.levelId);
    if (qaLevelIndex >= 0) {
      return qaLevelIndex;
    }
  }

  if (!Number.isInteger(saved?.currentLevel)) {
    return 0;
  }

  return Math.min(Math.max(saved.currentLevel, 0), LEVELS.length - 1);
}

export function buildInitialAppState({ qaConfig, supportedLanguages }) {
  const saved = loadProgress();
  const currentLevel = resolveCurrentLevelIndex(qaConfig, saved);
  const storedLang = safeLocalStorageGet("pyithon-lang", "en") || "en";
  const lang = qaConfig?.lang && supportedLanguages?.[qaConfig.lang]
    ? qaConfig.lang
    : storedLang;
  const offlineMode = qaConfig?.offline || safeLocalStorageGet("pyithon-offline") === "true";

  if (qaConfig?.enabled) {
    const level = LEVELS[currentLevel];
    const code = qaConfig.code && (!qaConfig.levelId || level.id === qaConfig.levelId)
      ? qaConfig.code
      : level.starterCode;

    return {
      code,
      completedLevels: qaConfig.completedLevels || [],
      currentLevel,
      lang,
      offlineMode,
      showWelcome: !qaConfig.skipWelcome,
      streak: 0,
      bestStreak: 0,
      totalXP: 0,
    };
  }

  if (saved && hasSavedSession(saved)) {
    const level = LEVELS[currentLevel];
    return {
      code: level.starterCode,
      completedLevels: saved.completedLevels || [],
      currentLevel,
      lang,
      offlineMode,
      showWelcome: false,
      streak: saved.streak || 0,
      bestStreak: saved.bestStreak || 0,
      totalXP: saved.totalXP || 0,
    };
  }

  return {
    code: LEVELS[0].starterCode,
    completedLevels: [],
    currentLevel: 0,
    lang,
    offlineMode,
    showWelcome: true,
    streak: 0,
    bestStreak: 0,
    totalXP: 0,
  };
}
