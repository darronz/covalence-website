---
status: complete
quick_id: 260426-npr
description: Create /docs/how-search-works page explaining 5-signal ranking system
date: 2026-04-26
files_modified:
  - src/content/docs/docs/how-search-works.md
  - src/content/docs/docs/index.md
---

# Quick Task 260426-npr: Create /docs/how-search-works

## What changed

**New page: how-search-works.md**
- Explains all 5 ranking signals: semantic similarity, keyword matching (BM25 with 5x title weight), source tiers, recency decay, title-match boosting
- Shows the full fusion formula with named constants
- Explains browse order vs search ranking difference (Core>MCP>File vs Core>File>MCP)
- Documents the tunable constants table
- Mentions cov-benchmark quality suite (30/30)

**index.md**
- Added "How Search Works" link to docs landing page

## Verification

- `npm run build` exits 0 (13 pages built, up from 12)
- `/docs/how-search-works/index.html` appears in build output
