# 18 — Context Engineering

Distilled from [agent-skills-for-context-engineering](../00-materials/repo/agent-skills-for-context-engineering/): four skills (context-fundamentals, context-degradation, context-compression, context-optimization) collapsed into one reference tuned for Claude Code sessions.

## What's here

`.claude/skills/context-engineering.md` — the combined reference. Install as a Claude Code skill:

```bash
cp .claude/skills/context-engineering.md ~/.claude/skills/context-engineering.md
```

Once installed, Claude activates it automatically when you ask about context limits, `/compact`, lost-in-middle, token costs, or observation masking.

## Key takeaways

| Concept | TL;DR |
|---------|-------|
| Tool outputs dominate token usage | 60–83% of context; focus optimization here |
| Lost-in-middle | Put critical info at start or end of context, never buried |
| Tokens-per-task | Over-compressing causes re-fetching; measure total cost, not per-request cost |
| Anchored iterative summarization | Structured persistent summary + merge-on-compact > full regeneration |
| KV-cache | Stable CLAUDE.md prefix = free tokens on every subsequent request |
| Sub-agent partitioning | Clean context per agent > one bloated shared context |

## How this maps to what's already in the repo

| Pattern | Folder | Context engineering concept |
|---------|--------|-----------------------------|
| Stop hook writes session summary | `03-auto-simplify/` | Write bucket — save context outside window |
| PreCompact hook backs up transcript | `23-hooks-in-deep/` | Write bucket + compression trigger |
| Sub-agents with isolated contexts | `05-subagents/` | Context partitioning |
| Per-project CLAUDE.md | throughout | Stable system prompt prefix for KV-cache |
| `/handoff` skill | `~/.claude/commands/` | Anchored iterative summarization format |
| `@file` refs in CLAUDE.md | `01-small-project/`, `04-uiux/` | Select bucket — just-in-time loading |
