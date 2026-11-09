// The one accent line. Blue was { color: "#2f81f7", ink: "#ffffff" }.
const ACCENT = { color: "#ffd43b", ink: "#1b1500" };

function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (shift) => Math.round(((n >> shift) & 255) * (1 - amount));
  return `#${[16, 8, 0].map((shift) => channel(shift).toString(16).padStart(2, "0")).join("")}`;
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [16, 8, 0].map((shift) => {
    const c = ((n >> shift) & 255) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function readableOn(hex, bg) {
  let amount = 0;
  while (contrast(shade(hex, amount), bg) < 4.5) amount += 0.01;
  return shade(hex, amount);
}

const DARK = {
  base: "#18191c", surface: "#1f2023", raised: "#26282c", line: "#313338", well: "#131416",
  text: "#ececee", muted: "#9b9da4", dim: "#6c6f77",
  accent: ACCENT.color, accentInk: ACCENT.ink, accentLine: ACCENT.color,
  xp: "#e3b341", pass: "#3fb950", miss: "#f85149",
  scrim: "rgba(10,10,12,0.72)", shadow: "0 20px 60px rgba(0,0,0,0.5)",
  syntaxKeyword: "#ff7b72", syntaxFunction: "#d2a8ff", syntaxString: "#a5d6ff", syntaxNumber: "#79c0ff",
  syntaxComment: "#8b949e", syntaxOperator: "#e6edf3", syntaxType: "#ffa657", syntaxVariable: "#ececee",
  scheme: "dark",
};

const LIGHT = {
  base: "#f4f5f7", surface: "#ffffff", raised: "#eceef1", line: "#d4d7dd", well: "#f8f9fa",
  text: "#1b1d21", muted: "#50545c", dim: "#666a73",
  accent: ACCENT.color, accentInk: ACCENT.ink, accentLine: readableOn(ACCENT.color, "#eceef1"),
  xp: "#8a5d00", pass: "#1a7f37", miss: "#cf222e",
  scrim: "rgba(20,22,26,0.45)", shadow: "0 20px 60px rgba(0,0,0,0.18)",
  syntaxKeyword: "#cf222e", syntaxFunction: "#8250df", syntaxString: "#0a3069", syntaxNumber: "#0550ae",
  syntaxComment: "#6e7781", syntaxOperator: "#1f2328", syntaxType: "#953800", syntaxVariable: "#1b1d21",
  scheme: "light",
};

export const THEMES = {
  dark: { palette: DARK },
  light: { palette: LIGHT },
};

export const DEFAULT_THEME_KEY = "dark";

export function resolveStoredThemeKey(storedTheme) {
  return storedTheme === "light" ? "light" : DEFAULT_THEME_KEY;
}

export const MONO_FONT = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', monospace";

export function mix(color, percent) {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

export function getPageStyle(theme) {
  return {
    minHeight: "100vh", backgroundColor: theme.base, color: theme.text,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    colorScheme: theme.scheme,
  };
}

export function getGlobalStyles(theme) {
  return `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: ${theme.base} !important; color-scheme: ${theme.scheme}; }
  html { height: 100%; }
  body { min-height: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
  #root { min-height: 100vh; }
  button { font-family: inherit; }
  button:focus-visible, input:focus-visible, [role="radio"]:focus-visible {
    outline: 2px solid ${theme.accentLine} !important;
    outline-offset: 2px;
  }
  button:disabled { cursor: not-allowed; }
  ::selection { background: ${mix(theme.accent, 30)}; }

  .ui-btn { transition: transform 120ms ease, filter 120ms ease, background-color 120ms ease; }
  @media (hover: hover) and (pointer: fine) {
    .ui-btn:hover:not(:disabled) { filter: brightness(1.08); }
  }
  .ui-btn:active:not(:disabled) { transform: translateY(1px) scale(0.98); }
  @media (pointer: coarse) { .ui-kbd { display: none !important; } }
  @media (max-width: 560px) { .ui-wide-only { display: none !important; } }

  .ui-shake { animation: shake 0.35s ease-in-out; }
  .ui-pop { animation: pop 0.35s cubic-bezier(0.2, 1.6, 0.4, 1) both; }
  .ui-slam { animation: slam 0.55s cubic-bezier(0.2, 1.4, 0.3, 1) both; }
  .ui-rise { animation: rise 0.28s ease-out both; }
  .ui-float-xp { position: fixed; transform: translateX(-50%); font-weight: 900; font-size: 26px; color: ${theme.xp}; pointer-events: none; z-index: 61; animation: floatUp 1.5s ease-out forwards; }
  @keyframes slam { from { transform: scale(1.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes rise { from { transform: translateY(10px); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes floatUp { 0% { opacity: 0; translate: 0 0; } 15% { opacity: 1; } 100% { opacity: 0; translate: 0 -90px; } }
  @keyframes shake { 0%, 100% { transform: none; } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
  @keyframes pop { from { transform: scale(0.7); opacity: 0; } to { transform: none; opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
}
