---
phase: 04-marketing-copy-rewrite-pro-tier-readiness
plan: 02
subsystem: marketing-landing
tags: [copy, howitworks, power-user, voice]
dependency_graph:
  requires: []
  provides: [howitworks-subtitle-tightened]
  affects: [dist/index.html]
tech_stack:
  added: []
  patterns: []
key_files:
  created: []
  modified: [src/components/HowItWorks.astro]
decisions:
  - British spelling "behavioural" preserved per D-04 locked target string
metrics:
  duration: "1m 8s"
  completed: "2026-04-26T08:10:17Z"
  tasks_completed: 1
  tasks_total: 1
  files_changed: 1
---

# Phase 4 Plan 2: HowItWorks Subtitle Tighten Summary

Replaced explainer sub-copy with imperative three-sentence string targeting power users who already know MCP.

## What Changed

| File | Change |
|------|--------|
| `src/components/HowItWorks.astro` | Line 4: subtitle replaced from "Connect your AI client to Covalence's MCP server, then tell it how to use memory." to "Add the MCP snippet. Paste the behavioural prompt. Done." |

## Task Completion

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Replace HowItWorks.astro subtitle with D-04 target string | f8d38db | src/components/HowItWorks.astro |

## Verification Results

- New string present in source: PASS
- Old string removed from source: PASS
- Heading "Two copy-pastes. That's it." unchanged: PASS
- Code blocks (`cov-mcp`, `Covalence, a persistent`) unchanged: PASS
- `npm run build` exits 0: PASS
- New string in rendered `dist/index.html`: PASS
- No banned voice words in HowItWorks section of rendered output: PASS

## Deviations from Plan

### Out-of-Scope Discovery

**1. Pre-existing banned word "instant" in Features.astro**
- **Found during:** Task 1 verification
- **Issue:** The plan's verification script checks `dist/index.html` globally for banned voice words. The word "instant" appears in `src/components/Features.astro` line 26 ("Global hotkey for instant search.") -- a pre-existing string unrelated to this plan's scope.
- **Action:** Not fixed (out of scope per deviation rules -- pre-existing issue in unrelated file). The HowItWorks section itself contains zero banned words. Logged for Phase 4 Plan 5 (Features.astro copy rewrite) to address.

## Known Stubs

None.

## Self-Check: PASSED

- [x] `src/components/HowItWorks.astro` exists and contains new subtitle
- [x] Commit f8d38db exists in git log
- [x] No unexpected file deletions
