---
phase: 260422-wks-phase-2.1-cleanups
plan: 01
status: complete
completed: 2026-04-22
duration: ~8 min
commits:
  - 00d02d1 fix(260422-wks): WR-01 — same-origin guard on og_image
  - b17d172 chore(260422-wks): IN-02 — remove dead astro-expressive-code dep
  - 229d4b7 docs(260422-wks): fix ChatGPT MCP compatibility claim
files_modified:
  - src/pages/posts/[...slug].astro
  - package.json
  - package-lock.json
  - src/content/docs/docs/getting-started.md
files_moved:
  - .planning/todos/pending/2026-04-21-fix-chatgpt-mcp-support-docs.md → .planning/todos/completed/
deviations: 0
requirements_closed:
  - QUICK-260422-wks (all three Phase 2.1 follow-ups)
---

# Phase 2.1 Cleanup Follow-ups — Quick Task Summary

**Duration:** ~8 min, 3 atomic commits, 0 deviations.

Closes the three items listed in `.planning/STATE.md:15` as "Three small follow-ups remain queued" from Phase 2.1's retroactive REVIEW + pending todo backlog:

| Item | Severity | Commit | Outcome |
|------|----------|--------|---------|
| WR-01 — `og_image` same-origin guard | Medium (advisory) | `00d02d1` | IIFE now throws at build time if resolved URL origin doesn't match `Astro.site`. Covers cross-origin absolutes, protocol-relative `//evil.com/x`, and `javascript:` schemes — all three slipped past the prior `new URL(relative, base)` call per the review's empirical verification. |
| IN-02 — dead `astro-expressive-code` dep | Low (dead dep) | `b17d172` | `npm uninstall astro-expressive-code` → `package.json.dependencies` drops 5→4 entries (`@astrojs/rss`, `@astrojs/starlight`, `astro`, `marked`). Lockfile loses the top-level entry only; transitive closure is shared with Starlight's bundled EC so nothing further to shed. |
| ChatGPT MCP claim | N/A (correctness) | `229d4b7` | Replaces dismissive "does not currently support" with forward-looking 3-sentence note linking to https://developers.openai.com/api/docs/mcp. Frames Covalence's local-only today + remote transport on roadmap — consistent with the project memory captured at phase 2.1. Todo moved `pending/` → `completed/`. |

## Verification

All three verification patterns from the plan green on final build:

- `grep -n 'u.origin !== new URL(Astro.site' src/pages/posts/[...slug].astro` → 1 match (line 28).
- `grep -c 'astro-expressive-code' package.json` → 0.
- `grep -n 'developers.openai.com/api/docs/mcp' src/content/docs/docs/getting-started.md` → 1 match (line 65).
- `grep -c 'does not currently support the MCP protocol' src/content/docs/docs/getting-started.md` → 0.
- `npm run build` → exit 0, 11 pages (unchanged count vs. Phase 2.1 end state).

## Deviations

None. Each task matched its plan specification exactly.

## What this did NOT do

- Did NOT address IN-03..IN-06 from the Phase 2.1 REVIEW. Those are advisory items outside STATE.md's queued follow-up list; they remain in `02.1-REVIEW.md` for the next phase's reviewer to surface if wanted.
- Did NOT push to `origin/main`. Local branch now 4 commits ahead of origin (was 1). Push is a separate deliberate step.
- Did NOT edit PROJECT.md or ROADMAP.md. The Covalence remote-MCP direction is documented in auto-memory (`project_covalence_remote_mcp_roadmap.md`) but not yet in the canonical planning docs — a decision for when the app-repo roadmap formalises the timeline, not for a doc-fix follow-up.

## Ready for

- Push `main` to `origin` (4 commits ahead: `f9068b9..229d4b7`).
- `/gsd-progress` or `/gsd-discuss-phase 3` to kick off Phase 3 (Content Depth & SEO).
