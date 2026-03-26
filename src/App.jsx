import { useState, useEffect, useRef, useCallback } from "react";

// ─── COLOR PALETTES ───
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
  // Light mode button text on gradient backgrounds should be white
  btnText: "#ffffff",
};

// Mutable theme reference — updated by component
let C = { ...DARK };

// ─── TRANSLATIONS ───
const STRINGS = {
  en: {
    levels: "Levels",
    allLevels: "All Levels",
    phase: "Phase",
    day: "Day",
    concept: "Concept",
    task: "Task",
    hint: "Hint",
    hideHint: "Hide Hint",
    reset: "Reset",
    runCode: "Run Code",
    evaluating: "Evaluating...",
    next: "Next",
    tryAgain: "Try Again",
    correct: "Correct!",
    notQuite: "Not quite",
    expectedOutput: "Expected Output",
    boss: "BOSS",
    editor: "Editor",
    output: "Output",
    runToSee: "Run your code to see output",
    writeCodeFirst: "Write some code first!",
    claudeEvaluating: "Claude is evaluating...",
    isEvaluatingMsg: "is evaluating...",
    provider: "AI Provider",
    providerDesc: "Select AI evaluator",
    startLearning: "Start Learning",
    configureApiKey: "Configure API Key",
    tagline: "Master Python from scratch.\nNo AI. No autocomplete. Just you.",
    subtitle: "30 levels \u00b7 3 phases \u00b7 Local Edition",
    settings: "Settings",
    darkMode: "Dark",
    lightMode: "Light",
    modeSuffix: "Mode",
    switchAppearance: "Switch appearance",
    offlineMode: "Offline Mode",
    offlineDesc: "Runs Python in your browser",
    onlineDesc: "AI evaluates your code",
    loading: "loading...",
    ready: "ready",
    apiKey: "API Key",
    apiKeyDesc: "Get a key at",
    saveKey: "Save Key",
    language: "Language",
    langDesc: "Interface language",
    python3: "Python 3",
    xp: "XP",
    phaseName1: "Foundations",
    phaseName2: "Real Skills",
    phaseName3: "Beyond",
  },
  ko: {
    levels: "\ub808\ubca8",
    allLevels: "\ubaa8\ub4e0 \ub808\ubca8",
    phase: "\ub2e8\uacc4",
    day: "\uc77c\ucc28",
    concept: "\uac1c\ub150",
    task: "\uacfc\uc81c",
    hint: "\ud78c\ud2b8",
    hideHint: "\ud78c\ud2b8 \uc228\uae30\uae30",
    reset: "\ucd08\uae30\ud654",
    runCode: "\ucf54\ub4dc \uc2e4\ud589",
    evaluating: "\ud3c9\uac00 \uc911...",
    next: "\ub2e4\uc74c",
    tryAgain: "\ub2e4\uc2dc \uc2dc\ub3c4",
    correct: "\uc815\ub2f5!",
    notQuite: "\uc544\uc26c\uc6cc\uc694",
    expectedOutput: "\uc608\uc0c1 \ucd9c\ub825",
    boss: "\ubcf4\uc2a4",
    editor: "\uc5d0\ub514\ud130",
    output: "\ucd9c\ub825",
    runToSee: "\ucf54\ub4dc\ub97c \uc2e4\ud589\ud558\uba74 \uacb0\uacfc\uac00 \uc5ec\uae30\uc5d0 \ud45c\uc2dc\ub429\ub2c8\ub2e4",
    writeCodeFirst: "\uba3c\uc800 \ucf54\ub4dc\ub97c \uc791\uc131\ud558\uc138\uc694!",
    claudeEvaluating: "Claude\uac00 \ud3c9\uac00 \uc911\uc785\ub2c8\ub2e4...",
    isEvaluatingMsg: "\uac00 \ud3c9\uac00 \uc911\uc785\ub2c8\ub2e4...",
    provider: "AI \uc81c\uacf5\uc790",
    providerDesc: "AI \ud3c9\uac00\uae30 \uc120\ud0dd",
    startLearning: "\ud559\uc2b5 \uc2dc\uc791",
    configureApiKey: "API \ud0a4 \uc124\uc815",
    tagline: "\ud30c\uc774\uc36c\uc744 \ucc98\uc74c\ubd80\ud130 \ub9c8\uc2a4\ud130\ud558\uc138\uc694.\nAI \uc5c6\uc774. \uc790\ub3d9\uc644\uc131 \uc5c6\uc774. \uc624\uc9c1 \ub2f9\uc2e0\uc758 \ud798\uc73c\ub85c.",
    subtitle: "30 \ub808\ubca8 \u00b7 3 \ub2e8\uacc4 \u00b7 \ub85c\uceec \uc5d0\ub514\uc158",
    settings: "\uc124\uc815",
    darkMode: "\ub2e4\ud06c",
    lightMode: "\ub77c\uc774\ud2b8",
    modeSuffix: "\ubaa8\ub4dc",
    switchAppearance: "\ud14c\ub9c8 \ubcc0\uacbd",
    offlineMode: "\uc624\ud504\ub77c\uc778 \ubaa8\ub4dc",
    offlineDesc: "\ube0c\ub77c\uc6b0\uc800\uc5d0\uc11c Python \uc2e4\ud589",
    onlineDesc: "AI\uac00 \ucf54\ub4dc\ub97c \ud3c9\uac00\ud569\ub2c8\ub2e4",
    loading: "\ub85c\ub529 \uc911...",
    ready: "\uc900\ube44 \uc644\ub8cc",
    apiKey: "API \ud0a4",
    apiKeyDesc: "\ud0a4 \ubc1c\uae09:",
    saveKey: "\ud0a4 \uc800\uc7a5",
    language: "\uc5b8\uc5b4",
    langDesc: "\uc778\ud130\ud398\uc774\uc2a4 \uc5b8\uc5b4",
    python3: "Python 3",
    xp: "XP",
    phaseName1: "\uae30\ucd08",
    phaseName2: "\uc2e4\uc804 \uc2a4\ud0ac",
    phaseName3: "\uadf8 \ub108\uba38",
  }
};

// ─── AI PROVIDER CONFIGURATIONS ───
const AI_PROVIDERS = {
  claude: {
    name: "Claude",
    endpoint: "/api/claude/v1/messages",
    model: "claude-sonnet-4-20250514",
    keyPrefix: "sk-ant-",
    keyPlaceholder: "sk-ant-...",
    keyUrl: "console.anthropic.com",
  },
  openai: {
    name: "OpenAI",
    endpoint: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4o-mini",
    keyPrefix: "sk-",
    keyPlaceholder: "sk-...",
    keyUrl: "platform.openai.com",
  },
  gemini: {
    name: "Gemini",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    model: "gemini-2.0-flash",
    keyPrefix: "AI",
    keyPlaceholder: "AIza...",
    keyUrl: "aistudio.google.com",
  },
};

// ─── PYODIDE PYTHON RUNTIME ───
let _pyodide = null;
let _pyodideLoading = false;
let _pyodideReady = false;
const _pyodideCallbacks = [];

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
    pyodide.runPython(code);
    const output = pyodide.runPython("_captured_output.getvalue()");
    // Reset stdout
    pyodide.runPython("sys.stdout = sys.__stdout__");
    return { success: true, output: output.trimEnd() };
  } catch (err) {
    pyodide.runPython("sys.stdout = sys.__stdout__");
    const msg = err.message || String(err);
    // Extract just the Python error line
    const lines = msg.split("\n");
    const pyErr = lines.filter(l => l.match(/Error:|error:/i)).pop() || lines[lines.length - 1] || msg;
    return { success: false, output: "", error: pyErr.trim() };
  }
}

// ─── CONSTRUCT CHECKS (ensure students use the right concept) ───
function _has(code, ...words) { const lc = code.toLowerCase(); return words.every(w => lc.includes(w)); }
function _fail(msg) { return { correct: false, feedback: msg, explanation: "" }; }

