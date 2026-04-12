# Changelog

All notable changes to Pyi-thon are tracked here.

This project follows semantic versioning for public releases. The first official tag is expected to be `v1.0.0`; until then, release-ready changes stay under `Unreleased`.

## Unreleased

### Added

- Repo community-health files, issue templates, CI, Dependabot, and release automation.
- Release checklist, roadmap, and label taxonomy documentation.
- Lightweight ESLint coverage with `npm run lint`.
- Client-side regression coverage to prevent public API key environment variables from entering the shipped client.
- Modular app structure under `src/components`, `src/data`, `src/lib`, and `src/theme`.
- Web app manifest, app icons, Apple touch icon, and manifest asset coverage.

### Changed

- README and contributor guidance now reflect the public quality bar for the app, source, and release workflow.
- Client AI provider handling now fails gracefully for unknown provider values.
- Interactive hover handlers now apply style changes to the intended button elements.
- Settings now has dialog semantics, Escape-key close behavior, clearer control states, and stronger mobile overflow handling.
- Focus-visible and reduced-motion treatment now apply consistently across the app.

### Planned

- Cut the first official tag after the PR is reviewed and merged.
- Keep release notes aligned with `.github/release.yml` categories.
