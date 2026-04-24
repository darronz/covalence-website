---
quick_id: 260424-uk9
status: complete
started: 2026-04-24T21:00:18Z
completed: 2026-04-24T22:01:00Z
mode: quick-inline
source_todo: .planning/todos/pending/2026-04-24-add-contact-channel-to-marketing-site.md
commits:
  - 270f650
deviations: 0
---

# Quick Task 260424-uk9 — Summary

## What changed

Appended two anchors to `Footer.astro`'s `.footer-links` row:

```diff
       <a href="/releases/">Releases</a>
       <a href="/releases/Covalence-latest.dmg">Latest Release</a>
       {hasPosts && <a href="/posts/rss.xml">RSS</a>}
+      <a href="mailto:hello@covalence.app">Contact</a>
+      <a href="https://github.com/darronz/covalence-website/issues/new" rel="noopener">Report an issue</a>
```

## Why

The marketing site advertised zero way to reach the maintainer. Two footer links now cover:
- **`Contact` → `hello@covalence.app`** (already live on Proton Mail) — warm, direct register for anything non-bug (feedback, interest, questions, security-ish).
- **`Report an issue`** → `covalence-website/issues/new` — public tracker for bug reports. The app repo `darronz/covalence` is private and GitHub doesn't expose only-issues-public on private repos; issues land on the public website repo and get transferred to the private app repo silently via GitHub's cross-repo issue transfer (preserves history).

Closes the todo `2026-04-24-add-contact-channel-to-marketing-site` (option B of the A/B/C/D menu in the todo body).

## Verification

- `git diff` shows exactly 2 insertions, no other changes
- `npm run build` exits 0, 12 pages built
- `dist/index.html` contains both anchors ✓
- `dist/releases/index.html` contains both anchors ✓
- `/docs/*` pages use Starlight's native footer (existing behaviour — unchanged)

## Deviations

None. No CSS changes needed; existing `.footer-links` flex row handles extra children, 640px breakpoint already switches to column on mobile.

## Landed on

Branch `gsd/phase-3-content-depth-seo` (PR #12). Third quick-task-sized fix riding along with the Phase 3 PR. Commit `270f650` is atomic and independently revertable.

## Follow-ups (captured, not done here)

- `SECURITY.md` in `darronz/covalence` pointing at `hello@covalence.app` for security reports — standard pattern, out of scope for this footer-level change.
- Reconcile with the memory-150 marketing-copy rewrite when that phase runs; both touch Footer.astro. Memory 150 changes the footer tagline; these two links ride through untouched.
- Monitor `covalence-website/issues` inbound volume. If a meaningful portion turns out to be app-specific, consider whether making `darronz/covalence` public (or creating a dedicated public `covalence-feedback` shell repo) would reduce triage overhead.
