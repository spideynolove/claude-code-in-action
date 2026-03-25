# Module 31 — GSD Planning Patterns

Borrowed from: glittercowboy/get-shit-done

Four planning conventions that complement the plan lifecycle (module 30):

## 1. `.planning/` Directory Convention

All project planning artifacts live in one folder:

```
.planning/
├── PROJECT.md       — living project context (what, who, core value, out-of-scope)
├── REQUIREMENTS.md  — categorized requirements with traceability to phases
├── ROADMAP.md       — phase structure with success criteria and plan lists
├── STATE.md         — living memory: position, velocity, blockers, session continuity
└── phases/
    └── 01/
        ├── PLAN.md
        └── SUMMARY.md
```

## 2. STATE.md — Living Project Memory

A single file (≤100 lines) read at the start of every session. Contains:
- Current position (phase X of Y, plan A of B, status)
- Progress bar (░░░░░░░░░░ 0%)
- Velocity metrics (plans/hour, trend)
- Accumulated decisions, blockers, pending todos
- Session continuity (last session date, stopped at, resume file)

**Rule:** Read STATE.md first, update it after every significant action.

## 3. REQUIREMENTS.md Template

Categorized requirements with:
- Explicit v1 vs v2 buckets (defer gracefully)
- Out-of-scope table with reasons (prevent scope creep)
- Traceability matrix (requirement → phase)

## 4. `/forensics` Command

Post-mortem investigation for stuck/failed workflows. Read-only — never modifies project files.

Evidence gathered:
- Git history (commit frequency, repeated file edits → stuck-loop signal)
- Planning artifacts (missing SUMMARY.md → phase not properly closed)
- Orphaned worktrees (crashed agents)
- Gap analysis (time since last commit vs STATE.md position)

Output: structured diagnostic report in `.planning/forensics/report-TIMESTAMP.md`

See `forensics-command.md` for the full command.
