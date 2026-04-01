# Pattern: Plan Lifecycle (create → iterate → implement → validate)

**Source:** humanlayer/humanlayer (.claude/commands/)
**Date:** 2026-03-25
**Gap filled:** No structured plan pipeline; implementation started without formal spec; no post-implementation validation

## What B had

Four tightly coupled commands forming a complete spec-driven development loop:

1. **create_plan** — Skeptical, interactive plan creation using parallel research agents. Presents design options, gets buy-in on phasing, writes to `plans/YYYY-MM-DD-description.md` with explicit automated + manual success criteria and "What We're NOT Doing" section.

2. **iterate_plan** — Surgical plan updates grounded in codebase research. Confirms understanding before touching the file; uses Edit not rewrite; maintains automated/manual criteria split.

3. **implement_plan** — Phase-by-phase execution with checkbox tracking in the plan file itself. Stops and reports when reality diverges from plan. After each phase's automated checks pass, pauses and lists manual verification steps for human confirmation before proceeding.

4. **validate_plan** — Post-implementation audit. Runs every automated criterion, generates a structured report (✓/⚠️/✗ per phase), lists remaining manual steps, and flags deviations and risks.

## Key principles extracted

- **Automated vs Manual split**: every phase has both; agents run automated, humans confirm manual
- **"What We're NOT Doing"**: explicit scope exclusion prevents scope creep
- **Stop on mismatch**: implement_plan surfaces divergence instead of improvising
- **Checkbox tracking in plan file**: plan is the source of truth for progress
- **No open questions in final plan**: ambiguity must be resolved before sign-off
- **Human gate after each phase**: no auto-proceed through manual verification

## What A got

- `~/.claude/commands/create_plan.md`
- `~/.claude/commands/iterate_plan.md`
- `~/.claude/commands/implement_plan.md`
- `~/.claude/commands/validate_plan.md`
- `30-plan-lifecycle/README.md` + `plan-template.md`
- Plan storage convention: `.claude/plans/YYYY-MM-DD-description.md`

## Adaptations made

- Removed Linear ticket integration (humanlayer-specific)
- Removed `humanlayer thoughts sync` calls
- Replaced `thoughts/shared/plans/` with `.claude/plans/`
- Replaced `make` commands with generic test runner patterns
