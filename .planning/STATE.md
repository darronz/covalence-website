---
gsd_state_version: 1.0
milestone: v1.3.0
milestone_name: milestone
status: complete
stopped_at: "Phase 5 complete (3/3 plans). All phases complete. Milestone v1.3.0 finished."
last_updated: "2026-04-26T08:56:12Z"
last_activity: 2026-04-27 -- Quick task 260427-n7h: CF Pages Functions for R2 proxy + Analytics Engine download tracking
progress:
  total_phases: 6
  completed_phases: 5
  total_plans: 23
  completed_plans: 23
  percent: 100
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-18)

**Core value:** When a new Covalence release is tagged in the app repo, this site rebuilds itself with the correct version, download, and release notes — with zero manual intervention — and visitors land on a page that explains what Covalence is clearly enough to decide whether to install it.
**Current focus:** Phase 3 — Content Depth & SEO (Phase 2.1 Blog merged 2026-04-22)

## Current Position

Phase: 5 of 5 (Accessibility Pass)
Plan: 3/3 complete (all plans done)
Status: Complete
Last activity: 2026-04-27 -- Quick task 260427-n7h: CF Pages Functions for R2 proxy + Analytics Engine download tracking

Progress: [████████████████] 100% overall (5 of 5 phases complete; milestone v1.3.0 finished)

## Performance Metrics

**Velocity:**

- Total plans completed: 9
- Average duration: ~4.4 min (Phase 2.1 Plans 01 + 02 + 03 + 04 + 06 + 07 + 08 measured)
- Total execution time: ~31 min (Plans 02.1-01 + 02.1-02 + 02.1-03 + 02.1-04 + 02.1-06 + 02.1-07 + 02.1-08; Phase 1 / Phase 2 durations not captured)

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1. Repo Hygiene & CI Gating | 2/2 | — | — |
| 2. Releases Page | shipped outside GSD | — | — |
| 2.1 Blog (INSERTED) | 7/8 | ~31 min | ~4.4 min |
| 3. Content Depth & SEO | 0/TBD | — | — |
| 4. Accessibility Pass | 0/TBD | — | — |

**Recent Trend:**

