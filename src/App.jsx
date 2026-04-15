import { createElement, useState, useEffect, useRef, useCallback } from "react";
import ActionBar from "./components/ActionBar";
import GameHeader from "./components/GameHeader";
import LevelSelectScreen from "./components/LevelSelectScreen";
import LevelInfoPanel from "./components/LevelInfoPanel";
import SettingsPanel from "./components/SettingsPanel";
import WelcomeScreen from "./components/WelcomeScreen";
import WorkspacePanel from "./components/WorkspacePanel";
import { buildDiffFeedback, buildMismatchFeedback } from "./offlineEvaluation";
import { formatHintText } from "./hintFormatting";
import { STRINGS } from "./data/appConfig";
import { LEVELS, getLocalizedLevel, getPhaseColors } from "./data/levels";
import { evaluateWithAI } from "./lib/aiEvaluation";
import {
  getApiKeyStorageKey,
  loadProgress,
  loadStoredApiKey,
  loadStoredProvider,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeSessionStorageGet,
  safeSessionStorageSet,
  saveProgress,
} from "./lib/storage";
import { getGlobalStyles, THEMES } from "./theme/themes";

let C = { ...THEMES.dark.palette };

// ─── PYODIDE PYTHON RUNTIME ───
let _pyodide = null;
let _pyodideLoading = false;
let _pyodideReady = false;
const _pyodideCallbacks = [];
const OFFLINE_FALLBACK_NOTICE_SESSION_KEY = "pyithon-offline-fallback-notice-shown";
const LOCAL_FALLBACK_NOTICE_SESSION_KEY = "pyithon-local-fallback-notice-shown";

async function loadPyodideRuntime() {
  if (_pyodideReady) return _pyodide;
  if (_pyodideLoading) return new Promise(resolve => _pyodideCallbacks.push(resolve));
  _pyodideLoading = true;
  try {
    _pyodide = await window.loadPyodide();
    _pyodideReady = true;
    _pyodideCallbacks.forEach(cb => cb(_pyodide));
    _pyodideCallbacks.length = 0;
    return _pyodide;
  } catch (e) {
    _pyodideLoading = false;
    throw e;
  }
}

async function runPython(code, simulatedInput) {
  const pyodide = await loadPyodideRuntime();
  // Set up input simulation
  const inputs = simulatedInput ? simulatedInput.split("\n") : [];
  pyodide.runPython(`
import sys, io
_captured_output = io.StringIO()
sys.stdout = _captured_output
_input_values = ${JSON.stringify(inputs)}
_input_index = 0
def input(prompt=""):
    global _input_index
    if _input_index < len(_input_values):
        val = _input_values[_input_index]
        _input_index += 1
        return val
    return ""
__builtins__.input = input
`);
  try {
    // Inject a loop iteration limit to prevent infinite loops from freezing the browser
    pyodide.runPython(`
import sys
_loop_limit = 100000
_original_trace = sys.gettrace()
_loop_counter = 0
def _loop_guard(frame, event, arg):
    global _loop_counter
    if event == 'line':
        _loop_counter += 1
        if _loop_counter > _loop_limit:
            raise RuntimeError("Infinite loop detected - your code executed over 100,000 lines. Check your loops and make sure they will eventually stop.")
    return _loop_guard
sys.settrace(_loop_guard)
`);
    pyodide.runPython(code);
    // Cleanup: restore trace and stdout safely
    pyodide.runPython(`
_sys = __import__('sys')
_sys.settrace(_original_trace if '_original_trace' in dir() else None)
_sys.stdout = _sys.__stdout__
`);
    const output = pyodide.runPython("_captured_output.getvalue()");
    return { success: true, output: output.trimEnd() };
  } catch (err) {
    try {
      pyodide.runPython(`
_sys = __import__('sys')
_sys.settrace(None)
if hasattr(_sys, '__stdout__'):
    _sys.stdout = _sys.__stdout__
`);
    } catch {}
    const msg = err.message || String(err);
    // Extract just the Python error line
    const lines = msg.split("\n");
    const pyErr = lines.filter(l => l.match(/Error:|error:/i)).pop() || lines[lines.length - 1] || msg;
    // Give a friendlier message for infinite loop detection
    if (msg.includes("Infinite loop detected")) {
      return { success: false, output: "", error: "Infinite loop detected! Check your while loop - make sure the condition will eventually become False (e.g., increment your counter variable)." };
    }
    return { success: false, output: "", error: pyErr.trim() };
  }
}

// ─── CONSTRUCT CHECKS (ensure students use the right concept) ───
function _has(code, ...words) { const lc = code.toLowerCase(); return words.every(w => lc.includes(w)); }
function _fail(msg) { return { correct: false, feedback: msg, explanation: "" }; }

