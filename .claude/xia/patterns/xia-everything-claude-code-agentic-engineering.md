---
source: https://github.com/affaan-m/everything-claude-code
extracted: 2026-03-25
---

# Agentic Engineering Skill from everything-claude-code

**Gap filled:** No eval-first loop, no 15-minute unit rule, no model routing heuristic
**Constraints applied:** Copied verbatim (markdown only)

## Pattern

Four principles:
1. **Eval-first loop**: define capability + regression eval → baseline → implement → re-run → compare deltas
2. **15-minute unit rule**: each task unit must be independently verifiable, single dominant risk, clear done condition
3. **Model routing**: Haiku=classification/boilerplate, Sonnet=implementation/refactors, Opus=architecture/root-cause/multi-file
4. **Session strategy**: continue for coupled units, fresh session after phase transitions, compact after milestones

## Seam

`29-skill-authoring/.claude/skills/agentic-engineering/SKILL.md`

## Delta from original

- Added to 29-skill-authoring alongside skill-security-auditor (thematically related meta-skills)
- rules-distill, platform-specific skills, AgentShield skipped
