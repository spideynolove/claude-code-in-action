---
source: 00-materials/repo/agent-skills-for-context-engineering (local)
extracted: 2026-03-25
---

# Context Engineering Skills from agent-skills-for-context-engineering

**Gap filled:** No context engineering theory, no filesystem-context patterns, no memory systems comparison, no evaluation framework, no tool design principles
**Constraints applied:** no comments, no docstrings; each SKILL.md stripped to Claude Code–specific examples; B's generic examples replaced with repo-local references

## Pattern

Five SKILL.md files installed to `~/.claude/skills/`:
- `context-engineering.md` — 4 skills collapsed into 1 (fundamentals + degradation + compression + optimization)
- `filesystem-context.md` — 6 patterns: scratch pad, plan persistence, sub-agent files, dynamic skill loading, log persistence, self-modification
- `memory-systems.md` — framework comparison table + decision ladder + temporal validity pattern
- `evaluation.md` — LLM-as-judge template + bias catalogue + 95% variance finding + PostToolUse hook sketch
- `tool-design.md` — consolidation principle + MCP naming + architectural reduction + optimization checklist

## Seam

Each SKILL.md is standalone. Install:
```bash
cp 18-context-engineering/SKILL.md ~/.claude/skills/context-engineering.md
cp 19-filesystem-context/SKILL.md ~/.claude/skills/filesystem-context.md
cp 20-memory-systems/SKILL.md ~/.claude/skills/memory-systems.md
cp 21-evaluation/SKILL.md ~/.claude/skills/evaluation.md
cp 22-tool-design/SKILL.md ~/.claude/skills/tool-design.md
```

## Delta from original

- 4 separate context skills → 1 combined SKILL.md (progressive disclosure less relevant in a learning repo)
- All B examples replaced with Claude Code–specific equivalents (CLAUDE.md as system prompt, /compact as compaction trigger, hooks as context controllers)
- memory-systems: kept framework comparison table + decision ladder; dropped code examples (framework-specific APIs)
- evaluation: kept LLM-as-judge template + 95% finding; added PostToolUse hook sketch; dropped pairwise swap protocol detail
- tool-design: kept consolidation + MCP naming + architectural reduction; dropped tool-testing-agent implementation detail
- New folders named 18–22 (18+ reserved range per user instruction, 13–17 reserved for parallel work)
