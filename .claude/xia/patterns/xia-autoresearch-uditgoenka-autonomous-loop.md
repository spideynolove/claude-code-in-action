---
source: https://github.com/uditgoenka/autoresearch
extracted: 2026-03-25
---

# Autonomous Loop Pattern from autoresearch

**Gap filled:** No autonomous Modify→Verify→Keep/Discard→Repeat iteration loop; no bounded iteration control; no git-as-memory pattern; no results TSV logging
**Constraints applied:** No docstrings, no comments added; files are protocol .md — no code changes required

## Pattern

Core loop: Modify → Commit → Verify → Guard → Decide → Log → Repeat

Phases:
0. Precondition checks (git clean, no lock files, not detached HEAD)
1. Review (read git log, diff last kept change, check results log)
2. Ideate (pick next change informed by git history + results log)
3. Modify (ONE atomic change — one-sentence test)
4. Commit (experiment(<scope>): <description> — before verification)
5. Verify (mechanical metric only — no subjective assessment)
5.5. Guard (regression check — optional, separate from verify)
6. Decide (keep / discard / crash / no-op / hook-blocked)
7. Log (append TSV row)
8. Repeat (unbounded: never stop; bounded: stop at N)

Key behaviors:
- git revert (not reset) for rollbacks — preserves experiment history
- Bounded via Iterations: N inline config
- Noise handling: multi-run median, min-delta threshold, confirmation run
- Stuck recovery: after 5 consecutive discards, re-read everything and try radical change

## Seam

`25-autoresearch/.claude/` — standalone module
- `commands/autoresearch.md` — slash command entry point
- `skills/autoresearch/SKILL.md` — full skill with subcommand index
- `skills/autoresearch/references/autonomous-loop-protocol.md` — loop phases detail
- `skills/autoresearch/references/results-logging.md` — TSV format + log functions

## Delta from original

No changes — files copied verbatim. The protocol is domain-agnostic and requires no adaptation for this repo's conventions. No comments or docstrings were present in source files.
