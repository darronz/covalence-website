# Phase 4: Marketing Copy Rewrite (Pro-tier readiness) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-26
**Phase:** 04-marketing-copy-rewrite-pro-tier-readiness
**Areas discussed:** Plan granularity, "Always running" tile, Arch-stack teaser audit, Voice-invariant verification

---

## Plan granularity (Area A)

**Question:** Confirm plan structure for Phase 4?

| Option | Description | Selected |
|--------|-------------|----------|
| 5 plans + 1 verification (recommended) | 5 component-scoped plans (Hero / HowItWorks / Features / Architecture / Footer) in Wave 1 — disjoint files parallelize cleanly via worktrees. One consolidated verification plan in Wave 2. Mirrors Phase 3 (4 plans across 3 waves). | ✓ |
| 5 plans, no separate verification | 5 component plans in one wave. Each plan's own must_haves does its verification — no Phase 3-style consolidated checkpoint. | |
| 1 plan, 6 atomic commits | One executor sweeps all 6 edits sequentially in a single plan with one commit per edit. No parallelization. | |
| 3 plans by principle | Plan 1: hero + privacy paragraph + features tile #3 (the triad). Plan 2: other 2 features tiles + HowItWorks sub-copy. Plan 3: footer + verification. | |

**User's choice:** 5 plans + 1 verification (recommended)
**Notes:** Locked the Wave 1 / Wave 2 structure. Wave 1 plans are mutually independent (5 disjoint files), parallelizable via worktree isolation. Wave 2 is the consolidated verification plan, depends-on Wave 1.

---

## "Always running" tile + WR-01 (Area B, question 1)

**Question:** How should we handle the 'Always running' tile + the 'instant' word in it?

| Option | Description | Selected |
|--------|-------------|----------|
| One-word fix only (recommended) | Leave tile heading + first sentence per memory 150. Just swap 'instant' for a non-banned word. Closes WR-01 with minimal scope creep. | |
| Leave tile completely as-is | Honour memory 150 strictly — don't touch this tile at all. WR-01 stays open until a future phase rewrites the tile when Pro ships a non-Mac host. | |
| Rewrite full tile in this phase | Rewrite both heading and body to be platform-neutral now. Closes WR-01 + future-proofs for Pro. Goes beyond memory 150's stated scope. | ✓ |
| Defer to backlog with trigger | File a backlog item that triggers when Pro ships its first non-Mac host. WR-01 stays open meanwhile. | |

**User's choice:** Rewrite full tile in this phase
**Notes:** User chose to go beyond memory 150's "leave it" guidance. Phase 4 now rewrites 4 of 6 features tiles instead of 3. The Features.astro plan (04-03) covers all four atomically.

---

## "Always running" tile body (Area B, question 2 — follow-up after picking "rewrite full tile")

**Question:** What should the 'Always running' tile body read?

| Option | Description | Selected |
|--------|-------------|----------|
| You decide (Claude's discretion) | Plan/executor picks from a candidate set hitting the bar. CONTEXT locks ONLY the constraint, not the exact words. | |
| 'Quick capture from anywhere. Global hotkey opens search from any window.' | Concrete + platform-neutral + tight. Replaces 'instant search' framing without softening the speed claim. | ✓ |
| 'One-key capture, one-key search. Stays out of the way until you press it.' | More atmospheric. 'One-key' implies fast without using a banned word. | |
| 'Background capture, instant recall — no app to open, no tab to find.' | Stronger 'always-on' framing. WARNING: contains the banned word 'instant'. | |

**User's choice:** 'Quick capture from anywhere. Global hotkey opens search from any window.'
**Notes:** Final tile #3 body sentence 2. Heading stays "Always running". Body sentence 1 stays "Menu bar app with one-click capture." Only sentence 2 changes.

---

## Arch-stack teaser audit (Area C, question 1)

**Question:** How should we treat the arch-stack teaser from Phase 3?

| Option | Description | Selected |
|--------|-------------|----------|
| Grep-gate only (recommended) | Verification plan greps the teaser for banned words. If clean, no edit. Safety net without churn. Respects Phase 3's work. | |
| Lightly rewrite to echo principle | Edit the teaser to add the 'no third-party cloud' principle as a fourth repetition. Strengthens the page's thematic spine. | ✓ |
| Leave entirely (no grep) | Out of scope, no verification. Phase 4 touches arch-privacy column only; arch-stack is Phase 3 territory. | |

**User's choice:** Lightly rewrite to echo principle
**Notes:** The "no third-party cloud, by architecture" principle now gets said FOUR times across the page — adds the arch-stack teaser to the existing hero / privacy / features triad. Bumps Phase 4 total to 9 edits.

---

## Arch-stack teaser body (Area C, question 2 — follow-up)

**Question:** Target wording for the arch-stack teaser rewrite?

| Option | Description | Selected |
|--------|-------------|----------|
| Claude's discretion (recommended) | CONTEXT locks the constraint only. Planner/executor picks the exact wording. | |
| 'Every memory becomes a 256-dimension vector on hardware you control. Vector similarity meets keyword match via RRF. No third-party cloud, by architecture.' | Concrete proposal. Three sentences. Drops 'No cloud round-trips' (redundant with 'no third-party cloud') and replaces with the principle phrasing verbatim. | ✓ |
| 'Embeddings on hardware you control. Vector similarity + FTS5 keyword match merged via Reciprocal Rank Fusion. No third-party cloud.' | Tighter, more technical. Names FTS5 + RRF explicitly. | |
| '256-dim vectors on hardware you control. Hybrid search (vector + FTS5 keyword) via Reciprocal Rank Fusion. No third-party cloud.' | Most fact-dense. Reads like a one-line tech summary. | |

**User's choice:** Locked the verbatim string in option 2.

---

## Voice-invariant verification (Area D)

**Question:** How strict should voice-invariant verification be?

| Option | Description | Selected |
|--------|-------------|----------|
| Both: per-plan + consolidated (recommended) | Each component plan greps its own dist/ output AND the consolidated verification plan greps all 5 dist/ outputs + the home page. Phase 3 pattern. | ✓ |
| Consolidated only | Only the verification plan greps. Component plans assume they didn't introduce banned words. | |
| Per-plan only | Each plan greps its own output, no separate verification phase. Conflicts with the A.1 choice we already locked. | |

**User's choice:** Both: per-plan + consolidated
**Notes:** Standard pattern from Phase 3 — local checks catch issues early; consolidated catches drift across combined output (especially on the home page where 4 of the 5 components render together).

---

## Claude's Discretion

- Exact ordering of the four edits within Plan 04-03 (Features.astro four-tile rewrite) — planner picks. The four tile edits are independent within the same file.
- Wave 1 spawn order across Plans 04-01..04-05 — orchestrator picks any order.
- Commit-message conventions — follow existing pattern: `feat(04-NN):` for tile/copy adds, `refactor(04-NN):` for arch-privacy heading rename, `docs(04-NN):` for SUMMARY.md commits.

## Deferred Ideas

- `/contact` route as a dedicated page (option D from the original todo's A/B/C/D menu).
- Pricing page / Pro waitlist / "Pro coming soon" badge.
- Apple-touch-icon + PWA manifest (surfaced in 260424-uqq SUMMARY).
- Real multi-size ICO bundle (surfaced in 260424-uqq SUMMARY).
- Voice sweep on `/docs/*` — track as v2 since memory 150 is marketing-site only.
