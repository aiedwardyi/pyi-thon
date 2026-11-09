import { createElement, useCallback, useEffect, useState } from "react";
import LevelSelectScreen from "./components/LevelSelectScreen";
import RepScreen from "./components/RepScreen";
import SetDone from "./components/SetDone";
import SettingsPanel from "./components/SettingsPanel";
import TopBar from "./components/TopBar";
import WelcomeScreen from "./components/WelcomeScreen";
import { STRINGS } from "./data/appConfig";
import { SETS, pick } from "./data/sets";
import {
  advanceRep, emptyProgress, hasProgress, isUnlocked, migrateProgress, recordMiss, recordPass, startTopic, topicState,
} from "./lib/progress";
import { loadPyodideRuntime } from "./lib/pythonRunner";
import { setSoundEnabled as setSoundOn, unlockAudio } from "./lib/sound";
import {
  getApiKeyStorageKey,
  loadProgress,
  loadStoredApiKey,
  loadStoredProvider,
  safeLocalStorageGet,
  safeLocalStorageSet,
  saveProgress,
} from "./lib/storage";
import { getIntroPageStyle, getIntroPalette } from "./theme/introTheme";
import { MONO_FONT, THEMES, getGlobalStyles, getPageStyle, resolveStoredThemeKey } from "./theme/themes";

function getQaConfig() {
  if (typeof window === "undefined") return null;
  const isLocalQaHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!import.meta.env.DEV && !isLocalQaHost) return null;
  const params = new URLSearchParams(window.location.search);
  if (!params.has("qa")) return null;
  const parseList = (value) => (value || "").split(",").map((v) => Number(v.trim())).filter((v) => Number.isFinite(v) && v > 0);
  const levelId = Number(params.get("qaLevel"));
  const rep = Number(params.get("qaRep"));
  return {
    levelId: Number.isFinite(levelId) && levelId > 0 ? levelId : null,
    rep: Number.isFinite(rep) && rep > 0 ? rep : null,
    lang: params.get("qaLang") || null,
    offline: params.get("qaOffline") === "1",
    skipWelcome: params.get("qaSkipWelcome") !== "0",
    completedLevels: parseList(params.get("qaCompleted")),
  };
}

function initialProgress(qa) {
  if (!qa) {
    const progress = migrateProgress(loadProgress(), SETS);
    const set = SETS[progress.current];
    return topicState(progress, set).rep >= set.reps.length ? startTopic(progress, SETS, progress.current) : progress;
  }
  let progress = migrateProgress({ completedLevels: qa.completedLevels }, SETS);
  const index = qa.levelId ? SETS.findIndex((set) => set.id === qa.levelId) : 0;
  progress = startTopic(progress, SETS, Math.max(index, 0));
  if (qa.rep) {
    const set = SETS[progress.current];
    const topic = topicState(progress, set);
    progress = { ...progress, topics: { ...progress.topics, [set.id]: { ...topic, rep: Math.min(qa.rep, set.reps.length) - 1 } } };
  }
  return { ...progress, hasStarted: false };
}

