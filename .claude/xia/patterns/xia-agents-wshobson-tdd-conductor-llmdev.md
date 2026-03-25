---
source: https://github.com/wshobson/agents
extracted: 2026-03-25
---

# TDD Orchestration + Conductor + LLM Dev Skills from wshobson/agents

**Gap filled:** No stateful TDD orchestration workflow; no multi-track project management; no LLM-application specific skills
**Constraints applied:** No comments, no docstrings; copied markdown commands/skills verbatim (no code to strip)

## Pattern 1: tdd-cycle command

6-phase TDD orchestration using filesystem-as-working-memory. Each phase writes `.tdd-cycle/NN-step.md`; next agent reads it. 4 user-approval checkpoints. Resumable via `state.json`. Supports `--incremental` (one test at a time) and `--suite` (full suite) modes.

## Pattern 2: conductor plugin

Multi-track project management with `conductor/` directory as state store. Tracks have spec.md + plan.md + metadata.json. Commands: setup, new-track, implement, status, manage, revert.

## Pattern 3: llm-application-dev skills

8 progressive disclosure SKILL.md files: prompt-engineering-patterns, rag-implementation, embedding-strategies, hybrid-search-implementation, similarity-search-patterns, vector-index-tuning, langchain-architecture, llm-evaluation.

## Seam

`27-tdd-conductor-llmdev/.claude/commands/` — 7 commands
`27-tdd-conductor-llmdev/.claude/agents/` — 3 agents (tdd-orchestrator, code-reviewer, conductor-validator)
`27-tdd-conductor-llmdev/.claude/skills/` — 8 skill directories

## Delta from original

- Grouped three separate plugins into one learning module
- No code changes (all markdown); structure preserved exactly
- tdd-red/green/refactor subcommands omitted (tdd-cycle covers full workflow)
