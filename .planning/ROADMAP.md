# Roadmap: Covalence Website

## Overview

This milestone takes the Covalence website from "recently split out of the app monorepo" to "fully standalone, CI-gated, publicly verifiable, and indexable." Phase 1 makes the repo habitable as its own project and puts a build gate in front of `main`. Phase 2 ships the public `/releases` page that implements upstream DOC-09, consuming the `releases.json` contract already produced by the release-ingestion workflow. Phase 3 deepens the marketing content ("Under the hood") and closes SEO/sharing gaps (robots, sitemap, canonical, OG/Twitter). Phase 4 runs an accessibility pass on the custom (non-Starlight) surfaces so the site meets WCAG AA on brand-owned components. Everything else — tests, design-system extraction, i18n, SSR — is explicitly deferred.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Repo Hygiene & CI Gating** - Make the repo self-explanatory and put `astro build` in front of every PR merge to `main`
- [ ] **Phase 2: Releases Page** - Ship `/releases` reading `releases.json` at build time (implements upstream DOC-09)
- [ ] **Phase 3: Content Depth & SEO** - Expand the "Under the hood" section and close SEO / social-sharing metadata gaps
- [ ] **Phase 4: Accessibility Pass** - Custom components meet WCAG AA and pass an automated a11y scan

## Phase Details

### Phase 1: Repo Hygiene & CI Gating
**Goal**: The repo is self-explanatory to an outside contributor and broken builds cannot reach `main`.
**Depends on**: Nothing (first phase)
**Requirements**: REPO-01, REPO-02, REPO-03, REPO-04, CI-01, CI-02
**Success Criteria** (what must be TRUE):
  1. A visitor to the repo root on GitHub can go from "what is this?" to a running local dev server using only `README.md` (Node prereq, install, dev, build, preview, deploy flow, link to the main app repo).
  2. Opening a PR that changes any source file automatically runs `npm ci` + `npm run build` via GitHub Actions on a runner pinned to the `.nvmrc` Node version.
  3. A PR whose `astro build` fails cannot be merged into `main` because the build workflow is configured as a required status check on the `main` branch.
  4. Opening a new PR auto-fills a template asking "what changed, why, and screenshots for UI changes"; opening a new issue offers at minimum a bug report and a content/typo report template.
  5. `CONTRIBUTING.md` tells a new contributor how to branch, what commit message style to use, how the PR workflow works, and where docs vs. marketing content live.
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Author README.md, CONTRIBUTING.md, PR template, and issue templates (REPO-01..04)
- [ ] 01-02-PLAN.md — Add ci.yml build-gate workflow and enable required-status-check on main (CI-01, CI-02)

Notes:
- Low-risk foundation work. No production-site behavior changes.
- CI workflow here is separate from the existing `.github/workflows/new-release.yml` (which is a release-ingestion workflow, not a build gate).
- Branch protection / required status check configuration happens via repo settings; the plan should document this step even if it's a manual GitHub UI action.

### Phase 2: Releases Page
**Goal**: Visitors can find a public, chronological list of every Covalence release shipped since v1.3.0 — with version, date, summary, and a working download link — directly on `covalence.app`.
**Depends on**: Phase 1 (CI gate protects the `main` branch while this lands)
**Requirements**: REL-01, REL-02, REL-03
**Success Criteria** (what must be TRUE):
  1. Visiting `https://covalence.app/releases` renders a page listing at least one release (currently v1.3.2) with its version, release date, human-readable summary, and a working download link.
  2. When a new `repository_dispatch` event of type `new-release` is processed and `src/data/releases.json` gains a new entry on `main`, the next Cloudflare Pages build re-renders `/releases` with that entry included — with zero code changes and zero hand-editing of content.
  3. Each release entry's download link resolves to a DMG under the `covalence.app/releases/*` origin (not a preview host, not a relative path that breaks under `*.pages.dev`).
  4. The `/releases` page is reachable from the site's primary nav and/or footer, so a visitor does not need to know the URL to find it.
**Plans**: TBD

