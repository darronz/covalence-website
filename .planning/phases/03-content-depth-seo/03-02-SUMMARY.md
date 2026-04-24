---
phase: 03-content-depth-seo
plan: 02
subsystem: content

tags: [starlight, docs, svg, retrieval, embeddings, seo]

# Dependency graph
requires:
  - phase: 03-content-depth-seo
    provides: "Phase 3 planning artefacts (CONTEXT, RESEARCH, PATTERNS) supplying §Retrieval Stack Parameter Table with 11 confirmed numbers sourced from ../covalence/"
provides:
  - "/docs/under-the-hood/ Starlight page — five-topic retrieval-stack explainer with inline SVG schematic"
  - "Voice invariant applied to a deep-content page: no promotional adjectives, concrete numbers, denial-cascade rhythm, British spelling"
  - "Inline-SVG diagram pattern for Starlight /docs/* (role=img + aria-labelledby → title+desc, currentColor for theme-awareness, zero plugin)"
affects: [03-content-depth-seo-plan-01, 03-content-depth-seo-plan-03, 03-content-depth-seo-plan-04, 04-accessibility]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline-SVG technical diagrams in plain .md (no plugin, no runtime); role=img + aria-labelledby pointing to inner <title>/<desc>; stroke=currentColor + fill=currentColor for automatic dark/light theming"
    - "Deep-content page anchored on a §Parameter Table: every concrete number traces to an exact ../covalence/ file:line; zero fabrication"

key-files:
  created:
    - src/content/docs/docs/under-the-hood.md
  modified: []

key-decisions:
  - "Inline SVG over the Mermaid escape-hatch: one diagram, once; zero new plugin surface; trivial a11y; currentColor handles dark/light without CSS (per 03-RESEARCH.md §Recommended Diagram Mechanism)"
  - "Six H2 sections (five required + optional closing 'Putting it together'): the closing paragraph anchors the pipeline on a concrete tool call (memory_search(\"project context\")) and routes readers to /docs/mcp-tools/ and /docs/getting-started/ for a next step; permitted by the plan's acceptance_criteria"
  - "Optional code fences used in Hybrid search and Recency weighting (language tag `text`, column 1, RRF formula + decay function): numeric specifics read cleaner as a code block than as prose, and `text` is safe under Expressive Code"

patterns-established:
  - "Accessible inline-SVG diagrams for technical docs: width=700/viewBox=0 0 700 260 fits Starlight's ~704 px content column; monospace 12 px labels; single <marker> in <defs> for arrowheads; all primitives monochrome via currentColor"
  - "Every cited number in a credibility-critical page traces to a primary-source file:line (Swift code) — pattern makes regressions/drift detectable in future phases"

requirements-completed: [CONT-01]

# Metrics
duration: 3min
completed: 2026-04-23
---

# Phase 3 Plan 02: Under the Hood — retrieval-stack explainer + inline SVG diagram

