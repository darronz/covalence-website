---
created: 2026-04-24T00:00:00Z
title: Fix /docs/keyboard-shortcuts/ copy — "Navigate to General" should be "Navigate to Shortcuts"
area: docs
files:
  - src/content/docs/docs/keyboard-shortcuts.md:40
---

## Problem

On `/docs/keyboard-shortcuts/#configuring-the-global-shortcut` the written step for changing the global hotkey reads:

> 2. Navigate to **General**

but in the Covalence macOS app, the Preferences pane that holds the global shortcut control is **Shortcuts**, not **General**. Readers following the documented flow will not find the control where the page tells them to look.

Source: `src/content/docs/docs/keyboard-shortcuts.md:40` (the "Configuring the global shortcut" H2 section's numbered list).

## Solution

Change `Navigate to **General**` → `Navigate to **Shortcuts**` on line 40 of `src/content/docs/docs/keyboard-shortcuts.md`. Rebuild and re-verify the rendered `/docs/keyboard-shortcuts/#configuring-the-global-shortcut` anchor. One-line fix, good candidate for `/gsd-quick`.

Before merging, cross-check against the live Covalence app's Preferences pane labels to make sure "Shortcuts" is the exact string the app uses (capitalization, plural) — if the app calls it something else (e.g. "Keyboard Shortcuts"), match that verbatim.