export default function PyithonApp() {
  const [qa] = useState(getQaConfig);
  const [xpEl, setXpEl] = useState(null);
  const [storedTheme] = useState(() => safeLocalStorageGet("pyithon-theme"));
  const [themeKey, setThemeKey] = useState(() => resolveStoredThemeKey(storedTheme));
  const [progress, setProgress] = useState(() => initialProgress(qa) || emptyProgress());
  const [showWelcome, setShowWelcome] = useState(() => (qa ? !qa.skipWelcome : !hasProgress(progress)));
  const [view, setView] = useState("rep");
  const [setDoneInfo, setSetDoneInfo] = useState(null);
  const [repKey, setRepKey] = useState(0);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKey, setApiKey] = useState(() => loadStoredApiKey(loadStoredProvider()));
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [offlineMode, setOfflineMode] = useState(() => qa?.offline || safeLocalStorageGet("pyithon-offline") === "true");
  const [pyodideStatus, setPyodideStatus] = useState("idle");
  const [soundEnabled, setSoundEnabled] = useState(() => safeLocalStorageGet("pyithon-sound") === "true");
  const [typedChars, setTypedChars] = useState(0);
  const [lang, setLang] = useState(() => {
    const qaLang = qa?.lang;
    if (qaLang && STRINGS[qaLang]) return qaLang;
    return safeLocalStorageGet("pyithon-lang", "en") || "en";
  });
  const [provider, setProvider] = useState(loadStoredProvider);

  const t = useCallback((key) => STRINGS[lang]?.[key] || STRINGS.en[key] || key, [lang]);
  const C = THEMES[themeKey].palette;

  useEffect(() => {
    if (showWelcome && !hasProgress(progress)) return;
    saveProgress({ ...progress, hasStarted: progress.hasStarted || !showWelcome });
  }, [progress, showWelcome]);

  useEffect(() => { unlockAudio(); }, []);
  useEffect(() => { setSoundOn(soundEnabled); safeLocalStorageSet("pyithon-sound", String(soundEnabled)); }, [soundEnabled]);
  useEffect(() => { safeLocalStorageSet("pyithon-offline", String(offlineMode)); }, [offlineMode]);
  useEffect(() => {
    if (offlineMode) loadPyodideRuntime().then(() => setPyodideStatus("ready")).catch(() => setPyodideStatus("error"));
  }, [offlineMode]);
  useEffect(() => { safeLocalStorageSet("pyithon-theme", themeKey); }, [themeKey]);
  useEffect(() => { safeLocalStorageSet("pyithon-lang", lang); }, [lang]);
  useEffect(() => { safeLocalStorageSet("pyithon-provider", provider); }, [provider]);

  // Welcome typing animation
  const tagline = t("tagline");
  useEffect(() => {
    if (!showWelcome) return;
    if (typedChars >= tagline.length) return;
    const timer = setInterval(() => setTypedChars(c => { if (c >= tagline.length) { clearInterval(timer); return c; } return c + 1; }), 45);
    return () => clearInterval(timer);
  }, [showWelcome, typedChars, tagline]);
  const [typedLang, setTypedLang] = useState(lang);
  if (typedLang !== lang) {
    setTypedLang(lang);
    setTypedChars(0);
  }

  const changeProvider = (next) => {
    setProvider(next);
    setApiKey(loadStoredApiKey(next));
    setApiKeyInput("");
  };

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      safeLocalStorageSet(getApiKeyStorageKey(provider), apiKeyInput.trim());
      setShowApiSetup(false);
    }
  };

  const index = progress.current;
  const set = SETS[index];
  const topic = topicState(progress, set);
  const repIndex = Math.min(topic.rep, set.reps.length - 1);
  const isLast = repIndex === set.reps.length - 1;

  const goToTopic = useCallback((target) => {
    if (!isUnlocked(progress, SETS, target)) return;
    setProgress(startTopic(progress, SETS, target));
    setRepKey((k) => k + 1);
    setView("rep");
  }, [progress]);

  const onPass = useCallback((outcome) => {
    setProgress((prev) => recordPass(prev, set, repIndex, outcome).progress);
    return recordPass(progress, set, repIndex, outcome).reward;
  }, [progress, repIndex, set]);

  const onMiss = useCallback(() => setProgress((prev) => recordMiss(prev)), []);

  const onNext = useCallback(() => {
    const result = advanceRep(progress, SETS, index);
    setProgress(result.progress);
    if (result.setDone) {
      setSetDoneInfo({ index, bonus: result.bonus, outcomes: topicState(result.progress, set).outcomes });
      setView("setDone");
    }
  }, [index, progress, set]);

  const onSetDoneNext = useCallback(() => {
    const next = setDoneInfo.index + 1;
    if (next < SETS.length) goToTopic(next);
    else setView("levels");
  }, [goToTopic, setDoneInfo]);

  const settings = showApiSetup && createElement(SettingsPanel, {
    apiKey,
    apiKeyInput,
    C,
    handleSaveApiKey,
    lang,
    offlineMode,
    provider,
    pyodideStatus: offlineMode && pyodideStatus === "idle" ? "loading" : pyodideStatus,
    setApiKeyInput,
    setLang,
    setOfflineMode,
    setProvider: changeProvider,
    setShowApiSetup,
    setThemeKey,
    t,
    themeKey,
  });

  if (showWelcome) {
    const introC = getIntroPalette(storedTheme);
    return createElement(WelcomeScreen, {
      C: introC,
      monoFont: MONO_FONT,
      onConfigureApiKey: () => {
        setShowWelcome(false);
        setShowApiSetup(true);
      },
      onStartLearning: () => setShowWelcome(false),
      pageStyle: getIntroPageStyle(introC),
      t,
      tagline,
      typedChars,
    });
  }

  const doneSet = setDoneInfo && SETS[setDoneInfo.index];
  return (
    <div style={{ ...getPageStyle(C), display: "flex", flexDirection: "column" }}>
      {createElement(TopBar, {
        C,
        chip: view === "rep" ? `${set.id} · ${pick(set.title, lang)}` : null,
        combo: progress.combo,
        current: repIndex,
        onOpenLevels: () => setView("levels"),
        onOpenSettings: () => setShowApiSetup(true),
        onToggleSound: () => setSoundEnabled((prev) => !prev),
        outcomes: view === "rep" ? topic.outcomes : null,
        soundEnabled,
        t,
        xp: progress.xp,
        xpRef: setXpEl,
      })}
      {view !== "setDone" && createElement(RepScreen, {
        key: `${set.id}-${repIndex}-${repKey}`,
        ai: { enabled: !offlineMode && Boolean(apiKey), apiKey, provider },
        C,
        hidden: view !== "rep",
        isLast,
        lang,
        onMiss,
        onNext,
        onPass,
        rep: set.reps[repIndex],
        repIndex,
        set,
        startWithSee: repIndex === 0 && !topic.outcomes.some(Boolean),
        t,
        xpEl,
      })}
      {view === "levels" && createElement(LevelSelectScreen, { C, goToTopic, lang, onBack: () => setView("rep"), progress, sets: SETS, t })}
      {view === "setDone" && doneSet && createElement(SetDone, {
        C,
        bonus: setDoneInfo.bonus,
        lang,
        nextSet: SETS[setDoneInfo.index + 1],
        onNext: onSetDoneNext,
        outcomes: setDoneInfo.outcomes,
        set: doneSet,
        t,
      })}
      {settings}
      <style>{getGlobalStyles(C)}</style>
    </div>
  );
}
