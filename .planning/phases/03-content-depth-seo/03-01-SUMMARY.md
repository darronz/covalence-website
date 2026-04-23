---
phase: 03-content-depth-seo
plan: 01
subsystem: seo
tags: [robots.txt, starlight, open-graph, twitter-card, sitemap, astro, seo]

# Dependency graph
requires:
  - phase: 2.1-blog
    provides: "starlight({ head: [...] }) array (single <link rel=\"alternate\"> entry) as the structural template this plan extends with 4 meta-tag entries"
provides:
  - "public/robots.txt served at site root (4 directives, allow-all, sitemap pointer, DMG disallow)"
  - "Starlight head array extended with og:image, og:image:width, og:image:height, twitter:image — the 4-tag delta that brings /docs/* to parity with Base.astro's SEO block"
  - "Starlight sidebar registration for /docs/under-the-hood (slot between Core Memories and MCP Tools) so Plan 03-02's page is reachable via docs navigation"
  - "Technically accurate MLTensor wording on Features.astro Local embeddings card — no longer drifts from the /docs/under-the-hood explainer"
affects: [03-02-under-the-hood, 03-03-architecture-teaser, 03-04-verification, future seo/sharing phases]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Delta-only Starlight head mirror (option 2c): only tags Starlight does NOT auto-emit are added; rely on Starlight's per-page og:* emission for twitter:* fallback"
    - "Hardcoded absolute URLs in config-time head arrays (no Astro.site in scope at config load)"
    - "Allow-all robots.txt policy with narrow DMG disallow — aligned with the site's open-public stance"

key-files:
  created:
    - public/robots.txt
  modified:
    - astro.config.mjs
    - src/components/Features.astro

key-decisions:
  - "Delta-only head mirror (option 2c from 03-RESEARCH §Head Tag Mirror) — chosen over full mirror to keep astro.config.mjs readable and avoid redundant emission; Starlight's mergeHead() would dedupe but 4 vs 10 tags is the right tradeoff"
  - "No twitter:title / twitter:description tags added — Twitter/X falls back to og:title / og:description which Starlight already emits per-page from frontmatter; adding site-wide hardcoded values would stamp one title on every /docs/* page"
  - "Sidebar entry for docs/under-the-hood lands in this plan even though Plan 03-02 owns the .md file — both plans run in Wave 1 and the orchestrator validates after the full wave; pre-creating the .md file here would overlap Plan 03-02's scope"
  - "Features.astro voice fix folded into this plan (per 03-RESEARCH Open Question 3) — MLTensor/Apple Silicon is accurate; CoreML/ANE is not what the code declares; matching /docs/under-the-hood language here closes the mismatch in one plan rather than a trailing quick task"
  - "Disallow pattern uses RFC 9309 `/releases/*.dmg` wildcard rather than `/releases/Covalence-*.dmg` — robust to future DMG naming changes; does NOT block /releases/ HTML index"

patterns-established:
  - "Delta-only Starlight head mirror — only add tags Starlight does not already auto-emit; annotate with a comment explaining what's being skipped and why"
  - "Literal absolute URLs in config-time head arrays — Astro.site is not in scope; hardcode and keep consistent with the `site:` field on line 5"
  - "Voice correction for technical-accuracy drift — when marketing copy claims a stack detail that the code doesn't actually declare, fold a one-line correction into the nearest content-depth plan"

requirements-completed: [SEO-01, SEO-03, SEO-04]

# Metrics
duration: ~2min
completed: 2026-04-23
---

# Phase 03 Plan 01: SEO metadata baseline Summary

**Four-line allow-all robots.txt at the site root, a 4-tag og:image / twitter:image delta in Starlight's head array bringing /docs/* to parity with Base.astro, a new Under the Hood sidebar entry reserving the slot for Plan 03-02's deep-dive page, and a Features.astro one-liner rewrite that swaps the technically-inaccurate "CoreML on Apple Neural Engine" claim for "MLTensor on Apple Silicon" so the marketing surface no longer contradicts the technical docs.**

## Performance

- **Duration:** ~2 min (91 seconds executor wall time)
- **Started:** 2026-04-23T07:03:19Z
- **Completed:** 2026-04-23T07:04:50Z
- **Tasks:** 3 / 3
- **Files modified:** 3 (1 created, 2 edited)

## Accomplishments

