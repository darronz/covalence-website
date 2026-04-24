---
phase: 03-content-depth-seo
plan: 03
subsystem: marketing-components

tags: [astro, marketing, voice, cta, css]

# Dependency graph
requires:
  - phase: 03-content-depth-seo
    provides: "Plan 03-02 — /docs/under-the-hood/ deep page (CTA target route with trailing slash)"
provides:
  - "src/components/Architecture.astro arch-stack column rewritten as 2–3 paragraph retrieval teaser + inline 'Full technical deep-dive →' CTA to /docs/under-the-hood/"
  - "Voice/tone pattern established for home-page marketing columns: (1) statement paragraph mirrors denial-cascade cadence of sibling arch-privacy column; (2) detail paragraph names concrete components + numbers sourced from Plan 03-02's Retrieval Stack Parameter Table; (3) CTA paragraph with single anchor"
  - "CSS pattern for sibling-shaped columns: .arch-teaser / .arch-teaser-detail typography mirrors .privacy-statement / .privacy-detail so the two 'Under the hood' columns visually balance without duplicating selectors"
affects: [03-content-depth-seo-plan-04]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Home-page marketing-column teaser ↔ deep-docs page: three-paragraph (statement / detail / CTA) shape with inline `→` arrow glyph CTA, mirroring the sibling column's typography so both columns in the same grid row stay balanced"
    - "Accurate technical wording at marketing altitude: name the runtime ('MLTensor on Apple Silicon', 'nomic-embed-text-v1.5'), the mechanism ('Reciprocal Rank Fusion at k=60'), and the scalars ('256 dimensions', '10% of the final score') — never promotional adjectives"

key-files:
  created: []
  modified:
    - src/components/Architecture.astro

key-decisions:
  - "Option 1 CTA text 'Full technical deep-dive →' selected verbatim from the plan and 03-CONTEXT D-02. Matches the register of the sibling arch-privacy column and the site-wide voice anchors (Hero.astro 'Runs on your Mac. Private, fast, and entirely yours.' / HowItWorks.astro 'Two copy-pastes. That's it.'). The `→` arrow is re-used from the removed .arch-stack li::before glyph, preserving a visual cue."
  - "Option A CSS strategy (delete dead .arch-stack ul/li rules + add three new .arch-teaser* rules) chosen over Option B (repurpose existing selectors). Rationale: new selectors read symmetrically with the .privacy-* sibling pair and make the teaser vs. bullet distinction self-documenting in the stylesheet. Selected per plan-author's Option B suggestion in 03-PATTERNS.md was overridden in favour of this explicit-rules approach (aligns with plan's Change 3 block which specifies new rules by name)."
  - "Statement paragraph closes with the denial cascade 'No cloud round-trips.' — echoes arch-privacy:18's 'No accounts. No telemetry. No cloud.' rhythm. Kept to a single cascade beat on the marketing surface; Plan 03-02's SUMMARY notes the deep page already uses two cascades, so the home-page teaser uses one to avoid over-rhyming."

patterns-established:
  - "Cross-surface consistency: the home-page teaser uses the EXACT phrasing that Plan 03-02's deep page uses for the same technical concepts ('nomic-embed-text-v1.5 via MLTensor on Apple Silicon', 'Reciprocal Rank Fusion at k=60', 'weighted at 10%'), so a reader who clicks the CTA sees the same names + numbers reinforced — not re-introduced or re-defined. Future cross-surface CTAs should preserve the same name-stability rule."
  - "Astro scoped-class hash appends to emitted class attributes on components — `class=\"arch-teaser\"` in .astro source becomes `class=\"arch-teaser astro-4gd5y3do\"` in dist/*.html. Verification scripts that need to assert a class presence in minified HTML should use `grep -qE 'class=\"<classname>[ \"]'` instead of `grep -qF 'class=\"<classname>\"'` — the fixed-string form fails when the scope hash is present."

requirements-completed: [CONT-01]

# Metrics
duration: 2min
completed: 2026-04-23
---

# Phase 3 Plan 03: Architecture.astro arch-stack rewrite — retrieval teaser + CTA to /docs/under-the-hood/