// Construct requirements per level - what concept must the code use
const CONSTRUCT_CHECKS_MSGS = {
  en: {
    2: ["Create a variable called 'name' using = assignment.", "Use print(name) to print the variable, not a hardcoded string."],
    3: ["Use str(), an f-string, or .format() to combine strings and numbers."],
    4: ["Use input() to ask the user for their name."],
    5: ["Use both if and else for this task."],
    6: ["Use elif for multiple conditions."],
    7: ["Use a for loop with range()."],
    8: ["Use a while loop for this task."],
    9: ["Use a while loop with input()."],
    10: ["Use a loop to calculate the sum."],
    11: ["Use / to divide for the average."],
    12: ['Use "while True" with "break".', "Use input() to read values."],
    13: ["Define a function using def.", "Use return to send back the result."],
    14: ["Define a function using def.", 'Name your function "greet".', "Use return."],
    15: ["Create a list using [ ] brackets."],
    16: ["Use .append().", "Use len()."],
    17: ["Create a dictionary using { } or dict()."],
    18: ["Use .items() to loop through key-value pairs.", "Use a for loop."],
    19: ["Use a while loop with input() and .append()."],
    20: ["Use open() to work with files."],
    21: ["Use try/except to handle the error."],
    22: ["Use the class keyword.", "Add an __init__ method.", "Use self."],
    23: ["Import json first.", "Use json.dumps() and json.loads()."],
    24: ["Import math.", "Define a function.", "Use math.pi."],
    25: ["Define a function.", "Use sum() and len()."],
    26: ["Use a list comprehension: [expr for x in iterable]."],
    27: ["Use .split() and .join()."],
    28: ['Use an f-string: f"...{variable}..."'],
    29: ["Use a lambda function.", "Use map()."],
    30: ["Use a for loop.", "Use an if statement to filter."],
  },
  ko: {
    2: ["= 할당을 사용하여 'name' 변수를 만드세요.", "하드코딩된 문자열이 아닌 print(name)으로 변수를 출력하세요."],
    3: ["str(), f-string, 또는 .format()을 사용하여 문자열과 숫자를 결합하세요."],
    4: ["input()을 사용하여 사용자의 이름을 물어보세요."],
    5: ["이 과제에는 if와 else를 모두 사용하세요."],
    6: ["여러 조건에는 elif를 사용하세요."],
    7: ["range()와 함께 for 반복문을 사용하세요."],
    8: ["이 과제에는 while 반복문을 사용하세요."],
    9: ["input()과 함께 while 반복문을 사용하세요."],
    10: ["합계를 계산하려면 반복문을 사용하세요."],
    11: ["평균을 구하려면 /를 사용하세요."],
    12: ['"while True"와 "break"를 사용하세요.', "input()을 사용하여 값을 읽으세요."],
    13: ["def를 사용하여 함수를 정의하세요.", "return을 사용하여 결과를 반환하세요."],
    14: ["def를 사용하여 함수를 정의하세요.", '함수 이름을 "greet"로 지정하세요.', "return을 사용하세요."],
    15: ["[ ] 괄호를 사용하여 리스트를 만드세요."],
    16: [".append()를 사용하세요.", "len()을 사용하세요."],
    17: ["{ } 또는 dict()를 사용하여 딕셔너리를 만드세요."],
    18: [".items()를 사용하여 키-값 쌍을 순회하세요.", "for 반복문을 사용하세요."],
    19: ["while 반복문, input(), .append()를 사용하세요."],
    20: ["open()을 사용하여 파일을 다루세요."],
    21: ["try/except를 사용하여 에러를 처리하세요."],
    22: ["class 키워드를 사용하세요.", "__init__ 메서드를 추가하세요.", "self를 사용하세요."],
    23: ["먼저 json을 임포트하세요.", "json.dumps()와 json.loads()를 사용하세요."],
    24: ["math를 임포트하세요.", "함수를 정의하세요.", "math.pi를 사용하세요."],
    25: ["함수를 정의하세요.", "sum()과 len()을 사용하세요."],
    26: ["리스트 컴프리헨션을 사용하세요: [표현식 for x in 반복가능]."],
    27: [".split()과 .join()을 사용하세요."],
    28: ['f-string을 사용하세요: f"...{변수}..."'],
    29: ["lambda 함수를 사용하세요.", "map()을 사용하세요."],
    30: ["for 반복문을 사용하세요.", "if문을 사용하여 필터링하세요."],
  },
};

