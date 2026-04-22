---
title: Getting Started
description: Connect Covalence to Claude Desktop, Claude Code, or Cursor in under a minute.
---

Connect Covalence to your AI client by adding it as an MCP server. Once connected, your AI gains persistent memory that persists across sessions.

## Prerequisites

- macOS 15 or later (Sonoma)
- [Covalence](https://covalence.app/releases/Covalence-latest.dmg) installed in `/Applications`

## Connect Your AI Client

### Claude Desktop

Add the following to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "covalence": {
      "command": "/Applications/Covalence.app/Contents/MacOS/cov-mcp"
    }
  }
}
```

Then restart Claude Desktop.

### Claude Code

Run this command in your terminal:

```bash
claude mcp add covalence /Applications/Covalence.app/Contents/MacOS/cov-mcp
```

Claude Code picks up the new server immediately — no restart needed.

### Cursor

Open **Cursor Settings > MCP Servers** and add the same JSON as Claude Desktop:

```json
{
  "mcpServers": {
    "covalence": {
      "command": "/Applications/Covalence.app/Contents/MacOS/cov-mcp"
    }
  }
}
```

### OpenCode

Run this command in your terminal:

```bash
opencode mcp add covalence /Applications/Covalence.app/Contents/MacOS/cov-mcp
```

### ChatGPT

ChatGPT does not currently support the MCP protocol. Watch for updates from OpenAI.

## Add the AI Instruction

Connecting the MCP server gives your AI access to the memory tools, but it won't use them automatically without guidance. Add the [AI Instruction](/docs/ai-instruction/) to your AI client's system prompt so it knows when to search and store.

This step is recommended for best results.

## Verify It Works

Ask your AI: **"What do you know about me?"**

If Covalence is connected, it will use `memory_search` to look up relevant context and respond. On a fresh install the database is empty, so the AI will say it has no memories yet — that's expected.

## What's Next

- **[Spaces](/docs/spaces/)** — Isolate memories by project using the `--space` flag
- **[Core Memories](/docs/core-memories/)** — Pin important knowledge so your AI always checks it first
- **[AI Instruction](/docs/ai-instruction/)** — Full instruction text and where to add it per client