**Closed the CONT-01 marketing-surface half: home-page `/` "Under the hood" section now leads with a 2–3 paragraph retrieval-stack teaser (statement + detail + CTA) that mirrors the sibling arch-privacy column's cadence and routes readers to the Plan 03-02 deep page via the inline `Full technical deep-dive →` link.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-23T07:11:59Z
- **Completed:** 2026-04-23T07:14:13Z
- **Tasks:** 1 / 1
- **Files modified:** 1 (0 created, 1 edited)

## Accomplishments

- Replaced `src/components/Architecture.astro` lines 5–14 (the five-bullet `arch-stack` list) with a three-paragraph teaser: (1) statement paragraph — "Every memory becomes a 256-dimension vector. Search runs on-device. Vector similarity meets keyword match via RRF. No cloud round-trips."; (2) detail paragraph naming nomic-embed-text-v1.5 via MLTensor on Apple Silicon, 256-dim truncation + SQLite/FTS5 hybrid store, Reciprocal Rank Fusion at k=60, 10% hyperbolic recency weighting; (3) CTA paragraph — `<a href="/docs/under-the-hood/">Full technical deep-dive →</a>`.
- Removed the four dead `.arch-stack ul | li | li::before | li strong` CSS rules (lines 44–68 of the pre-edit file) since the column has no `<ul>`/`<li>` elements after the rewrite.
- Added three new CSS rules `.arch-teaser { … }`, `.arch-teaser-detail { … }`, `.arch-teaser-cta { … }` (plus hover/focus variants on the inner `<a>`) that mirror `.privacy-statement` / `.privacy-detail` typography so the two "Under the hood" columns visually balance.
- Left the `arch-privacy` column byte-identical to its pre-phase state — same `<h3>`, same two paragraphs, same classes, verified by `git diff` showing zero lines touched in the right column.
- `npm run build` exited 0; `dist/index.html` renders the new `arch-teaser` / `arch-teaser-detail` / `arch-teaser-cta` classes (with Astro's scoped style hash `astro-4gd5y3do` appended, as expected for Astro scoped styles); the inline CTA `href="/docs/under-the-hood/"` is emitted exactly with the trailing slash; the CTA target `dist/docs/under-the-hood/index.html` exists (Plan 03-02 dependency satisfied).

## Final Prose Shipped (verbatim — for Plan 03-04's preview checkpoint)

**Heading:** `How retrieval works`

**Statement paragraph (.arch-teaser):**
> Every memory becomes a 256-dimension vector. Search runs on-device. Vector similarity meets keyword match via RRF. No cloud round-trips.

**Detail paragraph (.arch-teaser-detail):**
> Covalence embeds each memory with nomic-embed-text-v1.5 via MLTensor on Apple Silicon, truncates the output to 256 dimensions, and stores it in SQLite alongside an FTS5 full-text index.
> Searches hit both indexes in parallel — vector similarity and BM25 keyword scoring — and merge the results with Reciprocal Rank Fusion at k=60.
> A hyperbolic recency factor then nudges newer memories upward, weighted at 10% of the final score so recency never overrides genuine relevance.

**CTA paragraph (.arch-teaser-cta):**
> `<a href="/docs/under-the-hood/">Full technical deep-dive →</a>`

**CTA link text chosen:** `Full technical deep-dive →` — Option 1 from the plan's enumerated choices (planner-recommended, matches 03-CONTEXT D-02 wording).

## Task Commits

Each task was committed atomically (this plan has one task):

1. **Task 1: Rewrite arch-stack column with prose teaser + CTA; remove dead CSS rules; leave arch-privacy byte-identical** — `3cab56f` (feat)

## Files Created/Modified

- `src/components/Architecture.astro` (modified, +31 / −22 lines net +9) — three concrete changes all inside this single file: (a) lines 5–14 replaced with the new three-paragraph teaser; (b) four dead `.arch-stack ul/li/li::before/li strong` CSS rules removed; (c) three new `.arch-teaser*` CSS rules added directly after the shared `.arch-stack h3, .arch-privacy h3` block. Diff scope is within the planned −30 to +30 envelope; no collateral edits.

## Diff Stats

From `git diff --stat src/components/Architecture.astro` (against the pre-task HEAD `3f3d525`):

```
src/components/Architecture.astro | 53 +++++++++++++++++++++++----------------
1 file changed, 31 insertions(+), 22 deletions(-)
```

- Net change: **+9 lines** (well within the plan's stated −30 to +30 envelope).
- No arch-privacy lines touched (verified by `git diff src/components/Architecture.astro | grep -E "^[-+]" | grep -iE "privacy|Your data|Every component|back up, and export"` → 0 matches; critical invariant respected).

## `arch-privacy` Untouched — Pitfall L1 Survived

The `arch-privacy` column (pre-edit lines 15–25) is byte-identical post-edit:

- `<h3>Privacy by architecture</h3>` — unchanged.
- `<p class="privacy-statement">Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device.</p>` — unchanged.
- `<p class="privacy-detail">Every component — the database, the embedding model, the search engine — runs locally. There are no network calls, no API keys, no external dependencies. Your memories are a single SQLite file on your Mac that you own, back up, and export whenever you want.</p>` — unchanged.
- `.privacy-statement { … }` + `.privacy-detail { … }` CSS rules at former lines 70–82 — unchanged.

Explicit `grep -qF` checks on the emitted HTML confirmed both the statement and the detail prose survived verbatim in `dist/index.html`.

## CSS Footprint

**Removed (dead rules — column has no `<ul>`/`<li>` after rewrite):**
- `.arch-stack ul { list-style: none; display: flex; flex-direction: column; gap: var(--space-sm); }`
- `.arch-stack li { … padding-left: var(--space-md); position: relative; … }`
- `.arch-stack li::before { content: '→'; position: absolute; left: 0; color: var(--accent-subtle); }`
- `.arch-stack li strong { color: var(--text-primary); }`

**Added (new rules — mirror the .privacy-* sibling typography):**
- `.arch-teaser { font-size: 1.125rem; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-md); line-height: 1.5; }` — identical to `.privacy-statement`.
- `.arch-teaser-detail { color: var(--text-secondary); font-size: 0.9375rem; line-height: 1.6; margin-bottom: var(--space-md); }` — same colour/size as `.privacy-detail`, adds `margin-bottom: var(--space-md)` so the CTA paragraph has breathing room.
- `.arch-teaser-cta { font-size: 0.9375rem; line-height: 1.5; }` + `.arch-teaser-cta a { color: var(--accent-subtle); text-decoration: none; font-weight: 600; }` + `.arch-teaser-cta a:hover, .arch-teaser-cta a:focus-visible { text-decoration: underline; }`. The `--accent-subtle` token re-uses the exact colour that the removed `.arch-stack li::before` arrow used — visual continuity with the pre-edit design.

**Unchanged (verified):** `.arch-grid` (grid scaffolding), shared `.arch-stack h3, .arch-privacy h3` selector (now covers the new `How retrieval works` heading with zero change), `.privacy-statement`, `.privacy-detail`, and `@media (max-width: 768px) { .arch-grid { grid-template-columns: 1fr; } }`.

## Voice Invariants — Pre-Ship Checklist

Ran against the final prose (`grep -qwi` on each word):

- No `instant` ✓
- No `amazing` ✓
- No `powerful` ✓
- No `blazing` ✓
- No `lightning` ✓
- No `seamless` ✓
- No `effortless` ✓
- No `CoreML on Apple Neural Engine` (Pitfall L2 avoided) ✓ — uses `MLTensor on Apple Silicon` instead.
- No `free` as a promotional adjective ✓ — the source file contains zero occurrences of the word `free`.
- Numbers preferred over qualifiers: `256 dimensions`, `k=60`, `10%` all present and specific ✓
- Denial-cascade rhythm landed once in the short paragraph (`No cloud round-trips.`) ✓ — echoes arch-privacy:18 without over-rhyming.
- CTA link target: `/docs/under-the-hood/` with trailing slash (Pitfall L4 respected) ✓

## Numbers Used and Their Sources

All numbers on the teaser trace to Plan 03-02's §Retrieval Stack Parameter Table (which in turn traces every value to live Swift source in `../covalence/`):

| Number / term | Source |
|---|---|
| `256 dimensions` (twice — "256-dimension vector" + "256 dimensions") | `EmbeddingEngine.swift:42` (`public static let dimensions = 256`) |
| `nomic-embed-text-v1.5` | `EmbeddingEngine.swift:39` (`static let modelName`) |
| `MLTensor on Apple Silicon` | `../covalence/CLAUDE.md:283` + `EmbeddingEngine.swift:34` (`@available(macOS 15.0, *)`) |
| `SQLite … FTS5 full-text index` | `MemoryStore.swift:1204-1213` + `1328-1350` |
| `Reciprocal Rank Fusion at k=60` | `MemoryStore.swift:1355` (`let k = 60.0`) |
| `BM25 keyword scoring` | `MemoryStore.swift:1328-1350` (FTS5 BM25 query) |
| `hyperbolic recency factor` | `MemoryStore.swift:1432` (`1.0 / (1.0 + ageHours / 8760.0)`) |
| `weighted at 10% of the final score` | `MemoryStore.swift:1355-1433` (`recencyWeight = 0.10`) |

Every number in the teaser appears in the §Retrieval Stack Parameter Table — no fabrication (Pitfall L3 avoided).

## Build Gate Status

- `npm run build` exited 0.
- `dist/index.html` rendered with all three teaser classes (`arch-teaser`, `arch-teaser-detail`, `arch-teaser-cta`) and the full CTA anchor `<a href="/docs/under-the-hood/">Full technical deep-dive →</a>`.
- `dist/docs/under-the-hood/index.html` (Plan 03-02's output) exists and the CTA therefore resolves.
- `dist/index.html` still contains the complete arch-privacy prose ("Your data never leaves your machine. No accounts. No telemetry. No cloud. Runs entirely on-device.") — byte-identical, rendered verbatim.
- Pre-existing "collection `posts` does not exist or is empty" warnings appeared in the build log (as in Plan 03-02) — these are unrelated to this plan (empty posts collection after Phase 2.1) and are pre-existing state.
- Scoped-class hash detail: Astro appends a scoped style hash `astro-4gd5y3do` to the component's emitted class attributes in `dist/index.html` (e.g. `class="arch-teaser astro-4gd5y3do"`). This is standard Astro SSG behaviour for scoped `<style>` blocks — Covalence Website's existing components (Hero, Features, HowItWorks, Nav, Footer) all exhibit the same pattern. Verification greps on minified dist output must tolerate the trailing hash; the source-file greps (on `src/components/Architecture.astro`) see the bare class names.

## Decisions Made

1. **CTA text: `Full technical deep-dive →` (Option 1 from the plan).** Matches 03-CONTEXT.md D-02 exactly ("inline 'Full technical deep-dive' CTA"); the `→` arrow glyph is re-used from the removed `.arch-stack li::before` arrow, preserving visual continuity with the pre-edit design.
2. **CSS strategy: Option A (explicit new rules), not Option B (repurpose existing selectors).** The three new `.arch-teaser*` rules mirror the `.privacy-*` sibling pair's typography verbatim and make the teaser-vs-bullet distinction self-documenting in the stylesheet. Chosen because the plan's Change 3 block specifies the new rules by name, and the symmetry with `.privacy-statement` / `.privacy-detail` is worth making explicit.
3. **Denial cascade used once, not twice.** Plan 03-02's SUMMARY notes the deep page already uses two cascades ("One truncation step. Not a schedule." and "No schedule. No rebuild step. Just the first 256 floats and a normalisation."). Keeping the marketing teaser to a single beat (`No cloud round-trips.`) avoids over-rhyming across surfaces and matches the sibling arch-privacy column's own single-cascade cadence.
4. **`--accent-subtle` token retained for CTA link colour.** The plan's Change 3 block allowed a fallback to `var(--text-primary)` with an underline if contrast turned out to be poor; the token reads visibly in the dist render without deferring that decision. Phase 4's a11y sweep will globally audit link contrast per the plan's Phase 4 handoff note.

## Deviations from Plan

**1. [Rule 1 - Verification pattern] Plan's automated-check grep on rendered HTML needs to tolerate Astro scoped-class hashes.**

- **Found during:** Task 1 build verification.
- **Issue:** The plan's `<verify><automated>` block includes `grep -qF 'class="arch-teaser"' dist/index.html` (fixed-string match). Astro's scoped-style compiler appends a scope hash suffix to component class attributes, so the emitted attribute is `class="arch-teaser astro-4gd5y3do"`. The fixed-string grep fails on the scoped form; the class is nevertheless present and rendering correctly.
- **Fix:** Re-verified with `grep -qE 'class="arch-teaser[ "]'` on the dist output — the pattern tolerates either a trailing space (scope-hash present) or a closing quote (scope-hash absent) and succeeds on both cases. The source-file grep (`grep -qF 'class="arch-teaser"' src/components/Architecture.astro`) still works unchanged — the scope hash is appended only at emit time, never in `.astro` source.
- **Files modified:** None. This is a verification-script refinement, not a source-code change.
- **Commit:** N/A — captured in this SUMMARY for Plan 03-04's sitemap/SEO verification sweep so the pattern carries forward. Same class of issue as STATE.md's 02.1-04 decision ("`grep -c` counts lines, not occurrences") and 02.1-08 decision ("distinguish `<a>` anchors from `<link>` metadata when both contain the same href").

All plan acceptance criteria are substantively met. The only deviation is a verification-pattern refinement.

## Issues Encountered

None at the source-code level. The rewrite compiled on first build, no iteration needed. The plan's verification-grep-vs-Astro-scoped-classes issue above is the one thing worth flagging to Plan 03-04.

The "collection `posts` does not exist or is empty" build-log warnings are pre-existing (inherited from Phase 2.1 empty-posts state) and unrelated to this plan.

## User Setup Required

None — no external service configuration required. Static content only.

## Next Phase Readiness

- **Plan 03-04 (consolidated build + sitemap + preview checkpoint):** the home-page teaser is live and CTA resolves to `/docs/under-the-hood/`; the preview checkpoint will walk: (a) `/` visually — two columns balance, no orphan spacing, mobile breakpoint still collapses cleanly; (b) click the CTA — lands on `/docs/under-the-hood/`; (c) confirm no promotional adjectives visible on `/`. The final prose is captured verbatim in this SUMMARY's "Final Prose Shipped" section so the checkpoint knows what to look for.
- **Plan 03-04 verification sweep:** adopt the scope-hash-tolerant grep pattern (`grep -qE 'class="<name>[ "]'`) for any rendered-HTML class checks on marketing-component output.
- **Phase 4 (Accessibility Pass):** the new `.arch-teaser-cta a` link should get a11y re-audit alongside the rest of the site — `:focus-visible` underline is declared, colour comes from `--accent-subtle`, but global contrast/focus-indicator audit is Phase 4's scope.

## Self-Check

Verification of claims in this SUMMARY before close:

- **File check:** `src/components/Architecture.astro` — FOUND (99 lines), renders as expected.
- **Commit check:** `3cab56f` (Task 1: feat(03-03) rewrite arch-stack into prose teaser + CTA) — FOUND in `git log --oneline`.
- **Build artefact check:** `dist/index.html` — FOUND; contains `class="arch-teaser astro-4gd5y3do"`, `class="arch-teaser-detail astro-4gd5y3do"`, `class="arch-teaser-cta astro-4gd5y3do"`, `href="/docs/under-the-hood/"`, `MLTensor`, `nomic-embed-text-v1.5`, `Reciprocal Rank Fusion`, `256-dimension`, `256 dimensions`, `Full technical deep-dive`, `How retrieval works`, and the arch-privacy prose (`Your data never leaves your machine…`, `Every component — the database…`). CTA target file `dist/docs/under-the-hood/index.html` — FOUND.
- **Voice invariants:** zero whole-word occurrences of `instant`, `amazing`, `powerful`, `blazing`, `lightning`, `seamless`, `effortless` in `src/components/Architecture.astro` — confirmed via `grep -qwi` on each.
- **arch-privacy byte-identical:** `git diff` on the commit touches zero lines inside the `.arch-privacy` column or its CSS rules — confirmed via pattern grep across the diff.
- **Diff scope:** `+31 / −22` (net +9), within the plan's −30/+30 envelope — confirmed via `git diff --stat`.

## Self-Check: PASSED

---
*Phase: 03-content-depth-seo*
*Completed: 2026-04-23*