function _getChecks(lang) {
  const m = CONSTRUCT_CHECKS_MSGS[lang] || CONSTRUCT_CHECKS_MSGS.en;
  return {
    2: (c, _lc) => { if (!/name\s*=/.test(c)) return m[2][0]; if (/print\s*\(\s*["']/.test(c) && !/print\s*\(\s*\w+\s*\)/.test(c.replace(/"[^"]*"|'[^']*'/g, '""'))) return m[2][1]; },
    3: (c, lc) => { if (!_has(lc, "str(") && !_has(lc, 'f"') && !_has(lc, "f'") && !_has(lc, "format")) return m[3][0]; },
    4: (c, lc) => { if (!_has(lc, "input(")) return m[4][0]; },
    5: (c, lc) => { if (!_has(lc, "if ") || !_has(lc, "else")) return m[5][0]; },
    6: (c, lc) => { if (!_has(lc, "elif")) return m[6][0]; },
    7: (c, lc) => { if (!_has(lc, "for ") || !_has(lc, "range")) return m[7][0]; },
    8: (c, lc) => { if (!_has(lc, "while ")) return m[8][0]; },
    9: (c, lc) => { if (!_has(lc, "while ") || !_has(lc, "input(")) return m[9][0]; },
    10: (c, lc) => { if (!_has(lc, "for ") && !_has(lc, "while ")) return m[10][0]; },
    11: (c, _lc) => { if (!_has(c, "/")) return m[11][0]; },
    12: (c, lc) => { if (!_has(lc, "while") || !_has(lc, "break")) return m[12][0]; if (!_has(lc, "input(")) return m[12][1]; },
    13: (c, lc) => { if (!_has(lc, "def ")) return m[13][0]; if (!_has(lc, "return")) return m[13][1]; },
    14: (c, lc) => { if (!_has(lc, "def ")) return m[14][0]; if (!/def\s+greet\s*\(/.test(c)) return m[14][1]; if (!_has(lc, "return")) return m[14][2]; },
    15: (c, _lc) => { if (!_has(c, "[") || !_has(c, "]")) return m[15][0]; },
    16: (c, lc) => { if (!_has(lc, "append")) return m[16][0]; if (!_has(lc, "len(")) return m[16][1]; },
    17: (c, lc) => { if ((!_has(c, "{") || !_has(c, "}")) && !_has(lc, "dict(")) return m[17][0]; },
    18: (c, lc) => { if (!_has(lc, ".items()")) return m[18][0]; if (!_has(lc, "for ")) return m[18][1]; },
    19: (c, lc) => { if (!_has(lc, "while") || !_has(lc, "input(") || !_has(lc, "append")) return m[19][0]; },
    20: (c, lc) => { if (!_has(lc, "open(")) return m[20][0]; },
    21: (c, lc) => { if (!_has(lc, "try") || !_has(lc, "except")) return m[21][0]; },
    22: (c, lc) => { if (!_has(lc, "class ")) return m[22][0]; if (!_has(lc, "__init__")) return m[22][1]; if (!_has(lc, "self")) return m[22][2]; },
    23: (c, lc) => { if (!_has(lc, "import json")) return m[23][0]; if (!_has(lc, "json.dumps") || !_has(lc, "json.loads")) return m[23][1]; },
    24: (c, lc) => { if (!_has(lc, "import math")) return m[24][0]; if (!_has(lc, "def ")) return m[24][1]; if (!_has(lc, "math.pi")) return m[24][2]; },
    25: (c, lc) => { if (!_has(lc, "def ")) return m[25][0]; if (!_has(lc, "sum(") || !_has(lc, "len(")) return m[25][1]; },
    26: (c, _lc) => { if (!/\[.+for .+ in .+\]/.test(c)) return m[26][0]; },
    27: (c, lc) => { if (!_has(lc, ".split(") || !_has(lc, ".join(")) return m[27][0]; },
    28: (c, lc) => { if (!_has(lc, 'f"') && !_has(lc, "f'")) return m[28][0]; },
    29: (c, lc) => { if (!_has(lc, "lambda")) return m[29][0]; if (!_has(lc, "map(")) return m[29][1]; },
    30: (c, lc) => { if (!_has(lc, "for ")) return m[30][0]; if (!_has(lc, "if ")) return m[30][1]; },
  };
}

// Common mistakes per level - targeted hints for frequent beginner errors
const COMMON_MISTAKES = {
  en: {
    1: [
      [/print\s*[^(]/, "Don't forget the parentheses: print(...)"],
      [/Print\(/, "Python is case-sensitive - use lowercase print()"],
      [/hello, world/i, "Check capitalization - it should be exactly: Hello, World!"],
      [/Hello World/, "Don't forget the comma: Hello, World!"],
    ],
    2: [
      [/print\s*\(\s*["']Alice["']\s*\)/, "Don't hardcode the string - use print(name) to print the variable"],
    ],
    3: [
      [/print\s*\(\s*name\s*\+\s*" is "\s*\+\s*age\s*\)/, "age is an integer - use str(age) to convert it first"],
    ],
    5: [
      [/score\s*==\s*70/, "Use >= (greater than or equal) not == (equals)"],
      [/Pass|Fail/, 'Use lowercase "pass" and "fail"'],
    ],
    7: [
      [/range\s*\(\s*4\s*\)/, "range(4) only goes 0-3. Use range(5) for 0-4"],
      [/range\s*\(\s*1\s*,\s*5\s*\)/, "range(1,5) starts at 1, but the task asks for 0-4. Use range(5)"],
    ],
    8: [
      [/while .+:[\s\S]*(?!count|i|n|num|x|c)\s*[+=]/, "Make sure you increment your counter inside the while loop!"],
      [/while\s+True/, "Use a condition like 'while count <= 5' instead of 'while True' for this level"],
    ],
    10: [
      [/range\s*\(\s*5\s*\)/, "range(5) gives 0-4. Use range(1, 6) to get 1-5"],
    ],
    11: [
      [/\/\//, "Use / for regular division (gives float), not // (integer division)"],
    ],
    26: [
      [/for .+ in range\(5\)/, "range(5) starts at 0. Use range(1, 6) to get 1-5"],
    ],
  },
  ko: {
    1: [
      [/print\s*[^(]/, "괄호를 잊지 마세요: print(...)"],
      [/Print\(/, "Python은 대소문자를 구분합니다 - 소문자 print()를 사용하세요"],
    ],
    8: [
      [/while .+:[\s\S]*(?!count|i|n|num|x|c)\s*[+=]/, "while 루프 안에서 카운터를 증가시키세요!"],
    ],
  },
};

async function evaluateOffline(userCode, level, lang) {
  const _t = (key) => STRINGS[lang]?.[key] || STRINGS.en[key] || key;
  const code = userCode.trim();
  if (!code || code === level.starterCode.trim()) return _fail(_t("writeCodeFirst"));

  // Step 1: Check construct requirements (does the code use the right concept?)
  const checks = _getChecks(lang);
  const check = checks[level.id];
  const lc = code.toLowerCase();
  const checkErr = check ? check(code, lc) : null;
  if (checkErr) {
    return _fail(checkErr);
  }

  // Step 2: Actually run the code with Pyodide
  try {
    const result = await runPython(code, level.simulatedInput || "");
    if (!result.success) {
      // Check for common mistakes to give better error hints
      const mistakes = (COMMON_MISTAKES[lang] || COMMON_MISTAKES.en)[level.id] || COMMON_MISTAKES.en[level.id] || [];
      for (const [pattern, hint] of mistakes) {
        if (pattern.test(code)) {
          return { correct: false, feedback: `${_t("offlinePyError")}${result.error}\n\n${_t("hint")}: ${hint}`, explanation: "" };
        }
      }
      return { correct: false, feedback: `${_t("offlinePyError")}${result.error}`, explanation: "" };
    }

    const actual = result.output.trim();
    const expected = level.expectedOutput.trim();

    // Exact match - perfect
    if (actual === expected) {
      return { correct: true, feedback: _t("offlineCorrect"), explanation: "" };
    }

    // Normalized match - accept minor whitespace differences
    const normalizeWs = (s) => s.replace(/\s+$/gm, "").replace(/\n+$/, "");
    if (normalizeWs(actual) === normalizeWs(expected)) {
      return { correct: true, feedback: _t("offlineCorrect"), explanation: "" };
    }

    // Check common mistakes for targeted hints
    const mistakes = (COMMON_MISTAKES[lang] || COMMON_MISTAKES.en)[level.id] || COMMON_MISTAKES.en[level.id] || [];
    for (const [pattern, hint] of mistakes) {
      if (pattern.test(code)) {
        return {
          correct: false,
          feedback: buildMismatchFeedback({
            actual,
            expected,
            sampleInput: level.simulatedInput || "",
            t: _t,
            prefix: `${_t("offlineAlmostRight")}${hint}`,
          }),
          explanation: ""
        };
      }
    }

    // Partial credit - concept is right but output is wrong
    const diff = buildDiffFeedback(actual, expected, _t);
    if (diff) {
      return {
        correct: false,
        feedback: buildMismatchFeedback({
          actual,
          expected,
          sampleInput: level.simulatedInput || "",
          t: _t,
          prefix: _t("offlineConceptOk"),
        }),
        explanation: ""
      };
    }

    // Fallback - generic wrong output
    return {
      correct: false,
      feedback: buildMismatchFeedback({
        actual,
        expected,
        sampleInput: level.simulatedInput || "",
        t: _t,
        prefix: _t("offlineWrongOutput").replace("{actual}", actual).replace("{expected}", expected),
      }),
      explanation: ""
    };
  } catch {
    return { correct: false, feedback: _t("offlineRunError"), explanation: "" };
  }
}

// ─── PYTHON SYNTAX HIGHLIGHTER ───
const PY_KEYWORDS = new Set(["def","class","if","elif","else","for","while","return","import","from","as","try","except","finally","with","in","not","and","or","is","True","False","None","break","continue","pass","raise","yield","lambda","global","nonlocal","assert","del"]);
const PY_BUILTINS = new Set(["print","input","len","range","int","str","float","list","dict","set","tuple","type","sum","min","max","abs","round","sorted","enumerate","zip","map","filter","open","isinstance","bool","super","property","staticmethod","classmethod","hasattr","getattr","setattr"]);

function highlightPython(code) {
  const tokens = [];
  const regex = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?''')|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+\.?\d*\b)|(\b[a-zA-Z_]\w*\b)/gm;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(code)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: code.slice(lastIndex, match.index), color: null });
    }
    if (match[1]) { // comment
      tokens.push({ text: match[0], color: C.syntaxComment });
    } else if (match[2] || match[3]) { // string
      tokens.push({ text: match[0], color: C.syntaxString });
    } else if (match[4]) { // number
      tokens.push({ text: match[0], color: C.syntaxNumber });
    } else if (match[5]) { // identifier
      const word = match[0];
      if (PY_KEYWORDS.has(word)) {
        tokens.push({ text: word, color: C.syntaxKeyword });
      } else if (PY_BUILTINS.has(word)) {
        tokens.push({ text: word, color: C.syntaxBuiltin });
      } else {
        // Check if it's a function call (followed by parenthesis)
        const rest = code.slice(match.index + word.length);
        if (/^\s*\(/.test(rest)) {
          tokens.push({ text: word, color: C.syntaxFunction });
        } else {
          tokens.push({ text: word, color: C.codeText });
        }
      }
    } else {
      tokens.push({ text: match[0], color: null });
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < code.length) {
    tokens.push({ text: code.slice(lastIndex), color: null });
  }
  return tokens;
}

function decodeBase64Utf8(value) {
  const binary = window.atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

function getQaConfig() {
  if (typeof window === "undefined") return null;
  const isLocalQaHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (!import.meta.env.DEV && !isLocalQaHost) return null;
  const params = new URLSearchParams(window.location.search);
  if (!params.has("qa")) return null;

  const parseList = (value) => (value || "")
    .split(",")
    .map(v => Number(v.trim()))
    .filter(v => Number.isFinite(v) && v > 0);

  let code = "";
  const codeB64 = params.get("qaCodeB64");
  if (codeB64) {
    try {
      code = decodeBase64Utf8(codeB64);
    } catch {
      code = "";
    }
  }

  const levelId = Number(params.get("qaLevel"));
  return {
    enabled: true,
    levelId: Number.isFinite(levelId) ? levelId : null,
    lang: params.get("qaLang") || null,
    offline: params.get("qaOffline") === "1",
    skipWelcome: params.get("qaSkipWelcome") !== "0",
    autoRun: params.get("qaAutoRun") === "1",
    code,
    completedLevels: parseList(params.get("qaCompleted")),
  };
}

// ─── MAIN APP ───
export default function PyithonApp() {
  const qaConfigRef = useRef(getQaConfig());
  const qaAutorunRef = useRef(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [code, setCode] = useState(LEVELS[0].starterCode);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [completedLevels, setCompletedLevels] = useState(() => new Set());
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [totalXP, setTotalXP] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeEditor, setShakeEditor] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiKey, setApiKey] = useState(() => loadStoredApiKey(loadStoredProvider()));
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [offlineMode, setOfflineMode] = useState(() => safeLocalStorageGet("pyithon-offline") === "true");
  const [pyodideStatus, setPyodideStatus] = useState("idle"); // idle, loading, ready, error
  const [themeKey, setThemeKey] = useState(() => {
    const stored = safeLocalStorageGet("pyithon-theme");
    if (stored && THEMES[stored]) return stored;
    return stored === "light" ? "light" : "dark";
  });
  const darkMode = THEMES[themeKey].palette.scheme === "dark";
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
  const taskCardRef = useRef(null);
  const audioCtxRef = useRef(null);
  const offlineFallbackToastTimerRef = useRef(null);
  const [tab, setTab] = useState("editor");
  const [isWide, setIsWide] = useState(window.innerWidth >= 900);
  const [isCompactHeader, setIsCompactHeader] = useState(window.innerWidth < 560);
  const [isCompactMobile, setIsCompactMobile] = useState(window.innerWidth < 430);
  const [conceptCollapsed, setConceptCollapsed] = useState(false);
  const [levelTransition, setLevelTransition] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => safeLocalStorageGet("pyithon-sound") === "true");
  const [typedChars, setTypedChars] = useState(0);
  const [editorGlow, setEditorGlow] = useState(false);
  const [showXPFloat, setShowXPFloat] = useState(false);
  const [lang, setLang] = useState(() => safeLocalStorageGet("pyithon-lang", "en") || "en");
  const [provider, setProvider] = useState(loadStoredProvider);
  const [statusToast, setStatusToast] = useState("");

  const t = useCallback((key) => STRINGS[lang]?.[key] || STRINGS.en[key] || key, [lang]);
  const isUsingLocalFeedback = offlineMode || !apiKey;

  const level = LEVELS[currentLevel];
  const levelT = getLocalizedLevel(level, lang);
  const formattedHint = formatHintText(levelT.hint);
  const unlockedUpTo = Math.max(...completedLevels, 0) + 1;
  const progressPercent = (completedLevels.size / LEVELS.length) * 100;
  const phaseColors = getPhaseColors(C);

  useEffect(() => {
    const saved = loadProgress();
    const qaConfig = qaConfigRef.current;
    if (qaConfig?.enabled) {
      if (qaConfig.completedLevels.length) setCompletedLevels(new Set(qaConfig.completedLevels));
      if (qaConfig.levelId) {
        const levelIndex = LEVELS.findIndex(l => l.id === qaConfig.levelId);
        if (levelIndex >= 0) setCurrentLevel(levelIndex);
      }
      if (qaConfig.lang && STRINGS[qaConfig.lang]) setLang(qaConfig.lang);
      if (qaConfig.offline) setOfflineMode(true);
      if (qaConfig.skipWelcome) setShowWelcome(false);
      return;
    }
    if (saved) {
      if (saved.completedLevels) setCompletedLevels(new Set(saved.completedLevels));
      if (saved.currentLevel !== undefined) setCurrentLevel(saved.currentLevel);
      if (saved.streak !== undefined) setStreak(saved.streak);
      if (saved.bestStreak !== undefined) setBestStreak(saved.bestStreak);
      if (saved.totalXP !== undefined) setTotalXP(saved.totalXP);
      setShowWelcome(false);
    }
  }, []);

  useEffect(() => {
    saveProgress({ completedLevels: [...completedLevels], currentLevel, streak, bestStreak, totalXP });
  }, [completedLevels, currentLevel, streak, bestStreak, totalXP]);

  useEffect(() => {
    setCode(LEVELS[currentLevel].starterCode);
    setFeedback(null); setShowHint(false); setTab("editor");
    setLevelTransition(true);
    const t = setTimeout(() => setLevelTransition(false), 400);
    return () => clearTimeout(t);
  }, [currentLevel]);

  useEffect(() => {
    const qaConfig = qaConfigRef.current;
    if (!qaConfig?.enabled) return;
    if (!qaConfig.code) return;
    const current = LEVELS[currentLevel];
    if (qaConfig.levelId && current.id !== qaConfig.levelId) return;
    setCode(qaConfig.code);
  }, [currentLevel]);

  useEffect(() => {
    const onResize = () => {
      setIsWide(window.innerWidth >= 900);
      setIsCompactHeader(window.innerWidth < 560);
      setIsCompactMobile(window.innerWidth < 430);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Theme + preferences sync
  Object.assign(C, THEMES[themeKey].palette);
  useEffect(() => { safeLocalStorageSet("pyithon-sound", String(soundEnabled)); }, [soundEnabled]);
  useEffect(() => { safeLocalStorageSet("pyithon-offline", String(offlineMode)); }, [offlineMode]);
  // Preload Pyodide when offline mode is enabled or on first submit
  useEffect(() => {
    if (offlineMode && pyodideStatus === "idle") {
      setPyodideStatus("loading");
      loadPyodideRuntime().then(() => setPyodideStatus("ready")).catch(() => setPyodideStatus("error"));
    }
  }, [offlineMode, pyodideStatus]);
  useEffect(() => { safeLocalStorageSet("pyithon-theme", themeKey); }, [themeKey]);
  useEffect(() => { safeLocalStorageSet("pyithon-lang", lang); }, [lang]);
  useEffect(() => { safeLocalStorageSet("pyithon-provider", provider); }, [provider]);
  useEffect(() => {
    setApiKey(loadStoredApiKey(provider));
    setApiKeyInput("");
  }, [provider]);

  // Welcome typing animation
  const tagline = t("tagline");
  useEffect(() => {
    if (!showWelcome) return;
    if (typedChars >= tagline.length) return;
    const timer = setInterval(() => setTypedChars(c => { if (c >= tagline.length) { clearInterval(timer); return c; } return c + 1; }), 45);
    return () => clearInterval(timer);
  }, [showWelcome, typedChars, tagline]);
  // Reset typing animation when language changes
  useEffect(() => { setTypedChars(0); }, [lang]);
  useEffect(() => {
    return () => {
      if (offlineFallbackToastTimerRef.current) clearTimeout(offlineFallbackToastTimerRef.current);
    };
  }, []);

  // Sound helper
  const playTone = useCallback((frequency, duration, type = "sine", volume = 0.12) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + duration);
    } catch {}
  }, [soundEnabled]);

  const isMac = typeof navigator !== "undefined" && /Mac/.test(navigator.platform);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      safeLocalStorageSet(getApiKeyStorageKey(provider), apiKeyInput.trim());
      setShowApiSetup(false);
    }
  };

  const showStatusToast = useCallback((message, sessionKey) => {
    if (sessionKey && safeSessionStorageGet(sessionKey) === "true") return;
    if (sessionKey) safeSessionStorageSet(sessionKey, "true");
    setStatusToast(message);
    if (offlineFallbackToastTimerRef.current) clearTimeout(offlineFallbackToastTimerRef.current);
    offlineFallbackToastTimerRef.current = setTimeout(() => {
      setStatusToast("");
      offlineFallbackToastTimerRef.current = null;
    }, 4000);
  }, []);

  const showOfflineFallbackNotice = useCallback(() => {
    showStatusToast(t("offlineFallback"), OFFLINE_FALLBACK_NOTICE_SESSION_KEY);
  }, [showStatusToast, t]);

  const showLocalFallbackNotice = useCallback(() => {
    showStatusToast(t("localFallbackNotice"), LOCAL_FALLBACK_NOTICE_SESSION_KEY);
  }, [showStatusToast, t]);

  const handleScrollToTask = useCallback(() => {
    editorRef.current?.blur?.();
    taskCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleScrollToEditor = useCallback(() => {
    setTab("editor");
    setTimeout(() => {
      editorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      editorRef.current?.focus();
    }, 60);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isEvaluating) return;
    const useOffline = isUsingLocalFeedback;
    if (!offlineMode && !apiKey) {
      showOfflineFallbackNotice();
    }
    const userCode = code.trim();
    if (!userCode || userCode === level.starterCode.trim()) {
      setFeedback({ correct: false, message: t("writeCodeFirst"), expected: level.expectedOutput });
      setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
      playTone(330, 0.15, "triangle");
      return;
    }
    const expected = level.expectedOutput.trim();
    const localModeMessage = !offlineMode && apiKey ? t("localFallbackNotice") : t("offlineFallback");
    setIsEvaluating(true); setFeedback(null); setTab("output");
    try {
      let result;
      let feedbackSource = useOffline ? "local" : "provider";
      let sourceMessage = useOffline ? localModeMessage : "";
      if (useOffline) {
        result = await evaluateOffline(userCode, level, lang);
      } else {
        const aiResult = await evaluateWithAI(userCode, level, apiKey, lang, provider);
        if (aiResult.fallbackToLocal) {
          showLocalFallbackNotice();
          result = await evaluateOffline(userCode, level, lang);
          feedbackSource = "local";
          sourceMessage = aiResult.feedback || t("localFallbackNotice");
        } else {
          result = aiResult;
        }
      }
      if (result.correct) {
        setFeedback({ correct: true, message: result.feedback || t("correct"), expected, aiExplanation: result.explanation, source: feedbackSource, sourceMessage });
        const isNew = !completedLevels.has(level.id);
        if (isNew) {
          const nc = new Set(completedLevels); nc.add(level.id); setCompletedLevels(nc);
          setTotalXP(prev => prev + 100);
          setShowXPFloat(true); setTimeout(() => setShowXPFloat(false), 1500);
        }
        setStreak(prev => { const n = prev + 1; if (n > bestStreak) setBestStreak(n); return n; });
        setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000);
        setEditorGlow(true); setTimeout(() => setEditorGlow(false), 1500);
        playTone(523.25, 0.1); setTimeout(() => playTone(659.25, 0.1), 100); setTimeout(() => playTone(783.99, 0.15), 200);
      } else {
        setFeedback({ correct: false, message: result.feedback || t("notQuite"), expected, aiExplanation: result.explanation, source: feedbackSource, sourceMessage });
        setStreak(0); setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
        playTone(330, 0.15, "triangle");
      }
    } catch (err) {
      setFeedback({ correct: false, message: `${t("generalError")}: ${err.message}`, expected });
    } finally { setIsEvaluating(false); }
  }, [apiKey, bestStreak, code, completedLevels, isEvaluating, isUsingLocalFeedback, lang, level, offlineMode, playTone, provider, showLocalFallbackNotice, showOfflineFallbackNotice, t]);

  // Ctrl+Enter to run
  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleSubmit(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit]);

  const handleReset = () => { setCode(level.starterCode); setFeedback(null); setShowHint(false); setTab("editor"); };
  const goToLevel = (idx) => { if (idx < unlockedUpTo || completedLevels.has(LEVELS[idx].id)) { setCurrentLevel(idx); setShowLevelSelect(false); } };

  const filename = `level_${String(level.id).padStart(2, "0")}.py`;

  useEffect(() => {
    const qaConfig = qaConfigRef.current;
    if (!qaConfig?.enabled || !qaConfig.autoRun || qaAutorunRef.current) return;
    const current = LEVELS[currentLevel];
    if (qaConfig.levelId && current.id !== qaConfig.levelId) return;
    if (qaConfig.code && code !== qaConfig.code) return;
    qaAutorunRef.current = true;
    const timer = setTimeout(() => handleSubmit(), 150);
    return () => clearTimeout(timer);
  }, [currentLevel, code, handleSubmit]);

  const pageStyle = {
    minHeight: "100vh", background: C.bg, color: C.text,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    colorScheme: C.scheme,
    backgroundImage: `radial-gradient(${C.dotGrid} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
  };
  const monoFont = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', monospace";

  // ═══ CONFETTI PARTICLES ═══
  const confettiShapes = ["circle", "rect", "diamond"];
  const confettiColors = [C.accent, C.accentLight, C.green, C.amber, "#ec4899", "#38bdf8", "#c084fc"];
  const confettiParticles = Array.from({ length: 80 }).map((_, i) => {
    const shape = confettiShapes[i % confettiShapes.length];
    const color = confettiColors[i % confettiColors.length];
    const size = 4 + Math.random() * 12;
    const left = Math.random() * 100;
    const delay = Math.random() * 1;
    const duration = 1.8 + Math.random() * 1.8;
    const drift = (Math.random() - 0.5) * 300;
    const rotation = Math.random() * 1080;
    return { shape, color, size, left, delay, duration, drift, rotation, key: i };
  });

  if (showApiSetup) {
    return createElement(SettingsPanel, {
      apiKey,
      apiKeyInput,
      C,
      darkMode,
      handleSaveApiKey,
      lang,
      monoFont,
      offlineMode,
      pageStyle,
      provider,
      pyodideStatus,
      setApiKeyInput,
      setLang,
      setOfflineMode,
      setProvider,
      setShowApiSetup,
      setThemeKey,
      t,
      themeKey,
    });
  }

  // ═══ RENDER: WELCOME ═══
  if (showWelcome) {
    return createElement(WelcomeScreen, {
      C,
      monoFont,
      onConfigureApiKey: () => {
        setShowWelcome(false);
        setShowApiSetup(true);
      },
      onStartLearning: () => setShowWelcome(false),
      pageStyle,
      t,
      tagline,
      typedChars,
    });
  }

  // ═══ RENDER: LEVEL SELECT ═══
  if (showLevelSelect) {
    return createElement(LevelSelectScreen, {
      C,
      completedLevels,
      currentLevel,
      goToLevel,
      lang,
      pageStyle,
      phaseColors,
      progressPercent,
      setShowLevelSelect,
      t,
      unlockedUpTo,
    });
  }

  const syntaxTokens = highlightPython(code);
  const totalLevels = LEVELS.length;

  // ═══ RENDER: MAIN GAME ═══
  return (
    <div style={{ ...pageStyle, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", height: "100vh" }}>
      {/* Confetti */}
      {showConfetti && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
        {confettiParticles.map(p => (
          <div key={p.key} style={{
            position: "absolute",
            width: p.shape === "rect" ? p.size * 0.6 : p.size,
            height: p.size,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "diamond" ? "2px" : "1px",
            left: `${p.left}%`, top: "-3%",
            backgroundColor: p.color,
            transform: p.shape === "diamond" ? "rotate(45deg)" : "none",
            animation: `confettiFall ${p.duration}s cubic-bezier(0.25,0.46,0.45,0.94) forwards`,
            animationDelay: `${p.delay}s`,
            opacity: 0.9,
            ["--drift"]: `${p.drift}px`,
            ["--rotation"]: `${p.rotation}deg`,
          }} />
        ))}
      </div>}

      {createElement(GameHeader, {
        C,
        completedCount: completedLevels.size,
        isCompactHeader,
        isCompactMobile,
        isWide,
        levelId: level.id,
        onOpenLevelSelect: () => setShowLevelSelect(true),
        onOpenSettings: () => setShowApiSetup(true),
        onToggleSound: () => setSoundEnabled((prev) => !prev),
        progressPercent,
        showOfflineBadge: isUsingLocalFeedback,
        showXPFloat,
        soundEnabled,
        streak,
        t,
        totalLevels,
        totalXP,
      })}

      <div style={{
        flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "auto",
        animation: levelTransition ? "levelEnter 0.4s ease-out" : "none",
      }}>
        {createElement(LevelInfoPanel, {
          C,
          conceptCollapsed,
          formattedHint,
          isCompactMobile,
          level,
          levelT,
          monoFont,
          onScrollToEditor: handleScrollToEditor,
          onToggleHint: () => setShowHint((prev) => !prev),
          onToggleConcept: () => setConceptCollapsed((prev) => !prev),
          phaseColors,
          showHint,
          taskCardRef,
          t,
        })}

        {createElement(WorkspacePanel, {
          C,
          code,
          editorGlow,
          editorRef,
          feedback,
          filename,
          formattedHint,
          highlightRef,
          isCompactMobile,
          isEvaluating,
          isWide,
          level,
          levelT,
          monoFont,
          provider,
          setCode,
          setFeedback,
          setTab,
          shakeEditor,
          showHint,
          syntaxTokens,
          t,
          tab,
        })}
      </div>

      {createElement(ActionBar, {
        C,
        currentLevel,
        feedback,
        handleReset,
        handleSubmit,
        isCompactMobile,
        isEvaluating,
        isMac,
        onGoNextLevel: () => setCurrentLevel((prev) => Math.min(prev + 1, totalLevels - 1)),
        onScrollToTask: handleScrollToTask,
        onToggleHint: () => setShowHint((prev) => !prev),
        showHint,
        t,
        totalLevels,
      })}
      {statusToast && (
        <div data-testid="status-toast" style={{
          position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
          background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: "10px 20px", fontSize: 13, color: C.textDim, fontWeight: 500,
          boxShadow: `0 8px 32px rgba(0,0,0,0.3)`, zIndex: 9999,
          animation: "fadeSlideUp 0.3s ease-out",
          whiteSpace: "normal",
          maxWidth: "min(92vw, 480px)",
          textAlign: "center",
        }}>
          {statusToast}
        </div>
      )}
      <footer style={{
        textAlign: "center", padding: "16px 20px", fontSize: 12,
        color: C.textDim, borderTop: `1px solid ${C.border}`,
        flexShrink: 0,
      }}>
        &copy; 2026 Pyithon - an educational project by Edward Yi
      </footer>
      <style>{getGlobalStyles(C)}</style>
    </div>
  );
}


