# 22 — Tool Design

Adapted from [agent-skills-for-context-engineering](../00-materials/repo/agent-skills-for-context-engineering/skills/tool-design/).

Principles for designing tools that agents use reliably. Directly applicable to `02-mcp/` and any new MCP server built in this repo.

## Install

```bash
cp SKILL.md ~/.claude/skills/tool-design.md
```

## Key takeaways

- If you can't say which tool to use in a given situation, the agent can't either → consolidate
- Tool descriptions are prompt engineering, not documentation
- MCP tools: always use `ServerName:tool_name` — unqualified names fail silently with multiple servers
- Architectural reduction (primitives > specialized tools) often outperforms complex API surfaces
- Claude can optimize its own tool descriptions: feed it failures → get better descriptions

## What's directly applicable

| Pattern | Where in this repo |
|---------|-------------------|
| MCP naming `ServerName:tool_name` | `02-mcp/` (fix any bare tool references) |
| Consolidation check | Any new MCP server in `02-mcp/` |
| Error message design | All hooks in `03-auto-simplify/`, `12-hooks-in-deep/` |
| Tool optimization with Claude | Use against any MCP tool that generates wrong calls |
