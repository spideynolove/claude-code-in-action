# Module 33 — Best Practice Patterns

Borrowed from: shanraisshan/claude-code-best-practice

Three non-obvious patterns not documented elsewhere in the course:

## 1. CLAUDE.md Monorepo Loading Behavior

Two distinct mechanisms — understanding this prevents context bloat and missing instructions.

**Ancestor loading (UP the tree) — immediate at startup:**
Claude walks upward from your CWD and loads every CLAUDE.md found.

**Descendant loading (DOWN the tree) — lazy:**
Subdirectory CLAUDE.md files load only when Claude reads files in that subdirectory.
Siblings never load.

```
/mymonorepo/
├── CLAUDE.md          ← loaded immediately (root = ancestor of frontend/)
├── frontend/
│   └── CLAUDE.md      ← loaded immediately if CWD is frontend/ (ancestor: root)
├── backend/
│   └── CLAUDE.md      ← NOT loaded — sibling branch, lazy only
└── api/
    └── CLAUDE.md      ← NOT loaded — sibling branch, lazy only
```

**Starting from `/mymonorepo/frontend`:**
- ✅ `/mymonorepo/CLAUDE.md` — ancestor, loads at startup
- ✅ `/mymonorepo/frontend/CLAUDE.md` — CWD, loads at startup
- ❌ `/mymonorepo/backend/CLAUDE.md` — sibling, never loads
- ✅ `~/.claude/CLAUDE.md` — global, always loads

**Design implications:**
- Put shared conventions in root CLAUDE.md (propagates down to all components)
- Put component-specific rules in component CLAUDE.md (isolated, lazy)
- Use `CLAUDE.local.md` (git-ignored) for personal preferences not shared with team

## 2. Cross-Model Review Workflow

Use two AI models with different strengths for plan quality assurance:

```
Step 1 — PLAN      (Claude Opus, plan mode)
  → plans/{feature}.md  — phased plan with test gates

Step 2 — QA REVIEW (Codex / second model)
  → Reads plan + codebase
  → Inserts "Phase 2.5" with "Model Finding" headings
  → Adds to plan, NEVER rewrites original phases

Step 3 — IMPLEMENT (Claude Opus, new session)
  → Executes phase-by-phase with test gates

Step 4 — VERIFY    (Codex / second model)
  → Verifies implementation against the plan
```

**Key rule:** The reviewing model is additive only — it inserts intermediate phases for gaps found, never rewrites the planner's phases. This preserves intent while catching blind spots.

**Benefit:** Each model's weaknesses are caught by the other. Planning bias and implementation drift both get flagged.

## 3. Agent Frontmatter — Three Underdocumented Fields

Fields absent from most documentation but functional and useful:

| Field | Type | Effect |
|---|---|---|
| `isolation: "worktree"` | string | Runs agent in a temporary git worktree — auto-cleaned if no changes made |
| `background: true` | boolean | Always runs as background task — non-blocking |
| `color` | string | CLI output color for visual distinction (e.g., `green`, `magenta`, `blue`) |

**`isolation: "worktree"` use case:** Safe parallel agents — each gets its own working copy, no file conflicts, no dirty state leaking between agents.

**`color` use case:** When running multiple agents, color makes it immediately clear which output belongs to which agent.

Example agent frontmatter using all three:
```yaml
---
name: safe-refactor-agent
description: Runs dangerous refactors in isolation
model: sonnet
isolation: worktree
background: true
color: yellow
tools: Read, Write, Edit, Bash
---
```
