---
quick_id: 260424-uqq
status: complete
started: 2026-04-24T22:07:00Z
completed: 2026-04-24T22:08:40Z
mode: quick-inline
commits:
  - eb49d8e
deviations: 0
---

# Quick Task 260424-uqq — Summary

## What changed

Replaced `public/favicon.ico` — was the default Astro scaffold file (32×32 PNG with `.ico` extension, colormap-palette greyscale Astro mark), now a 32×32 PNG rasterized from the branded `public/favicon.svg` Co-swirl using `rsvg-convert`.

```
-rw-r--r--  old: 655 bytes, PNG 32x32 8-bit colormap       (default Astro mark)
-rw-r--r--  new: 1044 bytes, PNG 32x32 8-bit/color RGBA    (Covalence Co-swirl)
```

## Why

Browsers auto-fetch `/favicon.ico` from site root regardless of `<link>` tags in HTML. Base.astro and Starlight both point modern browsers at the branded `favicon.svg`, but the leftover Astro `.ico` file was still the fallback for tab-bar icon caching, bookmark thumbnails, some crawlers, and any context where a browser prefers the `.ico` over the SVG hint. Now both discovery paths land on the same Covalence mark.

## Verification

- `file public/favicon.ico` reports `PNG image data, 32 x 32, 8-bit/color RGBA` ✓
- `cmp` vs. the pre-change backup shows bytes differ from byte 26 ✓
- PNG-signature + IHDR sanity check confirms valid 32×32 PNG ✓
- `npm run build` exits 0 ✓
- `cmp public/favicon.ico dist/favicon.ico` → byte-identical (Astro passthrough works as expected) ✓
- CF Pages preview will redeploy the bytes on next push — eyeball the tab-bar icon on the preview after the next push

## Deviations

None. Kept the same PNG-as-ICO pattern that was already there — the 32×32 PNG was Astro's default shape, and bringing in a real multi-size ICO container would need Pillow installed, which is out of scope for a quick task.

## Landed on

Branch `gsd/phase-3-content-depth-seo` (PR #12). Third quick fix riding along, after u9x (keyboard-shortcuts docs) and uk9 (Footer contact links). Commit `eb49d8e` is atomic and independently revertable.

## Follow-ups (captured, not done here)

- If the 32×32 Co-swirl reads too thin on light browser chrome, rasterize from `public/app-icon.svg` instead (dark rounded-square with gradient swirl — designed for small-icon display). One-line command change.
- Real multi-size ICO (16×16 + 32×32 + 48×48 bundled) would be a modest upgrade for pixel-perfect rendering at each context. Requires Pillow install or an online tool like realfavicongenerator.net. Not blocking; current 32×32 PNG is what browsers have been scaling on this site since launch anyway.
- `apple-touch-icon.png` and a PWA `manifest.webmanifest` are not wired — `public/app-icon.svg` exists as a source. Only worth doing if/when iOS home-screen install becomes a supported flow.