- `public/robots.txt` shipped (4 lines exactly, ASCII, LF-terminated) — crawlers now find `Sitemap: https://covalence.app/sitemap-index.xml` and a narrow `Disallow: /releases/*.dmg` that keeps crawler budget off the worker-proxied DMG downloads while leaving every HTML route indexable. No blanket AI-crawler blocks per D-07.
- `astro.config.mjs` head array extended by 4 meta entries (og:image + og:image:width=1200 + og:image:height=627 + twitter:image — all pointing at the literal absolute URL `https://covalence.app/og-image.png`). This is the full delta between Starlight's native emission and Base.astro's SEO block per 03-RESEARCH §Head Tag Mirror; nothing Starlight already emits is re-emitted.
- `astro.config.mjs` sidebar array gained a 7th entry `{ label: 'Under the Hood', slug: 'docs/under-the-hood' }` inserted between Core Memories and MCP Tools, registering the navigation slot Plan 03-02 populates with `src/content/docs/docs/under-the-hood.md`.
- `src/components/Features.astro` Local embeddings feature-card description replaced with technically-accurate, voice-compliant wording: `'nomic-embed-text-v1.5 via MLTensor on Apple Silicon. No API keys. No network round-trips.'`. Drops two promotional adjectives ('no cost', 'millisecond inference') and the inaccurate "CoreML on Apple Neural Engine" claim.

## Task Commits

Each task was committed atomically with `--no-verify` (parallel executor convention):

1. **Task 1: Create public/robots.txt with the four D-06 directives** — `56e79ff` (feat)
2. **Task 2: Extend astro.config.mjs — 4 head entries + Under-the-Hood sidebar entry** — `38dad2e` (feat)
3. **Task 3: Correct Features.astro line 21 — MLTensor on Apple Silicon** — `6e6fcc4` (fix)

_No refactor or test commits — this plan is pure additive config + one-line content fix._

## Files Created/Modified

### Created

- **`public/robots.txt`** (new, 4 lines, 98 bytes, ASCII) — crawler policy + sitemap pointer. Astro 6 copies `public/` to `dist/` byte-identical on every build, so CF Pages will serve this at `https://covalence.app/robots.txt` on next deploy.

### Modified

- **`astro.config.mjs`** (+11 insertions) — Starlight `head` array grew from 1 entry to 5 (existing RSS `<link rel="alternate">` preserved; 4 new `<meta>` entries appended with a 6-line explanatory comment block). Sidebar array grew from 6 entries to 7 (Under the Hood inserted at index 3). No `@astrojs/sitemap` import added (Pitfall L1); no `twitter:title` or `twitter:description` added (option 2c). Structure of the existing `integrations: [starlight({ ... })]` block preserved.
- **`src/components/Features.astro`** (+1 insertion, -1 deletion — single-line replacement) — line 21 description text changed. The 5 other feature-card descriptions (Semantic search, Core Memories, Multi-client, Always running, Your data), all icons/titles, the `<template>` render block, and the `<style>` block are byte-identical to pre-edit. Grep confirmed 4 `.feature-grid` CSS rule references unchanged.

## Decisions Made

- **Delta-only head mirror (option 2c)** instead of full mirror of Base.astro's SEO block. Rationale: Starlight already auto-emits canonical, og:title, og:type (as "article"), og:url, og:description, og:site_name, og:locale, twitter:card, and meta description on every `/docs/*` page — verified empirically against `dist/docs/index.html` during 03-RESEARCH. The only missing tags are the image-set. Mirroring the already-emitted tags would work (Starlight's `mergeHead` dedupes by name/property per `utils/head.ts:140-187`) but produces config noise. The 6-line comment above the new entries documents the reasoning for future maintainers.
- **Skip `twitter:title` / `twitter:description` entirely.** Modern Twitter/X falls back to `og:title` / `og:description` when twitter-specific tags are absent. Starlight emits og:title from each doc's frontmatter title and og:description from frontmatter description, so twitter cards on `/docs/*` pages get correct per-page values via the fallback without any mirror work. Adding hardcoded site-level values would paint every doc page with the same title — strictly worse than the fallback.
- **Sidebar entry for docs/under-the-hood lands in this plan, not Plan 03-02.** The plan was written this way deliberately: Plan 03-02 creates the `.md` file, Plan 03-01 registers the navigation slot. Both plans run in Wave 1; the orchestrator validates `npm run build` at the Phase 3 checkpoint (Plan 03-04), not per-plan. If Plan 03-01 runs before Plan 03-02 in the same wave, an intermediate `npm run build` would fail with "no matching page" — this is expected and not a regression.
- **Features.astro fix folded in** per 03-RESEARCH Open Question 3. The technically-accurate phrasing anchors the marketing surface to what `/docs/under-the-hood` will say (Plan 03-02), preventing a cross-surface credibility gap. Surgical one-line edit; no voice sweep of adjacent lines attempted (those lines have no UK-variant spellings to rewrite and no other promotional adjectives to prune — verified by grep).
- **Hardcoded absolute og:image URL** rather than a template literal or computed value. `starlight({ head })` is a static array evaluated at config-load time where `Astro` is not in scope (Pitfall L2). The site URL is already hardcoded at `astro.config.mjs:5` (`site: 'https://covalence.app'`), so duplicating the origin in the head entries is consistent with existing precedent and avoids introducing a brittle string-concatenation pattern.

