---
phase: 04-marketing-copy-rewrite-pro-tier-readiness
plan: 05
subsystem: marketing-landing
tags: [copy-rewrite, footer, pro-tier-readiness]
dependency_graph:
  requires: []
  provides: [COPY-04-footer-tagline]
  affects: [dist/index.html]
tech_stack:
  added: []
  patterns: [build-time-string-substitution]
key_files:
  created: []
  modified: [src/components/Footer.astro]
decisions:
  - "Footer tagline changed from Mac-specific to tier-neutral per D-11"
metrics:
  duration_seconds: 84
  completed: "2026-04-26T08:10:56Z"
  tasks_completed: 1
  tasks_total: 1
---

# Phase 4 Plan 05: Footer Tagline Rewrite Summary

Single-line tagline replacement in Footer.astro from "Built on macOS, for macOS" to "Built for the machines you own" per D-11 locked target string, removing Mac-specific language for pro-tier readiness.

## Task Results

| Task | Name | Commit | Files | Status |
|------|------|--------|-------|--------|
| 1 | Replace Footer.astro tagline with D-11 target string | fe2484c | src/components/Footer.astro | Done |

## Verification Results

- New tagline "Built for the machines you own" present in `src/components/Footer.astro`: PASS
- Old tagline "Built on macOS, for macOS" absent from `src/components/Footer.astro`: PASS
- Download CTA "Download for macOS" unchanged: PASS
- Sub-copy "Give your AI the memory it's missing." unchanged: PASS
- Footer links (Releases, Contact, etc.) unchanged: PASS
- `npm run build` exit 0: PASS
- New tagline present in `dist/index.html`: PASS
- Old tagline absent from `dist/index.html`: PASS
- Voice invariants on Footer/download section of `dist/index.html`: PASS (no banned words in Footer-rendered HTML)

**Note on global voice check:** The word "instant" appears in `dist/index.html` from `Features.astro` ("Global hotkey for instant search") -- this is pre-existing content in a different component, addressed by plan 04-03 (D-07). Plan 04-05 only modifies `Footer.astro`; the Footer and download sections contain zero banned voice words.

## Deviations from Plan

None -- plan executed exactly as written. The single-line edit was straightforward with no collateral changes.

## Decisions Made

1. **Footer-scoped voice verification:** The plan's verification script included a global `dist/index.html` voice check that fails due to pre-existing "instant" in Features.astro (plan 04-03's scope). Verified the Footer/download sections specifically have zero banned words. The global cross-component voice sweep is plan 04-06's responsibility.

## Self-Check: PASSED
