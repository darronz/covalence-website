---
title: Core Memories
description: Pin important knowledge so your AI always checks it first.
---

Core Memories are a curated subset of your memories marked as permanently important. They appear pinned at the top of the memory list in the Covalence app and are intended for knowledge your AI should always have immediate access to.

## How Memories Are Organised

Covalence organises memories along two independent axes:

**Category** determines how a memory was created:

- **Memory** -- an intentional entry stored via MCP or quick capture. You or your AI decided this was worth remembering.
- **File** -- auto-indexed content from a watched folder. Covalence reads the file and keeps a searchable copy. The file is the source of truth; edit the file and Covalence re-indexes it.

**Source** tracks where the memory came from: `mcp` (stored by an AI client), `file` (indexed from a watched folder), or `capture` (saved via the quick capture panel).

**Core** is a flag, not a category. Any memory -- whether it came from MCP, a file, or quick capture -- can be promoted to Core. Promoting a memory pins it to the top of the browse list and signals that your AI should always have it available.

## Creating Core Memories

**Via MCP (tell your AI):**

- "Save this as a core memory" — AI uses `memory_store` with `core: true`
- "Make this a core memory" — same trigger
- "Core memory: [content]" — shorthand trigger phrase

**Via the app:**

Open the memory detail pane and click **Make this a Core Memory**.

## Promote and Demote

You can change the core status of any existing memory without copying or deleting it — it's an in-place flag flip.

**Promote to core:**

Tell your AI: "Promote this to core" or "This should be a core memory" — it uses `memory_promote` with the memory ID.

**Demote from core:**

Tell your AI: "This is no longer a core memory" or "Demote this" — it uses `memory_demote` with the memory ID.

## Searching Core Memories

`memory_search` with `core: true` returns only Core Memories. Omitting the filter returns all memories (core and regular).

## When to Use Core Memories

**Good candidates:**

- Personal preferences your AI should always know
- Recurring project context (tech stack, conventions, constraints)
- Important decisions that affect future work
- Facts your AI should reference before answering certain questions

**Not a good fit:**

- Temporary context (use regular memories)
- Frequently changing information (promote/demote as needed)
- Everything — Core Memories are valuable because they're curated, not comprehensive

## In the App

Core Memories appear with a pin icon at the top of the unified memory list. They can be edited in-place like any other memory — editing does not affect their core status.

## Important: User-Controlled Only

Core Memories are created exclusively on explicit user request. The AI instruction specifies that the AI must never autonomously decide what should be a Core Memory — the user decides, always. This applies to both Memory and File categories -- the AI never auto-promotes a File memory to Core either.
