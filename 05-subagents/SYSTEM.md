# 05-subagents System Reference

Single source of truth for the agent + command taxonomy. Read this before spawning any agent or running any command in a project that has this dotfiles system installed.

---

## Two-Tier Agent Taxonomy

Agents split into two tiers with different purposes, different callers, and different lifecycles.

| Tier | Purpose | Who invokes | Naming |
|------|---------|-------------|--------|
| **1 — Pipeline** | Workflow machinery. Run a phase of the coding pipeline. | `orchestrator` spawns them programmatically | Plain noun: `orchestrator`, `codebase-analyst`, `task-runner`, `mcp-manager` |
| **2 — Role persona** | Specialized analysis mode. Evidence-First focused review. | User invokes via `/role <name>` command | `role-` prefix: `role-security`, `role-architect`, `role-reviewer`, `role-analyzer` |

### Tier 1 — Pipeline Agents

| Agent | Spawned by | Does |
|-------|-----------|------|
| `orchestrator` | User (entry point) | Runs Gate 0 team setup → 6 phases: clarify → analyze → plan → implement → test → review |
| `codebase-analyst` | `orchestrator` Phase 2 | Packs repo with repomix, runs sequential-thinking branches, stores findings in `.aim/` |
| `task-runner` | `orchestrator` Phases 3–6 | Receives role+tool+task, shells out to assigned CLI (deepseek/qwen/glm/codex/kimi/gemini), writes `.aim/results/<id>.json` |
| `mcp-manager` | Any agent that needs an MCP call without polluting its context | Runs `npx mcporter call` and returns result. Does NOT do CLI delegation — use task-runner for that. |

### Tier 2 — Role Persona Agents

Invoked via `/role <name>`. Activate a specialized Claude analysis persona in the current session, or as an independent sub-agent with `--agent` flag.

| Agent | Model | Specialization |
|-------|-------|---------------|
| `role-security` | opus | OWASP / LLM security / STRIDE threat modeling / CVE matching |
| `role-architect` | opus | System design / ADR / MECE trade-off analysis / evolutionary architecture |
| `role-reviewer` | sonnet | Code quality / Clean Code / style guide compliance / MECE review |
| `role-analyzer` | opus | Root cause / 5 Whys + counter-evidence / systems thinking / cognitive bias elimination |

**"Reviewer" is not the same in both tiers:**
- `task-runner role=reviewer` — external CLI (codex/qwen) doing a diff review as a pipeline step
- `role-reviewer` — Claude sub-agent doing Evidence-First code quality analysis as an analysis persona

These serve different needs. Use `task-runner` when you want an external tool's perspective inside the pipeline. Use `/role reviewer` when you want deep Claude-native analysis outside the pipeline.

---

## Command Groups

Two groups with no naming overlap.

### Group A — Project Onboarding

Run once per new project. `startup` chains the other two.

| Command | Does |
|---------|------|
| `/startup` | Chains A→B→C: build knowledge graph, generate CLAUDE.md, detect team. Skips phases already complete. |
| `/init-project` | Generates `CLAUDE.md` via external CLI (codex → qwen → kimi fallback chain) |
| `/detect-team` | Detects project type from file signals, proposes role-to-CLI assignments, writes `.aim/roles.json` |

### Group B — Analysis Mode

Use any time for focused analysis. Independent of the pipeline.

| Command | Does |
|---------|------|
| `/role <name> [--agent]` | Activates a Tier 2 role persona. `--agent` spawns it with independent context. |
| `/role-debate <r1>,<r2> [topic]` | 4-phase structured debate between two roles (position → rebuttal → compromise → conclusion) |

**"Role" disambiguation:**
- In `/role` and `/role-debate` — *role* means a Tier 2 analysis persona (Claude sub-agent)
- In `/detect-team` and `team.json` — *role* means a task assignment (planner/coder/tester/reviewer → external CLI)

---

## `.aim/` Schema

Written by pipeline agents, read by successor agents and commands.

| File | Written by | Contains |
|------|-----------|----------|
| `.aim/team.json` | `orchestrator` Gate 0 | task_type, active_roles, roster (role → CLI mapping) |
| `.aim/roles.json` | `/detect-team` | project_type, roles array with id + preferred_tool + task_types |
| `.aim/results/<id>.json` | `task-runner` | task_id, role, tool, status, output, files_changed, commit_sha, error |
| `.aim/memory.jsonl` | `codebase-analyst` | knowledge graph entities and relations |

---

## Install

```bash
cd 05-subagents
bash install.sh
cp .claude/settings.json ~/.claude/settings.json
# Edit settings.json — replace absolute paths with paths for this machine
```

`install.sh` symlinks into `~/.claude/`:
- `agents/*.md` → `~/.claude/agents/`
- `skills/*/SKILL.md` → `~/.claude/skills/`
- `commands/*.md` → `~/.claude/commands/`
- `hooks/*` → `~/.claude/hooks/`
- `CLAUDE.md` → `~/.claude/CLAUDE.md`

`settings.json` is NOT symlinked — copy and edit paths manually per machine.
