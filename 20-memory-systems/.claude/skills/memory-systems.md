---
name: memory-systems
description: Use when implementing agent memory that persists across sessions, choosing between memory frameworks (Mem0, Zep/Graphiti, Letta, Cognee, LangMem), building knowledge graphs for agents, tracking entities over time, or evaluating memory quality. Compares production frameworks with benchmark data.
---

# Memory Systems

Memory lets agents maintain continuity across sessions and reason over accumulated knowledge. The key benchmark finding: **reliable retrieval beats sophisticated tooling** — Letta's filesystem agents (74% LoCoMo) outperformed Mem0's specialized memory (68.5%). Start simple; add complexity only when retrieval quality fails.

## Memory Layers

| Layer | Persistence | What it stores | Implementation |
|-------|------------|---------------|----------------|
| Working | Context window | Current task state, scratchpad | In-prompt (optimize placement) |
| Short-term | Session-scoped | Tool results, conversation state | `.claude/scratch/` files |
| Long-term | Cross-session | Preferences, domain facts, decisions | Key-value file → graph DB |
| Entity | Cross-session | Who/what is consistent across convos | Entity registry with properties |
| Temporal KG | Cross-session + history | Facts that change over time | Graph with validity intervals |

## Framework Comparison

| Framework | Architecture | Best For |
|-----------|-------------|----------|
| **File-system** | Plain files, naming conventions | Prototyping; surprisingly competitive (74% LoCoMo) |
| **Mem0** | Vector store + graph, managed infra | Multi-tenant, fastest path to production |
| **Zep/Graphiti** | Temporal KG, bi-temporal model | Relationship modeling + temporal reasoning; 18.5% accuracy gain, 90% latency reduction |
| **Letta** | Self-editing tiered storage | Full agent introspection, stateful services |
| **Cognee** | Multi-layer semantic graph (ECL pipeline) | Multi-hop reasoning; best on HotPotQA EM/F1 |
| **LangMem** | Memory tools for LangGraph | Teams already on LangGraph |

## Retrieval Strategies

| Strategy | Use when | Limitation |
|----------|----------|------------|
| Semantic (embeddings) | Direct factual queries | Degrades on multi-hop |
| Entity (graph traversal) | "Everything about X" | Requires graph structure |
| Temporal (validity filter) | Facts change over time | Requires validity metadata |
| Hybrid | Best overall accuracy | Most infrastructure |

## Decision Ladder

```
1. Prototype   → filesystem (JSON files + timestamps)
2. Scale       → Mem0 or vector store when semantic search needed
3. Reasoning   → Zep/Graphiti for relationships + temporal; Cognee for denser multi-hop KG
4. Full control → Letta for agent self-management; Cognee for customizable ECL pipeline
```

## What's Already Running in This Repo

| Memory mechanism | Where |
|-----------------|-------|
| File-system memory (Stage 1) | `~/.claude/projects/<hash>/memory/*.md` — auto-memory via MEMORY.md |
| Semantic search (Stage 2) | `episodic-memory` plugin → `search-conversations` skill |
| Session summary | `03-auto-simplify/` Stop hook → `.claude/last-session.md` |
| Cross-session handoff | `/handoff` skill → `.claude/handoff.md` |

The auto-memory system is a production filesystem-memory implementation. It just hasn't been named as such.

## Temporal Validity Pattern

Track facts that change over time with `valid_from` / `valid_until`:

```json
{
  "entity": "user_preference_theme",
  "value": "dark",
  "valid_from": "2026-01-01",
  "valid_until": "2026-03-15"
}
```

On retrieval: prefer the fact with the most recent `valid_from`. If conflicting facts both have `valid_until: null`, surface the conflict.

## Error Recovery

- **Empty retrieval** → broaden search (remove entity filter, widen time range) → ask user
- **Stale results** → check `valid_until` → if mostly expired, trigger consolidation
- **Storage failure** → queue writes for retry; never block agent response on a memory write

## Anti-Patterns

- Stuffing all long-term memory into context — use just-in-time retrieval
- Ignoring temporal validity — stale facts cause context clash
- Over-engineering early — filesystem agent can beat specialized tools
- No consolidation — unbounded growth degrades retrieval over time
