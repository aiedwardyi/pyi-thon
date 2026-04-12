# Release Checklist

Use this checklist before publishing a versioned Pyi-thon release.

## Versioning

- Use semantic versioning: `MAJOR.MINOR.PATCH`.
- Use tags in the form `v1.0.0`.
- Keep the package version, changelog, and release notes aligned.
- Prefer small releases with a clear user-facing theme.

## Preflight

- Review `CHANGELOG.md` and move relevant entries out of `Unreleased`.
- Confirm no private keys, scratch prompts, local QA dumps, or generated debug artifacts are staged.
- Review `README.md`, `CONTRIBUTING.md`, and `SUPPORT.md` if the release changes public workflow.
- Confirm screenshots or social assets still match the shipped app when visual changes land.

## Validation

Run these checks from a clean working tree:

```bash
npm run lint
npm run smoke
npm run test:e2e
```

For UI changes, also smoke test:

- Fresh app load
- Settings open and close
- Theme change
- Language change
- Level select navigation
- Offline evaluation on at least one passing and one failing solution
- Desktop and mobile widths

## Publish

```bash
git tag v1.0.0
git push origin v1.0.0
```

The release workflow builds the static site, packages `dist/`, and publishes a GitHub Release with generated notes.

## After Publishing

- Check the GitHub Release notes for clear grouping.
- Download and inspect the packaged static site artifact.
- Confirm production still loads cleanly.
- Open a follow-up issue for any intentional post-release work.
