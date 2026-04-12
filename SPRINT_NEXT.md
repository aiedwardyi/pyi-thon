# Pyi-thon Next Sprint

Last updated: 2026-04-12

This file is the handoff note for the next round of work on Pyi-thon.
If chat context is cleared, start by opening this file.

## Sprint Goal

Make the repo and product feel unmistakably professional to programmers visiting:

- the live site
- the page source and devtools
- the public GitHub repo
- the contributor workflow

## Recommended Order

1. Codebase polish
2. UI interaction polish
3. Release polish
4. Accessibility polish
5. Branding and social polish
6. GitHub polish

## Current State

Already completed before this sprint:

- Removed unsafe build-time API key injection from the public client
- Cleaned up developer-facing source and production bundle details
- Added repo community-health files, issue routing, CI, release workflow, Dependabot, and public-facing README/contributing polish
- Removed em dashes from source and built site copy

## Sprint Backlog

### 1. Codebase polish

Goal:
Reduce the "single huge app file" feeling and make the source look more intentional to experienced developers.

Tasks:

- Split `src/App.jsx` into a few focused modules without overengineering
- Keep the app simple, but separate obvious responsibilities:
  - `src/data/levels.js`
  - `src/data/translations.js`
  - `src/lib/storage.js`
  - `src/lib/evaluation/`
  - `src/theme/`
  - `src/components/` for a few high-signal UI pieces
- Add ESLint with a lightweight config
- Add `npm run lint`
- Keep dependencies lean and avoid style-framework bloat

Definition of done:

- `App.jsx` is no longer the overwhelming center of gravity
- A programmer can scan the structure and understand where things live
- `npm run lint`, `npm test`, and `npm run build` all pass

### 2. UI interaction polish

Goal:
Make the product feel more premium and intentional in motion and interaction.

Tasks:

- Improve button hover/active states
- Make Settings interactions feel softer and more polished
- Refine toggles, tabs, and panel transitions
- Add slightly more "bubbly" motion where it fits
- Keep motion tasteful, not flashy
- Preserve mobile usability

Definition of done:

- Buttons and settings feel smoother and more deliberate
- Motion improves quality perception without hurting speed
- Desktop and mobile still behave well

### 3. Release polish

Goal:
Make the repo feel ready for real versioned releases.

Tasks:

- Add `CHANGELOG.md`
- Add a release checklist doc
- Define versioning and tagging expectations
- Prepare for a clean first official tag such as `v1.0.0`
- Make sure release notes line up with the GitHub release workflow

Definition of done:

- A maintainer can cut a release confidently
- Public visitors can see a clear release story

### 4. Accessibility polish

Goal:
Raise trust by making the product work better for keyboard and assistive-tech users.

Tasks:

- Audit focus states and tab order
- Improve modal semantics and keyboard handling
- Verify labels and roles on interactive controls
- Add or refine reduced-motion handling
- Check contrast and readability where needed

Definition of done:

- Keyboard navigation feels intentional
- Focus treatment is consistent
- Accessibility looks cared for, not accidental

### 5. Branding and social polish

Goal:
Make the app and repo look more complete when shared or installed.

Tasks:

- Add `manifest.webmanifest`
- Add touch icons / app icons where missing
- Review favicon/app metadata
- Improve Open Graph / social preview assets if needed
- Tighten README visuals if new screenshots or assets help

Definition of done:

- Shared links look polished
- Install/share metadata feels intentional

### 6. GitHub polish

Goal:
Make the public repo feel maintained, navigable, and easy to contribute to.

Tasks:

- Add a sensible label taxonomy
- Consider enabling GitHub Discussions
- Add a simple roadmap or project board reference
- Add milestone conventions
- Make release naming and issue flow feel consistent

Definition of done:

- Repo navigation is clearer for contributors and visitors
- Maintainer workflow looks deliberate

## Suggested First Slice

If picking up fresh, start here:

1. Refactor `src/App.jsx` into modules
2. Add ESLint and `npm run lint`
3. Run `npm run smoke`
4. Do one UI motion pass on Settings, buttons, and tabs

That path gives the best professionalism boost per hour.

## Resume Prompt

If resuming in a new chat, use something like:

"Open `SPRINT_NEXT.md` in the Pyi-thon repo and continue the next sprint from the top priority item. Start with codebase polish unless there is an obvious blocker."

## Notes

- Keep commit messages plain and professional
- Avoid anything that reads like AI-generated filler
- Favor small, reviewable changes over giant rewrites
- Preserve the existing product personality while making it feel sharper
