# AI Team Agent System

Role-explicit multi-agent coding workflow. The orchestrator asks what type of task it is and who runs each role before anything executes. No auto-picking.

## Quick Install

```bash
cd 05-subagents
bash install.sh
cp .claude/settings.json ~/.claude/settings.json
# Edit settings.json — replace all absolute paths with paths for this machine
```

Prerequisites:

| Requirement | Check |
|-------------|-------|
| mcporter configured | `cat ~/.mcporter/mcporter.json` |
| Skills installed | `ls ~/.claude/skills/` — needs: repomix, mcp-knowledge-graph, sequential-thinking |
| At least one CLI | `which deepseek qwen glm codex kimi gemini` |

install.sh creates symlinks for:
- `~/.claude/agents/*.md` — all agent definitions
- `~/.claude/skills/*/SKILL.md` — skill entry points
- `~/.claude/hooks/*` — context loader hook
- `~/.claude/CLAUDE.md` — global instructions

settings.json is NOT symlinked — copy and edit paths manually on each machine.

---

## Agents

| Agent | When to spawn | Spawns |
|-------|--------------|--------|
| `orchestrator` | Feature request, bug fix, refactor | codebase-analyst, task-runner |
| `codebase-analyst` | Need architectural understanding | mcporter (repomix + sequential-thinking + knowledge-graph) |
| `task-runner` | Execute a task with a specific CLI | (shells out to assigned CLI) |
| `mcp-manager` | Run a specific MCP tool call | mcporter only |

---

## How It Works

### Gate 0 — Team Setup (every session, before any code)

The orchestrator asks two questions:

**Q1 — Task type:**
```
1. feature   — new functionality
2. bug        — fix broken behavior
3. refactor   — restructure without changing behavior
4. analysis   — understand codebase only, no changes
5. test-only  — write or fix tests only
```

**Q2 — Role roster (confirm or override defaults):**
```
planner  → deepseek
coder    → qwen
tester   → glm
reviewer → codex
```

The confirmed roster is written to `.aim/team.json` before any agent is spawned.

### Gate 1 — Active Roles

Based on task type, only the needed roles are activated:

| task_type  | active_roles                     |
|------------|----------------------------------|
| feature    | planner, coder, tester, reviewer |
| bug        | planner, coder, tester, reviewer |
| refactor   | planner, coder, reviewer         |
| analysis   | (codebase-analyst only)          |
| test-only  | tester                           |

### Execution Flow

```
Gate 0 → team.json written
Gate 1 → active roles determined
Phase 1 → clarify intent
Phase 2 → codebase-analyst spawned
Phase 3 → task-runner(role=planner, cli=team.json[planner])
Phase 4 → task-runner(role=coder,   cli=team.json[coder])   × N tasks
Phase 5 → task-runner(role=tester,  cli=team.json[tester])
Phase 6 → task-runner(role=reviewer,cli=team.json[reviewer])
```

task-runner receives an **explicit** CLI assignment. If the CLI is not installed, it stops and reports — it does not substitute a different tool.

---

## `.aim/team.json` Schema

Written by the orchestrator at Gate 0. Read by task-runner at runtime.

```json
{
  "task_type": "feature",
  "active_roles": ["planner", "coder", "tester", "reviewer"],
  "roster": {
    "planner":  "deepseek",
    "coder":    "qwen",
    "tester":   "glm",
    "reviewer": "codex"
  }
}
```

---

## `.aim/results/<task_id>.json` Schema

Written by task-runner after each task. Read by successor tasks as context.

```json
{
  "task_id": "t1",
  "role": "coder",
  "tool": "qwen",
  "status": "complete",
  "output": "Added rate limiting middleware to src/middleware/ratelimit.ts",
  "files_changed": ["src/middleware/ratelimit.ts"],
  "commit_sha": "abc1234",
  "error": ""
}
```

---

## Usage

```
Agent(subagent_type: "orchestrator", prompt: "add rate limiting to the API in /path/to/project")
```

The orchestrator will ask the two Gate 0 questions before doing anything else.

---

## Relation to superpowers skills

The orchestrator inlines the logic from these skills — you do not need to run them manually:

| Superpowers skill | Equivalent phase |
|------------------|-----------------|
| `/superpowers:brainstorming` | Phase 1 — Clarify intent |
| `/superpowers:writing-plans` | Phase 3 — Plan |
| `/superpowers:executing-plans` | Phase 4 — Implement |
| `/superpowers:requesting-code-review` | Phase 6 — Review |
