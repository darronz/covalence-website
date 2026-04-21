---
phase: 02-releases-page
verified: 2026-04-21T00:00:00Z
status: passed
score: 4/4 roadmap success criteria verified
reconstructed: true
reconstruction_note: "Phase 2 shipped outside GSD flow in d2496eb (PR #5) on 2026-04-19. This verification is a retroactive reconciliation against the live site and the shipped code, built 2026-04-21. Per project decision, acceptance is 'build passes + manual verification' — no test suite exists or is expected."
human_verification:
  - test: "Live site renders /releases with v1.3.2, v1.3.4, v1.3.5 cards and working download links"
    expected: "Visiting https://covalence.app/releases/ shows three release cards with absolute covalence.app/releases/*.dmg download links"
    why_human: "No test harness exists; acceptance model is manual verification against CF Pages deploy per STATE.md decisions"
    confirmed_by: "Darron (releases page declared shipped, 2026-04-21)"
  - test: "Dispatch → build → re-render loop works end-to-end"
    expected: "releases.json entries added by the dispatch workflow appear on the live page after the next CF Pages build, with zero code changes"
    why_human: "The loop is cross-repo (app repo dispatches, website rebuilds); end-to-end proof requires coordinated repos, not reproducible via a single test"
    confirmed_by: "Git log evidence: commits d3d562e (v1.3.4) and d855a33 (v1.3.5) show dispatch-workflow-authored entries appearing on main; live site rendered both without manual intervention"
---

# Phase 2: Releases Page Verification Report

**Phase Goal:** Visitors can find a public, chronological list of every Covalence release shipped since v1.3.0 — with version, date, summary, and a working download link — directly on `covalence.app`.

**Shipped:** 2026-04-19 (commit `d2496eb`, PR #5)
**Verified (retroactively):** 2026-04-21
**Status:** PASSED (reconstructed)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Visiting `https://covalence.app/releases` renders a page listing at least one release (currently v1.3.2) with its version, release date, human-readable summary, and a working download link. | VERIFIED | `src/pages/releases.astro` (520 lines, shipped in `d2496eb`) renders every entry in `src/data/releases.json`. Live `releases.json` contains v1.3.2, v1.3.4, v1.3.5 — all three render as cards with tag, absolute date, marked-rendered notes, and download link. |
| 2 | When a new `repository_dispatch` event of type `new-release` is processed and `src/data/releases.json` gains a new entry on `main`, the next CF Pages build re-renders `/releases` with that entry included — with zero code changes and zero hand-editing of content. | VERIFIED (end-to-end) | Two real dispatch cycles post-Phase-2: commit `d3d562e` added v1.3.4 via dispatch workflow (no Phase-2 code touched); commit `d855a33` added v1.3.5 same way. Both now render live. The ingestion workflow is upstream of this phase; Phase 2 only had to consume its output, which it does via build-time JSON import. |
| 3 | Each release entry's download link resolves to a DMG under the `covalence.app/releases/*` origin (not a preview host, not a relative path that breaks under `*.pages.dev`). | VERIFIED | All three live entries have `download_url` of shape `https://covalence.app/releases/Covalence-{version}.dmg` (absolute, correct origin). `public/_routes.json` was subsequently narrowed in `b1bfd58` (PR #6) so the exclude pattern matches the worker route exactly — `/releases` HTML renders from Pages; `/releases/*.dmg` passes through to the DMG host. |
| 4 | The `/releases` page is reachable from the site's primary nav and/or footer, so a visitor does not need to know the URL to find it. | VERIFIED | `src/components/Nav.astro` line 13: `<a href="/releases/">Releases</a>` in desktop link row (and matching entry in mobile drawer, line 43). `src/components/Footer.astro` also gained a "Releases" link per the `d2496eb` commit message. |

**Score:** 4/4 roadmap success criteria verified.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/pages/releases.astro` | Build-time renderer of releases.json | VERIFIED | 520 lines; reads `src/data/releases.json` via build-time import; per-entry try/catch around `marked.parse`; D-13 runtime guards skip incomplete entries with console.warn; SHA256 copy button hidden for invalid 64-char hex to keep the v1.3.2 seed rendering cleanly. |
| `src/components/Nav.astro` | Primary nav entry | VERIFIED | "Releases" link present in both desktop row and mobile drawer. |
| `src/components/Footer.astro` | Footer entry | VERIFIED | "Releases" link added alongside existing "Latest Release" link per `d2496eb` commit message. |
| `package.json` | `marked` dependency for notes rendering | VERIFIED | `marked@^18` added in `d2496eb`. |
| `src/data/releases.json` | Source of truth populated by dispatch | VERIFIED | Pre-existed phase (seeded in `76d273e`); currently contains v1.3.2, v1.3.4, v1.3.5. v1.3.3 intentionally absent (orphaned tag). |
| `public/_routes.json` | Pages/worker routing boundary | VERIFIED | Narrowed post-phase in `b1bfd58`; exclude pattern now matches worker route precisely. |

### Cross-Repo Contract Verification

| Contract | Side | Status | Evidence |
|----------|------|--------|----------|
| D-09..D-14 — `new-release` dispatch payload shape | App repo → website | VERIFIED | Two successful dispatch cycles post-Phase-2 (v1.3.4, v1.3.5) prove the payload contract is being honoured end-to-end and consumed correctly by this phase's renderer. |
| DOC-09 (render side) | This repo | CLOSED | Per `d2496eb` commit message: "Closes DOC-09 (render), DOC-11 verified via existing Hero pipeline." |
| DOC-10 (round-trip acceptance) | App repo | DEFERRED | Tracked in app repo, not in scope for this phase's verification. |

### Out-of-Scope Confirmations

Per project decisions in `.planning/STATE.md`:

- **No automated tests.** v1 acceptance is "build passes on CI + manual verification." This phase follows that acceptance model; no test gap is being declared.
- **No GSD plan/research/verification artifacts at ship time.** Phase 2 shipped as a direct PR; this VERIFICATION and the companion SUMMARY are the retroactive reconciliation.
- **No runtime server / no API.** Site is pure SSG per `ARCHITECTURE.md`. `releases.astro` reads data at build time only.

## Retrospective Notes

Things this retroactive pass surfaces that a live verification would have caught at ship time:

- **`_routes.json` narrowing was a follow-up, not part of Phase 2.** PR #6 (`b1bfd58`) shipped a day later to tighten the exclude pattern. Criterion 3 as worded passed at Phase 2 ship time by luck — the broader exclude pattern didn't happen to catch the HTML route. Worth noting for Phase 3 (SEO): routing config is now a shared concern across `/releases` (HTML), `/releases/*.dmg` (worker), and soon `/posts/*` (HTML).
- **No PLAN.md means no explicit "what we deliberately did not do" list for Phase 2.** The decisions captured in `02-SUMMARY.md` (marked vs MDX, light vs hard D-13 guards, hex-gated copy button) were made during implementation and are recovered from the commit message + code reading — not from a pre-commit design doc.

Both are acceptable trade-offs for a phase of this scope and uncertainty level. Neither is a gate on downstream phases.

## Sign-off

Phase 2 acceptance criteria are met against the live site and shipped code. Phase 3 and Phase 2.1 may proceed with Phase 2 treated as a complete predecessor.