- Last 7 plans: 02.1-01 (~5 min, 1 deviation auto-fixed), 02.1-02 (~2 min, 0 deviations), 02.1-03 (~3 min, 0 deviations), 02.1-04 (~3 min, 1 Rule 2 deviation auto-fixed — Starlight head injection for /docs/* alternate rel), 02.1-06 (~10 min gap-closure, 0 deviations — H5 confirmed, Wave 1 decision reversed), 02.1-07 (~4 min gap-closure, 0 deviations — content-fix drops broken Tabs JSX, five linear H3 sub-sections replace them with column-1 fenced code blocks), 02.1-08 (~4 min gap-closure, 2 Rule 1 plan-level verification-pattern fixes auto-applied — `grep -oE 'href="/posts/rss.xml"'` conflates `<a>` with `<link>` metadata, so anchor-only assertions use `<a [^>]*href=...`; plan acceptance `grep -c ... == 0` was self-contradictory with Wave 4 invariant, resolved by refining pattern).
- Trend: Plans consistently land in 2-5 min with at most two deviations. Plan 04's deviation was a plan-level gap (Base.astro does not reach Starlight /docs/* routes) that the task-level acceptance spec caught and Rule 2 handled automatically — exactly the intended safety net. Plan 06 was longer-than-average (~10 min) because Task 1's disciplined H1-H5 experiment-revert cycle + the throwaway-post test cost minutes but prevented a blanket revert of Wave 4 / Wave 1 work. Plan 07 back under 5 min — pure content rewrite with clear target shape specified in the plan's `<interfaces>` block. Plan 08 another ~4-min gap-closure — two files, one atomic commit, clean rebuild + 10-metric invariant matrix all green; the two deviations were verification-logic refinements (not source-code fixes).

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
- 02.1-08: Gate VISIBLE `<a>` anchors on `hasPosts`, leave INVISIBLE head-level `<link rel="alternate">` unconditional. Head-level feed metadata auto-lights-up for crawlers on first-post publish (RSS 2.0 explicitly allows empty channels), while visible CTAs follow the CONTEXT voice rule ("nothing ships until the first real post lands"). Two-tier feed exposure; clean split between "invisible, auto-useful-eventually metadata" (stays) and "visible, user-facing CTA" (gates).
- 02.1-08: Per-component `const hasPosts = (await getCollection('posts')).length > 0` in frontmatter — the Nav/Footer-level equivalent of Plan 04's page-level `const showLatestWriting = true`. Each component computes its own flag once per build per page it renders on; no shared-state plumbing; extends naturally to other shared components needing content-aware gates.
- 02.1-08: Verification patterns must distinguish `<a>` anchors from `<link>` metadata when both contain the same href. `grep -oE 'href="/posts/rss\.xml"'` conflates them (counts BOTH tag types); `grep -oE '<a [^>]*href="/posts/rss\.xml"'` counts only anchors. In minified HTML with feed-discovery metadata in `<head>`, this distinction is load-bearing for empty-state delta assertions. Captured in 02.1-08 SUMMARY as a Rule 1 plan-level deviation so Plan 05 verification scripts use the precise pattern.
- 05-01: `:focus-visible` (not `:focus`) for all interactive element outlines — mouse clicks do not trigger outlines. The skip-link's own reveal uses `:focus` because it is only keyboard-reachable.
- 05-01: Emoji aria-label values describe tile concepts (e.g. "data ownership"), not emoji characters (e.g. "lock") — per D-06.
- 05-01: sr-only class added to global.css as site-wide utility. Skip-link pattern: sr-only + skip-link class, fixed positioning on :focus with z-index 200.
- 05-02: All 6 brand color pairings already pass WCAG AA -- no CSS :root adjustments needed. Ratios: text-primary 16.29:1, accent 5.82:1, accent-subtle 7.40:1, button-text 5.48:1, text-secondary/bg-primary 5.92:1, text-secondary/bg-surface 5.59:1.
- 05-02: @axe-core/cli installed as devDependency; ChromeDriver mismatch resolved via `npx browser-driver-manager install chrome` + `--chromedriver-path` flag.
- 05-03: axe-core 4.11.3 scan confirms zero WCAG AA violations on / and /releases/ -- all three a11y requirements (A11Y-01, A11Y-02, A11Y-03) satisfied. No gap-closure needed.

### Roadmap Evolution

- Phase 2.1 inserted after Phase 2: Blog — `/posts/` content collection, Expressive-Code-styled code blocks, RSS, "Latest writing" band on landing page (URGENT) — 2026-04-21

### Pending Todos

_(None — marketing-copy-rewrite-pro-tier-readiness promoted to Phase 4 on 2026-04-24)_

### Blockers/Concerns

- **CODE FIX LANDED (2026-04-21): Phase 2.1 Surface E regression.** H5 confirmed by Wave 6 diagnostic: the standalone `astro-expressive-code` integration silently replaced Starlight's bundled EC, producing correct EC markup but CSS theme selectors that never matched Starlight's `data-theme="dark"` HTML attribute. Fix landed on `gsd/phase-2.1-blog@4d258b0` — standalone integration removed; Starlight's bundled EC now drives both surfaces with matching theme selectors.
- **CONTENT FIX LANDED (2026-04-22): Phase 2.1 Surface E `/docs/getting-started/` indented-fence content bug.** Plan 02.1-07 landed on `gsd/phase-2.1-blog@f37c81a`. Dropped `<Tabs>`/`<TabItem>` JSX (which this repo cannot evaluate — no `@astrojs/mdx` integration), removed the stray `import { Tabs, TabItem }` line that had been rendering as literal prose, and rewrote the Connect-Your-AI-Client section as five linear H3 sub-sections with column-1 fenced code blocks. Post-fix: 0 leaked fences, 4 EC wrappers, ec_lines doubled (8→16) as indented content became full-width EC-processed content. All Wave 4 RSS-alternate invariants preserved; no regression on sibling `/docs/*` pages. Local `npm run build` + all grep invariants green; branch pushed to origin (`7ff888e..f37c81a`).
- **EMPTY-STATE UX FIX LANDED (2026-04-22): Phase 2.1 Wave 5 caveat resolved.** Plan 02.1-08 landed on `gsd/phase-2.1-blog@2ab5ca2`. Nav.astro + Footer.astro frontmatter blocks added; three visible `/posts/*` anchors gated on `hasPosts = (await getCollection('posts')).length > 0`. With empty collection, zero Blog anchors render on `/`, `/releases/`, `/posts/`; zero RSS anchor renders in Footer on any page. Head-level `<link rel="alternate">` metadata preserved (Wave 4 invariant — count=1 on `/` and `/docs/getting-started/`); Wave 6/7 EC wrappers preserved (count=4 on `/docs/getting-started/`); `/posts/index.html` + `/posts/rss.xml` still generated (valid empty states). Clean `npm run build` exit 0; branch fast-forward pushed (`0405b49..2ab5ca2`). **REMAINING STEP:** browser-level re-verification of the refreshed preview by re-running the 02.1-05 checkpoint — with empty collection, Blog nav + RSS footer link should be absent; everything else unchanged from Wave 7.
- Site is live in production on `covalence.app` — any phase that touches routing, metadata, or the DMG download path must be verified against a Cloudflare Pages preview deploy before merging to `main`.
- Required-status-check configuration for CI-02 is a manual GitHub UI step (branch protection rules). Plan 1 should document this explicitly so it doesn't get skipped.
- Starlight is pre-1.0 (`^0.38.3`) and Astro is `^6.1.6` — CI gate from Phase 1 is the containment strategy for surprise breakage in those deps.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260419-wks | Fix broken homepage anchor links in primary nav | 2026-04-19 | 31f0452 | [260419-wks-fix-broken-homepage-anchor-links-in-prim](./quick/260419-wks-fix-broken-homepage-anchor-links-in-prim/) |
| 260422-wks | Phase 2.1 cleanup follow-ups (WR-01 og_image guard, IN-02 dead dep removal, ChatGPT MCP claim fix) | 2026-04-22 | 00d02d1 · b17d172 · 229d4b7 | [260422-wks-phase-2.1-cleanups](./quick/260422-wks-phase-2.1-cleanups/) |
| 260424-u9x | Fix /docs/keyboard-shortcuts/ pane name — General → Shortcuts | 2026-04-24 | 4475f7f | [260424-u9x-fix-keyboard-shortcuts-docs-navigate-to-](./quick/260424-u9x-fix-keyboard-shortcuts-docs-navigate-to-/) |
| 260424-uk9 | Add Contact mailto + Report an issue links to Footer.astro | 2026-04-24 | 270f650 | [260424-uk9-add-contact-mailto-and-report-an-issue-l](./quick/260424-uk9-add-contact-mailto-and-report-an-issue-l/) |
| 260424-uqq | Replace default Astro favicon.ico with Covalence brand mark (32×32 PNG from favicon.svg) | 2026-04-24 | eb49d8e | [260424-uqq-replace-default-astro-favicon-ico-with-c](./quick/260424-uqq-replace-default-astro-favicon-ico-with-c/) |
| 260426-im8 | Update docs pages to match new memory taxonomy naming | 2026-04-26 | 53fbc9e | [260426-im8-update-docs-pages-to-match-new-memory-ta](./quick/260426-im8-update-docs-pages-to-match-new-memory-ta/) |
| 260426-npr | Create /docs/how-search-works page — 5-signal ranking system | 2026-04-26 | e250fab | [260426-npr-create-docs-how-search-works-page-explai](./quick/260426-npr-create-docs-how-search-works-page-explai/) |
| 260427-h4g | Fix mcp-tools.md return values to match v1.4 app repo schemas | 2026-04-27 | 837617b | [260427-h4g-fix-mcp-tools-md-return-values-to-match-](./quick/260427-h4g-fix-mcp-tools-md-return-values-to-match-/) |
| 260427-n7h | CF Pages Functions for R2 proxy + Analytics Engine download tracking | 2026-04-27 | 1b714a5 · b36f2e6 | [260427-n7h-release-download-analytics-cf-pages-func](./quick/260427-n7h-release-download-analytics-cf-pages-func/) |

## Deferred Items

Items acknowledged and carried forward from initialization:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Repo hygiene | `LICENSE` file (REPO-v2-01) pending open-core decision in main Covalence repo | v2 | 2026-04-18 |
| Accessibility | Full manual screen-reader pass (A11Y-v2-01, NVDA/VoiceOver) | v2 | 2026-04-18 |

## Session Continuity

Last session: 2026-04-26
Stopped at: Phase 5 complete (3/3 plans). All 5 phases complete. Milestone v1.3.0 finished.
Resume file: None -- all plans complete
