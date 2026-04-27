---
status: complete
quick_id: 260427-h4g
description: Fix mcp-tools.md return values to match v1.4 app repo tool schemas
date: 2026-04-27
files_modified:
  - src/content/docs/docs/mcp-tools.md
  - src/content/docs/docs/under-the-hood.md
---

# Quick Task 260427-h4g: Fix MCP tool return values

## What changed

Audited all 9 tool return shapes against ToolHandlers.swift in the app repo.

**mcp-tools.md — 9 fixes:**
1. memory_store: added missing `core` field to return
2. memory_search: added missing `tier` and `core` fields to return
3. memory_list: added missing `core` field to return
4. memory_retrieve: added missing `core` field to return
5. memory_status: added missing `core_memories` field to return
6. memory_delete: added return value (was undocumented)
7. memory_update: added return value (was undocumented)
8. memory_promote: added return value (was undocumented)
9. memory_demote: added return value (was undocumented)

**under-the-hood.md:**
- Bumped version reference in description from v1.3 to v1.4

## Verification

- `npm run build` exits 0
- All return values match ToolHandlers.swift in app repo
