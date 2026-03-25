# XIALOGUE — claude-code-in-action

## Current evolved state of A

This repo is a hands-on Claude Code learning environment. It covers MCP server setup (02), hook-based auto-simplification (03), multi-agent UI pipelines (04), portable dotfiles and agent/skill systems (05), GitHub Actions integration (06), voice input (07), CLAUDE.md meta-instruction tuning (08), personal workflow kit assembly from gstack + ecc-tools (09), GitNexus code intelligence (10), and the Xỉa comparative borrowing methodology (11).

After borrowing from `claude-howto` (2026-03-25), A now also covers: slash commands as skills (12), the CLAUDE.md memory hierarchy including auto-memory (13), checkpoint/rewind safe experimentation workflow (14), CLI mastery including print mode / JSON output / CI/CD integration (15), plugin bundling and distribution (16), and a consolidated advanced features module covering planning mode, permission modes, extended thinking, worktrees, sandboxing, background tasks, and agent teams (17).

Advanced hook types (Stop, Notification, SubagentStop, PreCompact) are in 03-auto-simplify and 23-hooks-in-deep. Five context engineering SKILL.md files have been added (18–22): context-engineering (fundamentals + degradation + compression + optimization collapsed into one reference), filesystem-context (scratch pad + plan persistence + sub-agent communication patterns), memory-systems (framework comparison: Mem0/Graphiti/Letta/Cognee + decision ladder), evaluation (LLM-as-judge + bias mitigation + 95%-variance finding), and tool-design (consolidation principle + MCP naming sharp edge + architectural reduction). All five install to ~/.claude/skills/.

Module 25-autoresearch (2026-03-25) borrows the full autoresearch plugin from uditgoenka/autoresearch: the autonomous Modify→Verify→Keep/Discard→Repeat loop (SKILL.md + autonomous-loop-protocol + results-logging), multi-persona swarm prediction (/autoresearch:predict — 5 personas, structured debate, anti-herd detection), autonomous security audit (/autoresearch:security — STRIDE + OWASP + 4 adversarial personas), scenario exploration engine (/autoresearch:scenario — 12 dimensions), and universal shipping workflow (/autoresearch:ship — 8-phase dry-run/rollback). The learn workflow (/autoresearch:learn) is deferred — preconditions and expected output documented in 25-autoresearch/PLAN.md.

Module 27-tdd-conductor-llmdev (2026-03-25) borrows three patterns from wshobson/agents: (1) `tdd-cycle` — a 6-phase stateful TDD orchestration command using filesystem-as-working-memory (.tdd-cycle/*.md), 4 user-approval checkpoints, and incremental/suite modes; (2) `conductor` — multi-track project management with conductor/tracks/ filesystem state and 6 commands (setup/new-track/implement/status/manage/revert); (3) 8 llm-application-dev SKILL.md files extending context engineering into applied LLM territory: prompt-engineering-patterns, RAG implementation, embedding strategies, hybrid search, similarity search, vector-index tuning, LangChain architecture, and LLM evaluation.

Module 26-security-quality-hooks (2026-03-25) borrows 5 PreToolUse hooks from davila7/claude-code-templates: secret-scanner (35+ regex patterns blocking commits with hardcoded secrets), dangerous-command-blocker (3-level guard: catastrophic/critical-path/suspicious), conventional-commits (denies non-conventional commit messages via JSON permissionDecision), tdd-gate (blocks production code edits without a corresponding test file), and plan-gate (non-blocking warning when editing source without recent .spec.md). These form a defense-in-depth policy enforcement layer at the agent boundary.

---

## Borrow history

| Date | Source | Pattern | Gap filled | Saved to |
|------|--------|---------|------------|----------|
| 2026-03-24 | disler/claude-code-hooks-mastery | Advanced hook types (Stop, Notification, SubagentStop, PreCompact) | No Stop/Notification/SubagentStop/PreCompact hooks; stop_hook_active trap unknown | .claude/xia/patterns/xia-claude-code-hooks-mastery-advanced-hooks.md |
| 2026-03-25 | 00-materials/claude-howto | feature-taxonomy-6modules | 6 missing Claude Code feature modules (slash commands, memory, checkpoints, CLI mastery, plugins, advanced features) | .claude/xia/patterns/xia-claude-howto-feature-taxonomy.md |
| 2026-03-25 | agent-skills-for-context-engineering (local) | 5 context engineering SKILL.md files (18–22) | No context theory, no filesystem-context patterns, no memory systems comparison, no evaluation framework, no tool design principles | .claude/xia/patterns/xia-agent-skills-context-engineering.md |
| 2026-03-25 | uditgoenka/autoresearch | autonomous-loop (core loop + results logging) | No Modify→Verify→Keep/Discard→Repeat loop; no bounded iteration; no git-as-memory; no TSV results log | .claude/xia/patterns/xia-autoresearch-uditgoenka-autonomous-loop.md |
| 2026-03-25 | uditgoenka/autoresearch | predict + security + scenario + ship subcommands | No multi-persona swarm prediction; no STRIDE+OWASP audit; no scenario exploration; no shipping workflow | .claude/xia/patterns/xia-autoresearch-uditgoenka-subcommands.md |
| 2026-03-25 | wshobson/agents | tdd-cycle + conductor + llm-application-dev skills | No stateful TDD orchestration; no multi-track project management; no LLM app skills | .claude/xia/patterns/xia-agents-wshobson-tdd-conductor-llmdev.md |
| 2026-03-25 | davila7/claude-code-templates | security-quality-hooks (5 hooks) | No secret scanning, no dangerous command blocking, no TDD gate, no conventional commits enforcement, no plan-gate | .claude/xia/patterns/xia-claude-code-templates-security-quality-hooks.md |
