# XIALOGUE — claude-code-in-action

## Current evolved state of A

A now covers the full Claude Code hook lifecycle, MCP servers, sub-agents, GitHub Actions, voice input, custom commands, superpowers analysis, code intelligence (GitNexus), and the Xỉa borrowing workflow. Five context engineering SKILL.md files have been added (18–22): context-engineering (fundamentals + degradation + compression + optimization collapsed into one reference), filesystem-context (scratch pad + plan persistence + sub-agent communication patterns), memory-systems (framework comparison: Mem0/Graphiti/Letta/Cognee + decision ladder), evaluation (LLM-as-judge + bias mitigation + 95%-variance finding), and tool-design (consolidation principle + MCP naming sharp edge + architectural reduction). All five install to ~/.claude/skills/. Advanced hook types (Stop, Notification, SubagentStop, PreCompact) are in 03-auto-simplify and 12-hooks-in-deep.

---

## Borrow history

| Date | Source | Pattern | Gap filled | File |
|------|--------|---------|------------|------|
| 2026-03-24 | disler/claude-code-hooks-mastery | Advanced hook types (Stop, Notification, SubagentStop, PreCompact) | No Stop/Notification/SubagentStop/PreCompact hooks; stop_hook_active trap unknown | .claude/xia/patterns/xia-claude-code-hooks-mastery-advanced-hooks.md |
| 2026-03-25 | agent-skills-for-context-engineering (local) | 5 context engineering SKILL.md files (18–22) | No context theory, no filesystem-context patterns, no memory systems comparison, no evaluation framework, no tool design principles | .claude/xia/patterns/xia-agent-skills-context-engineering.md |
