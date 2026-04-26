---
phase: 04-marketing-copy-rewrite-pro-tier-readiness
plan: 01
subsystem: marketing-landing
tags: [copy, hero, pro-tier]
dependency_graph:
  requires: []
  provides: [hero-subhead-pro-tier-ready]
  affects: [dist/index.html]
tech_stack:
  added: []
  patterns: []
key_files:
  created: []
  modified: [src/components/Hero.astro]
decisions:
  - "D-03 target string applied verbatim to Hero.astro line 23"
metrics:
  duration: "1m 16s"
  completed: "2026-04-26T08:10:14Z"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 4 Plan 01: Hero Subhead Rewrite Summary

Hero subhead replaced with D-03 locked target: "Your memory, on machines you own. Never anyone else's cloud." -- removes Mac-specific "Runs on your Mac" claim, establishes tier-neutral "machines you own" framing as the first of 4 repetitions of the no-third-party-cloud principle across the landing page.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace Hero.astro subhead with D-03 target string | 45f7c7c | src/components/Hero.astro |

## Verification Results

- New string present in `src/components/Hero.astro` line 23: PASS
- Old string "Runs on your Mac" removed: PASS
- Headline "Every AI you use, one shared memory" unchanged: PASS
- CTA "Download for macOS" unchanged: PASS
- `npm run build` exits 0: PASS
- New string in `dist/index.html`: PASS
- Old string not in `dist/index.html`: PASS
- Banned voice words in Hero section of dist/index.html: PASS (none found)

## Deviations from Plan

### Out-of-Scope Discovery

**1. Pre-existing banned word "instant" in Features.astro**
- **Found during:** Task 1 verification
- **Issue:** The plan's verification script checks `dist/index.html` for banned word "instant" (whole-word, case-insensitive). The word appears in Features.astro line 26: "Global hotkey for instant search." This is pre-existing content in a file NOT modified by this plan.
- **Action:** Logged as deferred item. Plan 04-03 (Features.astro rewrite) is the correct place to address this if D-13 voice invariants require it across the entire page.

## Known Stubs

None.

## Self-Check: PASSED

- [x] `src/components/Hero.astro` exists and contains new subhead
- [x] Commit `45f7c7c` exists in git log
- [x] No unintended file deletions
