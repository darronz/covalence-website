---
quick_id: 260424-u9x
created: 2026-04-24T20:47:55Z
mode: quick-inline
slug: fix-keyboard-shortcuts-docs-navigate-to-
title: Fix /docs/keyboard-shortcuts/ copy — "Navigate to General" → "Navigate to Shortcuts"
source_todo: .planning/todos/pending/2026-04-24-fix-keyboard-shortcuts-navigate-to-shortcuts-copy.md
files_modified:
  - src/content/docs/docs/keyboard-shortcuts.md
---

## Objective

Correct one word in `/docs/keyboard-shortcuts/#configuring-the-global-shortcut`. The step-2 instruction reads `Navigate to **General**` but the Covalence macOS app's Preferences pane that holds the global-shortcut control is **Shortcuts** — users following the doc today will not find the control where it says to look.

## Scope

Exactly one edit: `src/content/docs/docs/keyboard-shortcuts.md:40`, replace `Navigate to **General**` with `Navigate to **Shortcuts**`. No other lines, no other files.

## Verification

- `git diff` shows a one-line change
- `npm run build` exits 0
- `dist/docs/keyboard-shortcuts/index.html` contains `Navigate to <strong>Shortcuts</strong>` and does NOT contain `Navigate to <strong>General</strong>`

## Why inline (no subagent)

Task is a single-word substitution in a markdown file. Spawning a planner + executor pair for a 4-character change wastes context budget; inline execution preserves all GSD guarantees (atomic commit, PLAN/SUMMARY artifacts, STATE.md tracking) without the subagent overhead.