**Five-topic retrieval-stack explainer at /docs/under-the-hood/ covering nomic-embed-text-v1.5, asymmetric search, single-step 768 → 256 Matryoshka truncation, vec0 + FTS5 hybrid search with RRF k=60, and 10% hyperbolic recency weighting — every number sourced from live Swift code in ../covalence/**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-23T07:03:41Z
- **Completed:** 2026-04-23T07:06:05Z
- **Tasks:** 1 / 1
- **Files modified:** 1 (1 created, 0 edited)

## Accomplishments

- Shipped `src/content/docs/docs/under-the-hood.md` (133 lines, plain Markdown) with the complete CONT-01 five-topic explainer, the nested-docs path (not the shallow one), and every concrete number matching 03-RESEARCH.md §Retrieval Stack Parameter Table.
- Inline SVG pipeline diagram between sections 3 and 4: five labelled stations (Query → Embedding encoder → Matryoshka truncation → fan-out to Vector search + FTS5 keyword search → RRF merge → Recency weighting). `role="img"` + `aria-labelledby="rs-title rs-desc"` → inner `<title>` / `<desc>` pair; `stroke="currentColor"` + `fill="currentColor"` throughout so dark/light themes handle themselves.
- Voice: zero promotional adjectives (no `instant`, `amazing`, `powerful`, `free`, `blazing`, `lightning`, `seamless`, `effortless`). British `normalise` / `normalisation`. Two denial-cascade beats landed: "One truncation step. Not a schedule." and "No schedule. No rebuild step. Just the first 256 floats and a normalisation."
- `npm run build` exits 0; `dist/docs/under-the-hood/index.html` rendered with `nomic-embed-text-v1.5`, `MLTensor`, `RRF` / `Reciprocal Rank Fusion`, `768`, `256`, `8760`, `search_document`, `search_query`, and the inline `<svg role="img"...>` all present in the emitted HTML.

## Task Commits

Each task was committed atomically (this plan has one task):

1. **Task 1: Create `src/content/docs/docs/under-the-hood.md`** — `eaed709` (feat)

## Files Created/Modified

- `src/content/docs/docs/under-the-hood.md` (created, 133 lines) — frontmatter (`title: Under the Hood` + description feeding `og:description` / `<meta name="description">`), 2-sentence lead paragraph, five required H2 sections in D-04 order (The embedding model → Asymmetric search → Matryoshka truncation → Hybrid search → Recency weighting), inline SVG diagram between sections 3 and 4, and an optional closing "Putting it together" H2 that routes readers to /docs/mcp-tools/ and /docs/getting-started/.

## Section Structure

Six H2s (five required + one optional closer, permitted by the plan's `acceptance_criteria`):

1. `## The embedding model` — nomic-embed-text-v1.5, fp16 safetensors ~261 MB, MLTensor via `jkrukowski/swift-embeddings`, macOS 15+, 768-dim output, 512-token chunk boundary with 256-token overlap.
2. `## Asymmetric search` — same model, different prompt; `search_document: ` / `search_query: ` prefixes; queries and documents land in different regions of vector space.
3. `## Matryoshka truncation` — single 768 → 256 step, L2-normalise via vDSP (`vDSP_svesq` + `vDSP_vsdiv`), ~2% quality loss, 3× smaller vectors (1 KB per memory vs 3 KB).
4. `## Hybrid search` — vec0 KNN on `memories_vec` + FTS5 BM25 on `memories_fts`, `fetchLimit = max(limit × 4, 20)` (×6 with filters), pre-merge cosine threshold 0.3, RRF formula as a `text` fenced code block, `k = 60` (Cormack et al. 2009; also Azure AI Search + Elastic).
5. `## Recency weighting` — `decayFactor = 1.0 / (1.0 + ageHours / 8760.0)` as a `text` fenced block; 8760 = hours/year; 1-year → 0.5, 2-year → 1/3, 1-day → ~0.997; composition `finalScore = 0.9 × rrfScore + 0.1 × decayFactor × 0.033` → 10 % weight; rationale paragraph owning the design choice.
6. `## Putting it together` (optional) — one `memory_search("project context")` walkthrough tying all five stations together, closing with links to `/docs/mcp-tools/` and `/docs/getting-started/`.

## Diagram Mechanism Used

**Inline SVG, hand-authored in the .md file** — per 03-RESEARCH.md §Recommended Diagram Mechanism. Rationale (reaffirmed during execution):

- One diagram, once. No case for a plugin.
- Phase 2.1 Plan 06 landmine: a standalone Markdown-rendering integration silently replaced Starlight's bundled Expressive Code. Any new integration on `/docs/*` carries the same class of risk.
- Accessibility is cheap: `role="img"` + `aria-labelledby` → `<title>` + `<desc>` satisfies screen readers today; Phase 4's a11y sweep will re-audit.
- Dark/light theming is free: `stroke="currentColor"` + `fill="currentColor"` on every primitive + text element picks up Starlight's theme tokens with no CSS work.

The escape-hatch (`public/diagrams/under-the-hood.svg` + `<img>`) was **not** needed. Hand-authoring the raw SVG (marker-based arrows, rect+text nodes, monospaced 12 px labels) was ~30 lines and clean on first render.

**Dimensions:** `width="700"` `height="260"` `viewBox="0 0 700 260"` — fits Starlight's ~704 px content column; `style="max-width: 100%; height: auto;"` for narrow viewports. Added `margin: 1.5rem 0;` so the diagram has vertical breathing room against surrounding prose.

## Numbers Used and Their Sources

Every number on the page traces to the live Covalence app repo via 03-RESEARCH.md §Retrieval Stack Parameter Table (rows 1–11). No additional numbers beyond the table were introduced. Roll-up:

| Number | Source |
|---|---|
| `nomic-embed-text-v1.5`, fp16, ~261 MB | `../covalence/Sources/CovalenceCore/EmbeddingEngine.swift:39` + `../covalence/CLAUDE.md:277-283` |
| 768 (native embedding dim) | `EmbeddingEngine.swift:45` |
| 256 (stored / searched embedding dim) | `EmbeddingEngine.swift:42` |
| ~2% quality loss, 3× smaller (1 KB vs 3 KB) | `EmbeddingEngine.swift:31-33` (docstring) |
| vDSP_svesq + vDSP_vsdiv | `EmbeddingEngine.swift:125-133` |
| `search_document: ` / `search_query: ` | `EmbeddingEngine.swift:16-21` + `MemoryStore.swift:1193` |
| vec0 KNN + FTS5 BM25 | `MemoryStore.swift:1204-1213` + `1328-1350` |
| `fetchLimit = max(limit × 4, 20)` (×6 with filters) | `MemoryStore.swift:1204-1213` |
| Cosine threshold default 0.3 | `MemoryStore.swift:1260-1263` |
| RRF k = 60 | `MemoryStore.swift:1355` |
| `1.0 / (1.0 + ageHours / 8760.0)` | `MemoryStore.swift:1432` |
| `finalScore = 0.9 × rrfScore + 0.1 × decayFactor × 0.033` / 10 % | `MemoryStore.swift:1355-1433` |
| MLTensor via `jkrukowski/swift-embeddings`, macOS 15+ | `Package.swift:10` + `EmbeddingEngine.swift:34` + `../covalence/CLAUDE.md:283` |
| Chunking: <512 tokens single, >512 with 256 overlap | `../covalence/CLAUDE.md:293-297` |

No number on the page goes beyond what the §Parameter Table supplied.

## Voice-Invariant Edge Cases

- **British spelling:** applied `normalise` / `normalisation` (as in "L2-normalise with vDSP" and "Just the first 256 floats and a normalisation"). Left retrieval-technical terms untouched (`normalize` appears nowhere in the final body); "Matryoshka" is a proper noun; "organise/analyse" never came up.
- **Denial cascades:** used twice, sparingly — once at the close of the Matryoshka section ("No schedule. No rebuild step. Just the first 256 floats and a normalisation."), once inside that section ("One truncation step. Not a schedule."). The Architecture.astro-style cascade belongs in Plan 03-03's teaser rewrite, not repeated heavily on the deep page.
- **Concrete numbers vs qualifiers:** every claim that could have taken a qualifier got a number instead. "Gentle early, flatter later, and never quite hits zero" is the one qualitative sentence on the decay curve; the numeric rows immediately above it do the load-bearing work.
- **`MLTensor on Apple Silicon` wording:** used throughout (landmine L4 avoided). The deep page never says "CoreML on Apple Neural Engine". The parallel correction to `Architecture.astro` + `Features.astro` is Plan 03-03's scope (per 03-CONTEXT.md §Open Question 3), not this plan's.
- **Banned-word scan on the rendered prose:** zero occurrences of `instant`, `amazing`, `powerful`, `free`, `blazing`, `lightning`, `seamless`, `effortless`, `revolutionary`, `cutting-edge`, `best-in-class`, `blazing`. "Fast" appears only inside the inline SVG's textual description (screen-reader alt equivalent) where it does not appear — re-verified; "fast" also does not appear in the body.

## Code Fence Placement

Used fenced code blocks in two places (both column 1, language tag `text` to avoid Expressive Code surprises):

- Hybrid search: the RRF summation formula.
- Recency weighting: the `decayFactor` function and `finalScore` composition.

These are numeric / formulaic specifics that read cleaner as a code block than inline. Landmine L2 (no leading whitespace on fences) verified by `grep -qE '^[[:space:]]+```'` → no matches.

## Build Gate Status

- `npm run build` exited 0.
- `dist/docs/under-the-hood/index.html` was produced (confirmed).
- Rendered HTML contains `nomic-embed-text-v1.5`, `RRF`, `MLTensor`, `768`, `256`, `8760`, `search_document`, `search_query`, and the inline `<svg role="img"...>` element — all nine invariants green.
- The page was discovered by Starlight despite Plan 03-01's sidebar entry not yet landing in this worktree. Starlight auto-generates pages for all files in the docs collection; the sidebar entry controls navigation only. Sidebar entry will arrive when Plan 03-01 merges into the orchestrator's aggregated branch.

## Decisions Made

- **Inline SVG, not Mermaid / plugin / external file.** (Confirmed recommendation from 03-RESEARCH.md; escape-hatch not needed.)
- **Optional section 6 kept.** The closing "Putting it together" paragraph anchors on a concrete `memory_search("project context")` call, mirrors the pipeline, and routes the reader onward to `/docs/mcp-tools/` and `/docs/getting-started/`. Drops the page from "technical spec" to "technical spec with a landing pad". Permitted by `acceptance_criteria` ("additional H2s beyond these five are permitted").
- **Two `text` fenced code blocks inside H2 sections.** Used only for numeric formulas (RRF and recency) where code formatting is load-bearing. Plain-text language tag avoids Expressive Code language-detection edge cases.

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. The build produced the expected output on the first try. The "collection `posts` does not exist or is empty" warnings in the build log are pre-existing (empty posts collection after Phase 2.1) and unrelated to this plan.

## User Setup Required

None — no external service configuration required. Static content only.

## Next Phase Readiness

- Plan 03-01 will add the `{ label: 'Under the Hood', slug: 'docs/under-the-hood' }` entry to `astro.config.mjs` `sidebar: [...]`; the file is in place and will light up in the sidebar as soon as that lands.
- Plan 03-03 will rewrite `Architecture.astro`'s `arch-stack` column into a 2–3 paragraph teaser with a `[Full technical deep-dive →](/docs/under-the-hood/)` CTA. That CTA target is now real.
- Plan 03-04's consolidated build + sitemap checkpoint will see `/docs/under-the-hood/` in `dist/sitemap-0.xml` automatically (Starlight's internal `@astrojs/sitemap` wrapper auto-discovers file-based Starlight pages).
- Phase 4 (Accessibility Pass) should re-audit the inline SVG — the `role="img"` + `aria-labelledby` → `<title>`/`<desc>` contract satisfies the basics, but a screen-reader walk-through will sanity-check whether the `<desc>` narration of the flow is usable as the alt-text equivalent.

## Self-Check

- File check: `src/content/docs/docs/under-the-hood.md` — FOUND (133 lines).
- Commit check: `eaed709` (Task 1: feat(03-02) Under the Hood docs page) — FOUND in `git log --oneline`.
- Build artefact check: `dist/docs/under-the-hood/index.html` — FOUND; contains `nomic-embed-text-v1.5`, `MLTensor`, `RRF`, `768`, `256`, `8760`, `search_document`, `search_query`, `<svg role="img"`.

## Self-Check: PASSED

---
*Phase: 03-content-depth-seo*
*Completed: 2026-04-23*
