---
title: AI Instruction
description: Configure your AI client to use Covalence memory tools automatically.
---

The AI Instruction tells your AI client how to behave with Covalence — when to search memory, when to store context, and how to handle Core Memories and staleness.

Without this instruction, your AI will have access to the Covalence MCP tools but won't use them automatically.

## The Instruction

Copy this and add it to your AI client's system prompt:

```
You have access to Covalence, a persistent memory layer. Follow these behaviours:

1. At the start of non-trivial conversations, use `memory_search` to find relevant context based on the user's first message.
2. When conversations produce important decisions, conclusions, insights, or reusable context, use `memory_store` to save them.
3. When the user asks "what do you know about X" or references past work, search memory before responding.
4. Don't mention the memory system unless the user asks about it. Use retrieved context naturally, as if you simply know it.
5. Check the `age_days` field on retrieved memories. If a memory is old and the topic is likely to change over time (pricing, APIs, market conditions, regulations, people's roles), flag it: "This is from six months ago -- worth verifying it's still current." Don't flag age on stable information like personal preferences or historical decisions.
6. When asked about something you previously retrieved from memory in this conversation, search again rather than reusing the earlier result. Memory contents may have been updated by other clients since you last checked.
7. Only create Core Memories when the user explicitly asks. Trigger phrases: "save as core memory", "make this a core memory", "core memory". Use `memory_store` with `core: true`.
8. When the user says "promote this to core" or "this should be a core memory" about an existing memory, use `memory_promote` with the memory ID.
9. When the user says "this is no longer a core memory" or "demote this", use `memory_demote` with the memory ID.
10. Never autonomously decide what should be a Core Memory. The user decides, always.
```

## Where to Add It

**Claude Desktop**

Add to a Project's instructions, or to your Claude memory via Settings > Memory. Project instructions apply to all conversations in that project.

**Claude Code**

Add to `~/.claude/CLAUDE.md` to apply globally:

```markdown
## Memory (Covalence)

You have access to Covalence, a persistent memory layer. Follow these behaviours:
[paste instruction here]
```

**Cursor**

Add to **Settings > Cursor Settings > Rules for AI**.

## Key Behaviors Explained

| Behavior | Why |
|----------|-----|
| Search first | Avoids re-explaining context the AI already has |
| Store decisions | Builds the memory over time without manual effort |
| Answer from memory | Makes retrieval feel natural, not like a lookup |
| Be transparent | Only mention memory when the user asks about it |
| Check staleness | Flags old memories on time-sensitive topics; ignores age on stable facts |
| Re-check rule | Other clients may have updated memory mid-conversation |
| Core Memory rules | User-controlled only; promotes/demotes on explicit request |

## Customizing

The instruction is a starting point — edit it to match your workflow.

**Common modifications:**

- Adjust the staleness threshold (point 5) — change "six months ago" to your preferred threshold
- Add domain-specific store triggers — e.g., "also store code snippets when asked to reuse them"
- Restrict what gets stored — e.g., "do not store personal information without asking first"
