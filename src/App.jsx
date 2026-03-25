import { useState, useEffect, useRef, useCallback } from "react";

// ─── COLOR PALETTE (Blue-Violet Premium Dark) ───
const C = {
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
};

// ─── LEVEL DATA ───
const LEVELS = [
  { id: 1, phase: 1, day: "1", title: "Hello, World!", subtitle: "Your first print statement", concept: "The print() function outputs text to the screen. Text must be wrapped in quotes.", task: 'Use print() to display exactly: Hello, World!', hint: 'Remember: print("text goes here")', starterCode: '# Your first Python program\n', expectedOutput: "Hello, World!", explanation: 'print() is Python\'s built-in function for displaying output. Strings (text) must be wrapped in quotes — single or double.', tags: ["print", "strings"] },
  { id: 2, phase: 1, day: "1", title: "Variables & Assignment", subtitle: "Storing values in named containers", concept: "Variables store data. Use = to assign a value. Python figures out the type automatically.", task: 'Create a variable called name set to "eddie", then print it.', hint: 'Two lines: assign the variable, then print(variable_name)', starterCode: '# Create a variable and print it\n', expectedOutput: "eddie", explanation: 'Variables are like labeled boxes. name = "eddie" creates a box labeled "name" containing the text "eddie".', tags: ["variables", "assignment"] },
  { id: 3, phase: 1, day: "1", title: "String Concatenation", subtitle: "Combining strings with +", concept: "The + operator joins strings together. Numbers must be converted with str() first.", task: 'Create name = "eddie" and age = 38, then print: "eddie is 38"', hint: "Use + to join strings. Remember str(age) to convert the integer!", starterCode: '# Combine strings and numbers\n', expectedOutput: "eddie is 38", explanation: 'Strings and integers can\'t be directly concatenated. str() converts a number to a string so + can join them.', tags: ["strings", "str()", "concatenation"] },
  { id: 4, phase: 1, day: "1", title: "User Input", subtitle: "Getting data from the user", concept: "input() pauses the program and waits for the user to type something. It always returns a string.", task: 'Write code that asks "What is your name? " and prints: Hello, <n>', hint: 'name = input("question") then print("Hello, " + name)', starterCode: '# Ask for input and greet the user\n', expectedOutput: "Hello, Claude", simulatedInput: "Claude", explanation: 'input("prompt") displays the prompt and waits. The returned value is always a string.', tags: ["input", "strings"] },
  { id: 5, phase: 1, day: "2", title: "If/Else Logic", subtitle: "Making decisions in code", concept: "if checks a condition. If True, the indented block runs. else runs when the condition is False.", task: 'Set score = 85. If score >= 70, print "pass". Otherwise print "fail".', hint: "if score >= 70:\\n    print(...)\\nelse:\\n    print(...)", starterCode: "# Check if the score is passing\nscore = 85\n", expectedOutput: "pass", explanation: 'if/else creates a branch — the program takes one path or the other based on the condition.', tags: ["if", "else", "comparison"] },
  { id: 6, phase: 1, day: "2", title: "Elif Chains", subtitle: "Multiple conditions", concept: "elif (else-if) lets you check additional conditions. Python checks top to bottom and runs the FIRST match.", task: 'Set grade = 82. Print "A" if >= 90, "B" if >= 80, "C" if >= 70, else "F".', hint: "if grade >= 90:\\n    ...\\nelif grade >= 80:\\n    ...\\nelif ...", starterCode: "# Grade classifier\ngrade = 82\n", expectedOutput: "B", explanation: 'elif chains check conditions in order. Once a match is found, the rest are skipped.', tags: ["elif", "conditions"] },
  { id: 7, phase: 1, day: "3", title: "For Loops", subtitle: "Repeating with range()", concept: "for i in range(n) repeats a block n times. i starts at 0 and goes to n-1.", task: "Print the numbers 0 through 4, each on a new line.", hint: "for i in range(5):\\n    print(i)", starterCode: "# Print 0 to 4\n", expectedOutput: "0\n1\n2\n3\n4", explanation: 'range(5) generates 0, 1, 2, 3, 4.', tags: ["for", "range"] },
  { id: 8, phase: 1, day: "3", title: "While Loops", subtitle: "Looping until a condition is false", concept: "while condition: keeps looping as long as the condition is True. You must change the condition inside!", task: "Use a while loop to print numbers 1 through 5.", hint: "count = 1\\nwhile count <= 5:\\n    print(count)\\n    count = count + 1", starterCode: "# Count from 1 to 5 using while\n", expectedOutput: "1\n2\n3\n4\n5", explanation: 'While loops check their condition before each iteration.', tags: ["while", "counter"] },
  { id: 9, phase: 1, day: "4", title: "Interactive Loop", subtitle: "Combining input() and while", concept: "You can use input() inside a while loop to repeatedly ask the user for data.", task: 'Ask the user for a number 3 times and print each one.', hint: "count = 0\\nwhile count < 3:\\n    num = input(...)\\n    print(num)\\n    count = count + 1", starterCode: "# Ask for 3 numbers\n", expectedOutput: "10\n20\n30", simulatedInput: "10\n20\n30", explanation: 'Combining loops with input() creates interactive programs.', tags: ["while", "input", "interactive"] },
  { id: 10, phase: 1, day: "4b", title: "Running Total", subtitle: "The accumulator pattern", concept: "Start a variable at 0 before the loop. Add to it each iteration. This is the accumulator pattern.", task: "Calculate the sum of numbers 1 through 5 using a loop. Print the total.", hint: "total = 0\\nfor i in range(1, 6):\\n    total = total + i\\nprint(total)", starterCode: "# Sum 1 + 2 + 3 + 4 + 5\n", expectedOutput: "15", explanation: 'The accumulator pattern: (1) initialize total = 0, (2) loop and add, (3) use total after the loop.', tags: ["accumulator", "total", "for"] },
  { id: 11, phase: 1, day: "4b", title: "Averages", subtitle: "Total divided by count", concept: "Average = total / count. The / operator returns a float (decimal).", task: "Calculate the average of 10, 20, and 30. Print the result.", hint: "total = 10 + 20 + 30\\naverage = total / 3\\nprint(average)", starterCode: "# Find the average\n", expectedOutput: "20.0", explanation: '/ always returns a float in Python 3 (20.0 not 20).', tags: ["division", "average", "float"] },
  { id: 12, phase: 1, day: "5", title: "Sentinel Loop", subtitle: 'User-controlled exit with "done"', concept: 'A sentinel loop runs until the user types a special keyword (like "done") to stop.', task: 'Read numbers from input until "done" is typed. Print the sum. Inputs: 5, 10, 15, done.', hint: 'total = 0\\nwhile True:\\n    val = input(...)\\n    if val == "done":\\n        break\\n    total = total + int(val)\\nprint(total)', starterCode: '# Sum numbers until "done"\n', expectedOutput: "30", simulatedInput: "5\n10\n15\ndone", explanation: '"while True" + "break" is the sentinel pattern.', tags: ["sentinel", "break", "while True"] },
  { id: 13, phase: 1, day: "6", title: "Functions: def & return", subtitle: "Building reusable blocks", concept: "def creates a function. return sends a value back.", task: "Write a function called double that takes a number and returns it times 2. Print double(7).", hint: "def double(n):\\n    return n * 2\\nprint(double(7))", starterCode: "# Define a function that doubles\n", expectedOutput: "14", explanation: '"def" defines, parameters go in parentheses, "return" sends back the result.', tags: ["def", "return", "functions"] },
  { id: 14, phase: 1, day: "6", title: "Multiple Parameters", subtitle: "Functions with several inputs", concept: "Functions can accept multiple parameters, separated by commas.", task: 'Write greet(name, greeting) that returns greeting + ", " + name. Print greet("Eddie", "Hello").', hint: 'def greet(name, greeting):\\n    return greeting + ", " + name', starterCode: "# Function with two parameters\n", expectedOutput: "Hello, Eddie", explanation: 'Parameters are variable names in the definition. Arguments are the actual values you pass in.', tags: ["parameters", "arguments", "functions"] },
  { id: 15, phase: 1, day: "7", title: "Lists: Create & Access", subtitle: "Ordered collections of items", concept: "Lists hold multiple values in order. Access items by index starting at 0.", task: 'Create fruits = ["apple", "banana", "cherry"]. Print the second item.', hint: "Index 0 is the first, index 1 is the second.", starterCode: "# Create a list and access an item\n", expectedOutput: "banana", explanation: 'Lists are indexed starting at 0.', tags: ["lists", "indexing"] },
  { id: 16, phase: 1, day: "7", title: "List Methods", subtitle: "append, pop, and len", concept: ".append(item) adds to the end. len() returns length.", task: 'Start with nums = [1, 2, 3]. Append 4, then print the length.', hint: "nums.append(4)\\nprint(len(nums))", starterCode: "# Modify a list\nnums = [1, 2, 3]\n", expectedOutput: "4", explanation: '.append() modifies the list in-place. len() is a built-in.', tags: ["append", "pop", "len", "methods"] },
  { id: 17, phase: 1, day: "7", title: "Dictionaries", subtitle: "Key-value pairs", concept: 'Dicts store key: value pairs inside {}. Access values by key name.', task: 'Create person = {"name": "Eddie", "age": 38}. Print person["name"].', hint: 'Use curly braces and "key": value syntax.', starterCode: "# Create a dictionary\n", expectedOutput: "Eddie", explanation: 'Dicts map keys to values. JSON is essentially nested dictionaries.', tags: ["dict", "keys", "values"] },
  { id: 18, phase: 1, day: "7", title: "Looping Through a Dict", subtitle: "Iterating keys and values", concept: ".items() returns key-value pairs you can loop over.", task: 'Create scores = {"math": 90, "science": 85}. Loop and print each like: math: 90', hint: 'for subject, score in scores.items():\\n    print(subject + ": " + str(score))', starterCode: "# Loop through a dictionary\n", expectedOutput: "math: 90\nscience: 85", explanation: '.items() unpacks each pair into two variables.', tags: ["dict", "items", "for"] },
  { id: 19, phase: 2, day: "8", title: "Mini App: To-Do List", subtitle: "Combining everything from Phase 1", concept: "A real program combines lists, loops, input, and functions.", task: 'Create todos list. While loop: ask for task, append unless "done", then print all.', hint: 'todos = []\\nwhile True:\\n    task = input(...)\\n    if task == "done": break\\n    todos.append(task)\\nfor t in todos: print(t)', starterCode: "# Mini to-do app\n", expectedOutput: "Buy milk\nCode", simulatedInput: "Buy milk\nCode\ndone", explanation: 'Combines sentinel loops, lists, append, and iteration.', tags: ["lists", "while", "input", "mini-app"] },
  { id: 20, phase: 2, day: "9", title: "File I/O: Writing", subtitle: "Saving data to a file", concept: 'open("file", "w") creates/overwrites. Use "with" to auto-close.', task: 'Write "Hello from Python" to output.txt, then read and print.', hint: 'with open("output.txt", "w") as f:\\n    f.write(...)\\nwith open("output.txt", "r") as f:\\n    print(f.read())', starterCode: "# Write to a file, then read it\n", expectedOutput: "Hello from Python", explanation: '"with" handles opening AND closing.', tags: ["file", "open", "write", "read"] },
  { id: 21, phase: 2, day: "10", title: "Try/Except", subtitle: "Handling errors gracefully", concept: "try/except catches errors so your program doesn't crash.", task: 'Try to convert "hello" to int. Catch ValueError, print "Not a number".', hint: 'try:\\n    int("hello")\\nexcept ValueError:\\n    print("Not a number")', starterCode: "# Handle a conversion error\n", expectedOutput: "Not a number", explanation: 'try/except wraps risky operations.', tags: ["try", "except", "errors"] },
  { id: 22, phase: 2, day: "11", title: "Classes: Basics", subtitle: "Creating objects with __init__", concept: "A class is a blueprint. __init__ runs on creation. self = the instance.", task: 'Create class Dog with __init__(self, name) and bark() returning name + " says woof!". Print Dog("Rex").bark().', hint: 'class Dog:\\n    def __init__(self, name):\\n        self.name = name\\n    def bark(self):\\n        return self.name + " says woof!"', starterCode: "# Create a class\n", expectedOutput: "Rex says woof!", explanation: 'Classes organize code — __init__ for setup, methods for behavior.', tags: ["class", "__init__", "self", "methods"] },
  { id: 23, phase: 2, day: "12", title: "Working with JSON", subtitle: "Parsing and creating JSON data", concept: "json module converts between JSON strings and dictionaries.", task: 'Import json. Create data = {"project": "Archon", "version": 2}. Dumps then loads, print data["project"].', hint: 'import json\\ndata = {...}\\njson_str = json.dumps(data)\\nparsed = json.loads(json_str)\\nprint(parsed["project"])', starterCode: "# JSON round-trip\n", expectedOutput: "Archon", explanation: 'json.dumps() = dict to string. json.loads() = string to dict.', tags: ["json", "dumps", "loads", "api"] },
  { id: 24, phase: 2, day: "13", title: "Import & Structure", subtitle: "Reading real Python code", concept: "Real files: imports at top, then definitions, then execution.", task: 'Import math, define circle_area(r) returning math.pi * r * r, print rounded to 2 decimals for r=5.', hint: 'import math\\ndef circle_area(r):\\n    return math.pi * r * r\\nprint(round(circle_area(5), 2))', starterCode: "# Module structure pattern\n", expectedOutput: "78.54", explanation: 'Imports → definitions → execution. Every Python file.', tags: ["import", "modules", "structure"] },
  { id: 25, phase: 2, day: "14", title: "Graduation: Score Tracker", subtitle: "Combining classes, dicts, and JSON", concept: "The graduation ties everything together.", task: 'Create scores = {"python": 85, "git": 90}. Write get_average(scores_dict). Print rounded to 1 decimal.', hint: 'def get_average(d):\\n    return sum(d.values()) / len(d)\\nscores = {...}\\nprint(round(get_average(scores), 1))', starterCode: "# Graduation: Score calculator\n", expectedOutput: "87.5", explanation: 'Combines dicts, built-ins (sum, len, round), and custom functions.', tags: ["functions", "dict", "graduation"] },
  { id: 26, phase: 3, day: "Bonus", title: "List Comprehensions", subtitle: "Pythonic one-liners", concept: "[expression for item in iterable] creates lists in one line.", task: "Create a list of squares for 1-5 using a list comprehension. Print it.", hint: "squares = [x * x for x in range(1, 6)]\\nprint(squares)", starterCode: "# One-liner list creation\n", expectedOutput: "[1, 4, 9, 16, 25]", explanation: 'Replaces 4 lines of loop with 1.', tags: ["comprehension", "pythonic"] },
  { id: 27, phase: 3, day: "Bonus", title: "String Methods", subtitle: "split, join, strip, replace", concept: "Strings have powerful built-in methods.", task: 'Set text = "hello world python". Split by spaces, join with hyphens, print.', hint: 'words = text.split(" ")\\nresult = "-".join(words)\\nprint(result)', starterCode: "# String manipulation\n", expectedOutput: "hello-world-python", explanation: '.split() breaks to list. .join() combines list to string.', tags: ["split", "join", "strings"] },
  { id: 28, phase: 3, day: "Bonus", title: "F-Strings", subtitle: "Modern string formatting", concept: 'f"...{variable}..." embeds variables. Cleaner than concatenation.', task: 'Set name = "Eddie", level = 28. Print f-string: "Eddie has reached level 28!"', hint: 'print(f"{name} has reached level {level}!")', starterCode: "# F-string formatting\n", expectedOutput: "Eddie has reached level 28!", explanation: 'F-strings (3.6+) are preferred.', tags: ["f-string", "formatting"] },
  { id: 29, phase: 3, day: "Bonus", title: "Lambda & Map", subtitle: "Inline functions and transformations", concept: "lambda creates anonymous functions. map() applies to every item.", task: "Use map with lambda to triple every number in [1, 2, 3, 4, 5]. Print the list.", hint: "result = list(map(lambda x: x * 3, [1, 2, 3, 4, 5]))\\nprint(result)", starterCode: "# Lambda and map\n", expectedOutput: "[3, 6, 9, 12, 15]", explanation: 'lambda x: x * 3 is a one-line function.', tags: ["lambda", "map", "functional"] },
  { id: 30, phase: 3, day: "Boss", title: "Final Boss: Data Pipeline", subtitle: "Process, transform, and output", concept: "Real programs: parse, transform, output.", task: 'Given students list of dicts (name/score), print only names with scores >= 80.', hint: 'for s in students:\\n    if s["score"] >= 80:\\n        print(s["name"])', starterCode: '# Data pipeline\nstudents = [{"name": "Alice", "score": 92}, {"name": "Bob", "score": 78}, {"name": "Carol", "score": 88}]\n', expectedOutput: "Alice\nCarol", explanation: 'Iterate, filter, extract. The essence of backend programming.', tags: ["filter", "dicts", "lists", "pipeline", "boss"] },
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
  const [completedLevels, setCompletedLevels] = useState(() => new Set([1,2,3,4,5,6,7,8,9,10,11]));
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [totalXP, setTotalXP] = useState(1100);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeEditor, setShakeEditor] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [apiKey, setApiKey] = useState(() => import.meta.env.VITE_ANTHROPIC_API_KEY || localStorage.getItem("pyithon-api-key") || "");
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const editorRef = useRef(null);
  const [tab, setTab] = useState("editor");
  const [isWide, setIsWide] = useState(window.innerWidth >= 900);
  const [conceptCollapsed, setConceptCollapsed] = useState(false);
  const [levelTransition, setLevelTransition] = useState(false);

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

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      localStorage.setItem("pyithon-api-key", apiKeyInput.trim());
      setShowApiSetup(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!apiKey) { setShowApiSetup(true); return; }
    const userCode = code.trim();
    if (!userCode || userCode === level.starterCode.trim()) {
      setFeedback({ correct: false, message: "Write some code first!", expected: level.expectedOutput });
      setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
      return;
    }
    const expected = level.expectedOutput.trim();
    setIsEvaluating(true); setFeedback(null); setTab("output");
    try {
      const result = await evaluateWithClaude(userCode, level, apiKey);
      if (result.correct) {
        setFeedback({ correct: true, message: result.feedback || "Correct!", expected, aiExplanation: result.explanation });
        if (!completedLevels.has(level.id)) {
          const nc = new Set(completedLevels); nc.add(level.id); setCompletedLevels(nc);
          setTotalXP(prev => prev + 100);
        }
        setStreak(prev => { const n = prev + 1; if (n > bestStreak) setBestStreak(n); return n; });
        setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3000);
      } else {
        setFeedback({ correct: false, message: result.feedback || "Not quite right.", expected, aiExplanation: result.explanation });
        setStreak(0); setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
      }
    } catch (err) {
      setFeedback({ correct: false, message: "Error: " + err.message, expected });
    } finally { setIsEvaluating(false); }
  }, [code, level, completedLevels, bestStreak, streak, apiKey]);

  const handleReset = () => { setCode(level.starterCode); setFeedback(null); setShowHint(false); setTab("editor"); };
  const goToLevel = (idx) => { if (idx < unlockedUpTo || completedLevels.has(LEVELS[idx].id)) { setCurrentLevel(idx); setShowLevelSelect(false); } };

  const filename = `level_${String(level.id).padStart(2, "0")}.py`;

  const pageStyle = {
    minHeight: "100vh", background: C.bg, color: C.text,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', monospace",
    colorScheme: "dark",
  };

  // ═══ CONFETTI PARTICLES ═══
  const confettiShapes = ["circle", "rect", "diamond"];
  const confettiColors = [C.accent, C.accentLight, C.green, C.amber, "#ec4899", "#38bdf8", "#c084fc"];
  const confettiParticles = Array.from({ length: 60 }).map((_, i) => {
    const shape = confettiShapes[i % confettiShapes.length];
    const color = confettiColors[i % confettiColors.length];
    const size = 4 + Math.random() * 10;
    const left = Math.random() * 100;
    const delay = Math.random() * 0.8;
    const duration = 1.8 + Math.random() * 1.5;
    const drift = (Math.random() - 0.5) * 200;
    const rotation = Math.random() * 1080;
    return { shape, color, size, left, delay, duration, drift, rotation, key: i };
  });

  // ═══ RENDER: API KEY SETUP ═══
  if (showApiSetup) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 600, height: 600, background: C.accentGlowSoft, borderRadius: "50%", filter: "blur(150px)", pointerEvents: "none" }} />
        <div style={{
          maxWidth: 420, width: "100%", background: C.bgGlass, backdropFilter: "blur(24px)",
          border: `1px solid ${C.border}`, borderRadius: 20, padding: 32,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: C.accentBg, border: `1px solid ${C.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <h2 style={{ color: C.text, fontSize: 20, fontWeight: 700, margin: "0 0 8px", letterSpacing: -0.5 }}>API Key Required</h2>
          <p style={{ color: C.accentTextDim, fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
            Pyi-thon uses Claude to evaluate your code.<br />
            Get a key at <span style={{ color: C.accent }}>console.anthropic.com</span><br />
            Or set <span style={{ color: C.codeText, background: C.codeBg, padding: "1px 6px", borderRadius: 4, fontSize: 11 }}>VITE_ANTHROPIC_API_KEY</span> in .env
          </p>
          <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="sk-ant-..."
            style={{
              width: "100%", padding: "12px 16px", borderRadius: 12, background: C.codeBg,
              border: `1px solid ${C.border}`, color: C.codeText, fontSize: 13, outline: "none",
              fontFamily: "inherit", marginBottom: 16, transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = C.borderFocus}
            onBlur={e => e.target.style.borderColor = C.border}
            onKeyDown={e => e.key === "Enter" && handleSaveApiKey()}
          />
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowApiSetup(false)} style={{
              flex: 1, padding: "12px 0", borderRadius: 12, background: "rgba(255,255,255,0.03)",
              color: C.accentTextDim, border: `1px solid ${C.border}`, cursor: "pointer",
              fontFamily: "inherit", fontSize: 13, fontWeight: 600, transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.borderColor = C.borderFocus; }}
              onMouseLeave={e => { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.borderColor = C.border; }}
            >Cancel</button>
            <button onClick={handleSaveApiKey} style={{
              flex: 1, padding: "12px 0", borderRadius: 12,
              background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
              color: C.text, border: "none", cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 700, transition: "all 0.2s",
              boxShadow: `0 4px 16px ${C.accentGlow}`,
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 6px 24px ${C.accentGlow}`; }}
              onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 16px ${C.accentGlow}`; }}
            >Save Key</button>
          </div>
        </div>
        <style>{globalStyles}</style>
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
          <p style={{ color: C.accentText, textAlign: "center", maxWidth: 320, marginBottom: 8, fontSize: 15, lineHeight: 1.6, fontWeight: 500 }}>
            Master Python from scratch.<br />No AI. No autocomplete. Just you.
          </p>
          <p style={{ color: C.accentTextDim, fontSize: 12, marginBottom: 48, letterSpacing: 2, textTransform: "uppercase" }}>30 levels &middot; 3 phases &middot; Local Edition</p>

          <button onClick={() => setShowWelcome(false)} style={{
            padding: "16px 52px", borderRadius: 14, fontWeight: 700, color: C.text, fontSize: 16,
            border: "none", cursor: "pointer", fontFamily: "inherit",
            background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
            boxShadow: `0 8px 40px ${C.accentGlow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
            transition: "all 0.3s ease",
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
        <style>{globalStyles}</style>
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
                  color: C.text,
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
        <style>{globalStyles}</style>
      </div>
    );
  }

  // ═══ RENDER: EDITOR PANEL ═══
  const editorPanel = (
    <div style={{ flex: 1, position: "relative", minHeight: 240, animation: shakeEditor ? "shake 0.4s ease-in-out" : "none" }}>
      <div style={{
        position: "absolute", inset: 0, background: C.bgCard, border: `1px solid ${C.border}`,
        borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column",
        boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)",
      }}>
        {/* Filename bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, padding: "8px 14px",
          background: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${C.borderLight}`,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(244,63,94,0.5)" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(245,158,11,0.5)" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "rgba(34,197,94,0.5)" }} />
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginLeft: 8,
            padding: "3px 10px", borderRadius: 6, background: C.bgPanel,
            border: `1px solid ${C.borderLight}`,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2" strokeLinecap="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
            <span style={{ fontSize: 11, color: C.accentText, fontWeight: 600 }}>{filename}</span>
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
              <span key={i} style={{ fontSize: 11, color: C.lineNum, lineHeight: "1.75rem", userSelect: "none", fontWeight: 500 }}>{i + 1}</span>
            ))}
          </div>
          <textarea ref={editorRef} value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
            style={{
              flex: 1, background: "transparent", color: C.codeText, padding: "14px 16px",
              fontSize: 14, resize: "none", outline: "none", lineHeight: "1.75rem",
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
              tabSize: 4, border: "none", caretColor: C.accent,
            }}
            placeholder="# Write your Python code here..."
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
          border: `1px solid ${feedback.correct ? C.greenBorder : C.redBorder}`,
          background: feedback.correct ? C.greenBg : C.redBg,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: feedback.correct ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
              border: `1px solid ${feedback.correct ? C.greenBorder : C.redBorder}`,
            }}>
              {feedback.correct
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: feedback.correct ? C.greenLight : "#fca5a5" }}>{feedback.message}</span>
            </div>
            {feedback.correct && <span style={{ fontSize: 13, color: C.amber, fontWeight: 700, background: C.amberBg, padding: "4px 10px", borderRadius: 8, border: `1px solid ${C.amberBorder}` }}>+100 XP</span>}
          </div>

          {feedback.aiExplanation && (
            <div style={{
              marginBottom: 16, borderRadius: 12, padding: 16, position: "relative", overflow: "hidden",
              background: `linear-gradient(135deg, rgba(79,70,229,0.1), rgba(99,102,241,0.05))`,
              border: `1px solid ${C.accentBorder}`,
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: `linear-gradient(90deg, ${C.accentDeep}, ${C.accent}, transparent)` }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: 6, background: C.accentBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={C.accent}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/></svg>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1.5 }}>Claude says</span>
              </div>
              <p style={{ color: C.accentText, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{feedback.aiExplanation}</p>
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.accentTextDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Expected Output</p>
            <pre style={{
              background: C.codeBg, borderRadius: 10, padding: 14, color: C.codeText, fontSize: 12,
              overflowX: "auto", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap",
              border: `1px solid ${C.borderLight}`,
            }}>{feedback.expected}</pre>
          </div>

          <div style={{ paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: C.accentTextDim, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 6px" }}>Concept</p>
            <p style={{ color: "rgba(165,180,252,0.6)", fontSize: 12, lineHeight: 1.7, margin: 0 }}>{level.explanation}</p>
          </div>
        </div>
      ) : (
        <div style={{
          height: "100%", borderRadius: 14, border: `1px solid ${C.border}`,
          background: "rgba(255,255,255,0.015)", display: "flex", flexDirection: "column",
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
            <div style={{
              display: "flex", alignItems: "center", gap: 5, color: C.accentText,
              background: C.accentBg, padding: "4px 10px", borderRadius: 8,
              border: `1px solid ${C.accentBorder}`,
            }}>
              <span style={{ fontSize: 13 }}>&#x26A1;</span>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{totalXP}</span>
            </div>
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
              color: C.text, letterSpacing: 0.5,
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
            {!conceptCollapsed && <p style={{ color: C.accentText, fontSize: 13, lineHeight: 1.7, margin: "8px 0 0" }}>{level.concept}</p>}
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
          color: C.text, border: "none", fontFamily: "inherit",
          cursor: isEvaluating ? "not-allowed" : "pointer",
          background: `linear-gradient(135deg, ${C.accentDeep}, ${C.accent})`,
          boxShadow: `0 4px 24px ${C.accentGlow}`,
          opacity: isEvaluating ? 0.6 : 1, transition: "all 0.2s",
        }}
          onMouseEnter={e => { if (!isEvaluating) { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = `0 6px 32px ${C.accentGlow}`; }}}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = `0 4px 24px ${C.accentGlow}`; }}
        >
          {isEvaluating ? "Evaluating..." : "Run Code \u25B6"}
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
      <style>{globalStyles}</style>
    </div>
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: ${C.bg} !important; color-scheme: dark; }
  html { height: 100%; }
  body { min-height: 100%; }
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
  textarea::placeholder { color: rgba(129,140,248,0.2) !important; }
  textarea::-webkit-scrollbar { width: 5px; }
  textarea::-webkit-scrollbar-track { background: transparent; }
  textarea::-webkit-scrollbar-thumb { background: rgba(129,140,248,0.15); border-radius: 4px; }
  textarea::-webkit-scrollbar-thumb:hover { background: rgba(129,140,248,0.3); }

  button { transition: all 0.2s ease; }

  ::selection { background: rgba(99,102,241,0.3); }
`;
