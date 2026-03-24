# Repo Categorization — 00-materials/repo

58 repos grouped by purpose. Use this to identify overlaps, pick the right source for each Xỉa target, and avoid integrating two repos that solve the same problem.

---

## Config/Settings
Settings, CLAUDE.md defaults, personal configurations.

| Repo | Description |
|------|-------------|
| `claude-code-config-trailofbits` | Opinionated defaults, hooks, skills, MCP servers, and workflows for Claude Code at Trail of Bits with sandboxing and security |
| `claude-code-config-jarrodwatts` | Personal Claude Code configuration with custom settings and organization patterns |
| `claude-code-settings` | Claude Code settings, skills, and sub-agents curated for vibe-based coding style and rapid prototyping |
| `claude-codex-settings` | Settings and configuration templates following Codex integration patterns |
| `tweakcc` | Fine-tuning and customization tools for Claude Code settings |

---

## Skills/Commands
Skill SKILL.md collections, slash command sets, command libraries.

| Repo | Description |
|------|-------------|
| `claude-command-suite` | 216 slash commands, 12 skills, 54 agents, and automated workflows for code review, testing, deployment, and media processing |
| `claude-code-tresor` | World-class collection of 8 autonomous skills, 141 agents, 19 slash commands, and orchestration utilities |
| `claude-code-skill-factory` | Comprehensive toolkit for generating production-ready Claude skills and agents with validation and deployment automation |
| `claude-code-sub-agents` | 33 specialized AI subagents organized by domain (frontend, backend, infra, QA, data, AI, security, business) |
| `claude-code-tools` | Collection of tools and utilities extending Claude Code functionality |
| `claude-delegator` | GPT expert subagents for architecture, security, testing, and documentation |
| `agent-skills` | Curated agent skills library for improving development workflows |
| `agent-toolkit` | Softaworks agent skills for AI-assisted development |
| `ai-agent-skills` | AI agent skills library for extending Claude Code capabilities |
| `commands` | Comprehensive collection of Claude Code slash commands |
| `dotai` | Dot AI integration tools and utilities |
| `grepai` | Code search and analysis tool for Claude Code workflows |
| `opc-skills` | 10 skills for solopreneurs: SEO, domain hunting, logo creation, research across 16+ AI tools |
| `skillshare` | Skill sharing platform and collection for Claude Code agents |
| `skillforge` | Skill creation framework and methodology for building Claude Code skills |
| `claude-devtools` | Developer tools and utilities extending Claude Code |
| `lenny-skills` | Product management skills: product analysis and planning |
| `skill-codex` | Comprehensive codex of Claude Code skills organized by category |
| `tutor-skills` | Tutoring and educational skills for Claude Code |

> **Conflicts to watch:** `agent-skills`, `ai-agent-skills`, `agent-toolkit`, `opc-skills`, `skillshare` all provide generic skill collections — high overlap risk. Pick one as canonical source.

---

## Agent Frameworks
Orchestrator patterns, multi-agent systems, agentic loops.

| Repo | Description |
|------|-------------|
| `claude-forge` | Complete dev environment: 11 agents, 40 commands, 15 skills, 15 hooks, 9 rule files |
| `claude-sub-agent` | AI-driven development workflow system with multi-phase orchestration built on sub-agents |
| `spec-kitty` | Spec-driven development CLI for AI coding agents: artifact generation, work packages, git worktrees, 12 AI agent support |
| `ralph-orchestrator` | Hat-based orchestration framework in Rust: keeps agents iterating until tasks complete (planning, memories, tasks) |
| `claude-bootstrap` | Project initialization with agent teams, strict TDD pipeline, multi-engine code review, code graph MCP, security-first |
| `buildwithclaude` | Build-with-Claude framework for rapid application development |
| `open-ralph-wiggum` | Autonomous agentic loop for Claude Code supporting multiple backends |
| `ouroboros` | Self-referential agent loop enabling agents to modify their own behavior |
| `symbiotic-ai` | Turn conversations into clear next steps and persistent systems |

