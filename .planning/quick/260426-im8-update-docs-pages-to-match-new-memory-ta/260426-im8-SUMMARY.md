---
status: complete
quick_id: 260426-im8
description: Update docs pages to match new memory taxonomy naming
date: 2026-04-26
files_modified:
  - src/content/docs/docs/mcp-tools.md
  - src/content/docs/docs/core-memories.md
  - src/content/docs/docs/getting-started.md
---

# Quick Task 260426-im8: Update docs for new memory taxonomy

## What changed

**mcp-tools.md:**
- `source` parameter on `memory_search` and `memory_list` now lists valid values: `mcp`, `file`, `capture`
- Added browse order note after `memory_list` Returns: Core first, MCP second, File memories last

**core-memories.md:**
- New "How Memories Are Organised" section explaining the two-axis taxonomy (Category: Memory vs File; Source: mcp/file/capture; Core as a cross-category flag)
- Extended "User-Controlled Only" section to note rule applies across both Memory and File categories

**getting-started.md:**
- New "File Memories" section explaining auto-indexing from watched folders (Settings > Files)
- Added "Under the Hood" link to What's Next section

## Verification

- `npm run build` exits 0 (all 12 pages built)
- All key content strings confirmed via grep
