import { useState, useEffect, useRef, useCallback } from "react";

// ─── COLOR PALETTE ───
const C = {
  bg: "#0a0a14", bgCard: "#12121f", bgSubtle: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.08)", borderLight: "rgba(255,255,255,0.05)",
  text: "#ffffff", textMuted: "rgba(255,255,255,0.9)", textDim: "rgba(255,255,255,0.4)",
  purple: "#a855f7", purpleDark: "#7c3aed", purpleGlow: "rgba(139,92,246,0.5)",
  purpleText: "rgba(196,167,255,0.8)", purpleTextDim: "rgba(196,167,255,0.4)",
  purpleBg: "rgba(88,28,135,0.3)", purpleBorder: "rgba(88,28,135,0.4)",
  green: "#4ade80", greenBg: "rgba(20,83,45,0.3)", greenBorder: "rgba(22,101,52,0.3)",
  red: "#f87171", redBg: "rgba(69,10,10,0.3)", redBorder: "rgba(127,29,29,0.3)",
  amber: "#fbbf24", amberBg: "rgba(69,26,3,0.3)", amberBorder: "rgba(120,53,15,0.3)", amberText: "rgba(253,230,138,0.8)",
  codeBg: "rgba(0,0,0,0.3)", codeText: "rgba(134,239,172,0.9)",
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
const PHASE_GRADIENTS = { 1: "linear-gradient(135deg, #7c3aed, #9333ea)", 2: "linear-gradient(135deg, #2563eb, #4f46e5)", 3: "linear-gradient(135deg, #d97706, #ea580c)" };

// ─── LOCAL STORAGE (replaces window.storage for local dev) ───
const STORAGE_KEY = "pyithon-progress";
function loadProgress() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; } catch { return null; }
}
function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error("Save failed:", e); }
}