> **Conflicts to watch:** `ralph-orchestrator` and `open-ralph-wiggum` appear to be related (Ralph family). `claude-sub-agent` and `claude-bootstrap` both offer orchestration-with-TDD — likely overlap.

---

## Memory/Context
Memory systems, context management, knowledge persistence.

| Repo | Description |
|------|-------------|
| `memsearch` | Markdown-first semantic memory search with persistent knowledge graph, vector DB, and Claude Code plugin |
| `codebase-memory-mcp` | Fast code intelligence engine: 28M LOC in 3 min, 66 languages, knowledge graph, 14 MCP tools |

---

## Workflow Automation
CI/CD hooks, safety guards, automation pipelines, workflow templates.

| Repo | Description |
|------|-------------|
| `claude-code-safety-net` | Safety guards and quality enforcement preventing destructive operations and enforcing best practices |
| `claude-code-workflow` | Project starter template for Claude Code-based development |
| `claude-workflow-v2` | Second-generation workflow system for Claude Code development |
| `pro-workflow` | Battle-tested Claude Code workflows with self-correcting memory, parallel worktrees, and validation |
| `tdd-guard` | TDD enforcement tool preventing code merges without passing tests |

> **Conflicts to watch:** `claude-code-workflow` and `claude-workflow-v2` are likely v1/v2 of the same project. `pro-workflow` may supersede both.

---

## MCP Servers/Tools
MCP server implementations, protocol bridges.

| Repo | Description |
|------|-------------|
| `cclsp` | MCP server bridging LSP with MCP for AI-assisted code navigation and refactoring |
| `mcpdoc` | MCP server for llms.txt documentation fetch — AI agents access project docs from trusted sources |
| `claude-agent-server` | WebSocket server for Claude agents enabling real-time communication |
| `jcodemunch-mcp` | MCP server for code analysis and understanding codebase structure |

---

## Learning/Reference
Guides, cheat sheets, awesome lists, reverse-engineering references.

| Repo | Description |
|------|-------------|
| `claude-code-cheat-sheet` | Quick reference guide for Claude Code features, commands, and best practices |
| `claude-code-ultimate-guide` | Complete guide covering Claude Code features, workflows, and advanced usage |
| `awesome-claude-code-toolkit` | Most comprehensive toolkit: 135 agents, 35 skills, 42 commands, 150+ plugins, hooks, rules, MCP configs, templates |
| `reverse-api-engineer` | Tools and techniques for reverse-engineering APIs for integration with Claude Code |
| `claude-replay` | Browser automation and replay framework for testing Claude Code actions |
| `obsidian-agent-client` | Agent client plugin for Obsidian for AI-assisted knowledge management |
| `obsidian-claude-pkm` | Obsidian plugin for Claude Code integration with personal knowledge management |

> **Conflicts to watch:** `obsidian-agent-client` and `obsidian-claude-pkm` both target Obsidian — likely overlapping scope.

---

## Domain-specific
Repos targeting a specific tech stack, platform, or problem domain.

| Repo | Domain | Description |
|------|--------|-------------|
| `claude-bug-bounty` | Security/Bug Bounty | 7 skills, 8 commands, 5 agents, Web2/Web3 vulnerability classes for professional bug bounty |
| `ctf-skills` | Security/CTF | Agent skills for CTF challenges: web exploitation, binary pwn, crypto |
| `claude-code-ios-dev-guide` | iOS Dev | Comprehensive guide for Claude Code CLI for iOS development with PRD-driven workflows |
| `godogen` | Game Dev (Godot) | Claude Code skills that build complete Godot 4 projects from specifications |
| `aws-agent-skills` | AWS/Cloud | AWS-specific agent skills for cloud infrastructure and deployment automation |
| `terraform-skill` | Infrastructure | Terraform skill for infrastructure-as-code development and deployment |

---

## Summary

