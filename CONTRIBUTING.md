# Contributing to Covalence Website

Thanks for your interest in contributing! See [README.md](./README.md) for setup instructions. This
doc covers branching, commit message style, the PR workflow, and where new content goes.

## Branching

- Branch off `main` for every change.
- Branch name format: `<type>/<short-kebab-summary>` where `<type>` is one of
  `feat`, `fix`, `docs`, `chore`, `refactor`. Examples: `feat/releases-page`,
  `fix/footer-link`, `docs/contributing-guide`, `chore/bump-astro`.
- Keep branches short-lived; rebase on `main` before opening the PR if `main`
  has moved.

## Commit messages

This repo follows Conventional Commits, as observed throughout the existing git history. Format:

```text
<type>(<optional-scope>): <imperative summary>
```

Types in use:

- `feat` — a user-visible feature
- `fix` — a bug fix
- `docs` — documentation only
- `chore` — tooling, deps, repo housekeeping
- `refactor` — internal restructuring with no behavior change
- `chore(release): vX.Y.Z` — release ingestion commits, written by the
  `new-release.yml` workflow (do NOT author these by hand)

Concrete examples drawn from this repo's actual history:

- `feat(hero): read version and download size from latest-release.json`
- `chore: pin Node version for CF Pages build determinism`
- `docs: define v1 requirements`
- `fix(website): make Starlight sidebar selected text dark on rose highlight`

Scope is optional; use it when the change is clearly scoped to one component or surface (e.g.
`feat(hero):`, `fix(footer):`, `docs(contributing):`).

## Pull request workflow

1. Open the PR against `main`.
2. Fill in the PR template (it auto-loads from `.github/pull_request_template.md`).
3. Wait for the GitHub Actions build check to pass — it runs `npm ci` and `npm run build` on a
   runner pinned to `.nvmrc`. **A failing build blocks merge** (the workflow is configured as a
   required status check on `main`).
4. Cloudflare Pages will post a preview deploy URL on the PR — open it and spot-check anything
   visual.
5. Squash-merge once green and reviewed.

There are no tests in this repo today, so the build check and the Pages preview are the safety net.
If you change anything visual, attach a before/after screenshot to the PR per the template.

## Where content lives

- **A new section on the marketing landing page (`/`)**: add a new `PascalCase.astro` component
  under `src/components/`, then import and place it inside `<main>` in `src/pages/index.astro`.
  Use design tokens from `src/styles/global.css` (`var(--accent)`, `var(--space-lg)`, the
  `.container`, `.section`, `.section-title` utilities).

- **A new top-level marketing page (e.g. `/pricing`)**: add `src/pages/<route>.astro`, wrap it in
  `<Base title="…" description="…">` from `src/layouts/Base.astro`. Astro emits it at `/<route>/`.

- **A new documentation page**: add `src/content/docs/docs/<slug>.md` with frontmatter (`title`
  and `description` are required by Starlight). Then add a matching entry to the `sidebar` array
  in `astro.config.mjs` — pages are NOT auto-added to the sidebar.

- **An MDX doc using Starlight components (e.g. `<Tabs>`)**: name the file `.mdx` and import
  from `@astrojs/starlight/components`.

- **A new design token (color, spacing)**: add to `:root` in `src/styles/global.css`. If it
  should also apply inside the docs theme, mirror it in `src/styles/starlight.css`.

- **A new release-data field**: extend the dispatch payload in
  `.github/workflows/new-release.yml` and consume it in the relevant component. Do NOT
  hand-edit `src/data/latest-release.json` or `src/data/releases.json` — they are written by
  CI on `repository_dispatch` events.

## Code style

- 2-space indentation throughout.
- Single quotes for JS/TS strings, double quotes for HTML attributes, semicolons in JS/TS.
- Astro components use `PascalCase.astro`; pages use lowercase matching the URL segment; docs
  use `kebab-case.md`.
- No Prettier / ESLint / Biome is configured — match what's already there.

## Reporting bugs and content issues

Open an issue using the appropriate template (Bug report or Content / Typo report). Bug reports
about the Covalence app itself (the macOS product) belong in the upstream repo:
[github.com/darronz/covalence/issues](https://github.com/darronz/covalence/issues).
