import { AI_PROVIDERS } from "../data/appConfig";

const STORAGE_KEY = "pyithon-progress";
const LEGACY_CLAUDE_API_KEY_STORAGE_KEY = "pyithon-api-key";
const API_KEY_STORAGE_PREFIX = "pyithon-api-key-";

export function safeLocalStorageGet(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeLocalStorageSet(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeSessionStorageGet(key, fallback = "") {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.sessionStorage.getItem(key);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

export function safeSessionStorageSet(key, value) {
  if (typeof window === "undefined") return false;
  try {
    window.sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

function safeLocalStorageRemove(key) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

export function getApiKeyStorageKey(provider) {
  return `${API_KEY_STORAGE_PREFIX}${provider}`;
}

export function loadStoredProvider() {
  const provider = safeLocalStorageGet("pyithon-provider", "claude");
  return AI_PROVIDERS[provider] ? provider : "claude";
}

export function loadStoredApiKey(provider) {
  const providerKey = safeLocalStorageGet(getApiKeyStorageKey(provider), "");
  if (providerKey) return providerKey;
  if (provider !== "claude") return "";

  const legacyKey = safeLocalStorageGet(LEGACY_CLAUDE_API_KEY_STORAGE_KEY, "");
  if (!legacyKey) return "";

  safeLocalStorageSet(getApiKeyStorageKey("claude"), legacyKey);
  safeLocalStorageRemove(LEGACY_CLAUDE_API_KEY_STORAGE_KEY);
  return legacyKey;
}

export function loadProgress() {
  try {
    const data = safeLocalStorageGet(STORAGE_KEY, "");
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function saveProgress(data) {
  safeLocalStorageSet(STORAGE_KEY, JSON.stringify(data));
}
