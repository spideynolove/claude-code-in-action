---
name: xia-claude-howto-feature-taxonomy
source: 00-materials/claude-howto (local reference material)
extracted: 2026-03-25
---

# Feature Taxonomy — Xỉa from claude-howto

**Source**: 00-materials/claude-howto
**Extracted**: 2026-03-25
**Gap filled**: Six Claude Code feature areas that A lacked dedicated learning modules for

## What this is

A 10-section learning taxonomy for Claude Code features, structured in dependency order: slash commands → memory → skills → subagents → MCP → hooks → plugins → checkpoints → advanced features → CLI mastery.

## Why it fills A's gap

A organized modules around use-case demos (a Next.js project, a UI pipeline, a voice interface) rather than feature-first teaching. Learners could use the features implicitly but had no single place to understand what each feature is, how it works, or when to use it. B provided the missing feature-first structure.

## The pattern

B's learning order (based on dependency + frequency of use):
1. Slash commands — immediate wins, no prerequisites
2. Memory — foundational, everything else builds on it
3. Skills — extends commands with auto-invocation
4. Subagents — delegation (needs memory + commands first)
5. MCP — live data integration (needs config understanding)
6. Hooks — event-driven automation (needs tool understanding)
7. Checkpoints — safe experimentation (standalone)
8. CLI mastery — scripting + CI/CD (needs print mode concept)
9. Plugins — bundling everything (needs all prior features)
10. Advanced features — power tools (needs all prior features)

## How it was applied

Six new folders added to A matching the gaps:
- `12-slash-commands` — custom commands as skills, 3 examples (debug, standup, review)
- `13-memory` — CLAUDE.md hierarchy, rules/, auto-memory, @imports
- `14-checkpoints` — branch-and-compare pattern, Esc+Esc, rewind options
- `15-cli-mastery` — print mode, JSON output, piping, session management, CI/CD workflow
- `16-plugins` — plugin structure, manifest, example quality-gate plugin with command+agent+hook
- `17-advanced-features` — planning mode, permission modes, extended thinking, worktrees, sandboxing, background tasks, agent teams

## Original context

claude-howto uses these 10 sections as a progressive learning curriculum with milestones (Level 1 Beginner → Level 2 Intermediate → Level 3 Advanced). A kept its hands-on demo style but adopted the feature-first organization for the new folders.