// ─── CLAUDE API EVALUATOR (uses Vite proxy to avoid CORS) ───
async function evaluateWithClaude(userCode, level, apiKey) {
  const systemPrompt = `You are a Python code evaluator. Determine if the student's code is functionally correct.
RULES:
- Would this code produce the expected output in Python 3?
- Accept creative solutions (different variable names, different approaches).
- Code must be valid Python that would run.
- For simulated input, assume input() receives values in order.
- Be encouraging but honest.
Respond ONLY with JSON, no markdown fences:
{"correct": true/false, "feedback": "brief message", "explanation": "1-2 sentences"}`;

  const userPrompt = `TASK: ${level.task}
EXPECTED OUTPUT: ${level.expectedOutput}
${level.simulatedInput ? `SIMULATED INPUT: ${level.simulatedInput}` : ""}
HINT (reference): ${level.hint}

STUDENT CODE:
\`\`\`python
${userCode}
\`\`\`

Functionally correct?`;

  // In dev mode, use Vite proxy (/api/claude -> api.anthropic.com)
  const response = await fetch("/api/claude/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  const data = await response.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  try { return JSON.parse(clean); } catch {
    if (text.toLowerCase().includes('"correct": true') || text.toLowerCase().includes('"correct":true')) return { correct: true, feedback: "Nice work!", explanation: "" };
    return { correct: false, feedback: "Could not evaluate — try again.", explanation: "" };
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

  const level = LEVELS[currentLevel];
  const unlockedUpTo = Math.max(...completedLevels, 0) + 1;
  const progressPercent = (completedLevels.size / LEVELS.length) * 100;

  // Load saved progress on mount
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

  // Auto-save
  useEffect(() => {
    saveProgress({ completedLevels: [...completedLevels], currentLevel, streak, bestStreak, totalXP });
  }, [completedLevels, currentLevel, streak, bestStreak, totalXP]);

  useEffect(() => {
    setCode(LEVELS[currentLevel].starterCode);
    setFeedback(null); setShowHint(false); setTab("editor");
  }, [currentLevel]);

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
        setShowConfetti(true); setTimeout(() => setShowConfetti(false), 2000);
      } else {
        setFeedback({ correct: false, message: result.feedback || "Not quite right.", expected, aiExplanation: result.explanation });
        setStreak(0); setShakeEditor(true); setTimeout(() => setShakeEditor(false), 500);
      }
    } catch (err) {
      setFeedback({ correct: false, message: "Evaluation error — check your API key and try again.", expected, aiExplanation: err.message });
    } finally { setIsEvaluating(false); }
  }, [code, level, completedLevels, bestStreak, streak, apiKey]);

  const handleReset = () => { setCode(level.starterCode); setFeedback(null); setShowHint(false); setTab("editor"); };
  const goToLevel = (idx) => { if (idx < unlockedUpTo || completedLevels.has(LEVELS[idx].id)) { setCurrentLevel(idx); setShowLevelSelect(false); } };

  const pageStyle = { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace", colorScheme: "dark" };

  // ═══ API KEY SETUP MODAL ═══
  if (showApiSetup) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 400, width: "100%", background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700, margin: "0 0 8px" }}>🔑 API Key Required</h2>
          <p style={{ color: C.purpleTextDim, fontSize: 12, lineHeight: 1.6, margin: "0 0 16px" }}>
            The local version needs an Anthropic API key to evaluate your code with Claude.<br /><br />
            Get one at <span style={{ color: C.purple }}>console.anthropic.com</span><br />
            Or set <span style={{ color: C.codeText }}>VITE_ANTHROPIC_API_KEY</span> in a .env file.
          </p>
          <input
            type="password"
            value={apiKeyInput}
            onChange={e => setApiKeyInput(e.target.value)}
            placeholder="sk-ant-..."
            style={{ width: "100%", padding: "10px 12px", borderRadius: 8, background: C.codeBg, border: `1px solid ${C.border}`, color: C.codeText, fontSize: 13, outline: "none", fontFamily: "inherit", marginBottom: 12 }}
            onKeyDown={e => e.key === "Enter" && handleSaveApiKey()}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setShowApiSetup(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "rgba(255,255,255,0.04)", color: C.purpleTextDim, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Cancel</button>
            <button onClick={handleSaveApiKey} style={{ flex: 1, padding: "10px 0", borderRadius: 8, background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: C.text, border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>Save Key</button>
          </div>
        </div>
        <style>{globalStyles}</style>
      </div>
    );
  }

  // ═══ WELCOME ═══
  if (showWelcome) {
    return (
      <div style={{ ...pageStyle, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "rgba(139,92,246,0.15)", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" }} />
        <svg viewBox="0 0 200 200" style={{ width: 120, height: 120, marginBottom: 32, filter: `drop-shadow(0 0 30px ${C.purpleGlow})` }}>
          <defs><linearGradient id="aG" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7c3aed" /><stop offset="100%" stopColor="#c084fc" /></linearGradient></defs>
          <path d="M60 160 L60 60 L30 90" fill="none" stroke="url(#aG)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M90 160 L90 40 L60 70" fill="none" stroke="url(#aG)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M120 160 L120 60 L90 90" fill="none" stroke="url(#aG)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M150 160 L150 80 L120 110" fill="none" stroke="url(#aG)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: -1 }}>Pyi-thon</h1>
        <p style={{ color: C.purpleText, textAlign: "center", maxWidth: 280, marginBottom: 8, fontSize: 14, lineHeight: 1.5 }}>Master Python from scratch.<br />No AI. No autocomplete. Just you.</p>
        <p style={{ color: C.purpleTextDim, fontSize: 11, marginBottom: 32 }}>30 levels · 3 phases · Local Edition</p>
        <button onClick={() => setShowWelcome(false)} style={{ padding: "14px 40px", borderRadius: 12, fontWeight: 700, color: C.text, fontSize: 16, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 8px 32px rgba(88,28,135,0.4)", fontFamily: "inherit" }}>Start Learning</button>
        <button onClick={() => { setShowWelcome(false); setShowApiSetup(true); }} style={{ marginTop: 12, color: C.purpleTextDim, fontSize: 12, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>⚙️ Set API Key</button>
        <style>{globalStyles}</style>
      </div>
    );
  }

  // ═══ LEVEL SELECT ═══
  if (showLevelSelect) {
    return (
      <div style={{ ...pageStyle, padding: "16px 16px 100px", overflowY: "auto", position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 256, background: "linear-gradient(to bottom, rgba(88,28,135,0.15), transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, position: "relative", zIndex: 10 }}>
          <button onClick={() => setShowLevelSelect(false)} style={{ color: C.purpleText, background: "none", border: "none", cursor: "pointer", padding: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          </button>
          <h2 style={{ color: C.text, fontSize: 18, fontWeight: 700 }}>All Levels</h2>
          <div style={{ width: 32 }} />
        </div>
        {[1, 2, 3].map(phase => (
          <div key={phase} style={{ marginBottom: 24, position: "relative", zIndex: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: PHASE_GRADIENTS[phase], color: C.text }}>{PHASE_NAMES[phase]}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LEVELS.filter(l => l.phase === phase).map(l => {
                const idx = LEVELS.indexOf(l);
                const done = completedLevels.has(l.id);
                const unlocked = idx < unlockedUpTo || done;
                const curr = idx === currentLevel;
                return (
                  <button key={l.id} onClick={() => unlocked && goToLevel(idx)} disabled={!unlocked} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12, textAlign: "left", fontFamily: "inherit",
                    border: `1px solid ${curr ? "rgba(139,92,246,0.4)" : done ? C.greenBorder : C.border}`,
                    background: curr ? "rgba(88,28,135,0.2)" : done ? C.greenBg : C.bgSubtle,
                    cursor: unlocked ? "pointer" : "not-allowed", opacity: unlocked ? 1 : 0.35,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0, background: done ? "rgba(34,197,94,0.2)" : curr ? "rgba(139,92,246,0.25)" : "rgba(255,255,255,0.05)", color: done ? C.green : curr ? C.purpleText : C.textDim }}>
                      {done ? "✓" : l.id}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: done ? "#86efac" : unlocked ? C.text : C.textDim, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</p>
                      <p style={{ fontSize: 11, color: C.purpleTextDim, margin: "2px 0 0" }}>{l.subtitle}</p>
                    </div>
                    {l.tags.includes("boss") && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(245,158,11,0.2)", color: C.amber, fontWeight: 700 }}>BOSS</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <style>{globalStyles}</style>
      </div>
    );
  }

  // ═══ MAIN GAME ═══
  return (
    <div style={{ ...pageStyle, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
      {showConfetti && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 50, overflow: "hidden" }}>
        {Array.from({ length: 40 }).map((_, i) => <div key={i} style={{ position: "absolute", width: 8, height: 8, borderRadius: "50%", left: `${Math.random()*100}%`, top: "-5%", backgroundColor: ["#a855f7","#22c55e","#3b82f6","#f59e0b","#ec4899"][i%5], animation: `confettiFall ${1.5+Math.random()}s ease-out forwards`, animationDelay: `${Math.random()*0.5}s` }} />)}
      </div>}

      <header style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(10,10,20,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px" }}>
          <button onClick={() => setShowLevelSelect(true)} style={{ color: C.purpleText, background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          </button>
          <div style={{ flex: 1, margin: "0 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.purpleTextDim, fontWeight: 600 }}>Lv.{level.id}</span>
              <span style={{ fontSize: 11, color: C.purpleTextDim }}>{completedLevels.size}/{LEVELS.length}</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 8, transition: "width 0.7s ease-out", width: `${progressPercent}%`, background: "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)" }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {streak > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.amber }}><span style={{ fontSize: 14 }}>🔥</span><span style={{ fontSize: 12, fontWeight: 700 }}>{streak}</span></div>}
            <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.purpleText }}><span style={{ fontSize: 14 }}>⚡</span><span style={{ fontSize: 12, fontWeight: 700 }}>{totalXP}</span></div>
            <button onClick={() => setShowApiSetup(true)} style={{ color: C.purpleTextDim, background: "none", border: "none", cursor: "pointer", fontSize: 14, padding: 4 }}>⚙️</button>
          </div>
        </div>
      </header>

      <div style={{ padding: "16px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: PHASE_GRADIENTS[level.phase], color: C.text }}>P{level.phase}</span>
          <span style={{ color: C.purpleTextDim, fontSize: 10 }}>Day {level.day}</span>
          {level.tags.includes("boss") && <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "rgba(245,158,11,0.2)", color: C.amber, fontWeight: 700 }}>BOSS</span>}
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: -0.5 }}>{level.title}</h1>
        <p style={{ color: C.purpleTextDim, fontSize: 12, margin: "0 0 12px" }}>{level.subtitle}</p>
        <div style={{ background: C.purpleBg, border: `1px solid ${C.purpleBorder}`, borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <p style={{ color: C.purpleText, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{level.concept}</p>
        </div>
        <div style={{ background: C.bgSubtle, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 6px" }}>Task</p>
          <p style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{level.task}</p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "0 16px 16px", minHeight: 0 }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
          {["editor", "output"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "6px 16px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: "inherit", background: tab === t ? "rgba(88,28,135,0.3)" : "transparent", color: tab === t ? C.purpleText : C.purpleTextDim }}>
              {t === "editor" ? "Editor" : `Output ${isEvaluating ? "⏳" : feedback ? (feedback.correct ? "✓" : "✗") : ""}`}
            </button>
          ))}
        </div>

        {tab === "editor" ? (
          <div style={{ flex: 1, position: "relative", minHeight: 200, animation: shakeEditor ? "shake 0.4s ease-in-out" : "none" }}>
            <div style={{ position: "absolute", inset: 0, background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.3)", display: "flex" }}>
              <div style={{ width: 40, background: "rgba(255,255,255,0.02)", borderRight: `1px solid ${C.borderLight}`, paddingTop: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
                {code.split("\n").map((_, i) => <span key={i} style={{ fontSize: 10, color: "rgba(139,92,246,0.25)", lineHeight: "1.7rem", userSelect: "none" }}>{i + 1}</span>)}
              </div>
              <textarea ref={editorRef} value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
                style={{ flex: 1, background: "transparent", color: C.codeText, padding: 12, fontSize: 14, resize: "none", outline: "none", lineHeight: "1.7rem", fontFamily: "'JetBrains Mono', 'Fira Code', monospace", tabSize: 4, border: "none", caretColor: C.purple }}
                placeholder="# Write your Python code here..."
                onKeyDown={e => { if (e.key === "Tab") { e.preventDefault(); const s = e.target.selectionStart, end = e.target.selectionEnd; setCode(code.substring(0,s)+"    "+code.substring(end)); setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s+4; }, 0); }}}
              />
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, minHeight: 200 }}>
            {isEvaluating ? (
              <div style={{ height: "100%", borderRadius: 12, border: `1px solid ${C.purpleBorder}`, background: "rgba(88,28,135,0.1)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(139,92,246,0.2)" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: C.purple, animation: "spin 1s linear infinite" }} />
                </div>
                <p style={{ color: C.purpleTextDim, fontSize: 14, fontWeight: 600, margin: 0 }}>Evaluating your code...</p>
              </div>
            ) : feedback ? (
              <div style={{ height: "100%", borderRadius: 12, padding: 16, overflowY: "auto", border: `1px solid ${feedback.correct ? C.greenBorder : C.redBorder}`, background: feedback.correct ? C.greenBg : C.redBg }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 18, color: feedback.correct ? C.green : C.red }}>{feedback.correct ? "✓" : "✗"}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: feedback.correct ? "#86efac" : "#fca5a5" }}>{feedback.message}</span>
                  {feedback.correct && <span style={{ fontSize: 13, color: C.amber }}>+100 XP</span>}
                </div>
                {feedback.aiExplanation && (
                  <div style={{ marginBottom: 12, background: C.bgSubtle, borderRadius: 8, padding: 10, border: `1px solid ${C.borderLight}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 10 }}>🤖</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.purple, textTransform: "uppercase", letterSpacing: 1 }}>Claude says</span>
                    </div>
                    <p style={{ color: C.purpleText, fontSize: 12, lineHeight: 1.5, margin: 0 }}>{feedback.aiExplanation}</p>
                  </div>
                )}
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.purpleTextDim, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Expected Output</p>
                  <pre style={{ background: C.codeBg, borderRadius: 8, padding: 10, color: C.codeText, fontSize: 12, overflowX: "auto", fontFamily: "'JetBrains Mono', monospace", margin: 0, whiteSpace: "pre-wrap" }}>{feedback.expected}</pre>
                </div>
                <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.purpleTextDim, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>Concept</p>
                  <p style={{ color: "rgba(196,167,255,0.6)", fontSize: 12, lineHeight: 1.6, margin: 0 }}>{level.explanation}</p>
                </div>
              </div>
            ) : (
              <div style={{ height: "100%", borderRadius: 12, border: `1px solid ${C.border}`, background: C.bgSubtle, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ color: C.purpleTextDim, fontSize: 13 }}>Submit your code to see results</p>
              </div>
            )}
          </div>
        )}

        {showHint && (
          <div style={{ marginTop: 8, background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 12, padding: 12 }}>
            <p style={{ color: C.amberText, fontSize: 12, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>💡 {level.hint}</p>
          </div>
        )}
      </div>

      <div style={{ position: "sticky", bottom: 0, background: "rgba(10,10,20,0.95)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8, zIndex: 30 }}>
        <button onClick={() => setShowHint(!showHint)} style={{ padding: "10px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, background: "rgba(245,158,11,0.1)", color: C.amber, border: `1px solid rgba(180,83,9,0.3)`, cursor: "pointer", fontFamily: "inherit" }}>{showHint ? "Hide" : "Hint"}</button>
        <button onClick={handleReset} style={{ padding: "10px 12px", borderRadius: 12, fontSize: 12, fontWeight: 600, background: "rgba(255,255,255,0.04)", color: C.purpleTextDim, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit" }}>Reset</button>
        <button onClick={handleSubmit} disabled={isEvaluating} style={{ flex: 1, padding: "10px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, color: C.text, border: "none", cursor: isEvaluating ? "not-allowed" : "pointer", background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 4px 20px rgba(88,28,135,0.3)", opacity: isEvaluating ? 0.6 : 1, fontFamily: "inherit" }}>
          {isEvaluating ? "⏳ Evaluating..." : "Run Code ▶"}
        </button>
        {feedback?.correct && currentLevel < LEVELS.length - 1 && (
          <button onClick={() => setCurrentLevel(prev => Math.min(prev + 1, LEVELS.length - 1))} style={{ padding: "10px 16px", borderRadius: 12, fontSize: 12, fontWeight: 700, background: "rgba(34,197,94,0.15)", color: C.green, border: `1px solid rgba(22,101,52,0.4)`, cursor: "pointer", fontFamily: "inherit" }}>Next →</button>
        )}
      </div>
      <style>{globalStyles}</style>
    </div>
  );
}

const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  html, body { margin: 0; padding: 0; background: ${C.bg} !important; color-scheme: dark; }
  @keyframes confettiFall { 0% { transform: translateY(0) rotate(0deg) scale(1); opacity:1; } 100% { transform: translateY(100vh) rotate(720deg) scale(0); opacity:0; } }
  @keyframes shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-4px); } 40% { transform: translateX(4px); } 60% { transform: translateX(-3px); } 80% { transform: translateX(3px); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  textarea::placeholder { color: rgba(139,92,246,0.25) !important; }
  textarea::-webkit-scrollbar { width: 4px; }
  textarea::-webkit-scrollbar-track { background: transparent; }
  textarea::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.2); border-radius: 4px; }
`;
