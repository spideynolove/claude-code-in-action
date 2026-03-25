# Pattern: GSD Planning Patterns (.planning/ + STATE.md + REQUIREMENTS + forensics)

**Source:** glittercowboy/get-shit-done
**Date:** 2026-03-25
**Gap filled:** No structured planning directory; no living project state across sessions; no requirements traceability; no post-mortem investigation for stuck workflows

## What B had

Four planning conventions:

### 1. `.planning/` Directory Convention
All project artifacts in one folder: PROJECT.md (living context + core value + out-of-scope), REQUIREMENTS.md (categorized with traceability), ROADMAP.md (phases with success criteria + plan lists), STATE.md (living memory), phases/ subdirectories.

### 2. STATE.md — Living Project Memory
Single file (≤100 lines) read at start of every session:
- Current position (phase X of Y, plan A of B, status, progress bar)
- Velocity metrics (plans/hour, per-phase breakdown, trend)
- Accumulated decisions, pending todos, blockers
- Session continuity (last session, stopped at, resume file path)
Rule: read first, update after every significant action.

### 3. REQUIREMENTS.md Template
Categorized requirements with v1/v2 buckets (defer gracefully), explicit Out-of-Scope table with reasons, and a traceability matrix (requirement → phase).

### 4. Forensics Command
Read-only post-mortem investigation. Evidence: git log frequency analysis, planning artifact audit (missing SUMMARY.md = phase not closed), orphaned worktrees, time-gap analysis. Detects: stuck loops (same file in 3+ consecutive commits), abandoned work, missing artifacts. Output: `.planning/forensics/report-TIMESTAMP.md`.

## Key principles extracted

- **STATE.md is read first, updated last** — single source of truth for "where are we"
- **≤100 line constraint on STATE.md** — digest not archive; prune aggressively
- **Out-of-scope table with reasons** — prevents re-adding excluded features
- **v1/v2 requirements split** — defer gracefully; don't lose ideas
- **Forensics is read-only** — investigation never modifies project files
- **Stuck-loop signal** — same file in 3+ consecutive commits = agent is spinning

## What A got

- `31-gsd-planning-patterns/README.md`
- `31-gsd-planning-patterns/STATE-template.md`
- `31-gsd-planning-patterns/REQUIREMENTS-template.md`
- `31-gsd-planning-patterns/forensics-command.md`
- `~/.claude/commands/forensics.md`
- `.planning/` directory convention documented

## Adaptations made

- Removed GSD-specific tooling (`gsd-tools.cjs`, `gsd:health` command)
- Removed wave execution mechanics (separate pattern if needed)
- Forensics simplified to core git + artifact analysis without GSD-specific phase structure assumptions
