# Agent System Setup

Three agents covering the full coding workflow. Place them in `~/.claude/agents/` (global) or `.claude/agents/` in the project root (project-local).

## Agents

| Agent | Invoke when | Spawns |
|-------|------------|--------|
| `orchestrator` | Given a feature request or bug fix | codebase-analyst, mcp-manager |
| `codebase-analyst` | Need architectural understanding of a repo | repomix, sequential-thinking, knowledge-graph (via mcporter) |
| `mcp-manager` | Need to run an MCP tool without polluting context | gemini-cli → kimi → qwen → codex → mcporter |

## Installation

```bash
cp 05-subagents/orchestrator.md ~/.claude/agents/
cp 05-subagents/codebase-analyst.md ~/.claude/agents/
cp 05-subagents/mcp-manager.md ~/.claude/agents/
```

## Usage

### Full automated workflow
```
Agent(subagent_type: "orchestrator", prompt: "add rate limiting to the API in /path/to/project")
```

### Codebase analysis only
```
Agent(subagent_type: "codebase-analyst", prompt: "analyze shaneholloman/mcp-knowledge-graph")
```

### Single MCP tool call (context-clean)
```
Agent(subagent_type: "mcp-manager", prompt: "take a screenshot of google.com")
```

## mcp-manager CLI fallback chain

Checks availability with `which` before attempting each:

1. `gemini-cli` — `gemini -y -m gemini-2.5-flash -p "<task>"`
2. `kimi` — `kimi -p "<task>"`
3. `qwen-code` — `qwen -p "<task>"`
4. `codex` — `codex "<task>"`
5. `mcporter` — always available, guaranteed fallback

## Relation to superpowers skills

The orchestrator **inlines** the logic from these superpowers skills — you do not need to run them manually:

| Superpowers skill | Equivalent phase in orchestrator |
|------------------|----------------------------------|
| `/superpowers:brainstorming` | Phase 1 — Clarify intent |
| `/superpowers:writing-plans` | Phase 3 — Write plan |
| `/superpowers:executing-plans` | Phase 4 — Implement |
| `/superpowers:requesting-code-review` | Phase 5 — Review |

The orchestrator chains them automatically. Use the slash commands directly only when you want manual control over a single phase.

## Prerequisites

- mcporter configured: `~/.mcporter/mcporter.json`
- Skills installed: `~/.claude/skills/repomix/`, `mcp-knowledge-graph/`, `sequential-thinking/`
- At least one of: gemini-cli, kimi, qwen-code, codex, or mcporter available
