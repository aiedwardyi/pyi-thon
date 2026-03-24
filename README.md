# Pyi-thon — Local Edition

A gamified Python learning platform. 30 levels across 3 phases, mapped to your 14-day roadmap.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set your Anthropic API key (for code evaluation)
#    Option A: Create a .env file
cp .env.example .env
#    Then edit .env and add your key from console.anthropic.com

#    Option B: Enter it in the app (gear icon or on first submit)

# 3. Run it
npm run dev
```

Opens at **http://localhost:3000**

## What You Need

- **Node.js 18+** (you already have this for Claude Code)
- **Anthropic API key** from [console.anthropic.com](https://console.anthropic.com)

## How It Works

- **Code editor**: Write Python in the built-in editor (Tab for indent)
- **Claude evaluator**: Your code is sent to Claude Sonnet to check if it's functionally correct
- **Progress saves**: Everything auto-saves to localStorage — close and come back anytime
- **API key**: Stored locally in your browser, never sent anywhere except Anthropic's API

## Differences from Claude.ai Version

| Feature | Claude.ai Artifact | Local (this) |
|---------|-------------------|--------------|
| Storage | `window.storage` (cloud) | `localStorage` (browser) |
| API auth | Handled by Claude | Your API key via .env |
| CORS | Proxied by Claude | Proxied by Vite dev server |
| Access | Inside Claude chat | `npm run dev` on your PC |

## Project Structure

```
pyithon-local/
├── index.html          # Entry point
├── package.json        # Dependencies
├── vite.config.js      # Dev server + API proxy
├── .env.example        # API key template
└── src/
    ├── main.jsx        # React mount
    └── App.jsx         # The entire app
```
