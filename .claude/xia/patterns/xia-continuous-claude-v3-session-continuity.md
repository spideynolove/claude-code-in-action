---
source: https://github.com/PlatformerAI/continuous-claude-v3
extracted: 2026-03-25
---

# Session Continuity Patterns from continuous-claude-v3

**Gap filled:** Token-heavy markdown handoffs; no context% auto-stop; no session→permanent learning loop
**Constraints applied:** No docstrings, no comments; adapted auto-handoff-stop.py to plain python3 (removed uv script header)

## Pattern 1: YAML handoff (create-handoff skill)

Compact YAML format (~400 tokens vs ~2000 markdown). Fields: goal, now, test, done_this_session, blockers, questions. Stored in `thoughts/shared/handoffs/{session}/YYYY-MM-DD_HH-MM_desc.yaml`.

## Pattern 2: auto-handoff-stop (Stop hook)

Reads context% from `/tmp/claude-context-pct-{session_id}.txt`. Blocks at 85%+ with JSON `{"decision": "block", "reason": "..."}`. Guards against `stop_hook_active` recursion.

## Pattern 3: compound-learnings skill

Reads `.claude/cache/learnings/*.md` → frequency table → categorize (skill/hook/rule/agent) → propose with AskUserQuestion → create artifacts. Signal threshold: 3+ occurrences.

## Seam

`28-continuous-patterns/.claude/skills/create-handoff/SKILL.md`
`28-continuous-patterns/.claude/skills/compound-learnings/SKILL.md`
`28-continuous-patterns/.claude/hooks/auto-handoff-stop.py`

## Delta from original

- Removed `uv run` script header from stop hook (A uses plain python3)
- Removed docstrings and inline comments
- `thoughts/shared/handoffs/` path convention kept (A can adopt or rename)
- TLDR, skill-activation-prompt, memory-daemon not borrowed (High friction)
