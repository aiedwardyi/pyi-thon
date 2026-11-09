import { THEMES, resolveStoredThemeKey } from "./themes";

const APP_DARK = THEMES.dark.palette;
const APP_LIGHT = THEMES.light.palette;

const DARK = {
  bg: "#121214", text: "#f4f4f5", tagline: "rgba(255,226,140,0.88)", subtitle: "#8e8f96", link: "#aeb0b6", linkHover: APP_DARK.text,
  accent: APP_DARK.accent, accentDeep: "#f0b90b", accentInk: APP_DARK.accentInk, accentLine: APP_DARK.accentLine,
  logoFrom: "#c8920a", logoTo: "#ffe680", glow: "rgba(255,212,59,0.30)", glowSoft: "rgba(255,212,59,0.07)",
  btnShadow: "rgba(255,212,59,0.30)", btnShadowHover: "rgba(255,212,59,0.42)", btnInset: "rgba(255,255,255,0.35)",
  smokeA: "0 0 0 0 0.58  0 0 0 0 0.59  0 0 0 0 0.62  1.6 0 0 0 -0.72",
  smokeB: "0 0 0 0 0.66  0 0 0 0 0.66  0 0 0 0 0.68  0 1.8 0 0 -0.85",
  smokeOpacity: [[0.32, 0.4], [0.12, 0.22]], vignette: "rgba(0,0,0,0.55)",
  speck: "#d8d8dc", speckAccent: "#ffd43b", speckGlow: "0 0 6px rgba(255,212,59,0.6)", speckOpacity: [0.15, 0.3],
  scheme: "dark",
};

const LIGHT = {
  bg: APP_LIGHT.base, text: APP_LIGHT.text, tagline: "#6f5c19", subtitle: APP_LIGHT.dim, link: APP_LIGHT.muted, linkHover: APP_LIGHT.text,
  accent: APP_LIGHT.accent, accentDeep: "#f0b90b", accentInk: APP_LIGHT.accentInk, accentLine: APP_LIGHT.accentLine,
  logoFrom: APP_LIGHT.accentLine, logoTo: "#d9a50c", glow: "rgba(240,185,11,0.22)", glowSoft: "rgba(255,212,59,0.08)",
  btnShadow: "rgba(240,185,11,0.32)", btnShadowHover: "rgba(240,185,11,0.45)", btnInset: "rgba(255,255,255,0.45)",
  smokeA: "0 0 0 0 0.32  0 0 0 0 0.33  0 0 0 0 0.36  1.6 0 0 0 -0.72",
  smokeB: "0 0 0 0 0.36  0 0 0 0 0.36  0 0 0 0 0.38  0 1.8 0 0 -0.85",
  smokeOpacity: [[0.07, 0.09], [0.04, 0.07]], vignette: "rgba(20,22,26,0.06)",
  speck: "#8a8d94", speckAccent: "#f0b90b", speckGlow: "none", speckOpacity: [0.2, 0.3],
  scheme: "light",
};

export function getIntroPalette(storedTheme) {
  return resolveStoredThemeKey(storedTheme) === "light" ? LIGHT : DARK;
}

export function getIntroPageStyle(theme) {
  return {
    minHeight: "100vh", backgroundColor: theme.bg, color: theme.text,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    colorScheme: theme.scheme,
  };
}

export function getIntroStyles(theme) {
  return `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: ${theme.bg} !important; color-scheme: ${theme.scheme}; }
  html { height: 100%; }
  body { min-height: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
  #root { min-height: 100vh; }

  @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
  @keyframes bubbleIn {
    0% { opacity: 0; transform: translateY(14px) scale(0.94); }
    62% { opacity: 1; transform: translateY(-2px) scale(1.025); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes logoFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes logoStroke {
    from { stroke-dashoffset: 170; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes smokeDriftA { to { transform: translate(-9%, 4%) scale(1.08); opacity: ${theme.smokeOpacity[0][1]}; } }
  @keyframes smokeDriftB { to { transform: translate(8%, -6%) scale(1.1); opacity: ${theme.smokeOpacity[1][1]}; } }
  @keyframes breathe {
    from { opacity: 0.6; transform: translate(-50%, -50%) scale(0.92); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1.08); }
  }
  @keyframes speckFloat {
    from { transform: translateY(0); opacity: var(--o); }
    to { transform: translate(6px, -40px); opacity: calc(var(--o) * 0.35); }
  }

  button { transition: all 0.2s ease; }
  button:focus-visible {
    outline: 2px solid ${theme.accentLine} !important;
    outline-offset: 3px;
  }
  ::selection { background: rgba(255,212,59,0.3); }

  .ui-bounce-in {
    animation: bubbleIn 0.58s cubic-bezier(0.2, 0.9, 0.2, 1.2) both;
  }

  .intro-smoke-a { animation: smokeDriftA 22s ease-in-out infinite alternate; }
  .intro-smoke-b { animation: smokeDriftB 30s ease-in-out infinite alternate; }
  .intro-glow { animation: breathe 8s ease-in-out infinite alternate; }
  .intro-speck { animation: speckFloat var(--d) ease-in-out var(--delay) infinite alternate; }

  .ui-pop,
  .ui-pop-soft {
    transform-origin: center;
    transition-property: transform, filter, box-shadow, background-color, border-color, color, opacity;
    transition-duration: 220ms;
    transition-timing-function: cubic-bezier(0.2, 0.9, 0.2, 1.15);
  }

  @media (hover: hover) and (pointer: fine) {
    .ui-pop:hover:not(:disabled) {
      transform: translateY(-1px) scale(1.035);
      filter: brightness(1.03) saturate(1.03);
    }

    .ui-pop-soft:hover:not(:disabled) {
      transform: translateY(-1px) scale(1.02);
      filter: brightness(1.025);
    }
  }

  .ui-pop:active:not(:disabled),
  .ui-pop-soft:active:not(:disabled) {
    transform: translateY(1px) scale(0.94);
    filter: brightness(0.96);
    transition-duration: 90ms;
  }

  .ui-logo-float {
    animation: logoFloat 4s ease-in-out infinite;
    transform-origin: center;
  }

  .ui-logo-line {
    stroke-dasharray: 170;
    stroke-dashoffset: 170;
    animation: logoStroke 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  }

  .ui-logo-line:nth-of-type(2) { animation-delay: 0.07s; }
  .ui-logo-line:nth-of-type(3) { animation-delay: 0.14s; }
  .ui-logo-line:nth-of-type(4) { animation-delay: 0.21s; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.001ms !important;
    }
    .intro-smoke-a, .intro-smoke-b, .intro-glow, .intro-speck { animation: none !important; }
  }
`;
}
