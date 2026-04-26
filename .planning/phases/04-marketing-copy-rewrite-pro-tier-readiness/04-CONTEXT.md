# Phase 4: Marketing Copy Rewrite (Pro-tier readiness) - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite prose on five marketing-site components (`src/components/Hero.astro`, `HowItWorks.astro`, `Features.astro`, `Architecture.astro`, `Footer.astro`) so every user-facing claim survives the eventual Free/Pro tier split. The load-bearing principle "no third-party cloud, by architecture" is said **four** times across the page (hero subhead, arch-stack teaser, arch-privacy paragraph, features tile #5 "Your data, your infrastructure"). The site stops committing to "runs on your Mac" as a product-wide promise, without pre-announcing Pro.

**In scope:** prose edits to existing components only. Nine discrete string-level edits in total.

**Out of scope (locked):** new pages, pricing pages, Pro waitlist/badge, /contact route, form endpoints, CSS structural changes, template restructuring, asset additions, `/docs/*` content, code-snippet edits in HowItWorks, `/posts/*` content, `/releases/*` content, the v1.3.5 download-required banner, nav, download button, version string, release notes link, "Made in the UK" framing.

</domain>

<decisions>
## Implementation Decisions

### Plan structure (Area A)

- **D-01:** Six plans organized as two waves.
  - **Wave 1 — five component plans (parallel via worktrees, no file overlap):**
    1. `04-01-PLAN.md` — `Hero.astro` subhead rewrite (1 edit)
    2. `04-02-PLAN.md` — `HowItWorks.astro` sub-copy tightening (1 edit)
    3. `04-03-PLAN.md` — `Features.astro` four-tile rewrite (4 edits — tiles #1, #2, #3, #5)
    4. `04-04-PLAN.md` — `Architecture.astro` two-edit rewrite (arch-stack teaser + arch-privacy column, 2 edits)
    5. `04-05-PLAN.md` — `Footer.astro` tagline rewrite (1 edit)
  - **Wave 2 — consolidated verification (autonomous: false, depends on Wave 1):**
    6. `04-06-PLAN.md` — phase-level grep matrix + CF preview eyeball check across all five surfaces. Mirrors Plan 03-04 precedent.
- **D-02:** Plans 04-01..04-05 are mutually independent (disjoint files), spawn order doesn't matter, parallelize via worktree isolation per the established `/gsd-execute-phase` flow.

### Locked target strings (D-03 through D-09)

Memory 150 prescribes these verbatim. Any deviation needs a CONTEXT update.

- **D-03 (Hero subhead, `Hero.astro:23`):**
  - Current: `Runs on your Mac. Private, fast, and entirely yours.`
  - Target: `Your memory, on machines you own. Never anyone else's cloud.`
- **D-04 (HowItWorks sub-copy, `HowItWorks.astro:4`):**
  - Current: `Connect your AI client to Covalence's MCP server, then tell it how to use memory.`
  - Target: `Add the MCP snippet. Paste the behavioural prompt. Done.`
- **D-05 (Features tile #1 — Multi-client, `Features.astro:15` and body):**
  - Heading: `Multi-client` → `One memory, every client`
  - Body: `Claude Desktop, Claude Code, Cursor — any MCP client, simultaneously. No conflicts.` → `Claude Desktop, Claude Code, Cursor, and any MCP-capable agent. Same memory, simultaneously, across all of them.`
- **D-06 (Features tile #2 — Local embeddings, `Features.astro:20-21`):**
  - Heading: `Local embeddings` → `On-device embeddings`
  - Body: `nomic-embed-text-v1.5 via MLTensor on Apple Silicon. No API keys. No network round-trips.` → `Embeddings computed on your hardware, not someone else's. No API keys, no per-call cost, no external dependencies.`
- **D-07 (Features tile #3 — Always running, `Features.astro:25-26`):**
  - Heading stays: `Always running`
  - Body sentence 1 stays: `Menu bar app with one-click capture.`
  - Body sentence 2 changes: `Global hotkey for instant search.` → `Quick capture from anywhere. Global hotkey opens search from any window.` (Closes WR-01 from Phase 3 code review.)
- **D-08 (Features tile #5 — Your data, `Features.astro:30` and body):**
  - Heading: `Your data` → `Your data, your infrastructure`
  - Body: `SQLite file on your Mac. Export anytime as markdown or JSON. No cloud. No telemetry.` → `A SQLite file on hardware you own. Export anytime as markdown or JSON. No accounts, no telemetry, no one else's cloud.`
- **D-09 (Architecture arch-stack teaser, `Architecture.astro:8`):**
  - Current: `Every memory becomes a 256-dimension vector. Search runs on-device. Vector similarity meets keyword match via RRF. No cloud round-trips.`
  - Target: `Every memory becomes a 256-dimension vector on hardware you control. Vector similarity meets keyword match via RRF. No third-party cloud, by architecture.`
  - Rationale: adds a fourth repetition of the load-bearing principle (Area C). Phase 3 wrote this teaser without memory 150's framing in scope — this revision aligns it.

### Locked target strings continued (Area B follow-up + Architecture arch-privacy + Footer)

- **D-10 (Architecture arch-privacy column heading + body, `Architecture.astro:19-22`):**
  - Heading: `Privacy by architecture` → `Your data, your infrastructure`
  - Body (full): `Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device. Every component — the database, the embedding model, the search engine — runs locally. There are no network calls, no API keys, no external dependencies. Your memories are a single SQLite file on your Mac that you own, back up, and export whenever you want.` → `Covalence runs on machines you control. No accounts with us. No telemetry. No third-party cloud, by architecture. Every component — the database, the embedding model, the search engine — runs on your hardware. No network calls to us, no API keys to buy, no external dependencies to trust. Your memories are a SQLite file you own, back up, and export whenever you want.`
  - **Phase 3 invariant break:** Plan 03-03 preserved this column byte-identical. COPY-02 intentionally breaks that invariant — flag it explicitly in 04-04's plan + commit message so a future reader doesn't read it as a Phase 3 regression.
- **D-11 (Footer tagline, `Footer.astro:8`):**
  - Current: `Built on macOS, for macOS`
  - Target: `Built for the machines you own`

### Tile heading parity (Area B confirmation)

- **D-12:** Three of six Features tiles are NOT rewritten in Phase 4: Semantic search (tile #4), Core Memories (tile #6), and the leftover headings of Multi-client/Local embeddings/Always running/Your data after the four rewrites. Memory 150 explicitly endorsed leaving Semantic search and Core Memories as-is. The tile #3 ("Always running") body change is THE deviation from memory 150 — captured here so the Phase 5 a11y pass treats both rewritten and non-rewritten tiles consistently.

### Voice-invariant verification (Area D)

- **D-13:** Every component plan (04-01..04-05) MUST include a local grep block in its `must_haves.truths` that checks the rendered `dist/` output for the eight banned words: `instant`, `amazing`, `blazing`, `effortless`, `powerful` (whole-word, case-insensitive), `free`, `millisecond inference`, `CoreML on Apple Neural Engine`. Use `! grep -qwi 'word' dist/<surface>/index.html` per word. Note: `free` requires care — it appears in legitimate contexts ("MCP for free in your editor" etc.). Restrict the `free` check to the five surfaces being rewritten and exclude any pre-existing legitimate uses. Planner: surface this scoping decision when writing 04-03 and 04-05.
- **D-14:** Plan 04-06 (consolidated verification) reproduces the per-plan greps + adds a cross-cutting check on `dist/index.html` (the home page renders 4 of the 5 components — Hero, HowItWorks, Features, Architecture — so it's the natural single-page sweep) and a positive-control matrix confirming every locked target string actually appears in the rendered HTML.
- **D-15 (verification-pattern norms — carried from Phase 3):**
  - Use `grep -oE 'pattern' file | wc -l` for occurrence counts in minified HTML, not `grep -c`.
  - Astro appends `astro-<hash>` to component class attrs — match with `grep -oE 'class="foo[ "]'`, never bare `class="foo"`.
  - These norms apply to every plan in this phase.

### CF preview verification policy

- **D-16:** Plan 04-06 includes a CF preview eyeball check (mirrors Plan 03-04's social-card debugger gate, but lighter — copy changes don't touch routing/metadata/DMG paths, so the bar is just "preview renders + key strings are visually present on the deployed page"). User confirms approved on the preview before phase-complete is signaled. Not a blocker on the build matrix; an additional human gate.

### Claude's Discretion

- Exact ordering of edits within plan 04-03 (Features.astro four-tile rewrite) — planner picks. The four tile edits are independent within the same file.
- Wave 1 spawn order — plans are mutually independent; orchestrator picks any order.
- Commit-message conventions — follow existing pattern: `feat(04-NN):` for tile/copy adds, `refactor(04-NN):` for arch-privacy heading rename, `docs(04-NN):` for SUMMARY.md commits.

### Folded Todos

- The pending todo `2026-04-24-marketing-copy-rewrite-pro-tier-readiness` (source: covalence memory 150) was promoted to this phase via PR #13 on 2026-04-24. Memory 150 remains the authoritative spec for content; CONTEXT.md (this file) locks the implementation choices around it.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Spec source (load-bearing — read first)
- Covalence memory 150 ("covalence.app website copy update — hero and page rewrite for Pro-tier readiness", captured 2026-04-23) — the authoritative spec for every locked target string in D-03..D-11. Access via `mcp__covalence__memory_retrieve` with id 150 if any string ambiguity arises during planning or execution. Memory 150 is roughly 11.5k words and includes per-edit rationale. The "What NOT to change" section is also load-bearing.
- `.planning/todos/completed/2026-04-24-marketing-copy-rewrite-pro-tier-readiness.md` — pre-CONTEXT scoping notes (Phase 3 reconciliation surfaces, scope boundaries) captured when memory 150 was first surfaced as a todo. Useful as secondary reading; CONTEXT.md supersedes it for implementation choices.

### Roadmap + requirements
- `.planning/ROADMAP.md` (Phase 4 detail block, lines ~118-140) — phase goal, success criteria, requirements list, depends-on chain (Phase 3), notes on the v1.3.5 banner / nav / download button preservation.
- `.planning/REQUIREMENTS.md` §"Copy & Positioning" (COPY-01..COPY-05) — the five requirements this phase satisfies; each maps to one or more decisions D-03..D-11.

### Phase 3 reconciliation context
- `.planning/phases/03-content-depth-seo/03-CONTEXT.md` — Phase 3's voice-anchor decisions and verification-pattern norms (carried forward via D-13..D-15).
- `.planning/phases/03-content-depth-seo/03-01-SUMMARY.md` — what Plan 03-01 actually shipped on `Features.astro` line 21 (MLTensor edit). D-06 supersedes this.
- `.planning/phases/03-content-depth-seo/03-03-SUMMARY.md` — what Plan 03-03 shipped on `Architecture.astro` (arch-stack teaser + arch-privacy preservation). D-09 modifies the teaser; D-10 intentionally breaks the byte-identical preservation invariant.
- `.planning/phases/03-content-depth-seo/03-REVIEW.md` — Phase 3 code review report. **WR-01** ("Global hotkey for instant search" on `Features.astro:26`) is closed by D-07.

### Voice anchors + project-level constraints
- `.planning/PROJECT.md` — voice anchors (no superlatives, concrete numbers preferred, denial-cascade rhythm permitted) and the Validated Requirements table (CONT-01, SEO-01..04 marked Validated 2026-04-24).
- `CLAUDE.md` (project root) — voice anchor reminders and tech-stack pin (Astro 6.1.6, Starlight 0.38.3, Node 22.16.0).

### No external specs/ADRs are referenced for this phase
The phase is purely prose edits with no architectural change. Memory 150 is the only external reference and it lives in covalence memory, not a versioned `.md` file in this repo.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **Five target components already exist** at `src/components/Hero.astro`, `HowItWorks.astro`, `Features.astro`, `Architecture.astro`, `Footer.astro`. All edits are in-place string substitutions. No new components, no new exports.
- **`Footer.astro` was already touched in quick-task `260424-uk9`** (added Contact mailto + Report-an-issue links). The tagline edit (D-11) lands on `<h2>` at line 8 inside `<section id="download">`, not in the footer-links row. No conflict between Phase 4 and the uk9 quick fix.

### Established Patterns

- **No CSS changes needed.** `Architecture.astro` rewrites the `arch-privacy` heading from `Privacy by architecture` to `Your data, your infrastructure`. The existing `<style>` block targets `.arch-privacy h3` (selector at line 42); the rule continues to apply since the class stays.
- **Build-time string substitution only.** No runtime, no JS state, no data fetching. `npm run build` is the single verification path.
- **Worktree-parallel-execution** is the precedent from Phases 2.1 and 3 for plans that touch disjoint files. Plans 04-01..04-05 fit this pattern — orchestrator spawns five Task() calls with `isolation="worktree"` and dispatches sequentially with `run_in_background: true`.

### Integration Points

- **Plan 04-04 breaks Phase 3's byte-identical `arch-privacy` invariant.** Note explicitly in 04-04 plan body + commit message: this is intentional, NOT a regression. Phase 3 verifier and reviewer should not flag it on retrospective.
- **Plan 04-03 deletes pre-existing voice violations.** WR-01 ("instant" on Features.astro:26) is closed by D-07. Phase 4 close-out should reference WR-01 in its VERIFICATION.md.
- **No `dist/` URLs or canonical paths change.** No CF preview redeploy concerns beyond standard build-passes-on-PR. The `04-06` consolidated verification's CF preview gate is light-touch ("eyeball the visible copy"), not a debugger gate.

</code_context>

<specifics>
## Specific Ideas

- The "no third-party cloud, by architecture" principle is the load-bearing thread. After Phase 4 lands, the page says it FOUR times in four registers:
  1. Hero subhead — "Never anyone else's cloud."
  2. Arch-stack teaser — "No third-party cloud, by architecture."
  3. Arch-privacy paragraph — "No third-party cloud, by architecture."
  4. Features tile #5 — "no one else's cloud."
- The voice register progresses from headline (terse) to features (concrete) to architecture (declarative). Each repetition serves a different rhetorical job; planner should preserve that texture even if a target string deviates slightly from memory 150 during execution.
- "Machines you own" / "hardware you own" / "machines you control" are deliberately interchangeable. Memory 150 used all three across surfaces. Don't normalize to one phrase — the variation reads as natural English; the consistency comes from the principle, not the exact words.

</specifics>

<deferred>
## Deferred Ideas

- **`/contact` route as a dedicated page (option D from the original todo's A/B/C/D menu).** Out of scope here; quick task `260424-uk9` already shipped Contact mailto + Issues link in the Footer. A `/contact` page becomes a fit only if commercial conversations (Pro-tier sales, enterprise) actually start coming in.
- **Pricing page / Pro waitlist / "Pro coming soon" badge.** Memory 150 explicitly forbids these in this phase — they belong to a future phase that ships when Pro is real, not when it's a positioning bet.
- **Apple-touch-icon + PWA manifest.** Surfaced during quick task `260424-uqq` (favicon replacement). Not related to copy; defer until iOS home-screen install is a supported flow.
- **Real multi-size ICO** (16+32+48 bundled). Surfaced in `260424-uqq` SUMMARY. Cosmetic upgrade; needs Pillow install. Defer.
- **Voice sweep on `/docs/*`.** Memory 150 is marketing-site only. The Starlight-rendered docs pages may contain implementation language ("CoreML", "MLTensor", "macOS-specific install") that's accurate-for-now but will need revision when Pro ships. Track as a v2 todo, not a Phase 4 scope item.

### Reviewed Todos (not folded)

- None. The only relevant pending todo (`2026-04-24-marketing-copy-rewrite-pro-tier-readiness`) WAS folded — it's the source spec for this phase.

</deferred>

---

*Phase: 04-marketing-copy-rewrite-pro-tier-readiness*
*Context gathered: 2026-04-26*
