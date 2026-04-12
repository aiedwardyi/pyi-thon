const DARK = {
  bg: "#08090e", bgCard: "#0f1117", bgPanel: "#131520", bgSubtle: "rgba(255,255,255,0.025)",
  bgGlass: "rgba(15,17,23,0.85)", bgGlassStrong: "rgba(15,17,23,0.95)",
  border: "rgba(255,255,255,0.06)", borderLight: "rgba(255,255,255,0.04)", borderFocus: "rgba(129,140,248,0.3)",
  text: "#e8eaed", textMuted: "rgba(255,255,255,0.85)", textDim: "rgba(255,255,255,0.35)",
  accent: "#818cf8", accentLight: "#a5b4fc", accentDark: "#6366f1", accentDeep: "#4f46e5",
  accentGlow: "rgba(99,102,241,0.4)", accentGlowSoft: "rgba(99,102,241,0.15)",
  accentText: "rgba(165,180,252,0.9)", accentTextDim: "rgba(165,180,252,0.45)",
  accentBg: "rgba(79,70,229,0.12)", accentBorder: "rgba(79,70,229,0.25)",
  green: "#34d399", greenLight: "#6ee7b7", greenBg: "rgba(16,185,129,0.08)", greenBorder: "rgba(16,185,129,0.2)",
  red: "#fb7185", redBg: "rgba(244,63,94,0.08)", redBorder: "rgba(244,63,94,0.2)",
  amber: "#fbbf24", amberBg: "rgba(245,158,11,0.08)", amberBorder: "rgba(245,158,11,0.18)", amberText: "rgba(252,211,77,0.9)",
  codeBg: "rgba(0,0,0,0.35)", codeText: "#6ee7b7",
  lineNum: "rgba(129,140,248,0.18)", lineNumActive: "rgba(129,140,248,0.45)",
  syntaxKeyword: "#c084fc", syntaxString: "#fbbf24", syntaxComment: "rgba(255,255,255,0.3)",
  syntaxNumber: "#38bdf8", syntaxFunction: "#818cf8", syntaxBuiltin: "#34d399",
  dotGrid: "rgba(255,255,255,0.03)", scheme: "dark",
  trafficRed: "rgba(244,63,94,0.5)", trafficYellow: "rgba(245,158,11,0.5)", trafficGreen: "rgba(34,197,94,0.5)",
  btnText: "#ffffff",
};

const LIGHT = {
  bg: "#f0f1f5", bgCard: "#ffffff", bgPanel: "#e8e9ee", bgSubtle: "rgba(0,0,0,0.03)",
  bgGlass: "rgba(240,241,245,0.85)", bgGlassStrong: "rgba(240,241,245,0.95)",
  border: "rgba(0,0,0,0.12)", borderLight: "rgba(0,0,0,0.08)", borderFocus: "rgba(99,102,241,0.5)",
  text: "#111827", textMuted: "#374151", textDim: "#6b7280",
  accent: "#4f46e5", accentLight: "#6366f1", accentDark: "#4338ca", accentDeep: "#3730a3",
  accentGlow: "rgba(79,70,229,0.2)", accentGlowSoft: "rgba(79,70,229,0.06)",
  accentText: "#4338ca", accentTextDim: "#6b7280",
  accentBg: "rgba(99,102,241,0.08)", accentBorder: "rgba(99,102,241,0.25)",
  green: "#047857", greenLight: "#059669", greenBg: "rgba(5,150,105,0.08)", greenBorder: "rgba(5,150,105,0.25)",
  red: "#be123c", redBg: "rgba(190,18,60,0.06)", redBorder: "rgba(190,18,60,0.2)",
  amber: "#b45309", amberBg: "rgba(180,83,9,0.08)", amberBorder: "rgba(180,83,9,0.2)", amberText: "#92400e",
  codeBg: "#f3f4f6", codeText: "#065f46",
  lineNum: "rgba(79,70,229,0.25)", lineNumActive: "rgba(79,70,229,0.6)",
  syntaxKeyword: "#7c3aed", syntaxString: "#92400e", syntaxComment: "#9ca3af",
  syntaxNumber: "#0369a1", syntaxFunction: "#4338ca", syntaxBuiltin: "#047857",
  dotGrid: "rgba(0,0,0,0.04)", scheme: "light",
  trafficRed: "rgba(220,38,38,0.6)", trafficYellow: "rgba(217,119,6,0.6)", trafficGreen: "rgba(5,150,105,0.6)",
  btnText: "#ffffff",
};