// Construct requirements per level — what concept must the code use
const CONSTRUCT_CHECKS = {
  2: (c, lc) => { if (!/name\s*=/.test(c)) return "Create a variable called 'name' using = assignment."; if (/print\s*\(\s*["']/.test(c) && !/print\s*\(\s*\w+\s*\)/.test(c.replace(/"[^"]*"|'[^']*'/g, '""'))) return "Use print(name) to print the variable, not a hardcoded string."; },
  3: (c, lc) => { if (!_has(lc, "str(") && !_has(lc, 'f"') && !_has(lc, "f'") && !_has(lc, "format")) return "Use str(), an f-string, or .format() to combine strings and numbers."; },
  4: (c, lc) => { if (!_has(lc, "input(")) return "Use input() to ask the user for their name."; },
  5: (c, lc) => { if (!_has(lc, "if ") || !_has(lc, "else")) return "Use both if and else for this task."; },
  6: (c, lc) => { if (!_has(lc, "elif")) return "Use elif for multiple conditions."; },
  7: (c, lc) => { if (!_has(lc, "for ") || !_has(lc, "range")) return "Use a for loop with range()."; },
  8: (c, lc) => { if (!_has(lc, "while ")) return "Use a while loop for this task."; },
  9: (c, lc) => { if (!_has(lc, "while ") || !_has(lc, "input(")) return "Use a while loop with input()."; },
  10: (c, lc) => { if (!_has(lc, "for ") && !_has(lc, "while ")) return "Use a loop to calculate the sum."; },
  11: (c, lc) => { if (!_has(c, "/")) return "Use / to divide for the average."; },
  12: (c, lc) => { if (!_has(lc, "while") || !_has(lc, "break")) return 'Use "while True" with "break".'; if (!_has(lc, "input(")) return "Use input() to read values."; },
  13: (c, lc) => { if (!_has(lc, "def ")) return "Define a function using def."; if (!_has(lc, "return")) return "Use return to send back the result."; },
  14: (c, lc) => { if (!_has(lc, "def ")) return "Define a function using def."; if (!/def\s+greet\s*\(/.test(c)) return 'Name your function "greet".'; if (!_has(lc, "return")) return "Use return."; },
  15: (c, lc) => { if (!_has(c, "[") || !_has(c, "]")) return "Create a list using [ ] brackets."; },
  16: (c, lc) => { if (!_has(lc, "append")) return "Use .append()."; if (!_has(lc, "len(")) return "Use len()."; },
  17: (c, lc) => { if ((!_has(c, "{") || !_has(c, "}")) && !_has(lc, "dict(")) return "Create a dictionary using { } or dict()."; },
  18: (c, lc) => { if (!_has(lc, ".items()")) return "Use .items() to loop through key-value pairs."; if (!_has(lc, "for ")) return "Use a for loop."; },
  19: (c, lc) => { if (!_has(lc, "while") || !_has(lc, "input(") || !_has(lc, "append")) return "Use a while loop with input() and .append()."; },
  20: (c, lc) => { if (!_has(lc, "open(")) return "Use open() to work with files."; },
  21: (c, lc) => { if (!_has(lc, "try") || !_has(lc, "except")) return "Use try/except to handle the error."; },
  22: (c, lc) => { if (!_has(lc, "class ")) return "Use the class keyword."; if (!_has(lc, "__init__")) return "Add an __init__ method."; if (!_has(lc, "self")) return "Use self."; },
  23: (c, lc) => { if (!_has(lc, "import json")) return "Import json first."; if (!_has(lc, "json.dumps") || !_has(lc, "json.loads")) return "Use json.dumps() and json.loads()."; },
  24: (c, lc) => { if (!_has(lc, "import math")) return "Import math."; if (!_has(lc, "def ")) return "Define a function."; if (!_has(lc, "math.pi")) return "Use math.pi."; },
  25: (c, lc) => { if (!_has(lc, "def ")) return "Define a function."; if (!_has(lc, "sum(") || !_has(lc, "len(")) return "Use sum() and len()."; },
  26: (c, lc) => { if (!/\[.+for .+ in .+\]/.test(c)) return "Use a list comprehension: [expr for x in iterable]."; },
  27: (c, lc) => { if (!_has(lc, ".split(") || !_has(lc, ".join(")) return "Use .split() and .join()."; },
  28: (c, lc) => { if (!_has(lc, 'f"') && !_has(lc, "f'")) return 'Use an f-string: f"...{variable}..."'; },
  29: (c, lc) => { if (!_has(lc, "lambda")) return "Use a lambda function."; if (!_has(lc, "map(")) return "Use map()."; },
  30: (c, lc) => { if (!_has(lc, "for ")) return "Use a for loop."; if (!_has(lc, "if ")) return "Use an if statement to filter."; },
};

async function evaluateOffline(userCode, level) {
  const code = userCode.trim();
  if (!code || code === level.starterCode.trim()) return _fail("Write some code first!");

  // Step 1: Check construct requirements (does the code use the right concept?)
  const check = CONSTRUCT_CHECKS[level.id];
  if (check) {
    const err = check(code, code.toLowerCase());
    if (err) return _fail(err);
  }

  // Step 2: Actually run the code with Pyodide
  try {
    const result = await runPython(code, level.simulatedInput || "");
    if (!result.success) {
      return { correct: false, feedback: `Python error: ${result.error}`, explanation: "" };
    }
    const actual = result.output.trim();
    const expected = level.expectedOutput.trim();
    if (actual === expected) {
      return { correct: true, feedback: "Correct! Your code runs perfectly.", explanation: "" };
    }
    // Show what they got vs what was expected
    return { correct: false, feedback: `Your code outputs "${actual}" but the expected output is "${expected}".`, explanation: "" };
  } catch (err) {
    return { correct: false, feedback: "Couldn't run your code. Try again.", explanation: "" };
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

// ─── LEVEL DATA ───
const LEVELS = [
  { id: 1, phase: 1, day: "1", title: "Hello, World!", subtitle: "Your first print statement", concept: "The print() function outputs text to the screen. Text must be wrapped in quotes.", task: 'Use print() to display exactly: Hello, World!', hint: 'Remember: print("text goes here")', starterCode: '# Your first Python program\n', expectedOutput: "Hello, World!", explanation: 'print() is Python\'s built-in function for displaying output. Strings (text) must be wrapped in quotes — single or double.', tags: ["print", "strings"] },
  { id: 2, phase: 1, day: "2", title: "Variables & Assignment", subtitle: "Storing values in named containers", concept: "Variables store data. Use = to assign a value. Python figures out the type automatically.", task: 'Create a variable called name set to "Alice", then print it.', hint: 'Two lines: assign the variable, then print(variable_name)', starterCode: '# Create a variable and print it\n', expectedOutput: "Alice", explanation: 'Variables are like labeled boxes. name = "Alice" creates a box labeled "name" containing the text "Alice".', tags: ["variables", "assignment"] },
  { id: 3, phase: 1, day: "3", title: "String Concatenation", subtitle: "Combining strings with +", concept: "The + operator joins strings together. Numbers must be converted with str() first.", task: 'Create name = "Alice" and age = 25, then print: "Alice is 25"', hint: "Use + to join strings. Remember str(age) to convert the integer!", starterCode: '# Combine strings and numbers\n', expectedOutput: "Alice is 25", explanation: 'Strings and integers can\'t be directly concatenated. str() converts a number to a string so + can join them.', tags: ["strings", "str()", "concatenation"] },
  { id: 4, phase: 1, day: "4", title: "User Input", subtitle: "Getting data from the user", concept: "input() pauses the program and waits for the user to type something. It always returns a string.", task: 'Write code that asks "What is your name? " and prints: Hello, <name>', hint: 'name = input("question") then print("Hello, " + name)', starterCode: '# Ask for input and greet the user\n', expectedOutput: "Hello, Sam", simulatedInput: "Sam", explanation: 'input("prompt") displays the prompt and waits. The returned value is always a string.', tags: ["input", "strings"] },
  { id: 5, phase: 1, day: "5", title: "If/Else Logic", subtitle: "Making decisions in code", concept: "if checks a condition. If True, the indented block runs. else runs when the condition is False.", task: 'Set score = 85. If score >= 70, print "pass". Otherwise print "fail".', hint: "if score >= 70:\\n    print(...)\\nelse:\\n    print(...)", starterCode: "# Check if the score is passing\nscore = 85\n", expectedOutput: "pass", explanation: 'if/else creates a branch — the program takes one path or the other based on the condition.', tags: ["if", "else", "comparison"] },
  { id: 6, phase: 1, day: "6", title: "Elif Chains", subtitle: "Multiple conditions", concept: "elif (else-if) lets you check additional conditions. Python checks top to bottom and runs the FIRST match.", task: 'Set grade = 82. Print "A" if >= 90, "B" if >= 80, "C" if >= 70, else "F".', hint: "if grade >= 90:\\n    ...\\nelif grade >= 80:\\n    ...\\nelif ...", starterCode: "# Grade classifier\ngrade = 82\n", expectedOutput: "B", explanation: 'elif chains check conditions in order. Once a match is found, the rest are skipped.', tags: ["elif", "conditions"] },
  { id: 7, phase: 1, day: "7", title: "For Loops", subtitle: "Repeating with range()", concept: "for i in range(n) repeats a block n times. i starts at 0 and goes to n-1.", task: "Print the numbers 0 through 4, each on a new line.", hint: "for i in range(5):\\n    print(i)", starterCode: "# Print 0 to 4\n", expectedOutput: "0\n1\n2\n3\n4", explanation: 'range(5) generates 0, 1, 2, 3, 4.', tags: ["for", "range"] },
  { id: 8, phase: 1, day: "8", title: "While Loops", subtitle: "Looping until a condition is false", concept: "while condition: keeps looping as long as the condition is True. You must change the condition inside!", task: "Use a while loop to print numbers 1 through 5.", hint: "count = 1\\nwhile count <= 5:\\n    print(count)\\n    count = count + 1", starterCode: "# Count from 1 to 5 using while\n", expectedOutput: "1\n2\n3\n4\n5", explanation: 'While loops check their condition before each iteration.', tags: ["while", "counter"] },
  { id: 9, phase: 1, day: "9", title: "Interactive Loop", subtitle: "Combining input() and while", concept: "You can use input() inside a while loop to repeatedly ask the user for data.", task: 'Ask the user for a number 3 times and print each one.', hint: "count = 0\\nwhile count < 3:\\n    num = input(...)\\n    print(num)\\n    count = count + 1", starterCode: "# Ask for 3 numbers\n", expectedOutput: "10\n20\n30", simulatedInput: "10\n20\n30", explanation: 'Combining loops with input() creates interactive programs.', tags: ["while", "input", "interactive"] },
  { id: 10, phase: 1, day: "10", title: "Running Total", subtitle: "The accumulator pattern", concept: "Start a variable at 0 before the loop. Add to it each iteration. This is the accumulator pattern.", task: "Calculate the sum of numbers 1 through 5 using a loop. Print the total.", hint: "total = 0\\nfor i in range(1, 6):\\n    total = total + i\\nprint(total)", starterCode: "# Sum 1 + 2 + 3 + 4 + 5\n", expectedOutput: "15", explanation: 'The accumulator pattern: (1) initialize total = 0, (2) loop and add, (3) use total after the loop.', tags: ["accumulator", "total", "for"] },
  { id: 11, phase: 1, day: "11", title: "Averages", subtitle: "Total divided by count", concept: "Average = total / count. The / operator returns a float (decimal).", task: "Calculate the average of 10, 20, and 30. Print the result.", hint: "total = 10 + 20 + 30\\naverage = total / 3\\nprint(average)", starterCode: "# Find the average\n", expectedOutput: "20.0", explanation: '/ always returns a float in Python 3 (20.0 not 20).', tags: ["division", "average", "float"] },
  { id: 12, phase: 1, day: "12", title: "Sentinel Loop", subtitle: 'User-controlled exit with "done"', concept: 'A sentinel loop runs until the user types a special keyword (like "done") to stop.', task: 'Read numbers from input until "done" is typed. Print the sum. Inputs: 5, 10, 15, done.', hint: 'total = 0\\nwhile True:\\n    val = input(...)\\n    if val == "done":\\n        break\\n    total = total + int(val)\\nprint(total)', starterCode: '# Sum numbers until "done"\n', expectedOutput: "30", simulatedInput: "5\n10\n15\ndone", explanation: '"while True" + "break" is the sentinel pattern.', tags: ["sentinel", "break", "while True"] },
  { id: 13, phase: 1, day: "13", title: "Functions: def & return", subtitle: "Building reusable blocks", concept: "def creates a function. return sends a value back.", task: "Write a function called double that takes a number and returns it times 2. Print double(7).", hint: "def double(n):\\n    return n * 2\\nprint(double(7))", starterCode: "# Define a function that doubles\n", expectedOutput: "14", explanation: '"def" defines, parameters go in parentheses, "return" sends back the result.', tags: ["def", "return", "functions"] },
  { id: 14, phase: 1, day: "14", title: "Multiple Parameters", subtitle: "Functions with several inputs", concept: "Functions can accept multiple parameters, separated by commas.", task: 'Write greet(name, greeting) that returns greeting + ", " + name. Print greet("Alice", "Hello").', hint: 'def greet(name, greeting):\\n    return greeting + ", " + name', starterCode: "# Function with two parameters\n", expectedOutput: "Hello, Alice", explanation: 'Parameters are variable names in the definition. Arguments are the actual values you pass in.', tags: ["parameters", "arguments", "functions"] },
  { id: 15, phase: 1, day: "15", title: "Lists: Create & Access", subtitle: "Ordered collections of items", concept: "Lists hold multiple values in order. Access items by index starting at 0.", task: 'Create fruits = ["apple", "banana", "cherry"]. Print the second item.', hint: "Index 0 is the first, index 1 is the second.", starterCode: "# Create a list and access an item\n", expectedOutput: "banana", explanation: 'Lists are indexed starting at 0.', tags: ["lists", "indexing"] },
  { id: 16, phase: 1, day: "16", title: "List Methods", subtitle: "append, pop, and len", concept: ".append(item) adds to the end. len() returns length.", task: 'Start with nums = [1, 2, 3]. Append 4, then print the length.', hint: "nums.append(4)\\nprint(len(nums))", starterCode: "# Modify a list\nnums = [1, 2, 3]\n", expectedOutput: "4", explanation: '.append() modifies the list in-place. len() is a built-in.', tags: ["append", "pop", "len", "methods"] },
  { id: 17, phase: 1, day: "17", title: "Dictionaries", subtitle: "Key-value pairs", concept: 'Dicts store key: value pairs inside {}. Access values by key name.', task: 'Create person = {"name": "Alice", "age": 25}. Print person["name"].', hint: 'Use curly braces and "key": value syntax.', starterCode: "# Create a dictionary\n", expectedOutput: "Alice", explanation: 'Dicts map keys to values. JSON is essentially nested dictionaries.', tags: ["dict", "keys", "values"] },
  { id: 18, phase: 1, day: "18", title: "Looping Through a Dict", subtitle: "Iterating keys and values", concept: ".items() returns key-value pairs you can loop over.", task: 'Create scores = {"math": 90, "science": 85}. Loop and print each like: math: 90', hint: 'for subject, score in scores.items():\\n    print(subject + ": " + str(score))', starterCode: "# Loop through a dictionary\n", expectedOutput: "math: 90\nscience: 85", explanation: '.items() unpacks each pair into two variables.', tags: ["dict", "items", "for"] },
  { id: 19, phase: 2, day: "19", title: "Mini App: To-Do List", subtitle: "Combining everything from Phase 1", concept: "A real program combines lists, loops, input, and functions.", task: 'Build a to-do app: create a list, loop to ask for tasks, append until "done", then print all tasks.', hint: 'todos = []\\nwhile True:\\n    task = input(...)\\n    if task == "done": break\\n    todos.append(task)\\nfor t in todos: print(t)', starterCode: "# Mini to-do app\n", expectedOutput: "Buy milk\nCode", simulatedInput: "Buy milk\nCode\ndone", explanation: 'Combines sentinel loops, lists, append, and iteration.', tags: ["lists", "while", "input", "mini-app"] },
  { id: 20, phase: 2, day: "20", title: "File I/O: Writing", subtitle: "Saving data to a file", concept: 'open("file", "w") creates/overwrites a file. Use "with" to auto-close.', task: 'Write "Hello from Python" to output.txt, then read it back and print the contents.', hint: 'with open("output.txt", "w") as f:\\n    f.write(...)\\nwith open("output.txt", "r") as f:\\n    print(f.read())', starterCode: "# Write to a file, then read it\n", expectedOutput: "Hello from Python", explanation: '"with" handles opening AND closing the file automatically.', tags: ["file", "open", "write", "read"] },
  { id: 21, phase: 2, day: "21", title: "Try/Except", subtitle: "Handling errors gracefully", concept: "try/except catches errors so your program doesn't crash.", task: 'Try to convert "hello" to int. Catch the ValueError and print "Not a number".', hint: 'try:\\n    int("hello")\\nexcept ValueError:\\n    print("Not a number")', starterCode: "# Handle a conversion error\n", expectedOutput: "Not a number", explanation: 'try/except wraps risky operations so errors are handled gracefully.', tags: ["try", "except", "errors"] },
  { id: 22, phase: 2, day: "22", title: "Classes: Basics", subtitle: "Creating objects with __init__", concept: "A class is a blueprint for objects. __init__ runs on creation. self refers to the instance.", task: 'Create class Dog with __init__(self, name) and bark() returning name + " says woof!". Print Dog("Rex").bark().', hint: 'class Dog:\\n    def __init__(self, name):\\n        self.name = name\\n    def bark(self):\\n        return self.name + " says woof!"', starterCode: "# Create a class\n", expectedOutput: "Rex says woof!", explanation: 'Classes organize code — __init__ for setup, methods for behavior.', tags: ["class", "__init__", "self", "methods"] },
  { id: 23, phase: 2, day: "23", title: "Working with JSON", subtitle: "Parsing and creating JSON data", concept: "The json module converts between JSON strings and Python dictionaries.", task: 'Import json. Create data = {"app": "MyApp", "version": 2}. Convert to JSON string and back, then print data["app"].', hint: 'import json\\ndata = {...}\\njson_str = json.dumps(data)\\nparsed = json.loads(json_str)\\nprint(parsed["app"])', starterCode: "# JSON round-trip\n", expectedOutput: "MyApp", explanation: 'json.dumps() = dict to string. json.loads() = string to dict.', tags: ["json", "dumps", "loads", "api"] },
  { id: 24, phase: 2, day: "24", title: "Import & Structure", subtitle: "Reading real Python code", concept: "Real Python files follow a pattern: imports at top, then definitions, then execution.", task: 'Import math, define circle_area(r) returning math.pi * r * r, print rounded to 2 decimals for r=5.', hint: 'import math\\ndef circle_area(r):\\n    return math.pi * r * r\\nprint(round(circle_area(5), 2))', starterCode: "# Module structure pattern\n", expectedOutput: "78.54", explanation: 'The standard pattern: imports at top, function definitions, then execution code.', tags: ["import", "modules", "structure"] },
  { id: 25, phase: 2, day: "25", title: "Graduation: Score Tracker", subtitle: "Combining everything you've learned", concept: "This graduation exercise ties together dicts, functions, and built-in operations.", task: 'Create scores = {"python": 85, "git": 90}. Write get_average(scores_dict) to return the average. Print rounded to 1 decimal.', hint: 'def get_average(d):\\n    return sum(d.values()) / len(d)\\nscores = {...}\\nprint(round(get_average(scores), 1))', starterCode: "# Graduation: Score calculator\n", expectedOutput: "87.5", explanation: 'Combines dicts, built-ins (sum, len, round), and custom functions.', tags: ["functions", "dict", "graduation"] },
  { id: 26, phase: 3, day: "26", title: "List Comprehensions", subtitle: "Pythonic one-liners", concept: "[expression for item in iterable] creates a new list in one line.", task: "Create a list of squares for 1-5 using a list comprehension. Print it.", hint: "squares = [x * x for x in range(1, 6)]\\nprint(squares)", starterCode: "# One-liner list creation\n", expectedOutput: "[1, 4, 9, 16, 25]", explanation: 'List comprehensions replace 4 lines of loop code with 1 elegant line.', tags: ["comprehension", "pythonic"] },
  { id: 27, phase: 3, day: "27", title: "String Methods", subtitle: "split, join, strip, replace", concept: "Strings have powerful built-in methods for manipulation.", task: 'Set text = "hello world python". Split by spaces, join with hyphens, and print the result.', hint: 'words = text.split(" ")\\nresult = "-".join(words)\\nprint(result)', starterCode: "# String manipulation\n", expectedOutput: "hello-world-python", explanation: '.split() breaks a string into a list. .join() combines a list back into a string.', tags: ["split", "join", "strings"] },
  { id: 28, phase: 3, day: "28", title: "F-Strings", subtitle: "Modern string formatting", concept: 'f"...{variable}..." embeds variables directly in strings. Much cleaner than concatenation.', task: 'Set language = "Python" and version = 3. Print: "Python version 3 is awesome!"', hint: 'print(f"{language} version {version} is awesome!")', starterCode: "# F-string formatting\n", expectedOutput: "Python version 3 is awesome!", explanation: 'F-strings (Python 3.6+) are the modern, preferred way to format strings.', tags: ["f-string", "formatting"] },
  { id: 29, phase: 3, day: "29", title: "Lambda & Map", subtitle: "Inline functions and transformations", concept: "lambda creates small anonymous functions. map() applies a function to every item in a list.", task: "Use map with a lambda to triple every number in [1, 2, 3, 4, 5]. Print the resulting list.", hint: "result = list(map(lambda x: x * 3, [1, 2, 3, 4, 5]))\\nprint(result)", starterCode: "# Lambda and map\n", expectedOutput: "[3, 6, 9, 12, 15]", explanation: 'lambda x: x * 3 is a compact one-line function.', tags: ["lambda", "map", "functional"] },
  { id: 30, phase: 3, day: "30", title: "Final Boss: Data Pipeline", subtitle: "Process, transform, and output", concept: "Real programs follow a pattern: parse input, transform data, produce output.", task: 'Given a list of student dicts (name/score), print only the names of students with scores >= 80.', hint: 'for s in students:\\n    if s["score"] >= 80:\\n        print(s["name"])', starterCode: '# Data pipeline\nstudents = [{"name": "Alice", "score": 92}, {"name": "Bob", "score": 78}, {"name": "Carol", "score": 88}]\n', expectedOutput: "Alice\nCarol", explanation: 'Iterate, filter, extract — the essence of data processing in any language.', tags: ["filter", "dicts", "lists", "pipeline", "boss"] },
];

const PHASE_NAMES = { 1: "Foundations", 2: "Real Skills", 3: "Beyond" };
const PHASE_ICONS = { 1: "01", 2: "02", 3: "03" };

const LEVELS_KO = {
  1: { title: "Hello, World!", subtitle: "\uccab \ubc88\uc9f8 print \ubb38", concept: "print() \ud568\uc218\ub294 \ud14d\uc2a4\ud2b8\ub97c \ud654\uba74\uc5d0 \ucd9c\ub825\ud569\ub2c8\ub2e4. \ud14d\uc2a4\ud2b8\ub294 \ub530\uc634\ud45c\ub85c \uac10\uc2f8\uc57c \ud569\ub2c8\ub2e4.", task: 'print()\ub97c \uc0ac\uc6a9\ud558\uc5ec \uc815\ud655\ud788 \ub2e4\uc74c\uc744 \ucd9c\ub825\ud558\uc138\uc694: Hello, World!', hint: '\uae30\uc5b5\ud558\uc138\uc694: print("\ud14d\uc2a4\ud2b8\ub97c \uc5ec\uae30\uc5d0")', explanation: 'print()\ub294 Python\uc758 \ub0b4\uc7a5 \ucd9c\ub825 \ud568\uc218\uc785\ub2c8\ub2e4. \ubb38\uc790\uc5f4(\ud14d\uc2a4\ud2b8)\uc740 \ub530\uc634\ud45c\ub85c \uac10\uc2f8\uc57c \ud569\ub2c8\ub2e4 \u2014 \uc791\uc740\ub530\uc634\ud45c\ub4e0 \ud070\ub530\uc634\ud45c\ub4e0 \uc0c1\uad00\uc5c6\uc2b5\ub2c8\ub2e4.' },
  2: { title: "\ubcc0\uc218\uc640 \ud560\ub2f9", subtitle: "\uc774\ub984\uc774 \uc788\ub294 \uc800\uc7a5 \uacf5\uac04\uc5d0 \uac12 \uc800\uc7a5\ud558\uae30", concept: "\ubcc0\uc218\ub294 \ub370\uc774\ud130\ub97c \uc800\uc7a5\ud569\ub2c8\ub2e4. =\ub97c \uc0ac\uc6a9\ud558\uc5ec \uac12\uc744 \ud560\ub2f9\ud569\ub2c8\ub2e4. Python\uc740 \uc790\ub3d9\uc73c\ub85c \ud0c0\uc785\uc744 \uacb0\uc815\ud569\ub2c8\ub2e4.", task: 'name\uc774\ub77c\ub294 \ubcc0\uc218\ub97c \ub9cc\ub4e4\uc5b4 "Alice"\ub97c \uc800\uc7a5\ud558\uace0 \ucd9c\ub825\ud558\uc138\uc694.', hint: '\ub450 \uc904: \ubcc0\uc218\uc5d0 \ud560\ub2f9\ud55c \ud6c4 print(\ubcc0\uc218\uc774\ub984)', explanation: '\ubcc0\uc218\ub294 \ub77c\ubca8\uc774 \ubd99\uc740 \uc0c1\uc790\uc640 \uac19\uc2b5\ub2c8\ub2e4. name = "Alice"\ub294 "name"\uc774\ub77c\ub294 \ub77c\ubca8\uc774 \ubd99\uc740 \uc0c1\uc790\uc5d0 "Alice"\ub77c\ub294 \ud14d\uc2a4\ud2b8\ub97c \ub2f4\ub294 \uac83\uc785\ub2c8\ub2e4.' },
  3: { title: "\ubb38\uc790\uc5f4 \uc5f0\uacb0", subtitle: "+\ub85c \ubb38\uc790\uc5f4 \ud569\uce58\uae30", concept: "+ \uc5f0\uc0b0\uc790\ub294 \ubb38\uc790\uc5f4\uc744 \ud569\uce69\ub2c8\ub2e4. \uc22b\uc790\ub294 \uba3c\uc800 str()\ub85c \ubcc0\ud658\ud574\uc57c \ud569\ub2c8\ub2e4.", task: 'name = "Alice"\uc640 age = 25\ub97c \ub9cc\ub4e4\uace0 "Alice is 25"\ub97c \ucd9c\ub825\ud558\uc138\uc694', hint: "+\ub97c \uc0ac\uc6a9\ud558\uc5ec \ubb38\uc790\uc5f4\uc744 \ud569\uce58\uc138\uc694. \uc815\uc218\ub97c \ubcc0\ud658\ud558\ub824\uba74 str(age)\ub97c \uae30\uc5b5\ud558\uc138\uc694!", explanation: '\ubb38\uc790\uc5f4\uacfc \uc815\uc218\ub294 \uc9c1\uc811 \uc5f0\uacb0\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4. str()\uc740 \uc22b\uc790\ub97c \ubb38\uc790\uc5f4\ub85c \ubcc0\ud658\ud558\uc5ec +\ub85c \ud569\uce60 \uc218 \uc788\uac8c \ud569\ub2c8\ub2e4.' },
  4: { title: "\uc0ac\uc6a9\uc790 \uc785\ub825", subtitle: "\uc0ac\uc6a9\uc790\ub85c\ubd80\ud130 \ub370\uc774\ud130 \ubc1b\uae30", concept: "input()\uc740 \ud504\ub85c\uadf8\ub7a8\uc744 \uba48\ucd94\uace0 \uc0ac\uc6a9\uc790\uac00 \uc785\ub825\ud560 \ub54c\uae4c\uc9c0 \uae30\ub2e4\ub9bd\ub2c8\ub2e4. \ud56d\uc0c1 \ubb38\uc790\uc5f4\uc744 \ubc18\ud658\ud569\ub2c8\ub2e4.", task: '"What is your name? "\uc774\ub77c\uace0 \ubb3c\uc5b4\ubcf4\uace0 Hello, <\uc774\ub984>\uc744 \ucd9c\ub825\ud558\uc138\uc694', hint: 'name = input("\uc9c8\ubb38") \ud6c4 print("Hello, " + name)', explanation: 'input("\ud504\ub86c\ud504\ud2b8")\ub294 \ud504\ub86c\ud504\ud2b8\ub97c \ud45c\uc2dc\ud558\uace0 \uae30\ub2e4\ub9bd\ub2c8\ub2e4. \ubc18\ud658\ub418\ub294 \uac12\uc740 \ud56d\uc0c1 \ubb38\uc790\uc5f4\uc785\ub2c8\ub2e4.' },
  5: { title: "If/Else \ub17c\ub9ac", subtitle: "\ucf54\ub4dc\uc5d0\uc11c \uacb0\uc815 \ub0b4\ub9ac\uae30", concept: "if\ub294 \uc870\uac74\uc744 \ud655\uc778\ud569\ub2c8\ub2e4. True\uc774\uba74 \ub4e4\uc5ec\uc4f0\uae30\ub41c \ube14\ub85d\uc774 \uc2e4\ud589\ub429\ub2c8\ub2e4. else\ub294 \uc870\uac74\uc774 False\uc77c \ub54c \uc2e4\ud589\ub429\ub2c8\ub2e4.", task: 'score = 85\ub85c \uc124\uc815\ud558\uc138\uc694. score >= 70\uc774\uba74 "pass"\ub97c, \uc544\ub2c8\uba74 "fail"\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: "if score >= 70:\\n    print(...)\\nelse:\\n    print(...)", explanation: 'if/else\ub294 \ubd84\uae30\ub97c \ub9cc\ub4ed\ub2c8\ub2e4 \u2014 \ud504\ub85c\uadf8\ub7a8\uc740 \uc870\uac74\uc5d0 \ub530\ub77c \ud55c \uacbd\ub85c\ub97c \uc120\ud0dd\ud569\ub2c8\ub2e4.' },
  6: { title: "Elif \uccb4\uc778", subtitle: "\uc5ec\ub7ec \uc870\uac74 \ucc98\ub9ac", concept: "elif(else-if)\ub294 \ucd94\uac00 \uc870\uac74\uc744 \ud655\uc778\ud569\ub2c8\ub2e4. Python\uc740 \uc704\uc5d0\uc11c \uc544\ub798\ub85c \ud655\uc778\ud558\uba70 \uccab \ubc88\uc9f8 \uc77c\uce58\ub97c \uc2e4\ud589\ud569\ub2c8\ub2e4.", task: 'grade = 82\ub85c \uc124\uc815\ud558\uc138\uc694. >= 90\uc774\uba74 "A", >= 80\uc774\uba74 "B", >= 70\uc774\uba74 "C", \uc544\ub2c8\uba74 "F"\ub97c \ucd9c\ub825\ud558\uc138\uc694.', hint: "if grade >= 90:\\n    ...\\nelif grade >= 80:\\n    ...\\nelif ...", explanation: 'elif \uccb4\uc778\uc740 \uc870\uac74\uc744 \uc21c\uc11c\ub300\ub85c \ud655\uc778\ud569\ub2c8\ub2e4. \uc77c\uce58\ud558\ub294 \uac83\uc744 \ucc3e\uc73c\uba74 \ub098\uba38\uc9c0\ub294 \uac74\ub108\ub5db\ub2c8\ub2e4.' },
  7: { title: "For \ubc18\ubcf5\ubb38", subtitle: "range()\ub85c \ubc18\ubcf5\ud558\uae30", concept: "for i in range(n)\uc740 \ube14\ub85d\uc744 n\ubc88 \ubc18\ubcf5\ud569\ub2c8\ub2e4. i\ub294 0\uc5d0\uc11c \uc2dc\uc791\ud558\uc5ec n-1\uae4c\uc9c0 \uac11\ub2c8\ub2e4.", task: "0\ubd80\ud130 4\uae4c\uc9c0\uc758 \uc22b\uc790\ub97c \ud55c \uc904\uc5d0 \ud558\ub098\uc529 \ucd9c\ub825\ud558\uc138\uc694.", hint: "for i in range(5):\\n    print(i)", explanation: 'range(5)\ub294 0, 1, 2, 3, 4\ub97c \uc0dd\uc131\ud569\ub2c8\ub2e4.' },
  8: { title: "While \ubc18\ubcf5\ubb38", subtitle: "\uc870\uac74\uc774 \uac70\uc9d3\uc774 \ub420 \ub54c\uae4c\uc9c0 \ubc18\ubcf5", concept: "while \uc870\uac74:\uc740 \uc870\uac74\uc774 True\uc778 \ub3d9\uc548 \uacc4\uc18d \ubc18\ubcf5\ud569\ub2c8\ub2e4. \ubc18\ubcf5\ubb38 \uc548\uc5d0\uc11c \uc870\uac74\uc744 \ubcc0\uacbd\ud574\uc57c \ud569\ub2c8\ub2e4!", task: "while \ubc18\ubcf5\ubb38\uc744 \uc0ac\uc6a9\ud558\uc5ec 1\ubd80\ud130 5\uae4c\uc9c0 \ucd9c\ub825\ud558\uc138\uc694.", hint: "count = 1\\nwhile count <= 5:\\n    print(count)\\n    count = count + 1", explanation: 'while \ubc18\ubcf5\ubb38\uc740 \uac01 \ubc18\ubcf5 \uc804\uc5d0 \uc870\uac74\uc744 \ud655\uc778\ud569\ub2c8\ub2e4.' },
  9: { title: "\ub300\ud654\ud615 \ubc18\ubcf5\ubb38", subtitle: "input()\uacfc while \uacb0\ud569\ud558\uae30", concept: "while \ubc18\ubcf5\ubb38 \uc548\uc5d0\uc11c input()\uc744 \uc0ac\uc6a9\ud558\uc5ec \uc0ac\uc6a9\uc790\uc5d0\uac8c \ubc18\ubcf5\uc801\uc73c\ub85c \ub370\uc774\ud130\ub97c \uc694\uccad\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", task: '\uc0ac\uc6a9\uc790\uc5d0\uac8c 3\ubc88 \uc22b\uc790\ub97c \ubb3c\uc5b4\ubcf4\uace0 \uac01\uac01 \ucd9c\ub825\ud558\uc138\uc694.', hint: "count = 0\\nwhile count < 3:\\n    num = input(...)\\n    print(num)\\n    count = count + 1", explanation: '\ubc18\ubcf5\ubb38\uacfc input()\uc744 \uacb0\ud569\ud558\uba74 \ub300\ud654\ud615 \ud504\ub85c\uadf8\ub7a8\uc744 \ub9cc\ub4e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4.' },
  10: { title: "\ub204\uc801 \ud569\uacc4", subtitle: "\ub204\uc801\uae30 \ud328\ud134", concept: "\ubc18\ubcf5\ubb38 \uc804\uc5d0 \ubcc0\uc218\ub97c 0\uc73c\ub85c \ucd08\uae30\ud654\ud558\uc138\uc694. \ub9e4 \ubc18\ubcf5\ub9c8\ub2e4 \ub354\ud558\uc138\uc694. \uc774\uac83\uc774 \ub204\uc801\uae30 \ud328\ud134\uc785\ub2c8\ub2e4.", task: "\ubc18\ubcf5\ubb38\uc744 \uc0ac\uc6a9\ud558\uc5ec 1\ubd80\ud130 5\uae4c\uc9c0\uc758 \ud569\uc744 \uacc4\uc0b0\ud558\uc138\uc694. \ud569\uacc4\ub97c \ucd9c\ub825\ud558\uc138\uc694.", hint: "total = 0\\nfor i in range(1, 6):\\n    total = total + i\\nprint(total)", explanation: '\ub204\uc801\uae30 \ud328\ud134: (1) total = 0 \ucd08\uae30\ud654, (2) \ubc18\ubcf5\ud558\uba70 \ub354\ud558\uae30, (3) \ubc18\ubcf5\ubb38 \ud6c4 total \uc0ac\uc6a9.' },
  11: { title: "\ud3c9\uade0", subtitle: "\ud569\uacc4\ub97c \uac1c\uc218\ub85c \ub098\ub204\uae30", concept: "\ud3c9\uade0 = \ud569\uacc4 / \uac1c\uc218. / \uc5f0\uc0b0\uc790\ub294 float(\uc18c\uc218)\ub97c \ubc18\ud658\ud569\ub2c8\ub2e4.", task: "10, 20, 30\uc758 \ud3c9\uade0\uc744 \uacc4\uc0b0\ud558\uc138\uc694. \uacb0\uacfc\ub97c \ucd9c\ub825\ud558\uc138\uc694.", hint: "total = 10 + 20 + 30\\naverage = total / 3\\nprint(average)", explanation: 'Python 3\uc5d0\uc11c /\ub294 \ud56d\uc0c1 float\ub97c \ubc18\ud658\ud569\ub2c8\ub2e4 (20\uc774 \uc544\ub2cc 20.0).' },
  12: { title: "\uac10\uc2dc \ubc18\ubcf5\ubb38", subtitle: '"done"\uc73c\ub85c \uc0ac\uc6a9\uc790\uac00 \uc885\ub8cc \uc81c\uc5b4', concept: '\uac10\uc2dc \ubc18\ubcf5\ubb38\uc740 \uc0ac\uc6a9\uc790\uac00 \ud2b9\ubcc4\ud55c \ud0a4\uc6cc\ub4dc(\uc608: "done")\ub97c \uc785\ub825\ud560 \ub54c\uae4c\uc9c0 \uc2e4\ud589\ub429\ub2c8\ub2e4.', task: '"done"\uc774 \uc785\ub825\ub420 \ub54c\uae4c\uc9c0 \uc22b\uc790\ub97c \uc77d\uace0 \ud569\uc744 \ucd9c\ub825\ud558\uc138\uc694. \uc785\ub825: 5, 10, 15, done.', hint: 'total = 0\\nwhile True:\\n    val = input(...)\\n    if val == "done":\\n        break\\n    total = total + int(val)\\nprint(total)', explanation: '"while True" + "break"\uac00 \uac10\uc2dc \ud328\ud134\uc785\ub2c8\ub2e4.' },
  13: { title: "\ud568\uc218: def\uc640 return", subtitle: "\uc7ac\uc0ac\uc6a9 \uac00\ub2a5\ud55c \ube14\ub85d \ub9cc\ub4e4\uae30", concept: "def\ub294 \ud568\uc218\ub97c \ub9cc\ub4ed\ub2c8\ub2e4. return\uc740 \uac12\uc744 \ub3cc\ub824\ubcf4\ub0c5\ub2c8\ub2e4.", task: "\uc22b\uc790\ub97c \ubc1b\uc544 2\ubc30\ub97c \ubc18\ud658\ud558\ub294 double \ud568\uc218\ub97c \uc791\uc131\ud558\uc138\uc694. double(7)\uc744 \ucd9c\ub825\ud558\uc138\uc694.", hint: "def double(n):\\n    return n * 2\\nprint(double(7))", explanation: '"def"\ub85c \uc815\uc758\ud558\uace0, \ub9e4\uac1c\ubcc0\uc218\ub294 \uad04\ud638 \uc548\uc5d0, "return"\uc73c\ub85c \uacb0\uacfc\ub97c \ubc18\ud658\ud569\ub2c8\ub2e4.' },
  14: { title: "\uc5ec\ub7ec \ub9e4\uac1c\ubcc0\uc218", subtitle: "\uc5ec\ub7ec \uc785\ub825\uc744 \ubc1b\ub294 \ud568\uc218", concept: "\ud568\uc218\ub294 \uc27c\ud45c\ub85c \uad6c\ubd84\ub41c \uc5ec\ub7ec \ub9e4\uac1c\ubcc0\uc218\ub97c \ubc1b\uc744 \uc218 \uc788\uc2b5\ub2c8\ub2e4.", task: 'greet(name, greeting)\uc774 greeting + ", " + name\uc744 \ubc18\ud658\ud558\ub3c4\ub85d \uc791\uc131\ud558\uc138\uc694. greet("Alice", "Hello")\ub97c \ucd9c\ub825\ud558\uc138\uc694.', hint: 'def greet(name, greeting):\\n    return greeting + ", " + name', explanation: '\ub9e4\uac1c\ubcc0\uc218\ub294 \uc815\uc758\uc5d0\uc11c\uc758 \ubcc0\uc218 \uc774\ub984\uc785\ub2c8\ub2e4. \uc778\uc218\ub294 \uc804\ub2ec\ud558\ub294 \uc2e4\uc81c \uac12\uc785\ub2c8\ub2e4.' },
  15: { title: "\ub9ac\uc2a4\ud2b8: \uc0dd\uc131\uacfc \uc811\uadfc", subtitle: "\uc21c\uc11c\uac00 \uc788\ub294 \ud56d\ubaa9 \ubaa8\uc74c", concept: "\ub9ac\uc2a4\ud2b8\ub294 \uc5ec\ub7ec \uac12\uc744 \uc21c\uc11c\ub300\ub85c \uc800\uc7a5\ud569\ub2c8\ub2e4. \uc778\ub371\uc2a4 0\ubd80\ud130 \uc2dc\uc791\ud558\uc5ec \ud56d\ubaa9\uc5d0 \uc811\uadfc\ud569\ub2c8\ub2e4.", task: 'fruits = ["apple", "banana", "cherry"]\ub97c \ub9cc\ub4dc\uc138\uc694. \ub450 \ubc88\uc9f8 \ud56d\ubaa9\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: "\uc778\ub371\uc2a4 0\uc774 \uccab \ubc88\uc9f8, \uc778\ub371\uc2a4 1\uc774 \ub450 \ubc88\uc9f8\uc785\ub2c8\ub2e4.", explanation: '\ub9ac\uc2a4\ud2b8\ub294 \uc778\ub371\uc2a4 0\ubd80\ud130 \uc2dc\uc791\ud569\ub2c8\ub2e4.' },
  16: { title: "\ub9ac\uc2a4\ud2b8 \uba54\uc11c\ub4dc", subtitle: "append, pop, len", concept: ".append(\ud56d\ubaa9)\uc740 \ub05d\uc5d0 \ucd94\uac00\ud569\ub2c8\ub2e4. len()\uc740 \uae38\uc774\ub97c \ubc18\ud658\ud569\ub2c8\ub2e4.", task: 'nums = [1, 2, 3]\uc73c\ub85c \uc2dc\uc791\ud558\uc138\uc694. 4\ub97c \ucd94\uac00\ud558\uace0 \uae38\uc774\ub97c \ucd9c\ub825\ud558\uc138\uc694.', hint: "nums.append(4)\\nprint(len(nums))", explanation: '.append()\ub294 \ub9ac\uc2a4\ud2b8\ub97c \uc9c1\uc811 \uc218\uc815\ud569\ub2c8\ub2e4. len()\uc740 \ub0b4\uc7a5 \ud568\uc218\uc785\ub2c8\ub2e4.' },
  17: { title: "\ub515\uc154\ub108\ub9ac", subtitle: "\ud0a4-\uac12 \uc30d", concept: "\ub515\uc154\ub108\ub9ac\ub294 {} \uc548\uc5d0 \ud0a4: \uac12 \uc30d\uc744 \uc800\uc7a5\ud569\ub2c8\ub2e4. \ud0a4 \uc774\ub984\uc73c\ub85c \uac12\uc5d0 \uc811\uadfc\ud569\ub2c8\ub2e4.", task: 'person = {"name": "Alice", "age": 25}\ub97c \ub9cc\ub4dc\uc138\uc694. person["name"]\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: '\uc911\uad04\ud638\uc640 "\ud0a4": \uac12 \uad6c\ubb38\uc744 \uc0ac\uc6a9\ud558\uc138\uc694.', explanation: '\ub515\uc154\ub108\ub9ac\ub294 \ud0a4\ub97c \uac12\uc5d0 \ub9e4\ud551\ud569\ub2c8\ub2e4. JSON\uc740 \ubcf8\uc9c8\uc801\uc73c\ub85c \uc911\ucca9\ub41c \ub515\uc154\ub108\ub9ac\uc785\ub2c8\ub2e4.' },
  18: { title: "\ub515\uc154\ub108\ub9ac \ubc18\ubcf5", subtitle: "\ud0a4\uc640 \uac12 \uc21c\ud68c\ud558\uae30", concept: ".items()\ub294 \ubc18\ubcf5\ud560 \uc218 \uc788\ub294 \ud0a4-\uac12 \uc30d\uc744 \ubc18\ud658\ud569\ub2c8\ub2e4.", task: 'scores = {"math": 90, "science": 85}\ub97c \ub9cc\ub4dc\uc138\uc694. \uac01\uac01 math: 90 \ud615\uc2dd\uc73c\ub85c \ucd9c\ub825\ud558\uc138\uc694', hint: 'for subject, score in scores.items():\\n    print(subject + ": " + str(score))', explanation: '.items()\ub294 \uac01 \uc30d\uc744 \ub450 \ubcc0\uc218\ub85c \ud480\uc5b4\uc90d\ub2c8\ub2e4.' },
  19: { title: "\ubbf8\ub2c8 \uc571: \ud560 \uc77c \ubaa9\ub85d", subtitle: "1\ub2e8\uacc4\uc758 \ubaa8\ub4e0 \uac83\uc744 \uacb0\ud569", concept: "\uc2e4\uc81c \ud504\ub85c\uadf8\ub7a8\uc740 \ub9ac\uc2a4\ud2b8, \ubc18\ubcf5\ubb38, \uc785\ub825, \ud568\uc218\ub97c \uacb0\ud569\ud569\ub2c8\ub2e4.", task: '\ud560 \uc77c \uc571\uc744 \ub9cc\ub4dc\uc138\uc694: \ub9ac\uc2a4\ud2b8\ub97c \ub9cc\ub4e4\uace0, \uc791\uc5c5\uc744 \ubb3c\uc5b4\ubcf4\uba70 "done"\uae4c\uc9c0 \ucd94\uac00\ud55c \ud6c4, \ubaa8\ub4e0 \uc791\uc5c5\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: 'todos = []\\nwhile True:\\n    task = input(...)\\n    if task == "done": break\\n    todos.append(task)\\nfor t in todos: print(t)', explanation: '\uac10\uc2dc \ubc18\ubcf5\ubb38, \ub9ac\uc2a4\ud2b8, append, \ubc18\ubcf5\uc744 \uacb0\ud569\ud569\ub2c8\ub2e4.' },
  20: { title: "\ud30c\uc77c I/O: \uc4f0\uae30", subtitle: "\ud30c\uc77c\uc5d0 \ub370\uc774\ud130 \uc800\uc7a5\ud558\uae30", concept: 'open("\ud30c\uc77c", "w")\uc740 \ud30c\uc77c\uc744 \uc0dd\uc131/\ub36e\uc5b4\uc501\ub2c8\ub2e4. "with"\ub97c \uc0ac\uc6a9\ud558\uba74 \uc790\ub3d9\uc73c\ub85c \ub2eb\ud799\ub2c8\ub2e4.', task: 'output.txt\uc5d0 "Hello from Python"\uc744 \uc4f0\uace0, \ub2e4\uc2dc \uc77d\uc5b4\uc11c \ub0b4\uc6a9\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: 'with open("output.txt", "w") as f:\\n    f.write(...)\\nwith open("output.txt", "r") as f:\\n    print(f.read())', explanation: '"with"\ub294 \ud30c\uc77c \uc5f4\uae30\uc640 \ub2eb\uae30\ub97c \uc790\ub3d9\uc73c\ub85c \ucc98\ub9ac\ud569\ub2c8\ub2e4.' },
  21: { title: "Try/Except", subtitle: "\uc5d0\ub7ec\ub97c \uc6b0\uc544\ud558\uac8c \ucc98\ub9ac\ud558\uae30", concept: "try/except\ub294 \uc5d0\ub7ec\ub97c \uc7a1\uc544\uc11c \ud504\ub85c\uadf8\ub7a8\uc774 \uba48\ucd94\uc9c0 \uc54a\uac8c \ud569\ub2c8\ub2e4.", task: '"hello"\ub97c int\ub85c \ubcc0\ud658\ud558\uc138\uc694. ValueError\ub97c \uc7a1\uc544\uc11c "Not a number"\ub97c \ucd9c\ub825\ud558\uc138\uc694.', hint: 'try:\\n    int("hello")\\nexcept ValueError:\\n    print("Not a number")', explanation: 'try/except\ub294 \uc704\ud5d8\ud55c \uc791\uc5c5\uc744 \uac10\uc2f8\uc11c \uc5d0\ub7ec\ub97c \uc6b0\uc544\ud558\uac8c \ucc98\ub9ac\ud569\ub2c8\ub2e4.' },
  22: { title: "\ud074\ub798\uc2a4: \uae30\ucd08", subtitle: "__init__\uc73c\ub85c \uac1d\uccb4 \ub9cc\ub4e4\uae30", concept: "\ud074\ub798\uc2a4\ub294 \uac1d\uccb4\uc758 \uc124\uacc4\ub3c4\uc785\ub2c8\ub2e4. __init__\uc740 \uc0dd\uc131 \uc2dc \uc2e4\ud589\ub429\ub2c8\ub2e4. self\ub294 \uc778\uc2a4\ud134\uc2a4\ub97c \uac00\ub9ac\ud0b5\ub2c8\ub2e4.", task: 'Dog \ud074\ub798\uc2a4\ub97c \ub9cc\ub4dc\uc138\uc694. __init__(self, name)\uacfc bark()\uac00 name + " says woof!"\ub97c \ubc18\ud658\ud558\ub3c4\ub85d. Dog("Rex").bark()\ub97c \ucd9c\ub825\ud558\uc138\uc694.', hint: 'class Dog:\\n    def __init__(self, name):\\n        self.name = name\\n    def bark(self):\\n        return self.name + " says woof!"', explanation: '\ud074\ub798\uc2a4\ub294 \ucf54\ub4dc\ub97c \uc870\uc9c1\ud569\ub2c8\ub2e4 \u2014 __init__\uc740 \uc124\uc815, \uba54\uc11c\ub4dc\ub294 \ub3d9\uc791\uc744 \ub2f4\ub2f9\ud569\ub2c8\ub2e4.' },
  23: { title: "JSON \ub2e4\ub8e8\uae30", subtitle: "JSON \ub370\uc774\ud130 \ud30c\uc2f1\uacfc \uc0dd\uc131", concept: "json \ubaa8\ub4c8\uc740 JSON \ubb38\uc790\uc5f4\uacfc Python \ub515\uc154\ub108\ub9ac\ub97c \uc0c1\ud638 \ubcc0\ud658\ud569\ub2c8\ub2e4.", task: 'json\uc744 \uc784\ud3ec\ud2b8\ud558\uc138\uc694. data = {"app": "MyApp", "version": 2}\ub97c \ub9cc\ub4dc\uc138\uc694. JSON \ubb38\uc790\uc5f4\ub85c \ubcc0\ud658\ud588\ub2e4\uac00 \ub2e4\uc2dc \ud30c\uc2f1\ud558\uace0 data["app"]\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: 'import json\\ndata = {...}\\njson_str = json.dumps(data)\\nparsed = json.loads(json_str)\\nprint(parsed["app"])', explanation: 'json.dumps() = \ub515\uc154\ub108\ub9ac\ub97c \ubb38\uc790\uc5f4\ub85c. json.loads() = \ubb38\uc790\uc5f4\uc744 \ub515\uc154\ub108\ub9ac\ub85c.' },
  24: { title: "\uc784\ud3ec\ud2b8\uc640 \uad6c\uc870", subtitle: "\uc2e4\uc81c Python \ucf54\ub4dc \uc77d\uae30", concept: "\uc2e4\uc81c Python \ud30c\uc77c\uc740 \ud328\ud134\uc744 \ub530\ub985\ub2c8\ub2e4: \uc784\ud3ec\ud2b8, \uc815\uc758, \uc2e4\ud589 \uc21c\uc11c.", task: 'math\ub97c \uc784\ud3ec\ud2b8\ud558\uace0, circle_area(r)\ub97c math.pi * r * r\ub85c \uc815\uc758\ud558\uc138\uc694. r=5\ub85c \uc18c\uc218\uc810 2\uc790\ub9ac\uae4c\uc9c0 \ucd9c\ub825\ud558\uc138\uc694.', hint: 'import math\\ndef circle_area(r):\\n    return math.pi * r * r\\nprint(round(circle_area(5), 2))', explanation: '\ud45c\uc900 \ud328\ud134: \uc784\ud3ec\ud2b8 \u2192 \ud568\uc218 \uc815\uc758 \u2192 \uc2e4\ud589 \ucf54\ub4dc.' },
  25: { title: "\uc878\uc5c5: \uc810\uc218 \ucd94\uc801\uae30", subtitle: "\ubc30\uc6b4 \ubaa8\ub4e0 \uac83\uc744 \uacb0\ud569\ud558\uae30", concept: "\uc774 \uc878\uc5c5 \uacfc\uc81c\ub294 \ub515\uc154\ub108\ub9ac, \ud568\uc218, \ub0b4\uc7a5 \uc5f0\uc0b0\uc744 \uc5f0\uacb0\ud569\ub2c8\ub2e4.", task: 'scores = {"python": 85, "git": 90}\uc744 \ub9cc\ub4dc\uc138\uc694. get_average(scores_dict)\ub85c \ud3c9\uade0\uc744 \ubc18\ud658\ud558\uc138\uc694. \uc18c\uc218\uc810 1\uc790\ub9ac\ub85c \ucd9c\ub825\ud558\uc138\uc694.', hint: 'def get_average(d):\\n    return sum(d.values()) / len(d)\\nscores = {...}\\nprint(round(get_average(scores), 1))', explanation: '\ub515\uc154\ub108\ub9ac, \ub0b4\uc7a5 \ud568\uc218(sum, len, round), \ucee4\uc2a4\ud140 \ud568\uc218\ub97c \uacb0\ud569\ud569\ub2c8\ub2e4.' },
  26: { title: "\ub9ac\uc2a4\ud2b8 \ucef4\ud504\ub9ac\ud5e8\uc158", subtitle: "\ud30c\uc774\uc36c\ub2e4\uc6b4 \ud55c \uc904 \ucf54\ub4dc", concept: "[\ud45c\ud604\uc2dd for \ud56d\ubaa9 in \ubc18\ubcf5\uac00\ub2a5] \ud615\ud0dc\ub85c \ud55c \uc904\uc5d0 \uc0c8 \ub9ac\uc2a4\ud2b8\ub97c \ub9cc\ub4ed\ub2c8\ub2e4.", task: "\ub9ac\uc2a4\ud2b8 \ucef4\ud504\ub9ac\ud5e8\uc158\uc744 \uc0ac\uc6a9\ud558\uc5ec 1-5\uc758 \uc81c\uacf1 \ub9ac\uc2a4\ud2b8\ub97c \ub9cc\ub4dc\uc138\uc694. \ucd9c\ub825\ud558\uc138\uc694.", hint: "squares = [x * x for x in range(1, 6)]\\nprint(squares)", explanation: '\ub9ac\uc2a4\ud2b8 \ucef4\ud504\ub9ac\ud5e8\uc158\uc740 4\uc904\uc758 \ubc18\ubcf5\ubb38 \ucf54\ub4dc\ub97c \uc6b0\uc544\ud55c 1\uc904\ub85c \ubc14\uafb8\ub2c8\ub2e4.' },
  27: { title: "\ubb38\uc790\uc5f4 \uba54\uc11c\ub4dc", subtitle: "split, join, strip, replace", concept: "\ubb38\uc790\uc5f4\uc5d0\ub294 \uac15\ub825\ud55c \ub0b4\uc7a5 \uc870\uc791 \uba54\uc11c\ub4dc\uac00 \uc788\uc2b5\ub2c8\ub2e4.", task: 'text = "hello world python"\uc744 \uc124\uc815\ud558\uc138\uc694. \uacf5\ubc31\uc73c\ub85c \ubd84\ub9ac\ud558\uace0 \ud558\uc774\ud508\uc73c\ub85c \ud569\uccd0\uc11c \ucd9c\ub825\ud558\uc138\uc694.', hint: 'words = text.split(" ")\\nresult = "-".join(words)\\nprint(result)', explanation: '.split()\uc740 \ubb38\uc790\uc5f4\uc744 \ub9ac\uc2a4\ud2b8\ub85c \ubd84\ub9ac\ud569\ub2c8\ub2e4. .join()\uc740 \ub9ac\uc2a4\ud2b8\ub97c \ubb38\uc790\uc5f4\ub85c \ud569\uce69\ub2c8\ub2e4.' },
  28: { title: "F-String", subtitle: "\ud604\ub300\uc801 \ubb38\uc790\uc5f4 \ud3ec\ub9e4\ud305", concept: 'f"...{\ubcc0\uc218}..."\ub85c \ubcc0\uc218\ub97c \ubb38\uc790\uc5f4\uc5d0 \uc9c1\uc811 \ud3ec\ud568\ud569\ub2c8\ub2e4. \uc5f0\uacb0\ubcf4\ub2e4 \ud6e8\uc52c \uae54\ub054\ud569\ub2c8\ub2e4.', task: 'language = "Python"\uacfc version = 3\uc744 \uc124\uc815\ud558\uc138\uc694. "Python version 3 is awesome!"\uc744 \ucd9c\ub825\ud558\uc138\uc694.', hint: 'print(f"{language} version {version} is awesome!")', explanation: 'F-string(Python 3.6+)\uc740 \ud604\ub300\uc801\uc774\uace0 \uc120\ud638\ub418\ub294 \ubb38\uc790\uc5f4 \ud3ec\ub9e4\ud305 \ubc29\ubc95\uc785\ub2c8\ub2e4.' },
  29: { title: "Lambda\uc640 Map", subtitle: "\uc778\ub77c\uc778 \ud568\uc218\uc640 \ubcc0\ud658", concept: "lambda\ub294 \uc791\uc740 \uc775\uba85 \ud568\uc218\ub97c \ub9cc\ub4ed\ub2c8\ub2e4. map()\uc740 \ub9ac\uc2a4\ud2b8\uc758 \ubaa8\ub4e0 \ud56d\ubaa9\uc5d0 \ud568\uc218\ub97c \uc801\uc6a9\ud569\ub2c8\ub2e4.", task: "map\uacfc lambda\ub97c \uc0ac\uc6a9\ud558\uc5ec [1, 2, 3, 4, 5]\uc758 \ubaa8\ub4e0 \uc22b\uc790\ub97c 3\ubc30\ub85c \ub9cc\ub4dc\uc138\uc694. \uacb0\uacfc \ub9ac\uc2a4\ud2b8\ub97c \ucd9c\ub825\ud558\uc138\uc694.", hint: "result = list(map(lambda x: x * 3, [1, 2, 3, 4, 5]))\\nprint(result)", explanation: 'lambda x: x * 3\uc740 \uac04\uacb0\ud55c \ud55c \uc904 \ud568\uc218\uc785\ub2c8\ub2e4.' },
  30: { title: "\ucd5c\uc885 \ubcf4\uc2a4: \ub370\uc774\ud130 \ud30c\uc774\ud504\ub77c\uc778", subtitle: "\ucc98\ub9ac, \ubcc0\ud658, \ucd9c\ub825", concept: "\uc2e4\uc81c \ud504\ub85c\uadf8\ub7a8\uc740 \ud328\ud134\uc744 \ub530\ub985\ub2c8\ub2e4: \uc785\ub825 \ud30c\uc2f1, \ub370\uc774\ud130 \ubcc0\ud658, \ucd9c\ub825 \uc0dd\uc131.", task: '\ud559\uc0dd \ub515\uc154\ub108\ub9ac \ub9ac\uc2a4\ud2b8(name/score)\uc5d0\uc11c \uc810\uc218\uac00 80 \uc774\uc0c1\uc778 \ud559\uc0dd\uc758 \uc774\ub984\ub9cc \ucd9c\ub825\ud558\uc138\uc694.', hint: 'for s in students:\\n    if s["score"] >= 80:\\n        print(s["name"])', explanation: '\ubc18\ubcf5, \ud544\ud130, \ucd94\ucd9c \u2014 \ubaa8\ub4e0 \uc5b8\uc5b4\uc5d0\uc11c\uc758 \ub370\uc774\ud130 \ucc98\ub9ac\uc758 \ubcf8\uc9c8\uc785\ub2c8\ub2e4.' },
};
const PHASE_COLORS = { 1: [C.accentDark, C.accent], 2: ["#0ea5e9", "#38bdf8"], 3: ["#f59e0b", "#fbbf24"] };

// ─── LOCAL STORAGE ───
const STORAGE_KEY = "pyithon-progress";
function loadProgress() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error("Save failed:", e); }
}

// ─── AI EVALUATOR (multi-provider, with timeout + error handling) ───
async function evaluateWithAI(userCode, level, apiKey, lang, provider) {
  const providerConfig = AI_PROVIDERS[provider];

  const prompt = `You are a Python code evaluator for an educational platform. Evaluate if the student's code is correct AND uses the concept being taught.

CRITICAL RULES:
- The student MUST use the concept/technique described in the task. Hardcoding the output is NOT acceptable.
- For example, if the task says "create a variable and print it", then print("value") without using a variable is WRONG.
- If the task says "use a for loop", writing print(1)\\nprint(2)\\nprint(3) is WRONG.
- If the task says "use str() to concatenate", just print("the answer") is WRONG.
- Accept creative solutions (different variable names, f-strings vs concatenation, etc.) as long as they use the required concept.
- Code must be valid Python 3 that would actually run without errors.
- For simulated input, assume input() receives values in order.
- Be encouraging but honest.

CONCEPT BEING TAUGHT: ${level.concept}
TASK: ${level.task}
EXPECTED OUTPUT: ${level.expectedOutput}
${level.simulatedInput ? `SIMULATED INPUT: ${level.simulatedInput}` : ""}
REFERENCE SOLUTION: ${level.hint}

STUDENT CODE:
\`\`\`python
${userCode}
\`\`\`

Does this code use the required concept AND produce the correct output? Respond ONLY with JSON, no markdown fences:
{"correct": true/false, "feedback": "brief encouraging message", "explanation": "1-2 sentences explaining why correct/incorrect, focusing on whether they used the concept"}${lang === "ko" ? "\nRespond in Korean." : ""}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    let response;

    if (provider === "claude") {
      response = await fetch(providerConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: providerConfig.model,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });
    } else if (provider === "openai") {
      response = await fetch(providerConfig.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: providerConfig.model,
          max_tokens: 500,
          messages: [{ role: "user", content: prompt }],
        }),
        signal: controller.signal,
      });
    } else if (provider === "gemini") {
      const url = `${providerConfig.endpoint}?key=${apiKey}`;
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 500 },
        }),
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    if (!response.ok) {
      const status = response.status;
      if (status === 401) return { correct: false, feedback: "Your API key is invalid or expired. Go to Settings to enter a new key, or switch to Offline mode.", explanation: "" };
      if (status === 429) return { correct: false, feedback: "Rate limit reached. Wait a moment and try again, or switch to Offline mode.", explanation: "" };
      if (status === 529 || status === 503) return { correct: false, feedback: `The ${providerConfig.name} API is temporarily overloaded. Try again in a minute, or switch to Offline mode.`, explanation: "" };
      return { correct: false, feedback: `Something went wrong (error ${status}). Check your API key in Settings, or switch to Offline mode.`, explanation: "" };
    }

    const data = await response.json();

    // Extract text based on provider
    let text = "";
    if (provider === "claude") {
      if (data.error) {
        const msg = data.error.message || "";
        if (msg.includes("invalid") || msg.includes("auth")) return { correct: false, feedback: "Your API key is invalid. Go to Settings to update it, or switch to Offline mode.", explanation: "" };
        return { correct: false, feedback: "Something went wrong with the API. Try again, or switch to Offline mode.", explanation: "" };
      }
      text = (data.content || []).map(b => b.text || "").join("").trim();
    } else if (provider === "openai") {
      if (data.error) {
        return { correct: false, feedback: data.error.message || "Something went wrong with the API.", explanation: "" };
      }
      text = data.choices?.[0]?.message?.content?.trim() || "";
    } else if (provider === "gemini") {
      if (data.error) {
        return { correct: false, feedback: data.error.message || "Something went wrong with the API.", explanation: "" };
      }
      text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    }

    if (!text) {
      return { correct: false, feedback: `Got an empty response from ${providerConfig.name}. Check your API key in Settings.`, explanation: "" };
    }

    const clean = text.replace(/```json|```/g, "").trim();
    try {
      return JSON.parse(clean);
    } catch {
      if (text.toLowerCase().includes('"correct": true') || text.toLowerCase().includes('"correct":true')) {
        return { correct: true, feedback: "Nice work!", explanation: "" };
      }
      return { correct: false, feedback: "Could not parse response.", explanation: "Raw: " + text.substring(0, 200) };
    }
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { correct: false, feedback: "Request timed out. Check your internet connection, or switch to Offline mode.", explanation: "" };
    }
    return { correct: false, feedback: `Couldn't connect to ${providerConfig.name}. Check your internet connection, or switch to Offline mode.`, explanation: "" };
  }
}

// ─── MAIN APP ───
export default function PyithonApp() {
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
  const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem("pyithon-api-key") || "");
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [offlineMode, setOfflineMode] = useState(() => localStorage.getItem("pyithon-offline") === "true");
  const [pyodideStatus, setPyodideStatus] = useState("idle"); // idle, loading, ready, error
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("pyithon-theme") !== "light");
  const editorRef = useRef(null);
  const highlightRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [tab, setTab] = useState("editor");
  const [isWide, setIsWide] = useState(window.innerWidth >= 900);
  const [conceptCollapsed, setConceptCollapsed] = useState(false);
  const [levelTransition, setLevelTransition] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => localStorage.getItem("pyithon-sound") === "true");
  const [typedChars, setTypedChars] = useState(0);
  const [editorGlow, setEditorGlow] = useState(false);
  const [showXPFloat, setShowXPFloat] = useState(false);
  const [lang, setLang] = useState(() => localStorage.getItem("pyithon-lang") || "en");
  const [provider, setProvider] = useState(() => localStorage.getItem("pyithon-provider") || "claude");

  const t = (key) => STRINGS[lang]?.[key] || STRINGS.en[key] || key;

  const level = LEVELS[currentLevel];
  const levelT = lang === "ko" && LEVELS_KO[level.id] ? { ...level, ...LEVELS_KO[level.id] } : level;
  const unlockedUpTo = Math.max(...completedLevels, 0) + 1;
  const progressPercent = (completedLevels.size / LEVELS.length) * 100;

  useEffect(() => {
    const saved = loadProgress();
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
    const onResize = () => setIsWide(window.innerWidth >= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Theme + preferences sync
  Object.assign(C, darkMode ? DARK : LIGHT);
  useEffect(() => { localStorage.setItem("pyithon-sound", soundEnabled); }, [soundEnabled]);
  useEffect(() => { localStorage.setItem("pyithon-offline", offlineMode); }, [offlineMode]);
  // Preload Pyodide when offline mode is enabled or on first submit
  useEffect(() => {
    if (offlineMode && pyodideStatus === "idle") {
      setPyodideStatus("loading");
      loadPyodideRuntime().then(() => setPyodideStatus("ready")).catch(() => setPyodideStatus("error"));
    }
  }, [offlineMode, pyodideStatus]);
  useEffect(() => { localStorage.setItem("pyithon-theme", darkMode ? "dark" : "light"); }, [darkMode]);
  useEffect(() => { localStorage.setItem("pyithon-lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("pyithon-provider", provider); }, [provider]);
  useEffect(() => {
    const stored = localStorage.getItem(`pyithon-api-key-${provider}`) ||
      (provider === "claude" ? (import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem("pyithon-api-key") || "") : "");
    setApiKey(stored);
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
      localStorage.setItem(`pyithon-api-key-${provider}`, apiKeyInput.trim());
      setShowApiSetup(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (isEvaluating) return;
    if (!offlineMode && !apiKey) { setShowApiSetup(true); return; }
    const userCode = code.trim();
    if (!userCode || userCode === level.starterCode.trim()) {
      setFeedback({ correct: false, message: t("writeCodeFirst"), expected: level.expectedOutput });
      setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
      playTone(330, 0.15, "triangle");
      return;
    }
    const expected = level.expectedOutput.trim();
    setIsEvaluating(true); setFeedback(null); setTab("output");
    try {
      const result = offlineMode ? await evaluateOffline(userCode, level) : await evaluateWithAI(userCode, level, apiKey, lang, provider);
      if (result.correct) {
        setFeedback({ correct: true, message: result.feedback || "Correct!", expected, aiExplanation: result.explanation });
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
        setFeedback({ correct: false, message: result.feedback || "Not quite right.", expected, aiExplanation: result.explanation });
        setStreak(0); setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
        playTone(330, 0.15, "triangle");
      }
    } catch (err) {
      setFeedback({ correct: false, message: "Error: " + err.message, expected });
    } finally { setIsEvaluating(false); }
  }, [code, level, completedLevels, bestStreak, streak, apiKey, isEvaluating, playTone, offlineMode, lang, provider]);

  // Ctrl+Enter to run
  useEffect(() => {
    const handler = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); handleSubmit(); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit]);

  const handleReset = () => { setCode(level.starterCode); setFeedback(null); setShowHint(false); setTab("editor"); };
  const goToLevel = (idx) => { if (idx < unlockedUpTo || completedLevels.has(LEVELS[idx].id)) { setCurrentLevel(idx); setShowLevelSelect(false); } };

  const filename = `level_${String(level.id).padStart(2, "0")}.py`;

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

  // ═══ RENDER: SETTINGS ═══
  const toggleStyle = (active) => ({
    width: 44, height: 24, borderRadius: 12, padding: 2, cursor: "pointer", border: "none",
    background: active ? C.accent : (darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"),
    transition: "all 0.2s",
    display: "flex", alignItems: "center", justifyContent: active ? "flex-end" : "flex-start",
  });

  if (showApiSetup) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative" }}>
        {/* Clickable backdrop */}
        <div onClick={() => setShowApiSetup(false)} style={{ position: "fixed", inset: 0, background: darkMode ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)", backdropFilter: "blur(8px)", zIndex: 0 }} />
        <div style={{
          maxWidth: 440, width: "100%", background: C.bgGlass, backdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`, borderRadius: 20, padding: 32,
          boxShadow: `0 24px 64px rgba(0,0,0,${darkMode ? "0.5" : "0.15"})`,
          position: "relative", zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>{t("settings")}</h2>
            <button onClick={() => setShowApiSetup(false)} style={{ color: C.textDim, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Theme toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t(darkMode ? "darkMode" : "lightMode")} {t("modeSuffix")}</p>
              <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{t("switchAppearance")}</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} style={toggleStyle(!darkMode)}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>

          {/* Language toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("language")}</p>
              <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{t("langDesc")}</p>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[["en", "EN"], ["ko", "\ud55c\uad6d\uc5b4"]].map(([code, label]) => (
                <button key={code} onClick={() => setLang(code)} style={{
                  padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                  border: `1px solid ${lang === code ? C.accentBorder : C.border}`,
                  background: lang === code ? C.accentBg : "transparent",
                  color: lang === code ? C.accentText : C.textDim,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Offline mode toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("offlineMode")}</p>
              <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{offlineMode ? `${t("offlineDesc")}${pyodideStatus === "loading" ? ` (${t("loading")})` : pyodideStatus === "ready" ? ` (${t("ready")})` : ""}` : t("onlineDesc")}</p>
            </div>
            <button onClick={() => setOfflineMode(!offlineMode)} style={toggleStyle(offlineMode)}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>

          {/* AI Provider */}
          {!offlineMode && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
              <div>
                <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("provider")}</p>
                <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{t("providerDesc")}</p>
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                {Object.entries(AI_PROVIDERS).map(([key, prov]) => (
                  <button key={key} onClick={() => setProvider(key)} style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    border: `1px solid ${provider === key ? C.accentBorder : C.border}`,
                    background: provider === key ? C.accentBg : "transparent",
                    color: provider === key ? C.accentText : C.textDim,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                  }}>{prov.name}</button>
                ))}
              </div>
            </div>
          )}

          {/* API Key */}
          {!offlineMode && (
            <div style={{ paddingTop: 16 }}>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>{t("apiKey")}</p>
              <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
                {t("apiKeyDesc")} <span style={{ color: C.accent }}>{AI_PROVIDERS[provider].keyUrl}</span>
              </p>
              <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={apiKey ? "••••••••" : AI_PROVIDERS[provider].keyPlaceholder}
                style={{
                  width: "100%", padding: "12px 16px", borderRadius: 12, background: C.codeBg,
                  border: `1px solid ${C.border}`, color: C.text, fontSize: 13, outline: "none",
                  fontFamily: monoFont, marginBottom: 12, transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = C.borderFocus}
                onBlur={e => e.target.style.borderColor = C.border}
                onKeyDown={e => e.key === "Enter" && handleSaveApiKey()}
              />
              <button onClick={handleSaveApiKey} style={{
                width: "100%", padding: "12px 0", borderRadius: 12,
                background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
                color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit",
                fontSize: 13, fontWeight: 700, transition: "all 0.2s",
                boxShadow: `0 4px 16px ${C.accentGlow}`,
              }}>{t("saveKey")}</button>
            </div>
          )}
        </div>
        <style>{getGlobalStyles(C)}</style>
      </div>
    );
  }

  // ═══ RENDER: WELCOME ═══
  if (showWelcome) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "25%", left: "50%", transform: "translate(-50%,-50%)", width: 700, height: 700, background: C.accentGlowSoft, borderRadius: "50%", filter: "blur(180px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "20%", width: 300, height: 300, background: "rgba(16,185,129,0.06)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeSlideUp 0.8s ease-out" }}>
          <svg viewBox="0 0 200 200" style={{ width: 100, height: 100, marginBottom: 40, filter: `drop-shadow(0 0 40px ${C.accentGlow})` }}>
            <defs><linearGradient id="aG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={C.accentDeep} /><stop offset="100%" stopColor={C.accentLight} /></linearGradient></defs>
            <path d="M60 160 L60 60 L30 90" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M90 160 L90 40 L60 70" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M120 160 L120 60 L90 90" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M150 160 L150 80 L120 110" fill="none" stroke="url(#aG)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <h1 style={{ fontSize: 44, fontWeight: 800, color: C.text, margin: "0 0 12px", letterSpacing: -2, background: `linear-gradient(135deg, ${C.text}, ${C.accentLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Pyi-thon
          </h1>
          <p style={{ color: C.accentText, textAlign: "center", maxWidth: 320, marginBottom: 8, fontSize: 15, lineHeight: 1.6, fontWeight: 500, minHeight: 48, fontFamily: monoFont }}>
            {tagline.substring(0, typedChars).split("\n").map((line, i, arr) => <span key={i}>{line}{i < arr.length - 1 && <br />}</span>)}
            <span style={{ display: "inline-block", width: 2, height: "1em", background: C.accent, marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
          </p>
          <p style={{ color: C.accentTextDim, fontSize: 12, marginBottom: 48, letterSpacing: 2, textTransform: "uppercase" }}>{t("subtitle")}</p>

          <button onClick={() => setShowWelcome(false)} style={{
            padding: "16px 52px", borderRadius: 14, fontWeight: 700, color: C.btnText, fontSize: 16,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
            boxShadow: `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
            transition: "all 0.3s ease", animation: "gentlePulse 2.5s ease-in-out infinite",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px) scale(1.02)"; e.target.style.boxShadow = `0 12px 48px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`; }}
          >{t("startLearning")}</button>

          <button onClick={() => { setShowWelcome(false); setShowApiSetup(true); }} style={{
            marginTop: 16, color: C.accentTextDim, fontSize: 13, background: "none",
            border: "none", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = C.accentText}
            onMouseLeave={e => e.target.style.color = C.accentTextDim}
          >{t("configureApiKey")}</button>
        </div>
        <style>{getGlobalStyles(C)}</style>
      </div>
    );
  }

  // ═══ RENDER: LEVEL SELECT ═══
  if (showLevelSelect) {
    return (
      <div style={{ ...pageStyle, padding: "20px 20px 100px", overflowY: "auto", position: "relative" }}>
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: 300, background: `linear-gradient(to bottom, ${C.accentGlowSoft}, transparent)`, pointerEvents: "none", zIndex: 0 }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button onClick={() => setShowLevelSelect(false)} style={{
              color: C.accentText, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
              cursor: "pointer", padding: "8px 12px", borderRadius: 10, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.borderColor = C.borderFocus; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.borderColor = C.border; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>{t("allLevels")}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: C.accentTextDim }}>{completedLevels.size}/{LEVELS.length}</span>
              <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 4, width: `${progressPercent}%`, background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent})`, transition: "width 0.5s" }} />
              </div>
            </div>
          </div>

          {[1, 2, 3].map(phase => (
            <div key={phase} style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, letterSpacing: 1,
                  background: `linear-gradient(135deg, ${PHASE_COLORS[phase][0]}, ${PHASE_COLORS[phase][1]})`,
                  color: C.btnText,
                }}>{PHASE_ICONS[phase]}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>{t("phaseName" + phase)}</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LEVELS.filter(l => l.phase === phase).map(l => {
                  const idx = LEVELS.indexOf(l);
                  const done = completedLevels.has(l.id);
                  const unlocked = idx < unlockedUpTo || done;
                  const curr = idx === currentLevel;
                  const lT = lang === "ko" && LEVELS_KO[l.id] ? { ...l, ...LEVELS_KO[l.id] } : l;
                  return (
                    <button key={l.id} onClick={() => unlocked && goToLevel(idx)} disabled={!unlocked} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderRadius: 14, textAlign: "left", fontFamily: "inherit",
                      border: `1px solid ${curr ? C.accentBorder : done ? C.greenBorder : C.border}`,
                      background: curr ? C.accentBg : done ? C.greenBg : "rgba(255,255,255,0.015)",
                      cursor: unlocked ? "pointer" : "not-allowed", opacity: unlocked ? 1 : 0.3,
                      transition: "all 0.2s ease",
                      ...(unlocked && !curr ? {} : {}),
                    }}
                      onMouseEnter={e => { if (unlocked) { e.currentTarget.style.background = curr ? "rgba(79,70,229,0.18)" : done ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = curr ? C.accent : done ? C.green : C.borderFocus; e.currentTarget.style.transform = "translateX(4px)"; }}}
                      onMouseLeave={e => { if (unlocked) { e.currentTarget.style.background = curr ? C.accentBg : done ? C.greenBg : "rgba(255,255,255,0.015)"; e.currentTarget.style.borderColor = curr ? C.accentBorder : done ? C.greenBorder : C.border; e.currentTarget.style.transform = "translateX(0)"; }}}
                    >
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 13, fontWeight: 700, flexShrink: 0,
                        background: done ? "rgba(16,185,129,0.15)" : curr ? C.accentBg : "rgba(255,255,255,0.03)",
                        color: done ? C.green : curr ? C.accent : C.textDim,
                        border: `1px solid ${done ? C.greenBorder : curr ? C.accentBorder : "transparent"}`,
                      }}>
                        {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : unlocked ? l.id : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: done ? C.greenLight : unlocked ? C.text : C.textDim, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lT.title}</p>
                        <p style={{ fontSize: 11, color: C.accentTextDim, margin: "3px 0 0" }}>{lT.subtitle}</p>
                      </div>
                      {l.tags.includes("boss") && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, fontWeight: 700, letterSpacing: 0.5 }}>{t("boss")}</span>}
                      {curr && <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent, boxShadow: `0 0 8px ${C.accentGlow}`, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <style>{getGlobalStyles(C)}</style>
      </div>
    );
  }

  // ═══ RENDER: EDITOR PANEL ═══
  const editorSharedStyle = {
    fontSize: 14, lineHeight: "1.75rem", fontFamily: monoFont,
    tabSize: 4, whiteSpace: "pre-wrap", wordWrap: "break-word", overflowWrap: "break-word",
    padding: "14px 16px", margin: 0,
  };
  const syntaxTokens = highlightPython(code);
  const editorPanel = (
    <div style={{ flex: 1, position: "relative", minHeight: 240, animation: shakeEditor ? "shake 0.4s ease-in-out" : "none" }}>
      <div style={{
        position: "absolute", inset: 0, background: C.bgCard,
        border: `1px solid ${editorGlow ? C.green : C.border}`,
        borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: editorGlow
          ? `0 8px 40px rgba(0,0,0,0.4), 0 0 30px rgba(16,185,129,0.2), inset 0 1px 0 rgba(255,255,255,0.03)`
          : "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}>
        {/* Filename bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
          background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.trafficRed }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.trafficYellow }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.trafficGreen }} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginLeft: 8,
            padding: "3px 10px", borderRadius: 6, background: C.bgPanel,
            border: `1px solid ${C.borderLight}`,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <span style={{ fontSize: 11, color: C.accentText, fontWeight: 600, fontFamily: monoFont }}>{filename}</span>
          </div>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: C.textDim }}>{t("python3")}</span>
        </div>
        {/* Editor body */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
          <div style={{
            width: 48, background: "rgba(255,255,255,0.015)", borderRight: `1px solid ${C.borderLight}`,
            paddingTop: 14, display: "flex", flexDirection: "column", alignItems: "center",
          }}>
            {code.split("\n").map((_, i) => (
              <span key={i} style={{ fontSize: 11, color: C.lineNum, lineHeight: "1.75rem", userSelect: "none", fontWeight: 500, fontFamily: monoFont }}>{i + 1}</span>
            ))}
          </div>
          {/* Syntax highlight overlay + textarea */}
          <div style={{ flex: 1, position: "relative" }}>
            <pre ref={highlightRef} aria-hidden="true" style={{
              ...editorSharedStyle, position: "absolute", inset: 0, overflow: "hidden",
              pointerEvents: "none", background: "transparent", color: C.codeText, border: "none",
            }}>
              {syntaxTokens.map((t, i) => t.color ? <span key={i} style={{ color: t.color }}>{t.text}</span> : t.text)}
              {"\n"}
            </pre>
            <textarea ref={editorRef} value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
              style={{
                ...editorSharedStyle, position: "relative", width: "100%", height: "100%",
                background: "transparent", color: "transparent", resize: "none", outline: "none",
                border: "none", caretColor: C.accent, zIndex: 1,
              }}
              placeholder="# Write your Python code here..."
              onScroll={e => { if (highlightRef.current) { highlightRef.current.scrollTop = e.target.scrollTop; highlightRef.current.scrollLeft = e.target.scrollLeft; } }}
              onKeyDown={e => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  const s = e.target.selectionStart, end = e.target.selectionEnd;
                  setCode(code.substring(0,s)+"    "+code.substring(end));
                  setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s+4; }, 0);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  // ═══ RENDER: OUTPUT PANEL ═══
  const outputPanel = (
    <div style={{ flex: 1, minHeight: 200 }}>
      {isEvaluating ? (
        <div style={{
          height: "100%", borderRadius: 14, border: `1px solid ${C.accentBorder}`,
          background: C.accentBg, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 16,
        }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 24, color: C.accent, animation: "bracketPulse 1.2s ease-in-out infinite", display: "inline-block" }}>{`{`}</span>
            <div style={{ display: "flex", gap: 4 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%", background: C.accent,
                  animation: "dotBounce 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }} />
              ))}
            </div>
            <span style={{ fontSize: 24, color: C.accent, animation: "bracketPulse 1.2s ease-in-out infinite 0.1s", display: "inline-block" }}>{`}`}</span>
          </div>
          <p style={{ color: C.accentTextDim, fontSize: 13, fontWeight: 600, margin: 0, letterSpacing: 0.5 }}>{AI_PROVIDERS[provider].name} {t("isEvaluatingMsg")}</p>
        </div>
      ) : feedback ? (
        <div style={{
          height: "100%", borderRadius: 14, padding: 20, overflowY: "auto",
          border: `1px solid ${C.border}`,
          background: C.bgCard,
        }}>
          {/* Result header — colored accent only on icon */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <div onClick={() => { if (!feedback.correct) setTab("editor"); }} style={{
              width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: feedback.correct ? C.green : C.red,
              cursor: feedback.correct ? "default" : "pointer",
              transition: "transform 0.2s",
            }}
              onMouseEnter={e => { if (!feedback.correct) e.currentTarget.style.transform = "scale(1.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {feedback.correct
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{feedback.correct ? t("correct") : t("notQuite")}</span>
              <p style={{ fontSize: 13, color: C.textMuted, margin: "4px 0 0", lineHeight: 1.6 }}>{feedback.aiExplanation || feedback.message}</p>
            </div>
            {feedback.correct && <span style={{ fontSize: 12, color: C.amber, fontWeight: 700, background: C.amberBg, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.amberBorder}`, flexShrink: 0 }}>+100 XP</span>}
          </div>

          {/* Expected output */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>{t("expectedOutput")}</p>
            <pre style={{
              background: C.codeBg, borderRadius: 10, padding: 14, color: C.codeText, fontSize: 12,
              overflowX: "auto", fontFamily: monoFont, margin: 0, whiteSpace: "pre-wrap",
              border: `1px solid ${C.borderLight}`,
            }}>{feedback.expected}</pre>
          </div>

          {/* Concept */}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 6px" }}>{t("concept")}</p>
            <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{levelT.explanation}</p>
          </div>

          {/* Try Again button — wrong answers only */}
          {!feedback.correct && (
            <button onClick={() => setTab("editor")} style={{
              width: "100%", marginTop: 16, padding: "12px 0", borderRadius: 10,
              background: C.accentBg, border: `1px solid ${C.accentBorder}`,
              color: C.accentText, fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = C.accentBorder; }}
              onMouseLeave={e => { e.target.style.background = C.accentBg; }}
            >{t("tryAgain")}</button>
          )}
        </div>
      ) : (
        <div style={{
          height: "100%", borderRadius: 14, border: `1px solid ${C.border}`,
          background: C.bgSubtle, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          <p style={{ color: C.textDim, fontSize: 13 }}>{t("runToSee")}</p>
        </div>
      )}
    </div>
  );

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

      {/* Header */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: C.bgGlassStrong, backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${C.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
          <button onClick={() => setShowLevelSelect(true)} style={{
            color: C.accentText, background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`,
            cursor: "pointer", padding: "7px 10px", borderRadius: 10, transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 6,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = C.borderFocus; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = C.border; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
            <span style={{ fontSize: 11, fontWeight: 600 }}>{t("levels")}</span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8 }}>
            <svg viewBox="0 0 200 200" style={{ width: 20, height: 20, flexShrink: 0, filter: `drop-shadow(0 0 6px ${C.accentGlow})` }}>
              <defs><linearGradient id="hG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor={C.accentDeep} /><stop offset="100%" stopColor={C.accentLight} /></linearGradient></defs>
              <path d="M60 160 L60 60 L30 90" fill="none" stroke="url(#hG)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M100 160 L100 40 L70 70" fill="none" stroke="url(#hG)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M140 160 L140 60 L110 90" fill="none" stroke="url(#hG)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M175 160 L175 80 L145 110" fill="none" stroke="url(#hG)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.accent, letterSpacing: -0.5, display: isWide ? "inline" : "none" }}>Pyi-thon</span>
          </div>

          <div style={{ flex: 1, margin: "0 20px", maxWidth: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: C.accentTextDim, fontWeight: 600 }}>{t("levels")} {level.id}</span>
              <span style={{ fontSize: 11, color: C.accentTextDim }}>{completedLevels.size}/{LEVELS.length}</span>
            </div>
            <div style={{ height: 5, background: "rgba(255,255,255,0.04)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 8, transition: "width 0.7s ease-out",
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent}, ${C.accentLight})`,
                boxShadow: `0 0 12px ${C.accentGlow}`,
              }} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {streak > 0 && <div style={{
              display: "flex", alignItems: "center", gap: 5, color: C.amber,
              background: C.amberBg, padding: "4px 10px", borderRadius: 8,
              border: `1px solid ${C.amberBorder}`,
            }}>
              <span style={{ fontSize: 13 }}>&#x1F525;</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{streak}</span>
            </div>}
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 5, color: C.accentText, background: C.accentBg, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.accentBorder}` }}>
              <span style={{ fontSize: 13 }}>&#x26A1;</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{totalXP}</span>
              {showXPFloat && <span style={{ position: "absolute", top: -8, right: -4, color: C.amber, fontSize: 12, fontWeight: 700, animation: "xpFloat 1.5s ease-out forwards", pointerEvents: "none" }}>+100</span>}
            </div>
            <button onClick={() => setSoundEnabled(!soundEnabled)} style={{
              color: soundEnabled ? C.accent : C.textDim, background: "none", border: "none", cursor: "pointer",
              fontSize: 14, padding: 4, transition: "color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.accentText}
              onMouseLeave={e => e.currentTarget.style.color = soundEnabled ? C.accent : C.textDim}
            >
              {soundEnabled
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
              }
            </button>
            <button onClick={() => setShowApiSetup(true)} style={{
              color: C.textDim, background: "none", border: "none", cursor: "pointer",
              fontSize: 14, padding: 4, transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = C.accentText}
              onMouseLeave={e => e.target.style.color = C.textDim}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main content with level transition */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "auto",
        animation: levelTransition ? "levelEnter 0.4s ease-out" : "none",
      }}>
        {/* Level info */}
        <div style={{ padding: "16px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
              background: `linear-gradient(135deg, ${PHASE_COLORS[level.phase][0]}, ${PHASE_COLORS[level.phase][1]})`,
              color: C.btnText, letterSpacing: 0.5,
            }}>{t("phase")} {level.phase}</div>
            <span style={{ color: C.textDim, fontSize: 11 }}>{t("day")} {level.day}</span>
            {level.tags.includes("boss") && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, fontWeight: 700 }}>{t("boss")}</span>}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>{levelT.title}</h1>
          <p style={{ color: C.accentTextDim, fontSize: 12, margin: "0 0 14px" }}>{levelT.subtitle}</p>

          {/* Collapsible concept */}
          <button onClick={() => setConceptCollapsed(!conceptCollapsed)} style={{
            width: "100%", background: C.accentBg, border: `1px solid ${C.accentBorder}`,
            borderRadius: 12, padding: conceptCollapsed ? "10px 14px" : "14px 16px",
            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            transition: "all 0.3s ease", marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.5 }}>{t("concept")}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accentTextDim} strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.3s", transform: conceptCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div style={{ overflow: "hidden", maxHeight: conceptCollapsed ? 0 : 200, opacity: conceptCollapsed ? 0 : 1, transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out" }}>
              <p style={{ color: C.accentText, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>{levelT.concept}</p>
            </div>
          </button>

          <div style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 6px" }}>{t("task")}</p>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{levelT.task}</p>
          </div>
        </div>

        {/* Editor + Output area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 20px 16px", minHeight: 0 }}>
          {isWide ? (
            /* Desktop: side-by-side */
            <div style={{ flex: 1, display: "flex", gap: 12, minHeight: 280 }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {editorPanel}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                {outputPanel}
              </div>
            </div>
          ) : (
            /* Mobile: tabs */
            <>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {["editor", "output"].map(tb => (
                  <button key={tb} onClick={() => setTab(tb)} style={{
                    padding: "8px 20px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                    border: `1px solid ${tab === tb ? C.accentBorder : "transparent"}`,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    background: tab === tb ? C.accentBg : "transparent",
                    color: tab === tb ? C.accentText : C.accentTextDim,
                  }}
                    onMouseEnter={e => { if (tab !== tb) e.target.style.color = C.accentText; }}
                    onMouseLeave={e => { if (tab !== tb) e.target.style.color = C.accentTextDim; }}
                  >
                    {tb === "editor" ? t("editor") : `${t("output")} ${isEvaluating ? "" : feedback ? (feedback.correct ? " \u2713" : " \u2717") : ""}`}
                    {tb === "output" && isEvaluating && <span style={{ display: "inline-block", marginLeft: 6, width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: "dotBounce 1.4s ease-in-out infinite" }} />}
                  </button>
                ))}
              </div>
              {tab === "editor" ? editorPanel : outputPanel}
            </>
          )}

          {showHint && (
            <div style={{
              marginTop: 10, background: C.amberBg, border: `1px solid ${C.amberBorder}`,
              borderRadius: 12, padding: "12px 16px",
              animation: "fadeSlideUp 0.3s ease-out",
            }}>
              <p style={{ color: C.amberText, fontSize: 12, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                <span style={{ fontWeight: 700, marginRight: 6 }}>{t("hint")}:</span>{levelT.hint}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{
        position: "sticky", bottom: 0,
        background: C.bgGlassStrong, backdropFilter: "blur(24px)",
        borderTop: `1px solid ${C.border}`, padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 8, zIndex: 30,
      }}>
        <button onClick={() => setShowHint(!showHint)} style={{
          padding: "10px 16px", borderRadius: 12, fontSize: 12, fontWeight: 600,
          background: C.amberBg, color: C.amber,
          border: `1px solid ${C.amberBorder}`, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(245,158,11,0.15)"; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = C.amberBg; e.target.style.transform = "translateY(0)"; }}
        >{showHint ? t("hideHint") : t("hint")}</button>

        <button onClick={handleReset} style={{
          padding: "10px 16px", borderRadius: 12, fontSize: 12, fontWeight: 600,
          background: "rgba(255,255,255,0.03)", color: C.accentTextDim,
          border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.borderColor = C.borderFocus; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.borderColor = C.border; e.target.style.transform = "translateY(0)"; }}
        >{t("reset")}</button>

        <button onClick={handleSubmit} disabled={isEvaluating} style={{
          flex: 1, padding: "12px 0", borderRadius: 12, fontSize: 14, fontWeight: 700,
          color: C.btnText, border: "none", fontFamily: "inherit",
          cursor: isEvaluating ? "not-allowed" : "pointer",
          background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
          boxShadow: `0 4px 24px ${C.accentGlow}`,
          opacity: isEvaluating ? 0.6 : 1, transition: "all 0.2s",
        }}
          onMouseEnter={e => { if (!isEvaluating) { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 6px 32px ${C.accentGlow}`; }}}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 24px ${C.accentGlow}`; }}
        >
          {isEvaluating ? t("evaluating") : <>{`${t("runCode")} \u25B6`}<span style={{ fontSize: 10, opacity: 0.45, marginLeft: 10 }}>{isMac ? "\u2318" : "Ctrl"}+Enter</span></>}
        </button>

        {feedback?.correct && currentLevel < LEVELS.length - 1 && (
          <button onClick={() => setCurrentLevel(prev => Math.min(prev + 1, LEVELS.length - 1))} style={{
            padding: "12px 20px", borderRadius: 12, fontSize: 13, fontWeight: 700,
            background: C.greenBg, color: C.green,
            border: `1px solid ${C.greenBorder}`, cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.2s", animation: "fadeSlideUp 0.3s ease-out",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(16,185,129,0.15)"; e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { e.target.style.background = C.greenBg; e.target.style.transform = "translateY(0)"; }}
          >{t("next")} &rarr;</button>
        )}
      </div>
      <style>{getGlobalStyles(C)}</style>
    </div>
  );
}

function getGlobalStyles(theme) {
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
const globalStyles = getGlobalStyles(DARK);
