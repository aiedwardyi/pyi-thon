# Contributing to Pyi-thon

Thanks for your interest in contributing. Pyi-thon is an open educational project, and we welcome bug fixes, polish, new levels, translations, and ideas that make the experience smoother for first-time learners.

## Ways To Contribute

- Add levels - write new Python exercises with clear tasks and expected outputs
- Improve UI/UX - polish motion, spacing, responsiveness, and accessibility
- Strengthen evaluation - make the offline checks and AI review more reliable
- Fix bugs - if something feels off, it probably helps to make it better for everyone
- Improve documentation - sharpen the README, contributor guide, or level explanations
- Extend the experience - themes, export/import, challenge modes, and similar quality-of-life work

## Getting Started

1. Fork the repo and clone your fork
2. Run `npm install` and `npm run dev`
3. Make your changes in the app source under `src/`
4. Test the result in the browser on desktop and mobile widths
5. Open a focused pull request with a clear summary of what changed and why

## Project Shape

The app is intentionally lightweight. Most product logic currently lives in `src/App.jsx`, with supporting bootstrap and configuration in the rest of `src/` and the project root.

When contributing, prefer small, readable changes that fit the existing style instead of introducing extra abstraction too early.

## Quality Bar

Before opening a PR, please make sure:

- `npm run smoke` passes for a quick local confidence check
- `npm test` passes
- `npm run build` passes
- `npm run test:e2e` passes when your change affects the UI or user flow
- The app still looks good on desktop and mobile
- Any new behavior is covered by a note, screenshot, or test when that helps reviewers

If a change affects a release-facing part of the product, smoke test the main flow after your edits:

- Load the app from a clean state
- Open Settings
- Try the relevant theme or language change
- Check offline mode if your change touches evaluation
- Confirm the console stays quiet in normal use

## Guidelines

### Code Style

- Keep the codebase simple and readable
- Reuse the existing patterns in the app rather than splitting things prematurely
- Avoid adding new dependencies unless they solve a real problem and are discussed first
- Keep visual changes consistent with the project voice: playful, clean, and browser-native

### Adding Levels

Each level is represented in the `LEVELS` array:

```js
{
  id: 31,                            // Sequential number
  phase: 3,                          // 1, 2, or 3
  day: "Bonus",                      // Day label
  title: "Your Level Title",         // Short title
  subtitle: "Brief description",     // One-line subtitle
  concept: "What the student learns", // Concept explanation
  task: "What to do",                // Clear task description
  hint: "Code hint",                 // Reference solution hint
  starterCode: "# Starter\n",        // Pre-filled code
  expectedOutput: "output",          // What correct code produces
  explanation: "Why this works",     // Post-solve explanation
  tags: ["tag1", "tag2"],            // Topic tags
}
```

If you add a new level, also add the Korean translation in the `LEVELS_KO` object with the same `id` key.

### Adding Translations

The app uses a `STRINGS` object for UI text and `LEVELS_KO` for level content. To add a new language:

1. Add a new key such as `ja` for Japanese to the `STRINGS` object with the translated UI strings
2. Create a matching `LEVELS_JA` object with translations for each level field
3. Add the language option to the language toggle in Settings
4. Update the translation lookup logic so the new language code is handled cleanly

## Pull Requests

- Keep PRs focused on one change or one theme
- Write a description that explains the user-visible impact
- Include screenshots for visual changes when possible
- Mention any follow-up work if your change deliberately leaves something for later

The repository already includes issue and PR templates. Please use them when they apply, because they help reviewers scan changes quickly.

## Commit Messages

Use conventional commit style when practical:

- `feat: add new level for decorators`
- `fix: correct concept collapse animation`
- `style: improve light mode contrast`
- `docs: update README with new features`

## Community Standards

Please keep the conversation respectful and collaborative. Assume good intent, explain tradeoffs clearly, and be generous when reviewing other people’s work. A good contribution here is not just correct - it is also understandable, considerate, and easy to build on.

## Questions?

Open an issue or start a discussion. No question is too small.
