# Contributing to Pyi-thon

Thanks for your interest in contributing! Pyi-thon is an open educational project and we welcome all kinds of contributions.

## Ways to Contribute

- **Add levels** — Write new Python exercises with clear tasks and expected outputs
- **Improve UI/UX** — Polish animations, fix spacing, enhance accessibility
- **Better evaluator** — Make the offline pattern matcher smarter
- **Bug fixes** — Found something broken? Fix it!
- **Documentation** — Improve the README, add tutorials, or translate content
- **New features** — Themes, export/import, challenge modes, etc.

## Getting Started

1. **Fork** the repo and clone your fork
2. Run `npm install` and `npm run dev`
3. Make your changes in `src/App.jsx`
4. Test that the app still runs and looks correct
5. Commit and open a PR

## Guidelines

### Code Style

- **Single file**: Keep everything in `src/App.jsx` — don't split into components
- **Inline styles**: Use the `C` palette object for colors (no Tailwind, no CSS files)
- **No new dependencies**: Unless absolutely necessary and discussed first
- **Keep it simple**: Minimal abstractions, readable code

### Adding Levels

Each level is an object in the `LEVELS` array:

```js
{
  id: 31,                           // Sequential number
  phase: 3,                         // 1, 2, or 3
  day: "Bonus",                     // Day label
  title: "Your Level Title",        // Short title
  subtitle: "Brief description",    // One-line subtitle
  concept: "What the student learns", // Concept explanation
  task: "What to do",               // Clear task description
  hint: "Code hint",                // Reference solution hint
  starterCode: "# Starter\n",       // Pre-filled code
  expectedOutput: "output",         // What correct code produces
  explanation: "Why this works",    // Post-solve explanation
  tags: ["tag1", "tag2"],           // Topic tags
}
```

### Pull Requests

- Keep PRs focused — one feature or fix per PR
- Write a clear description of what changed and why
- Test on both desktop and mobile widths
- Screenshots welcome for UI changes

### Commit Messages

Use conventional commit style:

- `feat: add new level for decorators`
- `fix: correct concept collapse animation`
- `style: improve light mode contrast`
- `docs: update README with new features`

## Questions?

Open an issue or start a discussion. No question is too small!
