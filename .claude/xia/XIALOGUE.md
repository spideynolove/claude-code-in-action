# XIALOGUE — claude-code-in-action

## Current evolved state of A

This repo is a hands-on Claude Code learning environment. It covers MCP server setup (02), hook-based auto-simplification (03), multi-agent UI pipelines (04), portable dotfiles and agent/skill systems (05), GitHub Actions integration (06), voice input (07), CLAUDE.md meta-instruction tuning (08), personal workflow kit assembly from gstack + ecc-tools (09), GitNexus code intelligence (10), and the Xỉa comparative borrowing methodology (11).

After borrowing from `claude-howto` (2026-03-25), A now also covers: slash commands as skills (12), the CLAUDE.md memory hierarchy including auto-memory (13), checkpoint/rewind safe experimentation workflow (14), CLI mastery including print mode / JSON output / CI/CD integration (15), plugin bundling and distribution (16), and a consolidated advanced features module covering planning mode, permission modes, extended thinking, worktrees, sandboxing, background tasks, and agent teams (17).

Advanced hook types (Stop, Notification, SubagentStop, PreCompact) are in 03-auto-simplify and 12-hooks-in-deep. Five context engineering SKILL.md files have been added (18–22): context-engineering (fundamentals + degradation + compression + optimization collapsed into one reference), filesystem-context (scratch pad + plan persistence + sub-agent communication patterns), memory-systems (framework comparison: Mem0/Graphiti/Letta/Cognee + decision ladder), evaluation (LLM-as-judge + bias mitigation + 95%-variance finding), and tool-design (consolidation principle + MCP naming sharp edge + architectural reduction). All five install to ~/.claude/skills/.

After borrowing from `claude-code-cookbook` (2026-03-25), A now also covers: Token Efficiency Mode (24) — a prompt-level symbol+abbreviation compression protocol that compresses Claude's prose responses by 30–50% during long sessions, complementing the tool-output-level context engineering in 18–22. The role system (security/architect/analyzer/reviewer/frontend/backend/mobile/qa/performance roles + /role-debate pattern) is added as a supplement to 05-subagents, giving learners a concrete Evidence-First role-dispatch model with structured debate protocols.

---

## Borrow history

| Date | Source | Pattern | Gap filled | Saved to |
|------|--------|---------|------------|----------|
| 2026-03-24 | disler/claude-code-hooks-mastery | Advanced hook types (Stop, Notification, SubagentStop, PreCompact) | No Stop/Notification/SubagentStop/PreCompact hooks; stop_hook_active trap unknown | .claude/xia/patterns/xia-claude-code-hooks-mastery-advanced-hooks.md |
| 2026-03-25 | 00-materials/claude-howto | feature-taxonomy-6modules | 6 missing Claude Code feature modules (slash commands, memory, checkpoints, CLI mastery, plugins, advanced features) | .claude/xia/patterns/xia-claude-howto-feature-taxonomy.md |
| 2026-03-25 | agent-skills-for-context-engineering (local) | 5 context engineering SKILL.md files (18–22) | No context theory, no filesystem-context patterns, no memory systems comparison, no evaluation framework, no tool design principles | .claude/xia/patterns/xia-agent-skills-context-engineering.md |
| 2026-03-25 | wasabeef/claude-code-cookbook | Token Efficiency Mode (24) | No prompt-level response compression protocol; context engineering (18–22) only covered tool-output level | .claude/xia/patterns/xia-claude-code-cookbook-token-efficiency.md |
| 2026-03-25 | wasabeef/claude-code-cookbook | Role system + role-debate (05-subagents supplement) | No /role command pattern; no Evidence-First role-dispatch model; no structured debate protocol | .claude/xia/patterns/xia-claude-code-cookbook-role-system.md |
