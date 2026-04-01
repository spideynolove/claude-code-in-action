# Module 30 — Plan Lifecycle

Borrowed from: humanlayer/humanlayer (.claude/commands/)

A 4-command plan pipeline for spec-driven development:

```
create_plan → iterate_plan → implement_plan → validate_plan
```

## Commands

| Command | Purpose |
|---|---|
| `/create_plan` | Skeptical, interactive plan creation with parallel research |
| `/iterate_plan` | Surgical plan updates grounded in codebase reality |
| `/implement_plan` | Phase-by-phase execution with checkbox tracking and human gates |
| `/validate_plan` | Post-implementation audit against plan success criteria |

## Key Patterns

- **Automated vs Manual success criteria** — every phase has both categories
- **"What We're NOT Doing"** — explicit scope boundary in every plan
- **Stop on mismatch** — implement_plan halts and asks when reality diverges from plan
- **Human gate after each phase** — no auto-proceed on manual verification items
- **Checkbox tracking** — plan file updated in-place as phases complete

## Plan File Location

`.claude/plans/YYYY-MM-DD-description.md`

## Plan Template

See `plan-template.md` in this directory.
