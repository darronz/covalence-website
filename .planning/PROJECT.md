# Covalence Website

## What This Is

The marketing, documentation, and releases site for [Covalence](https://github.com/darronz/covalence) — a native macOS app that gives any AI client persistent, local-first memory via MCP. This repo is a standalone static site (Astro 6 + Starlight) deployed to `covalence.app` via Cloudflare Pages, and is driven by release metadata dispatched from the main app repo's CI pipeline.

## Core Value

When a new Covalence release is tagged in the app repo, this site rebuilds itself with the correct version, download, and release notes — with zero manual intervention — and visitors land on a page that explains what Covalence is clearly enough to decide whether to install it.

## Requirements

### Validated

<!-- Inferred from existing code / shipped in prior phases. See .planning/codebase/ -->

- ✓ Astro 6 + Starlight SSG, Node `>=22.12.0` pinned via `.nvmrc` — app repo Phase 12
- ✓ Cloudflare Pages Git-integrated deploy on project `covalence-website-v2`; custom domain `covalence.app` — app repo Phase 12
- ✓ Hero reads version + download size from `src/data/latest-release.json` at build time (no manual bumps) — app repo Phase 12 (D-13)
- ✓ Docs section scaffolded under `src/content/docs/docs/` (nested-path routing pattern) — app repo Phase 10
- ✓ Onboarding explains both MCP "Connect + Instruct" copy-paste steps — inherited from app repo
- ✓ Release metadata ingested via `repository_dispatch` (type `new-release`) workflow that writes `src/data/latest-release.json` and appends `src/data/releases.json`, then commits to `main` — app repo Phase 12 (D-09…D-14)
- ✓ Git history preserved from original `website/` subdirectory via `git filter-repo` (28 commits) — app repo Phase 12
- ✓ Seeded `latest-release.json` / `releases.json` at v1.3.2 — commits `76d273e` / `3701d2e`

### Active

<!-- This milestone's scope. The website's first standalone-repo cycle. -->

- [ ] Standalone-repo hygiene — README, CONTRIBUTING expectations, license, issue/PR templates appropriate for a site repo (not a monorepo subfolder anymore)
- [ ] Releases page (`/releases`) — lists all published Covalence releases with version, date, summary, download links (mirrors upstream DOC-09)
- [ ] CI gating for PRs — at minimum `astro build` on PR, so broken builds cannot reach `main` and auto-deploy
- [ ] Expanded "Under the hood" technical section — embedding model, asymmetric search, Matryoshka truncation, hybrid search, recency weighting (from app STATE.md todos)
- [ ] SEO + sharing hygiene — canonical URLs, OG tags, `robots.txt`, `sitemap.xml` if not already present
- [ ] Accessibility pass on custom Astro components (non-Starlight surfaces: Hero, HowItWorks, any custom sections)

### Out of Scope

- Server-side rendering or runtime API calls — site is SSG only; runtime would break the CF Pages static deploy model
- Owning the release pipeline — the app repo publishes; this site only *consumes* the dispatch payload. Changing the payload shape is a cross-repo contract change
- Authentication / accounts / in-app state — nothing to log into
- Backend for analytics, telemetry, search index — if added later, must be static or edge-only (CF Pages compatible)
- Design system / component library extraction — keep components colocated in `src/` until real reuse pressure exists
- Multi-language / i18n — English-only for the foreseeable future
- Migrating pre-v1.3.0 releases into the releases page — matches upstream decision (only v1.3.0+ flows through the pipeline)
- Visual polish work pushed here from the app repo — small CSS fixes are fine; a ground-up redesign belongs in its own milestone

## Context

This repo was carved out of the main Covalence app repo in v1.3 Phase 12 (April 2026). Git history was preserved via `git filter-repo --subdirectory-filter website` and Cloudflare Pages was re-pointed from a Direct Upload project to a new Git-integrated project (`covalence-website-v2`), with `covalence.app` swapped over and the old project retained for a 24h rollback window.

The site is one side of a two-repo contract: the app repo's CI (Phase 14, pending) dispatches `repository_dispatch` events with full release metadata, and a workflow in this repo translates them into data files checked into `main`. CF Pages sees the commit and auto-deploys. That contract — event type `new-release`, payload shape D-11, auth token `WEBSITE_DISPATCH_TOKEN` with `contents:write` + `metadata:read` scoped to this repo — is locked. Any change requires cross-repo coordination.

Upstream pending work that touches this repo: Phase 15 (Website Releases Page, DOC-09/10/11), plus a standing todo to flesh out the "Under the hood" technical section. There are no tests in this repo today — verification is `npm run build`, local `astro preview`, and CF Pages preview deploys on PR.

See `.planning/codebase/` (mapped 2026-04-18) for the full technical picture — stack, architecture, conventions, concerns.

## Constraints

- **Tech stack**: Astro 6 + Starlight, TypeScript via `tsconfig.json` — no framework switch; Starlight constrains docs surface
- **Runtime**: SSG only — no server, no runtime APIs, must build to static HTML/CSS/JS
- **Host**: Cloudflare Pages Git-integrated deploy — build output must be compatible (standard `dist/`)
- **Node version**: `>=22.12.0` per `package.json` + `.nvmrc` — matches CF Pages build environment for determinism
- **Cross-repo contract**: `repository_dispatch` payload shape (D-11) and event type (`new-release`) are locked. Changes coordinate with the app repo
- **Domain**: `covalence.app` is live — changes that break routing or redirects are production incidents
- **Data sources**: `src/data/latest-release.json` and `src/data/releases.json` are written by CI, read by components at build time. Treat them as machine-generated; do not hand-edit except for seed/bootstrap

## Key Decisions

<!-- Decisions that constrain future work. Carry-overs explicitly marked. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Standalone repo (split from app monorepo) | Decouples website deploy cadence from app; lets CI paths in the app repo reason about app-only layout | ✓ Good (app repo Phase 12) |
| Astro + Starlight over Docusaurus/Next | Starlight is docs-first, lightweight, SSG-native, low JS — right fit for a marketing + docs site | ✓ Good (inherited) |
| Cloudflare Pages Git-integrated (not Direct Upload) | Auto-deploy on push removes manual release step; matches the "release is a tag push" v1.3 goal | ✓ Good (app repo Phase 12) |
| Release metadata via `repository_dispatch` (not API polling) | Push-based, no scheduled jobs, no rate-limit exposure, payload self-contained so no callback needed | ✓ Good (app repo Phase 12, D-09) |
| Hero version at build time, not runtime | SEO correctness, no hydration flash, no runtime dependency on GitHub API | ✓ Good (app repo Phase 12, D-13) |
| Content nesting `src/content/docs/docs/` | Starlight subdirectory routing without breaking base config that also serves marketing pages | ✓ Good (app repo Phase 10) |
| No tests (today) | Site is declarative content + light components; `astro build` + preview deploys catch most regressions. Revisit if logic grows | — Pending |
| GSD planning lives in `.planning/` | This repo now uses GSD independently from the app repo's `.planning/` | ✓ Good (this init) |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-18 after initialization (standalone-repo GSD bootstrap)*
