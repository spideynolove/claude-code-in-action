# 28 — Continuous Patterns (from continuous-claude-v3)

Three patterns for session continuity and self-improvement.

## 1. create-handoff skill (`.claude/skills/create-handoff/SKILL.md`)

YAML handoff format — ~400 tokens vs ~2000 for markdown.

```yaml
goal: what this session accomplished
now: what next session should do first
test: pytest tests/test_foo.py
done_this_session:
  - task: implemented X
    files: [src/x.py]
blockers: []
questions: []
```

Stored in `thoughts/shared/handoffs/{session-name}/YYYY-MM-DD_HH-MM_description.yaml`.

## 2. auto-handoff-stop hook (`.claude/hooks/auto-handoff-stop.py`)

Stop hook — reads context% from `/tmp/claude-context-pct-{session_id}.txt` (written by statusline).
Blocks at 85%+ with message: `"Context at N%. Run: /create-handoff"`.

Requires statusline to write the temp file. If file absent, does not block.

## 3. compound-learnings skill (`.claude/skills/compound-learnings/SKILL.md`)

Self-improvement loop: reads `.claude/cache/learnings/*.md` → extracts patterns → proposes skills/rules/hooks/agent updates.

Decision tree:
- Sequence of steps → Skill
- Runs on event automatically → Hook
- "When X do Y" heuristic → Rule
- Enhances agent workflow → Agent update

Signal threshold: 3+ occurrences = recommend, 4+ = definitely create.

## Key Insight

The **compound interest analogy** is structural: each session deposits learnings, `compound-learnings` converts deposits into capabilities, capabilities make next sessions more efficient. The loop compounds.
