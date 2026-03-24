# 20 — Memory Systems

Adapted from [agent-skills-for-context-engineering](../00-materials/repo/agent-skills-for-context-engineering/skills/memory-systems/).

Framework comparison + design patterns for agent memory that persists across sessions.

## Install

```bash
cp SKILL.md ~/.claude/skills/memory-systems.md
```

## Key finding

Letta's filesystem agents (plain files, basic operations) scored **74% on LoCoMo**, beating Mem0's specialized memory (68.5%). Start with files; add graph databases only when retrieval quality demands it.

## Where this repo already is

| Stage | Status |
|-------|--------|
| Filesystem memory | ✅ `~/.claude/projects/<hash>/memory/` |
| Semantic search | ✅ `episodic-memory` plugin |
| Session summaries | ✅ `03-auto-simplify/` Stop hook |
| Handoff / cross-session | ✅ `/handoff` skill |
| Temporal KG (Zep/Graphiti) | ❌ not implemented |
| Multi-hop reasoning (Cognee) | ❌ not implemented |

The repo is already at Stage 2 on the decision ladder. Stage 3+ (graph DBs) is the next frontier if retrieval quality starts failing.
