<!-- GSD:project-start source:PROJECT.md -->
## Project

**Covalence Website** — the marketing, documentation, and releases site for [Covalence](https://github.com/darronz/covalence), a native macOS app that gives AI clients persistent, local-first memory via MCP.

**Core value:** When a new Covalence release is tagged in the app repo, this site rebuilds itself with the correct version, download, and release notes — with zero manual intervention — and visitors land on a page that explains Covalence clearly enough to decide whether to install it.

This repo was split out of the main app monorepo in v1.3 Phase 12 (2026-04). It is one side of a locked cross-repo contract: the app repo dispatches `repository_dispatch` events of type `new-release` with a self-contained payload → a workflow here writes `src/data/latest-release.json` and appends to `src/data/releases.json` → CF Pages auto-deploys. That payload shape (contract D-09…D-14 in the app repo) must not drift unilaterally.

Full context: `.planning/PROJECT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

- **Astro** `^6.1.6` — SSG, `output: 'static'`, file-based routing (`src/pages/`)
- **Starlight** `^0.38.3` — docs integration mounted at `/docs/*`, content under `src/content/docs/docs/` (nested-docs routing pattern)
- **Node** `>=22.12.0` (pinned to `22.16.0` via `.nvmrc` for CF Pages build determinism)
- **npm** (lockfile `package-lock.json`)
- **TypeScript** only for `src/content.config.ts` (strict mode via `astro/tsconfigs/strict`)
- **CSS** hand-authored, no preprocessor; tokens in `src/styles/global.css`, Starlight overrides in `src/styles/starlight.css`
- **Fonts** `@fontsource/inter`, `@fontsource/jetbrains-mono`
- **Deploy** Cloudflare Pages (Git-integrated, project `covalence-website-v2`, domain `covalence.app`)

No framework integrations (React, Vue, etc.) are installed. No tests exist today — verification is `npm run build` + `astro preview` + CF Pages preview deploys.

Full detail: `.planning/codebase/STACK.md`.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

- **Components** `PascalCase.astro` in `src/components/`, one component per file
- **Layouts** `PascalCase.astro` in `src/layouts/` (`Base.astro`)
- **Pages** lowercase matching URL segment (`src/pages/index.astro`)
- **Docs content** `kebab-case.md` in `src/content/docs/docs/`
- **Data** `kebab-case.json` in `src/data/`, JSON keys `snake_case` (matches upstream dispatch payload)
- **Indentation** 2 spaces throughout
- **Quotes** single in JS/TS, double in HTML attributes, semicolons in JS/TS
- **No Prettier / ESLint / Biome** — style is manually consistent; match what's already there

Full detail: `.planning/codebase/CONVENTIONS.md`.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Pure SSG: single `astro build` produces fully pre-rendered static HTML served from Cloudflare Pages. No runtime server, no API layer, no custom client framework.

Two visual modes coexist in one build:
- **Marketing landing** at `/` — custom `.astro` components (Hero, HowItWorks, Features, Architecture, Footer) composed in `src/pages/index.astro` via `src/layouts/Base.astro`
- **Docs** at `/docs/*` — Starlight theme rendering content from `src/content/docs/docs/`

**Release data pipeline (build-time):**
1. App repo CI sends `repository_dispatch` `type: new-release` with full metadata
2. `.github/workflows/` handler writes `src/data/latest-release.json` and appends `src/data/releases.json`, commits to `main`
3. CF Pages detects the commit and runs `astro build` → redeploys

`Hero.astro` reads `latest-release.json` at build time (no runtime fetch). The forthcoming `/releases` page (Phase 2) reads `releases.json` the same way.

Full detail: `.planning/codebase/ARCHITECTURE.md`.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` — do not edit manually.
<!-- GSD:profile-end -->