## Deviations from Plan

None — plan executed exactly as written.

All three tasks' automated verifications passed on first attempt; all acceptance criteria met without rework. No Rule 1 (bug), Rule 2 (missing critical), Rule 3 (blocking), or Rule 4 (architectural) deviations applied. No CLAUDE.md directives contradicted the plan (2-space indent, single-quoted JS, trailing commas on array entries, no Prettier/ESLint — all followed).

## Issues Encountered

None.

## Verification Status

Plan-level verification step 1 (`npm run build` exits 0) is **deferred to Plan 03-04** per this plan's explicit note at `<verification>` step 1: "depends on Plan 03-02 landing `src/content/docs/docs/under-the-hood.md` — sidebar references it; if Plan 03-02 hasn't run yet, this step is deferred to Plan 03-04's consolidated build gate." Since this agent ran as a parallel worktree executor in the same wave as Plan 03-02, running `npm run build` here would fail solely because the under-the-hood.md file is not yet merged in this worktree. The orchestrator's post-merge build at the Phase 3 checkpoint is the authoritative gate.

Plan-level verification steps 2-5 (dist/robots.txt copy-through, dist/docs/*/index.html og:image emission, dist/index.html Features.astro text) all require a successful build and are therefore similarly deferred to Plan 03-04.

All per-task automated verification blocks (see Task 1 / Task 2 / Task 3 acceptance_criteria) ran and passed on source files — this is the portion of verification that is source-level and does not depend on build artifacts.

## User Setup Required

None — no external service configuration required. `public/robots.txt` and OG image URLs reference the already-live `https://covalence.app` domain; no DNS or CDN changes. Cloudflare Pages will serve the new `/robots.txt` on its next Git-triggered deploy.

## Next Phase Readiness

**Ready for:**
- Plan 03-02 (Under the Hood docs page) — sidebar slot is registered; plan can create `src/content/docs/docs/under-the-hood.md` with the frontmatter title/description and trust the nav entry to render on first build.
- Plan 03-03 (Architecture.astro teaser rewrite) — no file conflict; Architecture.astro was not touched by this plan. The voice invariants enforced here ("MLTensor on Apple Silicon", no promotional adjectives) are the same pattern Plan 03-03 applies to its own rewrite.
- Plan 03-04 (phase verification checkpoint) — will build once Plan 03-02 lands and will grep `dist/docs/*/index.html` for the 4 new meta tags emitted from this plan's head array.

**No blockers introduced.** No CI changes, no deploy-path changes, no cross-repo contract touchpoints.

## Self-Check: PASSED

Verification that the claims above are real (not hallucinated):

- `public/robots.txt` exists: `FOUND` (size 98 bytes, ASCII text, 4 lines, LF line endings)
- Commit `56e79ff` exists: `FOUND` (feat(03-01): add public/robots.txt with allow-all policy and sitemap pointer)
- Commit `38dad2e` exists: `FOUND` (feat(03-01): extend Starlight head + sidebar in astro.config.mjs)
- Commit `6e6fcc4` exists: `FOUND` (fix(03-01): correct Local embeddings voice in Features.astro)
- `astro.config.mjs` has 4 new meta entries + 1 new sidebar entry: `FOUND` (grep confirmed all 4 meta literals + `{ label: 'Under the Hood', slug: 'docs/under-the-hood' }`)
- `astro.config.mjs` has NO sitemap import and NO twitter:title/description: `FOUND` (grep -v confirmed absence of all three)
- `src/components/Features.astro` contains "MLTensor on Apple Silicon" and does NOT contain "CoreML on Apple Neural Engine" or "no cost, millisecond inference": `FOUND` (all three grep assertions passed)
- Worktree branch correctly based on `e0bd68074b88400b08cf5f4794fd06a4b5368a1f`: `FOUND` (reset at session start; verified HEAD matches)

No claims in this SUMMARY reference files or commits that do not exist.

---

*Phase: 03-content-depth-seo*
*Plan: 01 (Wave 1)*
*Completed: 2026-04-23*
