---
phase: 04-marketing-copy-rewrite-pro-tier-readiness
plan: 03
subsystem: marketing-landing
tags: [copy-rewrite, features, implementation-neutral, voice-compliance]
dependency_graph:
  requires: []
  provides: [implementation-neutral-features-tiles]
  affects: [dist/index.html]
tech_stack:
  added: []
  patterns: [astro-frontmatter-data-array]
key_files:
  created: []
  modified:
    - src/components/Features.astro
decisions:
  - "Used escaped apostrophes in single-quoted JS strings for 'someone else\\'s' and 'one else\\'s' to match codebase convention"
metrics:
  duration_seconds: 63
  completed: "2026-04-26T08:10:20Z"
  tasks_completed: 1
  tasks_total: 1
---

# Phase 04 Plan 03: Features Tile Copy Rewrite Summary

Implementation-neutral rewrites for four of six Features.astro tiles (D-05 through D-08), removing all Mac-specific and model-specific language while closing the WR-01 voice violation.

## What Changed

Four tiles in the `features` array within `src/components/Features.astro` were rewritten:

| Tile | Old Title | New Title | Key Change |
|------|-----------|-----------|------------|
| #1 (index 2) | Multi-client | One memory, every client | Broader agent framing, removed "No conflicts" |
| #2 (index 3) | Local embeddings | On-device embeddings | Removed MLTensor/Apple Silicon refs entirely |
| #3 (index 4) | Always running | Always running (unchanged) | Replaced "instant search" (WR-01) with "Quick capture from anywhere" |
| #5 (index 5) | Your data | Your data, your infrastructure | Removed "your Mac", added "No accounts" |

Tiles #4 (Semantic search, index 0) and #6 (Core Memories, index 1) were left byte-identical.

## Deviations from Plan

None -- plan executed exactly as written.

## WR-01 Closure

The word "instant" on the former line 26 (`Global hotkey for instant search.`) was the pre-existing voice violation flagged in Phase 3's code review (WR-01). The D-07 replacement string (`Quick capture from anywhere. Global hotkey opens search from any window.`) eliminates it. Verified: `grep -qwi 'instant' dist/index.html` returns no matches.

## Verification Results

- All positive controls pass (new tile text present in source and dist)
- All negative controls pass (old tile text absent from source and dist)
- Unchanged tiles verified intact
- `npm run build` exits 0
- Voice invariant matrix: instant, amazing, blazing, effortless, powerful -- all absent from dist/index.html
- Implementation detail strings absent: "millisecond inference", "CoreML on Apple Neural Engine"

## Known Stubs

None -- all tiles contain final production copy.

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 65b9037 | feat(04-03): rewrite four Features tiles with implementation-neutral copy |

## Self-Check: PASSED