| Category | Count | Key conflict zones |
|----------|-------|--------------------|
| Config/Settings | 5 | All are personal configs — additive, low conflict |
| Skills/Commands | 19 | High overlap across generic skill collections |
| Agent Frameworks | 9 | ralph-orchestrator ↔ open-ralph-wiggum; claude-sub-agent ↔ claude-bootstrap |
| Memory/Context | 2 | Different layers (search vs code graph) — complementary |
| Workflow Automation | 5 | claude-code-workflow ↔ claude-workflow-v2 (v1/v2 pair) |
| MCP Servers/Tools | 4 | Different protocols — additive |
| Learning/Reference | 7 | obsidian-agent-client ↔ obsidian-claude-pkm |
| Domain-specific | 6 | No cross-domain conflicts |
| **Total** | **57** | |

> Note: `skillshare` counted in Skills/Commands; total is 57 unique categorized entries + 1 (`skillshare`) shared.

---

## `/xia` Session Order

### Two axes, one constraint

**Importance** = how much value the category adds to A's *current* gaps (not generic value).
**Difficulty** = integration complexity: number of repos to compare, structural conflicts with existing A, and risk of breaking existing patterns.

**The constraint**: Agent Frameworks must come *after* Skills/Commands — agents *call* skills, so the skill library must be settled before deciding what's missing from the orchestration layer.

### A's current gap map

A is strong on: hooks, context engineering (18–22), memory theory (13, 20), GitHub Actions, CLI mastery, plugins, checkpoints, advanced features, role system.

A is thin on: actual skill content, workflow safety patterns, MCP bridge tooling, sophisticated multi-agent orchestration.

### Recommended order

| Round | Category | Repos | Why |
|-------|----------|-------|-----|
| 1 | **Memory/Context** | 2 | Smallest within-group (2 repos = fast). Extends the existing 18–22 cluster with practical tooling (memsearch = search layer, codebase-memory-mcp = code graph). Low risk, no conflicts. |
| 2 | **Workflow Automation** | 5 | `pro-workflow` is the likely canonical winner (self-correcting memory + parallel worktrees). `claude-code-safety-net` is additive. Neither conflicts with existing hook/GitHub Actions modules. Medium difficulty, high payoff. |
| 3 | **Config/Settings** | 5 | Low difficulty. `claude-code-config-trailofbits` is the standout (security-focused, hooks + MCP + sandboxing). Extracting its patterns here gives better defaults to apply when skills and agents are integrated later. |
| 4 | **MCP Servers/Tools** | 4 | Small group, clear differentiation: `cclsp` (LSP bridge) and `codebase-memory-mcp` fill different niches than A's existing MCP setup (02). Medium difficulty — needs care not to duplicate 02. |
| 5 | **Skills/Commands** | 19 | Biggest group. Within-group comparison collapses 19 → 2–3 candidates. High importance because A's skill library is thin. Do *after* Config/Settings so baseline is known before applying borrowed skills. |
| 6 | **Agent Frameworks** | 9 | Highest difficulty — direct structural overlap with 05-subagents. By Round 6 the skill library is settled, so what's missing from the orchestration layer is clear. `spec-kitty` and `claude-bootstrap` are likely candidates vs. the `ralph-orchestrator` family. |
| 7 | **Learning/Reference** | 7 | Mainly gap-checking. `awesome-claude-code-toolkit` is a completeness audit — run it last to catch anything missed in Rounds 1–6. `claude-replay` is the only unique pattern (browser replay for testing). |
| 8 | **Domain-specific** | 6 | Optional. None address A's core learning focus. Only touch if a specific domain becomes relevant (e.g., `ctf-skills` if security modules are added). |

### Key sequencing decisions

**Memory/Context first** — smallest comparison surface (2 repos), lowest disruption risk, directly extends existing work.

**Skills/Commands at Round 5, not earlier** — 19 repos is the heaviest within-group pass. Doing it after Config/Settings means the baseline is already known, which speeds up evaluation.

**Agent Frameworks last among high-value categories** — most destructive potential if done wrong (conflicts with 05-subagents). Doing it last means A is otherwise stable and one well-informed surgical change is made.

**Domain-specific skippable** — each is a self-contained silo. Order within Round 8 doesn't matter; skip entirely unless a specific domain becomes a learning target.
