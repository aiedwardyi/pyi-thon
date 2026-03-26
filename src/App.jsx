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

// ─── OFFLINE EVALUATOR ───
// Helpers
function _extractStrings(code) {
  const strs = [];
  const re = /(?:f?)("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
  let m;
  while ((m = re.exec(code)) !== null) {
    let s = m[0];
    if (s.startsWith("f")) s = s.slice(1);
    if (s.startsWith('"""') || s.startsWith("'''")) s = s.slice(3, -3);
    else s = s.slice(1, -1);
    strs.push(s);
  }
  return strs;
}
function _stripStringsAndComments(code) {
  return code.replace(/("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, '""').replace(/#.*/g, "");
}
function _has(code, ...words) { const lc = code.toLowerCase(); return words.every(w => lc.includes(w)); }
function _hasAny(code, ...words) { const lc = code.toLowerCase(); return words.some(w => lc.includes(w)); }
function _fail(msg) { return { correct: false, feedback: msg, explanation: "" }; }
function _pass() { return { correct: true, feedback: "Looks correct! (Offline mode)", explanation: "" }; }

function evaluateOffline(userCode, level) {
  const code = userCode.trim();
  const lc = code.toLowerCase();
  const expected = level.expectedOutput.trim();
  if (!code || code === level.starterCode.trim()) return _fail("Write some code first!");

  // Basic syntax: catch garbage after statements
  const stripped = _stripStringsAndComments(code);
  for (const line of stripped.split("\n")) {
    const t = line.trim();
    if (!t) continue;
    const after = t.match(/[)\]]\s+(.+)\s*$/);
    if (after) {
      const extra = after[1].trim();
      if (extra.startsWith("#")) continue;
      // Allow operators, comparisons, arithmetic, colons, parens, brackets after ) or ]
      if (/^[+\-*/%<>=!&|^~:.,()\[\]{]/.test(extra)) continue;
      const fw = extra.split(/\s/)[0];
      const ok = new Set(["if","else","elif","for","while","and","or","not","in","is","as","lambda","def","class","return","import","from","try","except","finally","with","break","continue","pass","raise","yield","del","assert","global","nonlocal"]);
      if (!ok.has(fw)) return _fail(`This wouldn't run in Python — unexpected "${extra}" after the statement.`);
    }
  }

  // Check for bare undefined identifiers in assignments (e.g. name = eddiee without quotes)
  const assignLines = stripped.split("\n").map(l => l.trim()).filter(l => l.match(/^\w+\s*=\s*[a-zA-Z]/));
  const pyAll = new Set(["True","False","None","int","str","float","list","dict","set","tuple","type","len","range","print","input","sum","min","max","abs","round","sorted","enumerate","zip","map","filter","open","isinstance","bool","super","not"]);
  for (const aline of assignLines) {
    const rhsMatch = aline.match(/=\s*([a-zA-Z_]\w*)\s*$/);
    if (rhsMatch) {
      const rhs = rhsMatch[1];
      if (!pyAll.has(rhs) && !aline.startsWith(rhs)) {
        // Check if rhs was defined earlier in code
        const defRegex = new RegExp(`^\\s*${rhs}\\s*=`, "m");
        if (!defRegex.test(stripped.split(aline)[0] || "")) {
          return _fail(`"${rhs}" is not defined. Did you forget to wrap it in quotes?`);
        }
      }
    }
  }

  // Must have print() for levels expecting output
  if (expected && !_has(code, "print")) return _fail("Don't forget to use print() to display your output.");

  const strs = _extractStrings(code);
  const id = level.id;

  // ─── PER-LEVEL VALIDATION ───
  switch (id) {
    case 1: // Hello, World! — must print exact string
      if (!strs.includes("Hello, World!")) return _fail('Your string must be exactly "Hello, World!" — check capitalization and punctuation.');
      return _pass();

    case 2: // Variables — must assign variable AND use it in print (not hardcode)
      if (!strs.includes("Alice")) return _fail('Set name to "Alice" (with quotes).');
      if (!stripped.includes("print") || stripped.match(/print\s*\(\s*""/)) {
        // print("") means they're printing a hardcoded string — check if they used the variable
        if (!stripped.match(/print\s*\(\s*\w+\s*\)/) && !_has(stripped, "print(name")) return _fail("Use print(name) to print the variable, not print(\"Alice\").");
      }
      if (!stripped.match(/name\s*=/)) return _fail('Create a variable called "name" using = assignment.');
      return _pass();

    case 3: // String concat — need name, age, str(), concatenation
      if (!strs.includes("Alice")) return _fail('Set name to "Alice".');
      if (!_has(code, "25") && !_has(code, "age")) return _fail("Set age = 25.");
      if (!_has(lc, "str(") && !_has(lc, "f\"") && !_has(lc, "f'") && !_has(lc, "format")) return _fail("Convert age to string with str(age), an f-string, or .format().");
      if (!strs.some(s => s.includes("Alice is 25") || s.includes("{") || s.includes("+"))) {
        if (!_has(code, "+") && !_has(lc, "f\"") && !_has(lc, "f'")) return _fail('Use + to concatenate strings, or use an f-string.');
      }
      return _pass();

    case 4: // Input — must use input()
      if (!_has(lc, "input(")) return _fail("Use input() to ask the user for their name.");
      if (!_has(lc, "hello")) return _fail('Your output should start with "Hello, ".');
      return _pass();

    case 5: // If/else — must use if and else
      if (!_has(lc, "if ") || !_has(lc, "else")) return _fail("Use both if and else for this task.");
      if (!strs.includes("pass")) return _fail('Print "pass" when score >= 70.');
      return _pass();

    case 6: // Elif — must use elif
      if (!_has(lc, "elif")) return _fail("Use elif for multiple conditions.");
      return _pass();

    case 7: // For loop — must use for and range
      if (!_has(lc, "for ") || !_has(lc, "range")) return _fail("Use a for loop with range().");
      return _pass();

    case 8: // While loop — must use while
      if (!_has(lc, "while ")) return _fail("Use a while loop for this task.");
      return _pass();

    case 9: // Interactive loop — while + input
      if (!_has(lc, "while ") || !_has(lc, "input(")) return _fail("Use a while loop with input().");
      return _pass();

    case 10: // Running total — for loop + accumulator
      if (!_has(lc, "for ") && !_has(lc, "while ")) return _fail("Use a loop to calculate the sum.");
      if (!_has(code, "total") && !_has(code, "sum") && !_has(code, "result")) return _fail("Use an accumulator variable (like total = 0) to track the sum.");
      return _pass();

    case 11: // Averages — division
      if (!_has(code, "/")) return _fail("Use / to divide for the average.");
      return _pass();

    case 12: // Sentinel loop — while True + break
      if (!_has(lc, "while") || !_has(lc, "break")) return _fail('Use "while True" with "break" for the sentinel pattern.');
      if (!_has(lc, "input(")) return _fail("Use input() to read values.");
      return _pass();

    case 13: // Functions — def + return
      if (!_has(lc, "def ")) return _fail("Define a function using def.");
      if (!_has(lc, "return")) return _fail("Use return to send back the result.");
      if (!_has(lc, "double")) return _fail('Name your function "double".');
      return _pass();

    case 14: // Multiple params — def with 2 params
      if (!_has(lc, "def ")) return _fail("Define a function using def.");
      if (!stripped.match(/def\s+greet\s*\(/)) return _fail('Name your function "greet".');
      if (!_has(lc, "return")) return _fail("Use return to send back the result.");
      return _pass();

    case 15: // Lists — create + index
      if (!_has(code, "[") || !_has(code, "]")) return _fail("Create a list using [ ] brackets.");
      if (!_has(code, "[1]") && !_has(code, "[ 1]") && !_has(code, "[1 ]")) return _fail("Access the second item using index [1].");
      return _pass();

    case 16: // List methods — append + len
      if (!_has(lc, "append")) return _fail("Use .append() to add an item.");
      if (!_has(lc, "len(")) return _fail("Use len() to get the length.");
      return _pass();

    case 17: // Dicts — create + access
      if (!_has(code, "{") || !_has(code, "}")) return _fail("Create a dictionary using { } braces.");
      if (!strs.includes("Alice")) return _fail('Use "Alice" as the name value.');
      return _pass();

    case 18: // Dict loop — .items()
      if (!_has(lc, ".items()")) return _fail("Use .items() to loop through key-value pairs.");
      if (!_has(lc, "for ")) return _fail("Use a for loop.");
      return _pass();

    case 19: // Mini app — list + while + input + append
      if (!_has(lc, "while") || !_has(lc, "input(") || !_has(lc, "append")) return _fail("Use a while loop with input() and .append().");
      return _pass();

    case 20: // File I/O — open + write + read
      if (!_has(lc, "open(")) return _fail("Use open() to work with files.");
      if (!_has(lc, '"w"') && !_has(lc, "'w'")) return _fail('Open the file in write mode with "w".');
      return _pass();

    case 21: // Try/except
      if (!_has(lc, "try") || !_has(lc, "except")) return _fail("Use try/except to handle the error.");
      if (!strs.includes("Not a number")) return _fail('Print "Not a number" in the except block.');
      return _pass();

    case 22: // Classes
      if (!_has(lc, "class ")) return _fail("Define a class using the class keyword.");
      if (!_has(lc, "__init__")) return _fail("Add an __init__ method.");
      if (!_has(lc, "self")) return _fail("Use self to refer to the instance.");
      return _pass();

    case 23: // JSON
      if (!_has(lc, "import json")) return _fail("Import the json module first.");
      if (!_has(lc, "json.dumps") || !_has(lc, "json.loads")) return _fail("Use json.dumps() and json.loads().");
      return _pass();

    case 24: // Import + structure
      if (!_has(lc, "import math")) return _fail("Import the math module.");
      if (!_has(lc, "def ")) return _fail("Define a function for circle_area.");
      if (!_has(lc, "math.pi")) return _fail("Use math.pi for the value of pi.");
      return _pass();

    case 25: // Graduation
      if (!_has(lc, "def ")) return _fail("Define a get_average function.");
      if (!_has(code, "{") || !_has(code, "}")) return _fail("Create a scores dictionary.");
      if (!_has(lc, "sum(") || !_has(lc, "len(")) return _fail("Use sum() and len() to calculate the average.");
      return _pass();

    case 26: // List comprehension
      if (!code.match(/\[.+for .+ in .+\]/)) return _fail("Use a list comprehension: [expr for x in iterable].");
      return _pass();

    case 27: // String methods
      if (!_has(lc, ".split(") || !_has(lc, ".join(")) return _fail("Use .split() and .join().");
      return _pass();

    case 28: // F-strings
      if (!_has(lc, 'f"') && !_has(lc, "f'")) return _fail("Use an f-string: f\"...{variable}...\"");
      if (!_has(code, "{") || !_has(code, "}")) return _fail("Put variables inside { } in the f-string.");
      return _pass();

    case 29: // Lambda + map
      if (!_has(lc, "lambda")) return _fail("Use a lambda function.");
      if (!_has(lc, "map(")) return _fail("Use map() to apply the function.");
      return _pass();

    case 30: // Data pipeline
      if (!_has(lc, "for ")) return _fail("Use a for loop to iterate through students.");
      if (!_has(lc, "if ")) return _fail("Use an if statement to filter by score.");
      if (!_has(code, '["score"]') && !_has(code, "['score']") && !_has(code, ".score")) return _fail('Access scores with student["score"].');
      return _pass();

    default:
      // Generic fallback
      return _pass();
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
const PHASE_COLORS = { 1: [C.accentDark, C.accent], 2: ["#0ea5e9", "#38bdf8"], 3: ["#f59e0b", "#fbbf24"] };

// ─── LOCAL STORAGE ───
const STORAGE_KEY = "pyithon-progress";
function loadProgress() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error("Save failed:", e); }
}

// ─── CLAUDE API EVALUATOR (with timeout + error handling) ───
async function evaluateWithClaude(userCode, level, apiKey) {
  const prompt = `You are a Python code evaluator. Determine if the student's code is functionally correct.

RULES:
- Would this code produce the expected output in Python 3?
- Accept creative solutions (different variable names, different approaches).
- Code must be valid Python that would run.
- For simulated input, assume input() receives values in order.
- Be encouraging but honest.

TASK: ${level.task}
EXPECTED OUTPUT: ${level.expectedOutput}
${level.simulatedInput ? `SIMULATED INPUT: ${level.simulatedInput}` : ""}
HINT (reference solution): ${level.hint}

STUDENT CODE:
\`\`\`python
${userCode}
\`\`\`

Is this functionally correct? Respond ONLY with JSON, no markdown fences:
{"correct": true/false, "feedback": "brief message", "explanation": "1-2 sentences"}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch("/api/claude/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return { correct: false, feedback: `API error (${response.status}): ${errText.substring(0, 150)}`, explanation: "" };
    }

    const data = await response.json();

    if (data.error) {
      return { correct: false, feedback: "API error: " + (data.error.message || JSON.stringify(data.error)), explanation: "" };
    }

    const text = (data.content || []).map(b => b.text || "").join("").trim();
    if (!text) {
      return { correct: false, feedback: "Empty response from Claude. Check your API key.", explanation: "" };
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
      return { correct: false, feedback: "Request timed out after 30s. Check your internet connection.", explanation: "" };
    }
    return { correct: false, feedback: "Network error: " + err.message, explanation: "" };
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

  const level = LEVELS[currentLevel];
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
  useEffect(() => { localStorage.setItem("pyithon-theme", darkMode ? "dark" : "light"); }, [darkMode]);

  // Welcome typing animation
  useEffect(() => {
    if (!showWelcome) return;
    const tagline = "Master Python from scratch.\nNo AI. No autocomplete. Just you.";
    if (typedChars >= tagline.length) return;
    const t = setInterval(() => setTypedChars(c => { if (c >= tagline.length) { clearInterval(t); return c; } return c + 1; }), 45);
    return () => clearInterval(t);
  }, [showWelcome, typedChars]);

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
      localStorage.setItem("pyithon-api-key", apiKeyInput.trim());
      setShowApiSetup(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (isEvaluating) return;
    if (!offlineMode && !apiKey) { setShowApiSetup(true); return; }
    const userCode = code.trim();
    if (!userCode || userCode === level.starterCode.trim()) {
      setFeedback({ correct: false, message: "Write some code first!", expected: level.expectedOutput });
      setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
      playTone(330, 0.15, "triangle");
      return;
    }
    const expected = level.expectedOutput.trim();
    setIsEvaluating(true); setFeedback(null); setTab("output");
    try {
      const result = offlineMode ? evaluateOffline(userCode, level) : await evaluateWithClaude(userCode, level, apiKey);
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
  }, [code, level, completedLevels, bestStreak, streak, apiKey, isEvaluating, playTone, offlineMode]);

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
            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>Settings</h2>
            <button onClick={() => setShowApiSetup(false)} style={{ color: C.textDim, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          {/* Theme toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>{darkMode ? "Dark" : "Light"} Mode</p>
              <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>Switch appearance</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} style={toggleStyle(!darkMode)}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>

          {/* Offline mode toggle */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.border}` }}>
            <div>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: 0 }}>Offline Mode</p>
              <p style={{ color: C.textDim, fontSize: 12, margin: "2px 0 0" }}>{offlineMode ? "Pattern matching (no API)" : "Claude evaluates your code"}</p>
            </div>
            <button onClick={() => setOfflineMode(!offlineMode)} style={toggleStyle(offlineMode)}>
              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "all 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
            </button>
          </div>

          {/* API Key */}
          {!offlineMode && (
            <div style={{ paddingTop: 16 }}>
              <p style={{ color: C.text, fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>API Key</p>
              <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.6, margin: "0 0 12px" }}>
                Get a key at <span style={{ color: C.accent }}>console.anthropic.com</span>
              </p>
              <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={apiKey ? "••••••••" : "sk-ant-..."}
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
              }}>Save Key</button>
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
            {"Master Python from scratch.\nNo AI. No autocomplete. Just you.".substring(0, typedChars).split("\n").map((line, i, arr) => <span key={i}>{line}{i < arr.length - 1 && <br />}</span>)}
            <span style={{ display: "inline-block", width: 2, height: "1em", background: C.accent, marginLeft: 2, animation: "blink 1s step-end infinite", verticalAlign: "text-bottom" }} />
          </p>
          <p style={{ color: C.accentTextDim, fontSize: 12, marginBottom: 48, letterSpacing: 2, textTransform: "uppercase" }}>30 levels &middot; 3 phases &middot; Local Edition</p>

          <button onClick={() => setShowWelcome(false)} style={{
            padding: "16px 52px", borderRadius: 14, fontWeight: 700, color: C.btnText, fontSize: 16,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
            boxShadow: `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
            transition: "all 0.3s ease", animation: "gentlePulse 2.5s ease-in-out infinite",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px) scale(1.02)"; e.target.style.boxShadow = `0 12px 48px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.15)`; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0) scale(1)"; e.target.style.boxShadow = `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`; }}
          >Start Learning</button>

          <button onClick={() => { setShowWelcome(false); setShowApiSetup(true); }} style={{
            marginTop: 16, color: C.accentTextDim, fontSize: 13, background: "none",
            border: "none", cursor: "pointer", fontFamily: "inherit", transition: "color 0.2s",
          }}
            onMouseEnter={e => e.target.style.color = C.accentText}
            onMouseLeave={e => e.target.style.color = C.accentTextDim}
          >Configure API Key</button>
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
            <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>All Levels</h2>
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
                <span style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: -0.3 }}>{PHASE_NAMES[phase]}</span>
                <div style={{ flex: 1, height: 1, background: C.border }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {LEVELS.filter(l => l.phase === phase).map(l => {
                  const idx = LEVELS.indexOf(l);
                  const done = completedLevels.has(l.id);
                  const unlocked = idx < unlockedUpTo || done;
                  const curr = idx === currentLevel;
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
                        <p style={{ fontSize: 13, fontWeight: 600, color: done ? C.greenLight : unlocked ? C.text : C.textDim, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</p>
                        <p style={{ fontSize: 11, color: C.accentTextDim, margin: "3px 0 0" }}>{l.subtitle}</p>
                      </div>
                      {l.tags.includes("boss") && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, fontWeight: 700, letterSpacing: 0.5 }}>BOSS</span>}
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
          <span style={{ fontSize: 10, color: C.textDim }}>Python 3</span>
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
          <p style={{ color: C.accentTextDim, fontSize: 13, fontWeight: 600, margin: 0, letterSpacing: 0.5 }}>Claude is evaluating...</p>
        </div>
      ) : feedback ? (
        <div style={{
          height: "100%", borderRadius: 14, padding: 20, overflowY: "auto",
          border: `1px solid ${C.border}`,
          background: C.bgCard,
        }}>
          {/* Result header — colored accent only on icon */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              background: feedback.correct ? C.green : C.red,
            }}>
              {feedback.correct
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{feedback.correct ? "Correct!" : "Not quite"}</span>
              <p style={{ fontSize: 12, color: C.textDim, margin: "2px 0 0", lineHeight: 1.5 }}>{feedback.message}</p>
            </div>
            {feedback.correct && <span style={{ fontSize: 12, color: C.amber, fontWeight: 700, background: C.amberBg, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.amberBorder}` }}>+100 XP</span>}
          </div>

          {/* Claude says — only shown in online mode */}
          {feedback.aiExplanation && !offlineMode && (
            <div style={{
              marginBottom: 16, borderRadius: 10, padding: 14, position: "relative",
              background: C.accentBg, border: `1px solid ${C.accentBorder}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill={C.accent}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>
                <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.5 }}>Claude says</span>
              </div>
              <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{feedback.aiExplanation}</p>
            </div>
          )}

          {/* Expected output */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Expected Output</p>
            <pre style={{
              background: C.codeBg, borderRadius: 10, padding: 14, color: C.codeText, fontSize: 12,
              overflowX: "auto", fontFamily: monoFont, margin: 0, whiteSpace: "pre-wrap",
              border: `1px solid ${C.borderLight}`,
            }}>{feedback.expected}</pre>
          </div>

          {/* Concept */}
          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.textDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 6px" }}>Concept</p>
            <p style={{ color: C.textDim, fontSize: 12, lineHeight: 1.7, margin: 0 }}>{level.explanation}</p>
          </div>
        </div>
      ) : (
        <div style={{
          height: "100%", borderRadius: 14, border: `1px solid ${C.border}`,
          background: C.bgSubtle, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.textDim} strokeWidth="1.5" strokeLinecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
          <p style={{ color: C.textDim, fontSize: 13 }}>Run your code to see output</p>
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
            <span style={{ fontSize: 11, fontWeight: 600 }}>Levels</span>
          </button>

          <div style={{ flex: 1, margin: "0 20px", maxWidth: 280 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: C.accentTextDim, fontWeight: 600 }}>Level {level.id}</span>
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
            }}>Phase {level.phase}</div>
            <span style={{ color: C.textDim, fontSize: 11 }}>Day {level.day}</span>
            {level.tags.includes("boss") && <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, fontWeight: 700 }}>BOSS</span>}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>{level.title}</h1>
          <p style={{ color: C.accentTextDim, fontSize: 12, margin: "0 0 14px" }}>{level.subtitle}</p>

          {/* Collapsible concept */}
          <button onClick={() => setConceptCollapsed(!conceptCollapsed)} style={{
            width: "100%", background: C.accentBg, border: `1px solid ${C.accentBorder}`,
            borderRadius: 12, padding: conceptCollapsed ? "10px 14px" : "14px 16px",
            cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            transition: "all 0.3s ease", marginBottom: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.5 }}>Concept</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.accentTextDim} strokeWidth="2" strokeLinecap="round" style={{ transition: "transform 0.3s", transform: conceptCollapsed ? "rotate(0deg)" : "rotate(180deg)" }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            <div style={{ overflow: "hidden", maxHeight: conceptCollapsed ? 0 : 200, opacity: conceptCollapsed ? 0 : 1, transition: "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out" }}>
              <p style={{ color: C.accentText, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>{level.concept}</p>
            </div>
          </button>

          <div style={{ background: "rgba(255,255,255,0.015)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 6px" }}>Task</p>
            <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{level.task}</p>
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
                {["editor", "output"].map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    padding: "8px 20px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                    border: `1px solid ${tab === t ? C.accentBorder : "transparent"}`,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
                    background: tab === t ? C.accentBg : "transparent",
                    color: tab === t ? C.accentText : C.accentTextDim,
                  }}
                    onMouseEnter={e => { if (tab !== t) e.target.style.color = C.accentText; }}
                    onMouseLeave={e => { if (tab !== t) e.target.style.color = C.accentTextDim; }}
                  >
                    {t === "editor" ? "Editor" : `Output ${isEvaluating ? "" : feedback ? (feedback.correct ? " \u2713" : " \u2717") : ""}`}
                    {t === "output" && isEvaluating && <span style={{ display: "inline-block", marginLeft: 6, width: 6, height: 6, borderRadius: "50%", background: C.accent, animation: "dotBounce 1.4s ease-in-out infinite" }} />}
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
                <span style={{ fontWeight: 700, marginRight: 6 }}>Hint:</span>{level.hint}
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
        >{showHint ? "Hide Hint" : "Hint"}</button>

        <button onClick={handleReset} style={{
          padding: "10px 16px", borderRadius: 12, fontSize: 12, fontWeight: 600,
          background: "rgba(255,255,255,0.03)", color: C.accentTextDim,
          border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.borderColor = C.borderFocus; e.target.style.transform = "translateY(-1px)"; }}
          onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.borderColor = C.border; e.target.style.transform = "translateY(0)"; }}
        >Reset</button>

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
          {isEvaluating ? "Evaluating..." : <>{`Run Code \u25B6`}<span style={{ fontSize: 10, opacity: 0.45, marginLeft: 10 }}>{isMac ? "\u2318" : "Ctrl"}+Enter</span></>}
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
          >Next &rarr;</button>
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
