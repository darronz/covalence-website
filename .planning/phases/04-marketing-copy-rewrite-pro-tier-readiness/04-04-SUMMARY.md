---
phase: 04-marketing-copy-rewrite-pro-tier-readiness
plan: 04
subsystem: marketing-landing
tags: [copy-rewrite, architecture, privacy, pro-tier]
dependency_graph:
  requires: []
  provides: [architecture-copy-d09, architecture-copy-d10]
  affects: [dist/index.html]
tech_stack:
  added: []
  patterns: [static-string-replacement]
key_files:
  created: []
  modified: [src/components/Architecture.astro]
decisions:
  - Intentionally broke Phase 3 Plan 03-03 byte-identical arch-privacy invariant per D-10 / COPY-02
metrics:
  duration: 70s
  completed: 2026-04-26T08:10:35Z
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 04 Plan 04: Architecture Copy Rewrite Summary

Two Architecture.astro sections rewritten per D-09/D-10: arch-stack teaser gains "on hardware you control" + 4th "No third-party cloud, by architecture" repetition; arch-privacy column reframed as "Your data, your infrastructure" with pro-tier-ready body copy.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite arch-stack teaser (D-09) + arch-privacy column (D-10) | 280cd7b | src/components/Architecture.astro |

## Changes Made

### Task 1: Rewrite arch-stack teaser (D-09) + arch-privacy column (D-10)

**Edit 1 -- arch-stack teaser (D-09):**
- Replaced "Search runs on-device." removal and "No cloud round-trips." with "on hardware you control" and "No third-party cloud, by architecture."
- This is the 4th repetition of the load-bearing principle (joining hero subhead, features tile #5, and arch-privacy)

**Edit 2 -- arch-privacy column (D-10):**
- Heading: "Privacy by architecture" -> "Your data, your infrastructure"
- Privacy-statement: Reframed from "Your data never leaves your machine" to "Covalence runs on machines you control" with "No third-party cloud, by architecture"
- Privacy-detail: "runs locally" -> "runs on your hardware"; "no network calls, no API keys, no external dependencies" -> "No network calls to us, no API keys to buy, no external dependencies to trust"; "a single SQLite file on your Mac" -> "a SQLite file you own"

**Preserved unchanged:**
- Section title "Under the hood"
- arch-stack heading "How retrieval works"
- arch-teaser-detail paragraph (Phase 3: nomic-embed-text-v1.5, RRF at k=60, 10% recency)
- arch-teaser-cta with /docs/under-the-hood/ link
- All CSS rules (34 lines, selectors unchanged since HTML classes preserved)

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- Pre-build string checks: PASS (all new strings present, all old strings absent, unchanged content preserved)
- npm run build: exits 0
- "No third-party cloud, by architecture" count in dist/index.html: 2 (exact)
- Voice-invariant grep matrix (D-13): PASS (zero banned words)
- "Your data, your infrastructure" in dist/index.html: PASS
- "Covalence runs on machines you control" in dist/index.html: PASS

## Decisions Made

1. **Intentional Phase 3 invariant break:** Phase 3 Plan 03-03 established a byte-identical invariant on the arch-privacy column. This plan intentionally rewrites that column per D-10 / COPY-02. This is the intended Phase 4 scope, not a regression. Flagged in commit message as required.

## Self-Check: PASSED