const TOKYO = {
  bg: "#1a1b26", bgCard: "#1f2335", bgPanel: "#24283b", bgSubtle: "rgba(255,255,255,0.03)",
  bgGlass: "rgba(26,27,38,0.88)", bgGlassStrong: "rgba(26,27,38,0.95)",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.04)", borderFocus: "rgba(125,207,255,0.35)",
  text: "#c0caf5", textMuted: "rgba(192,202,245,0.85)", textDim: "rgba(192,202,245,0.4)",
  accent: "#7aa2f7", accentLight: "#89b4fa", accentDark: "#5d7de0", accentDeep: "#3d59a1",
  accentGlow: "rgba(122,162,247,0.4)", accentGlowSoft: "rgba(122,162,247,0.15)",
  accentText: "rgba(137,180,250,0.9)", accentTextDim: "rgba(137,180,250,0.45)",
  accentBg: "rgba(61,89,161,0.15)", accentBorder: "rgba(61,89,161,0.3)",
  green: "#9ece6a", greenLight: "#b5e890", greenBg: "rgba(158,206,106,0.1)", greenBorder: "rgba(158,206,106,0.25)",
  red: "#f7768e", redBg: "rgba(247,118,142,0.1)", redBorder: "rgba(247,118,142,0.25)",
  amber: "#e0af68", amberBg: "rgba(224,175,104,0.1)", amberBorder: "rgba(224,175,104,0.2)", amberText: "rgba(224,175,104,0.9)",
  codeBg: "rgba(0,0,0,0.3)", codeText: "#9ece6a",
  lineNum: "rgba(122,162,247,0.2)", lineNumActive: "rgba(122,162,247,0.5)",
  syntaxKeyword: "#bb9af7", syntaxString: "#9ece6a", syntaxComment: "rgba(192,202,245,0.3)",
  syntaxNumber: "#ff9e64", syntaxFunction: "#7aa2f7", syntaxBuiltin: "#2ac3de",
  dotGrid: "rgba(255,255,255,0.03)", scheme: "dark",
  trafficRed: "rgba(247,118,142,0.5)", trafficYellow: "rgba(224,175,104,0.5)", trafficGreen: "rgba(158,206,106,0.5)",
  btnText: "#ffffff",
};

const LOVE = {
  bg: "#191724", bgCard: "#1f1d2e", bgPanel: "#26233a", bgSubtle: "rgba(255,255,255,0.03)",
  bgGlass: "rgba(25,23,36,0.88)", bgGlassStrong: "rgba(25,23,36,0.95)",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.04)", borderFocus: "rgba(235,111,146,0.35)",
  text: "#e0def4", textMuted: "rgba(224,222,244,0.85)", textDim: "rgba(224,222,244,0.4)",
  accent: "#eb6f92", accentLight: "#f0a0b8", accentDark: "#d65d7f", accentDeep: "#b4637a",
  accentGlow: "rgba(235,111,146,0.4)", accentGlowSoft: "rgba(235,111,146,0.15)",
  accentText: "rgba(235,111,146,0.9)", accentTextDim: "rgba(235,111,146,0.45)",
  accentBg: "rgba(180,99,122,0.15)", accentBorder: "rgba(180,99,122,0.3)",
  green: "#9ccfd8", greenLight: "#b8e0e8", greenBg: "rgba(156,207,216,0.1)", greenBorder: "rgba(156,207,216,0.25)",
  red: "#eb6f92", redBg: "rgba(235,111,146,0.1)", redBorder: "rgba(235,111,146,0.25)",
  amber: "#f6c177", amberBg: "rgba(246,193,119,0.1)", amberBorder: "rgba(246,193,119,0.2)", amberText: "rgba(246,193,119,0.9)",
  codeBg: "rgba(0,0,0,0.3)", codeText: "#9ccfd8",
  lineNum: "rgba(235,111,146,0.2)", lineNumActive: "rgba(235,111,146,0.5)",
  syntaxKeyword: "#c4a7e7", syntaxString: "#f6c177", syntaxComment: "rgba(224,222,244,0.3)",
  syntaxNumber: "#ea9a97", syntaxFunction: "#eb6f92", syntaxBuiltin: "#9ccfd8",
  dotGrid: "rgba(255,255,255,0.03)", scheme: "dark",
  trafficRed: "rgba(235,111,146,0.5)", trafficYellow: "rgba(246,193,119,0.5)", trafficGreen: "rgba(156,207,216,0.5)",
  btnText: "#ffffff",
};

