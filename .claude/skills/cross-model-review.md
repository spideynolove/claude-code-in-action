---
name: cross-model-review
description: Two-model plan quality assurance — plan with one model, QA review with a second (additive only), then implement. Use before implementing any non-trivial plan.
---

# Cross-Model Review Workflow

Use two AI models with different strengths for plan quality assurance.

## Workflow

```
Step 1 — PLAN      (Claude Opus, /create_plan)
  → .claude/plans/{feature}.md — phased plan with test gates

Step 2 — QA REVIEW (second model, e.g. Codex / Gemini)
  → Reads plan + codebase
  → Inserts "Phase 2.5 — Model Findings" with specific gaps found
  → Adds to plan, NEVER rewrites existing phases

Step 3 — IMPLEMENT (Claude, new session, /implement_plan)
  → Executes phase-by-phase with test gates

Step 4 — VERIFY    (second model)
  → Verifies implementation against the plan
  → Reports any drift from Phase 2.5 findings
```

## Key Rule — Additive Only

The reviewing model inserts intermediate phases for gaps found. It never rewrites the planner's phases. Format:

```markdown
## Phase 2.5 — Model Findings

> Added by: [model name] on [date]

### Finding 1: [Gap title]
[Description of gap and why it matters]

**Suggested addition to Phase N:**
[Specific addition, not a rewrite]
```

**Why additive-only:** Preserves planner's intent while catching blind spots. Each model's weaknesses are caught by the other — planning bias and implementation drift both get flagged.

## When to Use

- Any plan with 3+ phases
- Plans touching security, data integrity, or production systems
- Plans where you want a second perspective before investing implementation time

## Without External Models

If only one model is available, simulate the review by switching perspectives:

1. After writing the plan, read it as a **junior developer** — flag any ambiguity
2. Read it as an **oncall engineer** — flag any missing error handling or rollback steps
3. Insert findings as "Phase 2.5 — Self-Review" before implementing