Notes:
- This implements upstream requirement DOC-09 from the main Covalence project.
- Reads `src/data/releases.json` via a build-time `import` (or an Astro content collection) — NO runtime fetch, per SSG-only constraint.
- `public/_routes.json` already excludes `/releases/*` from Pages routing so the DMG host passes through; verify the HTML page at `/releases` is NOT caught by that exclusion (it's `/releases` exact, not `/releases/*`).
- Seed data is already live (`76d273e`), so there is no upstream blocker.
**UI hint**: yes

### Phase 3: Content Depth & SEO
**Goal**: A technical reader can evaluate Covalence's retrieval stack without leaving the site, and every public page is cleanly indexable and shareable on social.
**Depends on**: Phase 2 (so `/releases` is included in sitemap and has canonical/OG metadata from the start)
**Requirements**: CONT-01, SEO-01, SEO-02, SEO-03, SEO-04
**Success Criteria** (what must be TRUE):
  1. A technical reader can, on a single page of the site, read a concrete description of the embedding model, asymmetric search, Matryoshka truncation, hybrid search, and recency weighting — at enough depth to decide whether the approach is credible.
  2. `https://covalence.app/robots.txt` returns a valid robots policy that allows indexing and points crawlers at the sitemap URL.
  3. `https://covalence.app/sitemap-index.xml` (or equivalent) resolves and lists every public route, including `/`, `/releases`, and every `/docs/*` page.
  4. Viewing the HTML of any public page shows a `<link rel="canonical">` pointing at the correct absolute URL on `covalence.app`.
  5. Pasting the home page URL and the docs root URL into a social-card debugger (Twitter/X, Facebook, LinkedIn, or the equivalent meta-tag inspector) renders a title, description, and an image — not a blank card.
**Plans**: TBD

Notes:
- Starlight already emits some of this for docs pages; gaps are concentrated on the marketing surfaces (`/`, `/releases`) and the missing `robots.txt`. See CONCERNS.md "Known Bugs" for specifics.
- CONT-01 may land as a dedicated `/docs/under-the-hood` page or as an expanded `Architecture.astro` section — plan-phase decides.
- No test infrastructure will be added here. Acceptance is "build passes on CI (from Phase 1) + manual verification that robots.txt/sitemap/canonical/OG tags render on the built `dist/`."
**UI hint**: yes

### Phase 4: Accessibility Pass
**Goal**: The site's brand-owned components (the ones Starlight doesn't already handle) meet WCAG AA and don't silently degrade for keyboard or screen-reader users.
**Depends on**: Phase 3 (content and metadata are in their v1 shape before we audit them)
**Requirements**: A11Y-01, A11Y-02, A11Y-03
**Success Criteria** (what must be TRUE):
  1. Running an automated a11y scan (axe-core, pa11y, or Lighthouse a11y) against the built `dist/` reports zero critical violations on the custom marketing surfaces (`/`, `/releases`, and any non-Starlight component rendered under those routes).
  2. A keyboard-only user can tab through every interactive element on the landing page and the releases page and see a clearly visible focus indicator on each one.
  3. Every interactive element (links, buttons, the download CTA, nav items) has an accessible name reported by a screen reader or accessibility inspector — no unlabeled icon-only controls.
  4. The primary CTA and brand accent color pairings meet WCAG AA contrast ratios (≥4.5:1 for body text, ≥3:1 for large text) verified by the same automated scan.
**Plans**: TBD

Notes:
- Scope is explicitly the non-Starlight surfaces — Starlight handles its own a11y for docs. See CONCERNS.md "Accessibility Gaps" for known starting points (emoji labeling in Features.astro, mobile nav, skip-to-main link, CTA contrast).
- Full manual screen-reader pass is v2 (A11Y-v2-01), not in scope here.
- Success is a clean automated scan + keyboard-tab verification, not a full human audit.
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Repo Hygiene & CI Gating | 0/2   | Not started | -         |
| 2. Releases Page | 0/TBD | Not started | - |
| 3. Content Depth & SEO | 0/TBD | Not started | - |
| 4. Accessibility Pass | 0/TBD | Not started | - |

---
*Roadmap defined: 2026-04-18*
*Granularity: coarse (4 phases for 17 requirements across 6 categories)*
