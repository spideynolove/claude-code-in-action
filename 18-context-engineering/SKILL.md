---
name: context-engineering
description: Use when designing Claude Code sessions, debugging unexpected agent behavior, hitting context limits, or asking about /compact, token costs, context degradation, lost-in-middle, or observation masking. Covers context anatomy, degradation patterns, compression, and optimization — all four context engineering skills in one reference.
---

# Context Engineering

Context is everything in Claude's window at inference time: system prompt, tool definitions, message history, and tool outputs. Context engineering is the discipline of curating the smallest high-signal token set that maximizes the likelihood of correct outcomes.

## Anatomy of Context in Claude Code

| Component | Typical share | Notes |
|-----------|--------------|-------|
| System prompt (CLAUDE.md stack) | 3–8% | Stable; benefits from KV-cache |
| Tool definitions | 4–6% | Stable; loaded once per session |
| Message history | 10–25% | Grows with session length |
| Tool outputs (Read, Bash, Grep…) | **60–83%** | Dominant; observation masking applies here |

Tool outputs dominate. This is why `/compact` and output filtering matter more than trimming CLAUDE.md.

## Degradation Patterns

### Lost-in-Middle
U-shaped attention: start and end get reliable attention; the middle does not. 10–40% lower recall accuracy for information buried in context center.

**Fix:** Place critical information at the beginning (CLAUDE.md, system context) or at the very end (most recent message). Use explicit headers so Claude can navigate structure.

### Context Poisoning
A hallucination or wrong tool output enters context. Every subsequent turn references it, compounding the error.

**Signs:** Output quality degrades on tasks that previously worked; wrong tool parameters appear; corrections don't stick.

**Fix:** When you see compounding errors, `/clear` and restart with verified state. Don't try to "patch" a poisoned context.

### Context Distraction
Irrelevant content in context forces Claude to attend to it anyway. Even a single irrelevant file reduces performance on the relevant task.

**Fix:** Don't `@`-reference files you don't need for the current task. Prefer targeted `Read` + `Grep` over broad context loading.

### Context Clash
Contradictory correct information in context simultaneously — e.g., two versions of a schema both present.

**Fix:** Version-filter before loading. Use `@file` references instead of copy-pasting; the reference fetches current state.

## Compression

The right optimization target is **tokens-per-task** (total tokens to complete the task), not tokens-per-request. Over-aggressive compression forces re-fetching, which costs more total tokens.

### Anchored Iterative Summarization
The highest-fidelity compression pattern. Maintains a structured persistent summary; each compaction merges only the newly-truncated span rather than re-summarizing everything.

Structure forces preservation — dedicated sections act as checklists:

```markdown
## Session Intent
[what the user is trying to accomplish]

## Files Modified
- path/to/file.py: what changed

## Decisions Made
- [decision + reason]

## Current State
- [test counts, passing/failing, blockers]

## Next Steps
1. [ordered list]
```

Use this structure in `.claude/handoff.md` (the `/handoff` skill writes exactly this format).

### Compression Triggers

| Trigger | When | Trade-off |
|---------|------|-----------|
| Fixed threshold (70–80% utilization) | Simple | May compress too early |
| Sliding window (keep last N turns + summary) | Predictable | May lose detail |
| Task-boundary | Clean summaries | Unpredictable timing |

In Claude Code: the `/context` command shows current utilization. The autocompact buffer is ~16.5% of the window. Trigger manual `/compact` before hitting that buffer if context quality matters more than continuity.

## Optimization Techniques

### Observation Masking
Replace verbose tool output with a compact reference once it has served its purpose.

```
# Instead of keeping 500 lines of grep output in context:
# "Grep for 'useAuth' returned 47 matches across 12 files.
#  Key locations: auth/hooks.ts:23, components/Login.tsx:8"
```

Claude Code does this automatically for large Bash outputs (truncation). You can reinforce it by summarizing large outputs explicitly before moving on.

### KV-Cache Optimization
Stable prefixes (system prompt + tool definitions) are cached. Dynamic content breaks the cache.

**For Claude Code:** Keep CLAUDE.md content stable across sessions. Avoid injecting dynamic values (timestamps, session IDs) into persistent instructions. The stable parts load once; only the conversation tail costs new tokens.

### Context Partitioning via Sub-Agents
The most aggressive optimization: each sub-agent operates in a clean context focused only on its subtask. The coordinator context stays small (coordination logic only, not all the implementation detail).

This is exactly what `05-subagents/` demonstrates — each spawned agent starts with a fresh context budget.

### Degradation Thresholds (approximate)
| Model | Noticeable degradation | Severe |
|-------|----------------------|--------|
| Claude Sonnet 4.6 | ~80K tokens | ~150K |
| Claude Opus 4.6 | ~100K tokens | ~180K |

For reference: the autocompact buffer in Claude Code triggers at ~33K tokens reserve. At 200K window, that leaves ~167K before autocompact fires.

## Claude Code–Specific Patterns

### Progressive Disclosure via CLAUDE.md
CLAUDE.md is your system prompt. Apply the same rules: clear section headers, critical rules at the top, references via `@file` instead of inline copy-paste, specific enough to guide but not so granular it becomes fragile.

### Hooks as Context Controllers
- `PreCompact` hook (see `12-hooks-in-deep/`) — fires before `/compact` rewrites transcript; back up first
- `Stop` hook (see `03-auto-simplify/`) — fires at session end; write structured summary to `.claude/last-session.md`
- `UserPromptSubmit` hook — can inject context or gate requests before they consume tokens

### The Four-Bucket Approach
**Write** — save context outside the window: `.claude/scratch/`, `handoff.md`, log files
**Select** — pull only relevant context: targeted `@file` refs, specific Grep patterns
**Compress** — run `/compact` with anchored summary; use Stop hook to write session summary
**Isolate** — spawn sub-agents for parallel tasks; each gets a clean context budget
