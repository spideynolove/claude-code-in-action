# XIALOGUE — claude-code-in-action

## Current evolved state of A

A now covers the full Claude Code hook lifecycle: PostToolUse (edit counter), UserPromptSubmit (gate + context loader), SessionStart (03-auto-simplify), PreToolUse (gitnexus), Stop (session end log + stop_hook_active guard), Notification (notify-send desktop alert), SubagentStop (agent transcript task extraction → JSONL log), and PreCompact (transcript backup before /compact). The stop_hook_active infinite-loop trap has been explicitly practiced. Advanced hook types are split across 03-auto-simplify (session-scoped, low-dep) and 12-hooks-in-deep (multi-agent + compaction-aware).

---

## Borrow history

| Date | Source | Pattern | Gap filled | File |
|------|--------|---------|------------|------|
| 2026-03-24 | disler/claude-code-hooks-mastery | Advanced hook types (Stop, Notification, SubagentStop, PreCompact) | No Stop/Notification/SubagentStop/PreCompact hooks; stop_hook_active trap unknown | .claude/xia/patterns/xia-claude-code-hooks-mastery-advanced-hooks.md |
