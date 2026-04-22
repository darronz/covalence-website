---
phase: 02-releases-page
reconstructed: true
reconstructed_on: 2026-04-21
shipped_on: 2026-04-19
shipped_via: direct-PR (outside GSD flow)
tags:
  - releases
  - content-collection
  - cross-repo-contract
dependency_graph:
  requires:
    - Phase 1 CI gate (protects main while /releases lands)
    - Cross-repo contract D-09..D-14 (new-release dispatch payload shape, owned by app repo)
    - Release-ingestion workflow (writes releases.json on dispatch — pre-existed this phase)
  provides:
    - /releases page rendering every entry from releases.json
    - Nav + Footer entry points to /releases
    - Verified download link construction (absolute covalence.app/releases/*.dmg)
  affects:
    - Phase 3 SEO (sitemap + canonical + OG metadata must now cover /releases)
    - Phase 2.1 Blog (establishes the "build-time read from src/data/*.json" pattern that /posts/ mirrors for its collection)
tech_stack:
  added:
    - marked@^18 (build-time markdown rendering for release notes)
  patterns:
    - Astro set:html with :global() scoped CSS for marked output (per Astro issue #4380 idiom)
    - Per-entry try/catch around marked.parse to prevent one bad payload failing the page
    - Native <details> disclosure for SHA256 verification (no client JS framework needed)
key_files:
  created:
    - src/pages/releases.astro (520 lines)
  modified:
    - src/components/Nav.astro (Releases link beside Docs)
    - src/components/Footer.astro (Releases link alongside Latest Release)
    - package.json (marked dep)
    - package-lock.json
  follow-ups:
    - public/_routes.json (narrowed in b1bfd58 / PR #6 — exclude pattern now matches worker route exactly so /releases HTML is NOT caught alongside /releases/*.dmg passthrough)
decisions:
  - Shipped as a direct PR (#5) rather than through /gsd-plan-phase + /gsd-execute-phase — small enough scope to not warrant the full GSD ceremony, state reconciliation handled retroactively via this SUMMARY + VERIFICATION on 2026-04-21
  - Used marked over remark/MDX for notes rendering — avoids pulling MDX into the build just for release-note HTML
  - Light D-13 runtime guards (skip incomplete entries with console.warn) chosen over hard-failing the build on a malformed dispatch payload — preserves site availability if one entry is bad
  - Copy button for SHA256 hidden when the value isn't valid 64-char hex — lets seed entry (v1.3.2, pre-sha256-contract) render cleanly alongside fully-populated entries
  - v1.3.3 intentionally absent from releases.json (orphaned tag — tracked in app-repo todo 2026-04-19-v1.3.3-orphan-tag-no-website-entry.md)
requirements:
  completed:
    - REL-01 (render public releases list)
    - REL-02 (rebuild on dispatch without code changes)
    - REL-03 (correct origin for download links)
  linked:
    - DOC-09 (main Covalence app repo — "render" side closed)
    - DOC-11 (verified via existing Hero pipeline)
  deferred:
    - DOC-10 (round-trip dispatch acceptance) — tracked in app repo, not this phase
---

# Phase 2: Releases Page — Retroactive Summary

**Reconstructed:** 2026-04-21 — Phase 2 shipped outside GSD flow on 2026-04-19 (commit `d2496eb`, PR #5). This document is a back-fill so Phase 3 and Phase 2.1 have a canonical predecessor to point at.

**Phase Goal (from ROADMAP):** Visitors can find a public, chronological list of every Covalence release shipped since v1.3.0 — with version, date, summary, and a working download link — directly on `covalence.app`.

## What shipped

A single-page chronological release archive at `/releases`, rendering every entry in `src/data/releases.json` at build time. Latest release is featured at the top (accent top border, larger version header); earlier releases follow beneath as cards. Each card shows tag, absolute date, markdown-rendered notes, download link, and a `<details>` "Verify download" disclosure containing the SHA256 with a copy button.

Entry-point wiring: `Nav.astro` gained a "Releases" link beside "Docs"; `Footer.astro` gained a "Releases" link alongside "Latest Release".

## How data flows

1. App repo CI sends `repository_dispatch` event `type: new-release` with full metadata (contract D-09..D-14, owned upstream).
2. `.github/workflows/` handler writes `src/data/latest-release.json` and appends `src/data/releases.json`, commits to `main`. *(Pre-existed this phase — Phase 2 did not touch the ingestion workflow.)*
3. CF Pages detects the commit and runs `astro build` → `/releases` re-renders with the new entry included. No code changes, no hand-editing of content.

End-to-end proven in production: seed entry `v1.3.2` (commit `76d273e`, pre-Phase-2) + dispatch-added `v1.3.4` (commit `d3d562e`) + dispatch-added `v1.3.5` (commit `d855a33`). All three now render on the live `/releases` page.

## Why this didn't go through GSD

Small scope (one page, one dep, two nav edits). The design was already clear from ROADMAP success criteria and the upstream dispatch contract — no meaningful architectural decisions left for plan-phase to resolve. Shipping as a direct PR was a judgement call to avoid ceremony overhead on low-uncertainty work.

The trade-off: Phase 3 and Phase 2.1 need a canonical predecessor to depend on. This SUMMARY + the companion VERIFICATION.md close that gap.

## Follow-up

- `public/_routes.json` narrowed in PR #6 (`b1bfd58`) after Phase 2 merged — tightens the exclude pattern so `/releases` (HTML page, served by Pages) is distinct from `/releases/*.dmg` (worker passthrough to DMG host). Not a Phase 2 scope item but closely related; recording it here so Phase 3's routing-adjacent work (sitemap, canonical) has the full context in one place.

## What this phase explicitly did not do

- No automated tests (per project decision: v1 acceptance is "build passes on CI + manual verification on CF Pages preview").
- No PLAN.md, no research phase, no plan-checker pass — see "Why this didn't go through GSD" above.
- No changes to the ingestion workflow, which is upstream infrastructure pre-existing this phase.
- DOC-10 (round-trip dispatch acceptance) — tracked in the app repo, not here.