const GRUVBOX = {
  bg: "#1d2021", bgCard: "#282828", bgPanel: "#32302f", bgSubtle: "rgba(255,255,255,0.03)",
  bgGlass: "rgba(29,32,33,0.88)", bgGlassStrong: "rgba(29,32,33,0.95)",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.04)", borderFocus: "rgba(254,128,25,0.35)",
  text: "#ebdbb2", textMuted: "rgba(235,219,178,0.85)", textDim: "rgba(235,219,178,0.4)",
  accent: "#fe8019", accentLight: "#fabd2f", accentDark: "#d65d0e", accentDeep: "#af3a03",
  accentGlow: "rgba(254,128,25,0.4)", accentGlowSoft: "rgba(254,128,25,0.15)",
  accentText: "rgba(254,128,25,0.9)", accentTextDim: "rgba(254,128,25,0.45)",
  accentBg: "rgba(175,58,3,0.15)", accentBorder: "rgba(175,58,3,0.3)",
  green: "#b8bb26", greenLight: "#d5d84a", greenBg: "rgba(184,187,38,0.1)", greenBorder: "rgba(184,187,38,0.25)",
  red: "#fb4934", redBg: "rgba(251,73,52,0.1)", redBorder: "rgba(251,73,52,0.25)",
  amber: "#fabd2f", amberBg: "rgba(250,189,47,0.1)", amberBorder: "rgba(250,189,47,0.2)", amberText: "rgba(250,189,47,0.9)",
  codeBg: "rgba(0,0,0,0.3)", codeText: "#b8bb26",
  lineNum: "rgba(254,128,25,0.2)", lineNumActive: "rgba(254,128,25,0.5)",
  syntaxKeyword: "#fb4934", syntaxString: "#b8bb26", syntaxComment: "rgba(235,219,178,0.3)",
  syntaxNumber: "#d3869b", syntaxFunction: "#fabd2f", syntaxBuiltin: "#8ec07c",
  dotGrid: "rgba(255,255,255,0.03)", scheme: "dark",
  trafficRed: "rgba(251,73,52,0.5)", trafficYellow: "rgba(250,189,47,0.5)", trafficGreen: "rgba(184,187,38,0.5)",
  btnText: "#ffffff",
};

const CATPPUCCIN = {
  bg: "#1e1e2e", bgCard: "#252536", bgPanel: "#2a2a3c", bgSubtle: "rgba(255,255,255,0.03)",
  bgGlass: "rgba(30,30,46,0.88)", bgGlassStrong: "rgba(30,30,46,0.95)",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.04)", borderFocus: "rgba(203,166,247,0.35)",
  text: "#cdd6f4", textMuted: "rgba(205,214,244,0.85)", textDim: "rgba(205,214,244,0.4)",
  accent: "#cba6f7", accentLight: "#d4bbf9", accentDark: "#b486f0", accentDeep: "#9d6ee8",
  accentGlow: "rgba(203,166,247,0.4)", accentGlowSoft: "rgba(203,166,247,0.15)",
  accentText: "rgba(203,166,247,0.9)", accentTextDim: "rgba(203,166,247,0.45)",
  accentBg: "rgba(157,110,232,0.15)", accentBorder: "rgba(157,110,232,0.3)",
  green: "#a6e3a1", greenLight: "#c0eebb", greenBg: "rgba(166,227,161,0.1)", greenBorder: "rgba(166,227,161,0.25)",
  red: "#f38ba8", redBg: "rgba(243,139,168,0.1)", redBorder: "rgba(243,139,168,0.25)",
  amber: "#f9e2af", amberBg: "rgba(249,226,175,0.1)", amberBorder: "rgba(249,226,175,0.2)", amberText: "rgba(249,226,175,0.9)",
  codeBg: "rgba(0,0,0,0.3)", codeText: "#a6e3a1",
  lineNum: "rgba(203,166,247,0.2)", lineNumActive: "rgba(203,166,247,0.5)",
  syntaxKeyword: "#cba6f7", syntaxString: "#a6e3a1", syntaxComment: "rgba(205,214,244,0.3)",
  syntaxNumber: "#fab387", syntaxFunction: "#89b4fa", syntaxBuiltin: "#94e2d5",
  dotGrid: "rgba(255,255,255,0.03)", scheme: "dark",
  trafficRed: "rgba(243,139,168,0.5)", trafficYellow: "rgba(249,226,175,0.5)", trafficGreen: "rgba(166,227,161,0.5)",
  btnText: "#ffffff",
};

