# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-18)

**Core value:** When a new Covalence release is tagged in the app repo, this site rebuilds itself with the correct version, download, and release notes — with zero manual intervention — and visitors land on a page that explains what Covalence is clearly enough to decide whether to install it.
**Current focus:** Phase 2.1 — Blog (Phase 2 Releases Page shipped outside GSD flow)

## Current Position

Phase: 2.1 of 4+ (Blog, INSERTED) — Wave 7 landed; Phase 2.1 content is complete; Wave 5 browser-level checkpoint pending re-run on the refreshed preview
Plan: 6/7 (Waves 1–4 landed; Wave 6 landed on `gsd/phase-2.1-blog@4d258b0`; Wave 7 landed on `gsd/phase-2.1-blog@f37c81a`; Wave 5 still pending — it's the browser-level preview-deploy checkpoint, re-runs on refreshed CF Pages preview)
Status: Wave 7 gap-closure plan 02.1-07 executed cleanly. `src/content/docs/docs/getting-started.md` rewritten — `<Tabs>`/`<TabItem>` dropped, the stray `import { Tabs, TabItem }` literal prose-line removed, and the five per-client setup blocks are now linear H3 sub-sections (Claude Desktop / Claude Code / Cursor / OpenCode / ChatGPT) with column-1 fenced code blocks. Post-fix metrics on `/docs/getting-started/`: leaked_fences 0 (baseline 0 — Plan 06 had silently fixed this already), ec_lines 8 → 16 (EC now processes the previously-indented content as full-width ec-lines), ec_wrappers 4 (unchanged). Wave 4 invariants preserved (RSS alternate rel count=1 on `/docs/getting-started/` and `/posts/index.html`); no regression on sibling `/docs/*` pages. Branch pushed to origin (`7ff888e..f37c81a`) so CF Pages will auto-rebuild the preview for the 02.1-05 re-run.
Last activity: 2026-04-22 — Plan 02.1-07 complete on `gsd/phase-2.1-blog@f37c81a`. Route: re-run 02.1-05 checkpoint in a browser against the refreshed CF Pages preview — confirm `/docs/getting-started/` renders five H3 sub-sections with all four code blocks showing Starlight-themed syntax colouring, copy buttons, and frame chrome.

Progress: [██████████] 86% (2 phases + 6 of 7 blog plans shipped)

## Performance Metrics

**Velocity:**
- Total plans completed: 8
- Average duration: ~4.5 min (Phase 2.1 Plans 01 + 02 + 03 + 04 + 06 + 07 measured)
- Total execution time: ~27 min (Plans 02.1-01 + 02.1-02 + 02.1-03 + 02.1-04 + 02.1-06 + 02.1-07; Phase 1 / Phase 2 durations not captured)

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Repo Hygiene & CI Gating | 2/2 | — | — |
| 2. Releases Page | shipped outside GSD | — | — |
| 2.1 Blog (INSERTED) | 6/7 | ~27 min | ~4.5 min |
| 3. Content Depth & SEO | 0/TBD | — | — |
| 4. Accessibility Pass | 0/TBD | — | — |

**Recent Trend:**
- Last 6 plans: 02.1-01 (~5 min, 1 deviation auto-fixed), 02.1-02 (~2 min, 0 deviations), 02.1-03 (~3 min, 0 deviations), 02.1-04 (~3 min, 1 Rule 2 deviation auto-fixed — Starlight head injection for /docs/* alternate rel), 02.1-06 (~10 min gap-closure, 0 deviations — H5 confirmed, Wave 1 decision reversed), 02.1-07 (~4 min gap-closure, 0 deviations — content-fix drops broken Tabs JSX, five linear H3 sub-sections replace them with column-1 fenced code blocks).
- Trend: Plans consistently land in 2-5 min with at most one deviation. Plan 04's deviation was a plan-level gap (Base.astro does not reach Starlight /docs/* routes) that the task-level acceptance spec caught and Rule 2 handled automatically — exactly the intended safety net. Plan 06 was longer-than-average (~10 min) because Task 1's disciplined H1-H5 experiment-revert cycle + the throwaway-post test cost minutes but prevented a blanket revert of Wave 4 / Wave 1 work. Plan 07 back under 5 min — pure content rewrite with clear target shape specified in the plan's `<interfaces>` block.

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Init: Standalone-repo GSD bootstrap (split from app monorepo Phase 12)
- Init: Coarse granularity (4 phases for 17 requirements)
- Init: No tests in v1 — acceptance is "build passes on CI + manual verification"
- Init: `repository_dispatch` payload shape is locked (cross-repo contract with app repo)
- 02.1-01: Standalone Expressive Code and Starlight's bundled EC coexist (they do NOT defer) — standalone owns /posts/* with shiki night-owl themes, Starlight owns /docs/* with starlight-dark/starlight-light aliases. Verified against @astrojs/starlight@0.38.3 source.
- 02.1-01: Use Shiki-bundled `night-owl` / `night-owl-light` themes for standalone Expressive Code (BRIEF called for `starlight-dark`/`starlight-light`, which are Starlight-exclusive and crash the standalone build).
- 02.1-01: Posts Zod schema lives inline in src/content.config.ts alongside the docs collection — not extracted to a schema module until a third collection arrives.
- 02.1-02: PostLayout owns only a `<main class="post-page">` region — no Base/Nav/Footer import. Plan 03's [...slug].astro wraps it inside the full Base/Nav/Footer shell, leaving SEO-meta emission at the route level.
- 02.1-02: posts.css is imported by PostLayout.astro (exclusively), scoping 120 lines of prose CSS to /posts/* only — marketing landing and /docs/* pay no CSS cost for it.
- 02.1-02: British locale ('en-GB') is the blog convention for date formatting in both PostList and PostLayout. /releases/* stays on 'en' (predates the voice constraint) — treat as two separate surfaces, not an inconsistency to sweep.
- 02.1-03: Per-post SEO head tags emitted via `<Fragment slot="head-extra">` in `[...slug].astro` even though Base.astro does not yet declare that slot (Plan 04 adds it). Astro silently drops orphan named-slot children, so the route compiles today and tags light up automatically when Plan 04 ships — no fallback needed. Empirically verified: build exits 0 with the Fragment present.
- 02.1-03: Canonical URLs and og:image use `new URL(path, Astro.site)` — never `Astro.url.pathname`. Preview hosts therefore emit production-canonical URLs in both canonical tags and the RSS feed. `new URL()` also throws at build time on malformed `og_image` values (T-02.1-10 mitigation).
- 02.1-03: RSS body HTML via `marked.parse(post.body)` (not Astro container API) to reuse the existing `releases.astro` pipeline. `marked` is not sanitising — accepted risk per threat model T-02.1-12 for a single-committer repo; revisit with `sanitize-html`/`DOMPurify` only if the project opens to external contributors.
- 02.1-03: URL slug is `post.id` directly (no filename-to-slug stripping in v1). The v1 schema explicitly lacks a `slug` field, so the date-prefixed filename flows through to the URL. Deferred: add schema `slug` field or strip-regex if the first real post's URL feels date-heavy.
- 02.1-04: Base.astro head tags do NOT reach Starlight's /docs/* routes — Starlight uses its own page shell. Any site-wide head tag (starting with Plan 04's `<link rel="alternate">`) must be mirrored in `starlight({ head: [{tag, attrs}] })` in `astro.config.mjs`. Today's one tag doesn't justify a shared head-config module; revisit in Phase 3 if SEO work produces more than one such tag.
- 02.1-04: Landing-page A/B toggles ride a literal `const <flag> = true` at the top of the page frontmatter, not an env var or config file. Discoverable, editable without JS knowledge, and compile-time dead-code-eliminates the band when false. Pattern: `const showLatestWriting = true;` → `{flag && <section>…}`.
- 02.1-04: When counting HTML occurrences in minified Astro output, use `grep -oE 'pattern' file | wc -l` NOT `grep -c`. Multiple anchors can sit on one line; `grep -c` reports lines, not occurrences. Flagged for Plan 05's verification scripts.
- 02.1-06: **REVERSAL of 02.1-01 pattern** — Standalone `astro-expressive-code` does NOT coexist with Starlight's bundled EC; it silently REPLACES Starlight's EC configuration. A single user-level `astroExpressiveCode()` registration wins, and Starlight's `customConfigPreprocessors` never take effect. With the standalone removed, Starlight's bundled EC owns both `/docs/*` and `/posts/*`. The standalone integration is REMOVED from `astro.config.mjs` in Wave 6.
- 02.1-06: EC-styling smoke tests must check generated `dist/_assets/ec.<hash>.css` theme selectors match the HTML's `data-theme` attribute — not just grep for `class="expressive-code"` markup. The markup-only check was present from Plan 01 onward and was insufficient because it couldn't distinguish "pipeline ran" from "pipeline ran with the wrong theme aliases". This is now the required smoke-check for any future EC config change.
- 02.1-06: Wave 1 decision `themes: ['night-owl', 'night-owl-light']` reversed with the standalone integration's removal. Starlight's native starlight-dark/starlight-light aliases now drive both surfaces (internally mapping to Night Owl variants) — delivering the BRIEF's original "visually match /docs/*" acceptance criterion.
- 02.1-07: Starlight's `<Tabs>`/`<TabItem>` JSX components require a `.mdx` file (or `@astrojs/mdx` integration). In plain `.md` files they pass through as lowercase HTML — they do NOT render as interactive tabs, and any fenced code block indented inside them becomes a CommonMark indented-code-block (literal triple-backtick text, no language tag, no EC). Rule: do not use Starlight's Tabs component in this repo until `@astrojs/mdx` is installed; use linear H3 sub-sections instead. Fenced code blocks in `.md` files MUST start at column 1.
- 02.1-07: Option B (linear H3 sub-sections) chosen over Option A (install `@astrojs/mdx` to make Tabs work). Option A is larger scope (new integration + config + `.md`→`.mdx` migration) for zero net UX gain — the pre-existing Tabs had never rendered as interactive tabs anyway (0 `role="tablist"` in HTML on both preview and production). H3s make all five clients visible at once, which is better UX for a setup page the reader scrolls once and forgets.

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Blog — `/posts/` content collection, Expressive-Code-styled code blocks, RSS, "Latest writing" band on landing page (URGENT) — 2026-04-21

### Pending Todos

- [2026-04-21-fix-chatgpt-mcp-support-docs](./todos/pending/2026-04-21-fix-chatgpt-mcp-support-docs.md) — Fix incorrect ChatGPT MCP support claim in getting-started docs (`docs`)

### Blockers/Concerns

- **CODE FIX LANDED (2026-04-21): Phase 2.1 Surface E regression.** H5 confirmed by Wave 6 diagnostic: the standalone `astro-expressive-code` integration silently replaced Starlight's bundled EC, producing correct EC markup but CSS theme selectors that never matched Starlight's `data-theme="dark"` HTML attribute. Fix landed on `gsd/phase-2.1-blog@4d258b0` — standalone integration removed; Starlight's bundled EC now drives both surfaces with matching theme selectors.
- **CONTENT FIX LANDED (2026-04-22): Phase 2.1 Surface E `/docs/getting-started/` indented-fence content bug.** Plan 02.1-07 landed on `gsd/phase-2.1-blog@f37c81a`. Dropped `<Tabs>`/`<TabItem>` JSX (which this repo cannot evaluate — no `@astrojs/mdx` integration), removed the stray `import { Tabs, TabItem }` line that had been rendering as literal prose, and rewrote the Connect-Your-AI-Client section as five linear H3 sub-sections with column-1 fenced code blocks. Post-fix: 0 leaked fences, 4 EC wrappers, ec_lines doubled (8→16) as indented content became full-width EC-processed content. All Wave 4 RSS-alternate invariants preserved; no regression on sibling `/docs/*` pages. Local `npm run build` + all grep invariants green; branch pushed to origin (`7ff888e..f37c81a`). **REMAINING STEP:** browser-level re-verification of the refreshed preview by re-running the 02.1-05 checkpoint — both the theme-selector fix (Wave 6) and the content fix (Wave 7) are now in the preview.
- Site is live in production on `covalence.app` — any phase that touches routing, metadata, or the DMG download path must be verified against a Cloudflare Pages preview deploy before merging to `main`.
- Required-status-check configuration for CI-02 is a manual GitHub UI step (branch protection rules). Plan 1 should document this explicitly so it doesn't get skipped.
- Starlight is pre-1.0 (`^0.38.3`) and Astro is `^6.1.6` — CI gate from Phase 1 is the containment strategy for surprise breakage in those deps.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260419-wks | Fix broken homepage anchor links in primary nav | 2026-04-19 | 31f0452 | [260419-wks-fix-broken-homepage-anchor-links-in-prim](./quick/260419-wks-fix-broken-homepage-anchor-links-in-prim/) |

## Deferred Items

Items acknowledged and carried forward from initialization:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Repo hygiene | `LICENSE` file (REPO-v2-01) pending open-core decision in main Covalence repo | v2 | 2026-04-18 |
| Accessibility | Full manual screen-reader pass (A11Y-v2-01, NVDA/VoiceOver) | v2 | 2026-04-18 |

## Session Continuity

Last session: 2026-04-22
Stopped at: Plan 02.1-07 complete (Wave 7 gap-closure: content rewrite — `<Tabs>`/`<TabItem>` JSX dropped from `src/content/docs/docs/getting-started.md`, replaced by five linear H3 sub-sections with column-1 fenced code blocks. Fix commit `f37c81a` pushed to `origin/gsd/phase-2.1-blog`). Wave 5 browser-level checkpoint is now the only remaining Phase 2.1 plan — ready to re-run on the refreshed CF Pages preview that now includes both the Wave 6 theme-selector fix AND the Wave 7 content fix.
Resume file: `.planning/phases/2.1-blog/02.1-05-PLAN.md` (Wave 5 re-run: browser-level verification of the CF Pages preview on `gsd/phase-2.1-blog@f37c81a` — confirm `/docs/getting-started/` renders five H3 sub-sections for Claude Desktop / Claude Code / Cursor / OpenCode / ChatGPT, and that all four code blocks show Starlight-themed syntax colouring + copy buttons + frame chrome; re-walk the 7-surface checklist)
