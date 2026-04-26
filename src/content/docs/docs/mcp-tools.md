---
title: MCP Tools
description: Reference for all 9 Covalence memory tools.
---

Covalence exposes 9 tools via the MCP protocol. Your AI client can call these tools directly when Covalence is connected as an MCP server.

---

## memory_store

Store a new memory. Use when the conversation produces important decisions, conclusions, insights, or reusable context.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `content` | string | Yes | The text content to store |
| `title` | string | No | Title — auto-generated from content if omitted |
| `tags` | string[] | No | List of string tags for filtering |
| `metadata` | object | No | Key-value metadata as a JSON object |
| `core` | boolean | No | If `true`, stores as a Core Memory (default `false`) |

**Returns:** `{ id, title, indexed }`

---

## memory_search

Semantic search across all stored memories.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Natural language search query |
| `limit` | integer | No | Max results to return (default 5, max 20) |
| `threshold` | float | No | Minimum similarity score 0.0–1.0 (default 0.3) |
| `tags` | string[] | No | Filter results to memories with these tags |
| `source` | string | No | Filter by source: `mcp`, `file`, or `capture` |
| `core` | boolean | No | `true` = Core only, `false` = regular only, omit for all |

**Returns:** `[{ id, title, content, similarity, tags, source, created_at, age_days }]`

The `age_days` field enables staleness checking — the AI can flag old memories on time-sensitive topics.

---

## memory_list

Browse recent memories without a search query.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | integer | No | Max results to return (default 10, max 50) |
| `offset` | integer | No | Pagination offset (default 0) |
| `source` | string | No | Filter by source: `mcp`, `file`, or `capture` |
| `tags` | string[] | No | Filter by tags |
| `core` | boolean | No | Filter by core status |

**Returns:** `[{ id, title, source, tags, created_at }]`

When browsing without filters, results appear in intent order: Core memories first (pinned), then MCP memories (AI-stored), then File memories (auto-indexed from watched folders).

---

## memory_retrieve

Get the full content of a specific memory by ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The memory ID to retrieve |

**Returns:** `{ id, title, content, tags, metadata, source, created_at, updated_at }`

---

## memory_delete

Delete a memory permanently.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The memory ID to delete |

---

## memory_update

Update the content, title, tags, or metadata of an existing memory. Re-embeds the memory if content changes.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The memory ID to update |
| `content` | string | No | New content (triggers re-embedding) |
| `title` | string | No | New title |
| `tags` | string[] | No | New tags (replaces existing tags) |
| `metadata` | object | No | New metadata (replaces existing metadata) |

---

## memory_promote

Promote a regular memory to a Core Memory. This is an in-place flag change — no data is copied or deleted.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The memory ID to promote |

---

## memory_demote

Demote a Core Memory back to a regular memory. In-place flag change.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | The memory ID to demote |

---

## memory_status

Get system stats for the current space.

No parameters.

**Returns:** `{ total_memories, embedding_model, index_status, last_indexed }`
