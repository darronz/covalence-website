---
title: Spaces
description: Isolate memories by project using the --space flag.
---

Spaces are logical partitions within the Covalence database. Memories in one space are invisible to searches in other spaces. Use them to keep work projects, personal context, and client engagements separate.

## Default Space

Every MCP connection without a `--space` argument uses the default space. All memories created through the standard setup guide live here.

## Creating a Space

Spaces are created automatically when you first connect with a new `--space` name. There's nothing to configure in advance.

## Per-Project Isolation

Pass `--space <name>` as an argument to the `cov-mcp` binary.

**Claude Code:**

```bash
claude mcp add covalence-myproject /Applications/Covalence.app/Contents/MacOS/cov-mcp -- --space myproject
```

**Claude Desktop / Cursor (JSON config):**

```json
{
  "mcpServers": {
    "covalence-myproject": {
      "command": "/Applications/Covalence.app/Contents/MacOS/cov-mcp",
      "args": ["--space", "myproject"]
    }
  }
}
```

The MCP server name (`"covalence-myproject"`) can be anything — it's just a label for your AI client. The `--space` argument is what determines which partition in the Covalence database is used.

## When to Use Spaces

- Separate work projects from personal context
- Client engagements that should not share memory
- Experimental or short-lived contexts you want to discard later
- Different AI clients with different purposes

## Limitations

- You can change the space a memory is assigned to in v1.4.0 and later.
- `memory_search` and `memory_list` only return results from the current space.
- `memory_status` counts memories in the current space only.
