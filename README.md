<h1 align="center">Pyi-thon</h1>

<p align="center">
  <strong>Learn Python by writing real code. 30 levels. Zero setup. Completely free.</strong>
</p>

<p align="center">
  <a href="https://pyithon.com"><img src="https://img.shields.io/badge/%E2%96%B6%EF%B8%8F_Try_it_live-pyithon.com-6366f1?style=for-the-badge" alt="Try it live" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/levels-30-6366f1" alt="30 Levels" />
  <img src="https://img.shields.io/badge/phases-3-34d399" alt="3 Phases" />
  <img src="https://img.shields.io/badge/languages-EN%20%7C%20%ED%95%9C%EA%B5%AD%EC%96%B4-38bdf8" alt="EN | Korean" />
  <img src="https://img.shields.io/badge/AI-Claude%20%7C%20OpenAI%20%7C%20Gemini-f59e0b" alt="Multi-AI" />
  <img src="https://img.shields.io/badge/offline-Pyodide%20WASM-10b981" alt="Offline Ready" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
</p>

---

Pyi-thon is a gamified Python learning platform that runs entirely in your browser. No Python installation, no terminal, no complex setup — just open the app and start writing code.

Built for **complete beginners** who want a structured, hands-on path from `print("Hello")` to data pipelines. Every level teaches one concept, gives you a real task, and evaluates your code instantly.

<p align="center">
  <a href="https://pyithon.com"><strong>Try it now &rarr;</strong></a>
</p>

## Why Pyi-thon?

Most Python tutorials make you read. Pyi-thon makes you **write**.

- **No copy-paste** — you type every line yourself
- **No autocomplete** — you actually learn the syntax
- **Instant feedback** — know if you're right in seconds
- **Works offline** — Python runs in your browser via WebAssembly
- **Gamified** — XP, streaks, confetti, sound effects keep you going
- **Free and open source** — fork it, customize it, self-host it

## Screenshots

<table>
  <tr>
    <td align="center"><strong>Code Editor (Dark)</strong></td>
    <td align="center"><strong>Korean + Light Mode</strong></td>
  </tr>
  <tr>
    <td><img src="screenshots/correct-dark.png" width="400" /></td>
    <td><img src="screenshots/korean-light.png" width="400" /></td>
  </tr>
  <tr>
    <td align="center"><strong>Level Select</strong></td>
    <td align="center"><strong>Settings &amp; AI Providers</strong></td>
  </tr>
  <tr>
    <td><img src="screenshots/levels.png" width="400" /></td>
    <td><img src="screenshots/settings.png" width="400" /></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><strong>Mobile</strong></td>
  </tr>
  <tr>
    <td align="center" colspan="2"><img src="screenshots/mobile.png" width="250" /></td>
  </tr>
</table>

## Features

| Feature | Description |
|---------|-------------|
| **30 Progressive Levels** | From `print("Hello")` to data pipelines across 3 phases |
| **Real Python in Browser** | Pyodide (WebAssembly) runs actual Python 3 — no server needed |
| **AI-Powered Evaluation** | Claude, OpenAI, or Gemini analyze your code and accept creative solutions |
| **Offline Mode** | Works completely offline with Pyodide — no API key required |
| **Bilingual** | Full English and Korean (한국어) interface and level content |
| **Dark & Light Themes** | Beautiful, polished UI in both modes |
| **Gamification** | XP system, streak counter, confetti celebrations, sound effects |
| **Syntax Highlighting** | Full Python syntax highlighting in the built-in editor |
| **Progress Saving** | Auto-saves to localStorage — close the tab, come back later |
| **Responsive** | Side-by-side on desktop, tabbed layout on mobile |
| **Zero Dependencies** | React + Vite only. No state library, no CSS framework, no bloat |

## Quick Start

```bash
git clone https://github.com/aiedwardyi/pyi-thon.git
cd pyi-thon
npm install
npm run dev
```

Opens at **http://localhost:3000**. That's it — start learning Python.

### AI Evaluation (Optional)

Pyi-thon works fully **offline** out of the box. For smarter AI-powered evaluation, add any one of these:

| Provider | Get a key | Model used |
|----------|-----------|------------|
| **Claude** (default) | [console.anthropic.com](https://console.anthropic.com) | Claude Sonnet |
| **OpenAI** | [platform.openai.com](https://platform.openai.com) | GPT-4o Mini |
| **Google Gemini** | [aistudio.google.com](https://aistudio.google.com) | Gemini 2.0 Flash |

Enter your key in the Settings panel (gear icon), or create a `.env` file:

```bash
cp .env.example .env
# Edit .env with your preferred provider's key
```

## The 30 Levels

| Phase | Levels | What You Learn |
|-------|--------|---------------|
| **01 — Foundations** | 1–18 | print, variables, strings, input, if/else, loops, functions, lists, dicts |
| **02 — Real Skills** | 19–25 | mini apps, file I/O, error handling, classes, JSON, imports |
| **03 — Beyond** | 26–30 | list comprehensions, string methods, f-strings, lambda/map, data pipelines |

Each level has: a concept explanation, a task, a built-in hint, starter code, and a detailed explanation after you solve it.

## How It Works

```
You write Python  →  Submit  →  AI or Pyodide evaluates  →  Feedback + XP
```

**Offline mode** runs your code through Pyodide (real Python compiled to WebAssembly) and checks the output against expected results. It also verifies you used the right concept — no cheating with hardcoded answers.

**AI mode** sends your code to your chosen provider for nuanced evaluation. It accepts creative solutions, different variable names, and alternative approaches, as long as you use the concept being taught.

## Project Structure

```
pyi-thon/
├── index.html          # Entry point + font imports
├── package.json        # Dependencies (React + Vite only)
├── vite.config.js      # Dev server config
├── .env.example        # API key template (all providers)
└── src/
    ├── main.jsx        # React mount point
    └── App.jsx         # The entire app — single file, ~1600 lines
```

The whole application lives in one file. Colors, levels, translations, evaluator, syntax highlighter, and all UI components. Simple to understand, easy to fork.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI rendering |
| **Vite 5** | Dev server, build |
| **Pyodide** | Python 3 in the browser (WebAssembly) |
| **Claude / OpenAI / Gemini** | AI code evaluation |
| **Web Audio API** | Sound effects |
| **localStorage** | Progress + preferences |

No other dependencies. No state management library. No CSS framework. No component library. Just React and Vite.

## Self-Hosting

Pyi-thon is a static site — deploy it anywhere:

```bash
npm run build    # Outputs to dist/
```

Works with **Vercel**, **Netlify**, **AWS Amplify**, **GitHub Pages**, **Cloudflare Pages**, or any static host. The Pyodide runtime loads from CDN at runtime. All AI providers (Claude, OpenAI, Gemini) work directly from the browser.

## Contributing

Contributions are welcome! Whether you're fixing a bug, adding a level, improving translations, or building new features.

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ideas

- **More levels** — Phase 3 has room to grow (regex, decorators, generators, async)
- **More languages** — Japanese, Spanish, Chinese, etc.
- **More AI providers** — Mistral, Groq, local models via Ollama
- **Accessibility** — screen reader improvements, keyboard navigation
- **Challenge mode** — timed levels, leaderboards
- **Progress export** — share your progress, import on another device

## License

[MIT](LICENSE) — use it, fork it, learn from it, teach with it.

---

<p align="center">
  <strong>If Pyi-thon helped you learn Python, give it a star!</strong><br />
  It helps others find this project.
</p>

<p align="center">
  Made by <a href="https://github.com/aiedwardyi">Edward Yi</a>
</p>
