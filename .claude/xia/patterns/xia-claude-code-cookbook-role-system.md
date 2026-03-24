---
name: xia-claude-code-cookbook-role-system
source: https://github.com/wasabeef/claude-code-cookbook
extracted: 2026-03-25
---

# Role System + Role-Debate — Xỉa from claude-code-cookbook

**Source**: wasabeef/claude-code-cookbook (local: 00-materials/claude-code-cookbook)
**Extracted**: 2026-03-25
**Gap filled**: A had agent dispatch (orchestrator/task-runner) but no /role command pattern — no way to activate a specialized analysis persona on-demand. No structured debate protocol for trade-off decisions.

## What this is

A two-part pattern:
1. `/role <name> [--agent]` — activates an Evidence-First specialized agent (security/architect/reviewer/analyzer) either in-session or as an independent sub-agent
2. `/role-debate <r1>,<r2> [topic]` — 4-phase structured debate (position → rebuttal → compromise → conclusion) for resolving trade-offs between domains

Each role has: key check areas, MECE analysis method, standardized report format, trigger phrases, and documented biases (so you know how to weight its output).

## Why it fills A's gap

The orchestrator in 05-subagents is optimized for multi-phase coding tasks. Roles fill the complementary gap: single-domain deep analysis and cross-domain trade-off resolution. Both patterns are now available from the same dotfiles install.

## The pattern

Agent frontmatter: `name`, `description`, `model` (opus for deep analysis, sonnet for review), `tools`.
Role body: purpose → key check areas → method → report format → trigger phrases → debate stance.
Role-debate: 4 fixed phases with output templates. Debate characteristics (stance + biases) documented per role.

## How to apply here

- 4 role agent files in `05-subagents/.claude/agents/role-*.md` (symlinked by install.sh)
- 2 commands in `05-subagents/.claude/commands/role.md` and `role-debate.md` (symlinked by updated install.sh)
- `05-subagents/roles-supplement.md` documents how roles relate to the existing agent team

## Original context

B used 9 roles across a plugin marketplace (300+ lines each). A adapts 4 representative roles (security/architect/reviewer/analyzer) stripped to ~50 lines each — the minimum viable pattern for teaching the Evidence-First role concept.
