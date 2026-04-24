---
quick_id: 260424-uqq
created: 2026-04-24T22:07:00Z
mode: quick-inline
slug: replace-default-astro-favicon-ico-with-c
title: Replace default Astro favicon.ico with Covalence brand mark
files_modified:
  - public/favicon.ico
---

## Objective

`public/favicon.ico` is the leftover default Astro scaffold file — browsers auto-fetch `/favicon.ico` from site root as a discovery fallback (regardless of `<link>` tags in HTML), so the default Astro mark leaks through in tab-bar / bookmark / crawler contexts. Replace with the Covalence brand mark to match `favicon.svg` (which Base.astro already references and Starlight also emits).

## Context found during inspection

Partially contradicts the user's premise — `favicon.svg` was already custom Covalence (the red `#f0506a` "Co swirl"). Only `favicon.ico` was leftover from `npm create astro`.

Another quirk: `public/favicon.ico` is **not an ICO container** — `file` reports `PNG image data, 32 x 32, 8-bit colormap`. A 32×32 PNG with a `.ico` extension. Browsers read file magic and tolerate this fine, but it's unusual. Keeping the same shape (PNG-as-ICO at 32×32) because changing it to a real multi-size ICO would require installing Pillow (not present on this system) and is out of scope for a quick task.

## Scope

One-file change: rasterize `public/favicon.svg` to a 32×32 PNG using `rsvg-convert` and save as `public/favicon.ico`, overwriting the default Astro file. No HTML edits. No new assets beyond the one overwrite. No tooling install.

## Verification

- `file public/favicon.ico` reports `PNG image data, 32 x 32, 8-bit/color RGBA` (was `8-bit colormap` — now full-alpha)
- `cmp` against backup of old file shows bytes differ from byte 26 onward (different image content)
- `npm run build` exits 0
- `cmp public/favicon.ico dist/favicon.ico` → identical (Astro passthrough from `public/` works as expected)
- Manual eyeball on CF preview tab bar after push

## Known limitations (flagged for follow-up, not fixed here)

- **32×32 rendering of a thin curve on transparent background may look weak.** The SVG was designed for display at larger sizes. If the tab-bar icon turns out too faint or hard to recognize against light browser chrome, the one-line follow-up is to rasterize from `public/app-icon.svg` instead — it has the dark-background rounded-square composition designed for small-icon contexts. Keeping `favicon.svg` as source for consistency with Base.astro and Starlight's primary `<link rel="icon" type="image/svg+xml">`.
- **Not a true multi-size ICO.** True ICO format bundles 16×16 + 32×32 + 48×48 into one file for per-context optimal rendering. Would need Pillow (`pip install Pillow`) to produce. Skipped — the PNG-as-ICO pattern was already present and browsers handle it.
- **No `apple-touch-icon.png` or PWA manifest work.** Separate concern; the site doesn't pretend to be a PWA. `app-icon.svg` exists as a source but isn't wired anywhere — fine for now.
