<p align="center">
  <img src="https://img.shields.io/badge/Python-Learning-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python Learning" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 5" />
  <img src="https://img.shields.io/badge/Claude_AI-Powered-F97316?style=for-the-badge" alt="Claude AI Powered" />
</p>

<h1 align="center">Pyi-thon</h1>

<p align="center">
  <strong>A gamified Python learning platform with 30 levels, syntax highlighting, and AI-powered code evaluation.</strong>
</p>

<p align="center">
  Learn Python fundamentals by writing real code in the browser.<br />
  No setup. No autocomplete. Just you and a code editor.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/levels-30-6366f1" alt="30 Levels" />
  <img src="https://img.shields.io/badge/phases-3-34d399" alt="3 Phases" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome" />
</p>

---

## What is Pyi-thon?

Pyi-thon is an interactive Python learning app that runs entirely in your browser. Write Python code in a built-in editor with syntax highlighting, submit it, and get instant feedback — either from Claude AI or an offline pattern-matching evaluator.

**Who is this for?**

- Complete beginners learning Python for the first time
- Students who want structured, progressive exercises
- Anyone who wants to practice fundamentals without installing Python
- Developers curious about building educational tools with the Claude API

## Features

| Feature | Description |
|---------|-------------|
| **30 Progressive Levels** | From `print("Hello")` to data pipelines, across 3 phases |
| **Built-in Code Editor** | Syntax highlighting, line numbers, tab indentation |
| **AI Evaluation** | Claude analyzes your code and accepts creative solutions |
| **Offline Mode** | Pattern-matching evaluator when you don't have an API key |
| **Dark & Light Themes** | Toggle between themes in settings |
| **Gamification** | XP, streaks, confetti, and sound effects |
| **Progress Saving** | Auto-saves to localStorage — pick up where you left off |
| **Keyboard Shortcuts** | `Ctrl+Enter` / `Cmd+Enter` to submit code |
| **Responsive Layout** | Side-by-side on desktop, tabbed on mobile |
| **Zero Backend** | Runs entirely client-side with Vite dev server |

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher

### Installation

```bash
# Clone the repo
git clone https://github.com/aiedwardyi/pyithon.git
cd pyithon

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Opens at **http://localhost:3000**

### API Key (Optional)

Pyi-thon works in **offline mode** out of the box — no API key needed. For smarter AI-powered evaluation:

1. Get a free API key from [console.anthropic.com](https://console.anthropic.com)
2. Either:
   - Enter it in the app via the settings gear icon, or
   - Create a `.env` file: `cp .env.example .env` and add your key

## How It Works

```
You write Python → Submit → Claude (or offline evaluator) checks it → Feedback + XP
```

### The 3 Phases

| Phase | Levels | Topics |
|-------|--------|--------|
| **Foundations** | 1–18 | print, variables, if/else, loops, functions, lists, dicts |
| **Real Skills** | 19–25 | file I/O, error handling, classes, JSON, imports |
| **Beyond** | 26–30 | comprehensions, f-strings, lambda/map, data pipelines |

### Evaluation Modes

- **Claude Mode** (default) — sends your code to Claude Sonnet for smart evaluation. Accepts creative solutions, different variable names, and alternative approaches.
- **Offline Mode** — pattern-matching against expected output. Stricter, but works without an API key or internet connection.

Toggle between modes in the settings panel (gear icon).

## Project Structure

```
pyithon/
├── index.html          # Entry point + font imports
├── package.json        # Dependencies (React, Vite only)
├── vite.config.js      # Dev server + Anthropic API proxy
├── .env.example        # API key template
└── src/
    ├── main.jsx        # React mount point
    └── App.jsx         # The entire app (single file)
```

The entire application lives in a single `App.jsx` file — colors, levels, evaluator, and all UI components.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI rendering |
| **Vite 5** | Dev server + API proxy + build |
| **Claude API** | AI-powered code evaluation |
| **Web Audio API** | Sound effects |
| **localStorage** | Progress persistence |
| **Inter + JetBrains Mono** | Typography |

No other dependencies. No state management library, no CSS framework, no component library.

## Contributing

Contributions are welcome and encouraged! Whether you're fixing a bug, adding a level, improving the UI, or building a new feature — PRs are open.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ideas for Contributions

- Add more levels (Phase 3 has room to grow)
- Improve the offline evaluator with better pattern matching
- Add new themes or color schemes
- Accessibility improvements
- Mobile UX enhancements
- Internationalization (i18n)
- Add a progress export/import feature
- Leaderboard or challenge mode

## License

[MIT](LICENSE) — use it, fork it, learn from it, build on it.

---

<p align="center">
  Built with care for anyone learning to code.<br />
  <strong>Star the repo if you find it useful!</strong>
</p>