const NORD = {
  bg: "#2e3440", bgCard: "#3b4252", bgPanel: "#434c5e", bgSubtle: "rgba(255,255,255,0.03)",
  bgGlass: "rgba(46,52,64,0.88)", bgGlassStrong: "rgba(46,52,64,0.95)",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.04)", borderFocus: "rgba(136,192,208,0.35)",
  text: "#eceff4", textMuted: "rgba(236,239,244,0.85)", textDim: "rgba(236,239,244,0.4)",
  accent: "#88c0d0", accentLight: "#8fbcbb", accentDark: "#5e81ac", accentDeep: "#4c6c8c",
  accentGlow: "rgba(136,192,208,0.4)", accentGlowSoft: "rgba(136,192,208,0.15)",
  accentText: "rgba(136,192,208,0.9)", accentTextDim: "rgba(136,192,208,0.45)",
  accentBg: "rgba(76,108,140,0.15)", accentBorder: "rgba(76,108,140,0.3)",
  green: "#a3be8c", greenLight: "#b8d4a0", greenBg: "rgba(163,190,140,0.1)", greenBorder: "rgba(163,190,140,0.25)",
  red: "#bf616a", redBg: "rgba(191,97,106,0.1)", redBorder: "rgba(191,97,106,0.25)",
  amber: "#ebcb8b", amberBg: "rgba(235,203,139,0.1)", amberBorder: "rgba(235,203,139,0.2)", amberText: "rgba(235,203,139,0.9)",
  codeBg: "rgba(0,0,0,0.25)", codeText: "#a3be8c",
  lineNum: "rgba(136,192,208,0.2)", lineNumActive: "rgba(136,192,208,0.5)",
  syntaxKeyword: "#81a1c1", syntaxString: "#a3be8c", syntaxComment: "rgba(236,239,244,0.3)",
  syntaxNumber: "#b48ead", syntaxFunction: "#88c0d0", syntaxBuiltin: "#8fbcbb",
  dotGrid: "rgba(255,255,255,0.03)", scheme: "dark",
  trafficRed: "rgba(191,97,106,0.5)", trafficYellow: "rgba(235,203,139,0.5)", trafficGreen: "rgba(163,190,140,0.5)",
  btnText: "#ffffff",
};

export const THEMES = {
  dark: { palette: DARK, label: "Dark", labelKo: "\ub2e4\ud06c", colors: ["#08090e", "#818cf8", "#c084fc"] },
  light: { palette: LIGHT, label: "Light", labelKo: "\ub77c\uc774\ud2b8", colors: ["#f0f1f5", "#4f46e5", "#7c3aed"] },
  tokyo: { palette: TOKYO, label: "Tokyo Night", labelKo: "\ub3c4\ucfc4 \ub098\uc774\ud2b8", colors: ["#1a1b26", "#7aa2f7", "#bb9af7"] },
  love: { palette: LOVE, label: "Love", labelKo: "\ub7ec\ube0c", colors: ["#191724", "#eb6f92", "#c4a7e7"] },
  gruvbox: { palette: GRUVBOX, label: "Gruvbox", labelKo: "\uadf8\ub8e8\ubc15\uc2a4", colors: ["#1d2021", "#fe8019", "#fb4934"] },
  catppuccin: { palette: CATPPUCCIN, label: "Catppuccin", labelKo: "\uce74\ud478\uce58\ub178", colors: ["#1e1e2e", "#cba6f7", "#f38ba8"] },
  nord: { palette: NORD, label: "Nord", labelKo: "\ub178\ub974\ub4dc", colors: ["#2e3440", "#88c0d0", "#b48ead"] },
};

export function getGlobalStyles(theme) {
  return `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: ${theme.bg} !important; color-scheme: ${theme.scheme}; }
  html { height: 100%; }
  body { min-height: 100%; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  #root { min-height: 100vh; }

  @keyframes confettiFall {
    0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(100vh) translateX(var(--drift, 0px)) rotate(var(--rotation, 720deg)) scale(0.3); opacity: 0; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(6px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes levelEnter {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes bracketPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.15); }
  }
  @keyframes dotBounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1.2); opacity: 1; }
  }
  @keyframes gentlePulse {
    0%, 100% { box-shadow: 0 8px 40px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.1); }
    50% { box-shadow: 0 8px 50px rgba(99,102,241,0.6), inset 0 1px 0 rgba(255,255,255,0.15); }
  }
  @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
  @keyframes xpFloat {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-40px) scale(0.8); }
  }
  textarea::placeholder { color: rgba(129,140,248,0.2) !important; }
  textarea::-webkit-scrollbar { width: 5px; }
  textarea::-webkit-scrollbar-track { background: transparent; }
  textarea::-webkit-scrollbar-thumb { background: rgba(129,140,248,0.15); border-radius: 4px; }
  textarea::-webkit-scrollbar-thumb:hover { background: rgba(129,140,248,0.3); }

  button { transition: all 0.2s ease; }

  ::selection { background: rgba(99,102,241,0.3); }
`;
}
