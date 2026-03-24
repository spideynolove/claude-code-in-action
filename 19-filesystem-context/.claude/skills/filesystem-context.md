---
name: filesystem-context
description: Use when tool outputs are bloating the context window, agents need to persist state across long sessions, sub-agents must share data, or you need scratch pads for intermediate results. Covers write-to-file offloading, plan persistence, sub-agent filesystem communication, and dynamic skill loading.
---

# Filesystem-Based Context

The filesystem is an unlimited context extension. Instead of keeping everything in the window, agents write once and read selectively — pulling only the relevant portion when needed.

## The Core Trade-off: Static vs Dynamic Context

**Static context** (CLAUDE.md, tool definitions) — always loaded, always costs tokens.
**Dynamic context** (files loaded on demand) — costs nothing until needed; requires Claude to know when to fetch.

Dynamic context works well with frontier models. The agent receives a lightweight pointer (filename, description) and fetches full content via `Read` or `Grep` when the task requires it.

## Six Patterns

### 1 — Scratch Pad (tool output offloading)

Large tool outputs (web search, Bash logs, grep results) stay in message history for the whole session — burning tokens even after they're no longer relevant.

**Convention:** write oversized outputs to `.claude/scratch/<tool>-<timestamp>.txt`, return a one-line summary + path.

```
.claude/scratch/
  grep-useAuth-20260325.txt   ← 47 matches, 500 lines
  bash-build-20260325.txt     ← full npm build output
```

Claude then retrieves targeted lines when needed:
```
Read(.claude/scratch/grep-useAuth-20260325.txt, offset=10, limit=20)
```

This keeps message history lean while preserving full fidelity.

### 2 — Plan Persistence

Plans written only to message history fall out of attention as context grows. Writing the plan to a file lets Claude re-read it at any point.

```
.claude/scratch/plan.md
```

```markdown
## Objective
Refactor auth module

## Steps
- [x] Audit endpoints
- [ ] Design new token flow   ← current
- [ ] Implement + test
```

The `Stop` hook (see `03-auto-simplify/`) can write this to `.claude/last-session.md` automatically at session end.

### 3 — Sub-Agent Communication

Sub-agents reporting through message passing degrade information at each hop. Instead, each sub-agent writes findings directly to a file; the coordinator reads those files.

```
.claude/agents/
  research/findings.md
  code/changes.md
  test/results.txt
coordinator/synthesis.md
```

No message-passing degradation. Each agent operates in isolation; state is shared through files.

### 4 — Dynamic Skill Loading

Store skills as files. Put only names + one-line descriptions in static context. Claude fetches full SKILL.md content when the task triggers it.

```
Available skills (read with Read tool when relevant):
- context-engineering: ~/.claude/skills/context-engineering.md
- filesystem-context: this file
```

This is exactly what `~/.claude/skills/` does — Claude Code's skill system is the production implementation of this pattern.

### 5 — Log and Terminal Persistence

Long-running process output → write to `.claude/scratch/logs/`. Claude can `Grep` for errors without loading the entire log.

```bash
Grep(pattern: "error|Error", path: ".claude/scratch/logs/build.txt", -C: 3)
```

### 6 — Self-Modification (learned context)

Claude writes discovered preferences/conventions to a file that gets loaded next session.

```
.claude/learned/
  user-preferences.md    ← loaded via @-ref in CLAUDE.md
```

This is the manual version of the auto-memory system already in `~/.claude/projects/`.

## Claude Code Implementation

Add to your project's `CLAUDE.md`:

```markdown
## Filesystem context conventions
- Scratch files: `.claude/scratch/<purpose>-<YYYYMMDD>.<ext>`
- Sub-agent outputs: `.claude/agents/<agent-name>/output.md`
- Session plans: `.claude/scratch/plan.md`
- Large tool outputs (>500 lines): offload to scratch, return summary + path
```

Add `.claude/scratch/` to `.gitignore` (session-local, machine-specific):
```
.claude/scratch/
```

Keep `.claude/agents/` in git if sub-agent outputs should persist across sessions.
