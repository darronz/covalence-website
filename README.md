# Covalence Website

The marketing, documentation, and releases site for [Covalence](https://github.com/darronz/covalence) — a
native macOS app that gives any AI client persistent, local-first memory via
MCP. This is a standalone Astro 6 + Starlight static site deployed to https://covalence.app via Cloudflare Pages.

## What this repo is

This repo is content and components only — no backend, no runtime. It is one side of a cross-repo
contract: the main app repo dispatches `repository_dispatch` events of type `new-release`, which a
workflow here turns into JSON data files that drive the homepage. For bugs in the Covalence macOS app
or to follow core development, see
[github.com/darronz/covalence](https://github.com/darronz/covalence).

## Prerequisites

- Node.js `>=22.12.0` (this repo pins `22.16.0` via `.nvmrc` for reproducibility
  with Cloudflare Pages — recommended: install `nvm` and run `nvm use` from the
  repo root)
- npm (ships with Node)
- macOS, Linux, or Windows — no platform-specific build steps

## Install

```bash
nvm use            # picks up .nvmrc -> 22.16.0
npm ci             # reproducible install from package-lock.json
```

Prefer `npm ci` over `npm install` so contributors and CI agree on the dependency tree.

## Local development

```bash
npm run dev        # astro dev server at http://localhost:4321
npm run build      # production build into dist/
npm run preview    # serve dist/ locally to verify the built output
```

There are no tests in this repo today; verification is `npm run build` succeeding plus a
Cloudflare Pages preview deploy on PR.

## Project layout

```text
src/
  pages/index.astro            # Marketing landing page (/)
  layouts/Base.astro           # Marketing layout
  components/*.astro           # Marketing sections (Hero, Features, ...)
  content/docs/docs/*.md       # Starlight docs (served at /docs/<slug>/)
  data/*.json                  # Release metadata (machine-written)
  styles/global.css            # Design tokens + base styles
  styles/starlight.css         # Starlight theme overrides
public/                         # Static files served verbatim at site root
astro.config.mjs                # Astro + Starlight config (sidebar lives here)
.github/workflows/new-release.yml  # Ingests release events into src/data/
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the docs-vs-marketing decision tree when adding a new page.

## Deployment

Cloudflare Pages is connected to this repo (project `covalence-website-v2`). Every push to `main`
triggers a production build of `npm run build` and deploys `dist/` to https://covalence.app. Pull
requests get a preview deploy at a `*.pages.dev` URL.

Releases of the Covalence macOS app push their metadata to this repo via a `repository_dispatch`
event handled by `.github/workflows/new-release.yml`, which commits updated
`src/data/latest-release.json` and `src/data/releases.json` to `main`. That commit triggers the
Pages build, so a new release goes live with no manual intervention here.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching, commit message style, the PR workflow, and
where new docs vs. marketing content belongs.

## Related repos

- [`darronz/covalence`](https://github.com/darronz/covalence) — the main
  Covalence macOS app source. Releases there trigger rebuilds here.
