# /forensics — Post-Mortem Investigation

Post-mortem investigation for stuck or failed workflows. **Read-only — never modifies project files.**

## Usage

```
/forensics [problem description]
```

If no description provided, ask: "What went wrong? Describe the issue."

## Evidence Gathering

### 1. Git History

```bash
git log --oneline -30
git log --format="%H %ai %s" -30
git log --name-only --format="" -20 | sort | uniq -c | sort -rn | head -20
git status --short
git diff --stat
git worktree list
```

Collect: commit timeline, most-edited files, uncommitted changes, orphaned worktrees.

### 2. Planning State

Read if they exist:
- `.planning/STATE.md` — current position, blockers, last session
- `.planning/ROADMAP.md` — phase list with status
- `.planning/config.json` — workflow config

### 3. Phase Artifacts

For each `.planning/phases/*/`, check which exist:
- `PLAN.md` — execution plans
- `SUMMARY.md` — completion summary (missing = phase not properly closed)
- `VERIFICATION.md` — quality check (missing = skipped)

## Anomaly Detection

### Stuck Loop
**Signal:** Same file in 3+ consecutive commits in short window.
**Confidence HIGH** if commit messages are similar ("fix:", "fix:", "fix:").

### Missing Artifacts
**Signal:** Phase appears complete but lacks SUMMARY.md or VERIFICATION.md.

### Abandoned Work
**Signal:** Large time gap since last commit + STATE.md shows mid-execution status.

### Orphaned Worktrees
**Signal:** `git worktree list` shows paths that no longer correspond to active work.

## Output

Write report to `.planning/forensics/report-YYYY-MM-DD-HHMMSS.md`:

```markdown
# Forensics Report: [Problem Description]
**Date:** [timestamp]
**Confidence:** [HIGH / MEDIUM / LOW]

## Summary
[1-2 sentence diagnosis]

## Evidence
### Git Timeline
[Key commits and gaps]

### Anomalies Found
- [STUCK LOOP] [file] — appeared in N consecutive commits
- [MISSING ARTIFACT] Phase 3 has no SUMMARY.md
- [ABANDONED] 5 days since last commit, STATE.md shows "In progress"

## Root Cause
[Most likely cause based on evidence]

## Recommended Actions
1. [Specific action]
2. [Specific action]
```

Present report inline. Then offer: "Would you like to investigate further?"
