# PLAN — /autoresearch:learn Integration

## Status

Deferred. Skipped in 2026-03-25 Xỉa session due to Med friction.

---

## Why It Was Skipped

The learn workflow has one structural dependency that all other borrows lack: it generates documentation **into** a `docs/` directory and validates against files that must already exist or be created during the run. In a bare learning repo like `claude-code-in-action`, there is no `docs/` structure, no project type signals (no `package.json`, no test runner), and no prior documentation to diff against. Running `--mode init` cold on this repo would produce generic boilerplate rather than meaningful content.

The friction is not the workflow logic — it is the **preconditions**.

---

## Preconditions for Execution

All of the following must be true before borrowing and running this workflow:

### 1. Target project has source code Claude can scout

The learn workflow's Phase 1 scouts the codebase for:
- Files by extension (`.ts`, `.js`, `.py`, `.go`, `.rs`, etc.)
- Project type signals (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`)
- Test directories (`tests/`, `__tests__/`, `spec/`)
- Config files (`.env.example`, `config/`, `.github/workflows/`)

**Minimum viable target:** A project with at least one entry point and 20+ source files in a consistent language. The course module `01-small-project` (Next.js + Prisma + Vitest) qualifies immediately.

### 2. `docs/` directory decision is made upfront

The workflow branches on whether `docs/*.md` exists:
- **0 files found** → `--mode init` (full generation from scratch)
- **1+ files found** → `--mode update` (diff-aware refresh)
- **Unknown/check** → `--mode check` (read-only health report, no writes)

Running without a mode decision causes the interactive setup to ask 4 questions before doing anything. Decide the mode before invoking.

### 3. Optional: `validate-docs.cjs` script installed

Phase 5 looks for `$HOME/.claude/scripts/validate-docs.cjs`. If absent, validation is skipped silently. The workflow runs without it but produces lower-confidence output (no broken-link or stale-ref detection).

To install: copy from `00-materials/repo/autoresearch-uditgoenka/scripts/` if present, or write a minimal version that checks:
- Internal markdown links resolve
- Code block references match actual file paths

### 4. Git repo is clean before running

The workflow reads `git log` to calculate staleness (last code commit vs last docs commit) and uses `git diff` to scope what changed. A dirty tree skews staleness calculations. Stash or commit before running.

---

## Integration Seam

When conditions are met, the learn command + workflow file drop into `25-autoresearch/.claude/` alongside the existing borrows:

```
25-autoresearch/
└── .claude/
    ├── commands/
    │   └── autoresearch/
    │       └── learn.md          ← add this
    └── skills/
        └── autoresearch/
            └── references/
                └── learn-workflow.md   ← add this
```

Source files to copy:
- `00-materials/repo/autoresearch-uditgoenka/claude-plugin/commands/autoresearch/learn.md`
- `00-materials/repo/autoresearch-uditgoenka/claude-plugin/skills/autoresearch/references/learn-workflow.md`

No other files need to change. The SKILL.md already references `references/learn-workflow.md` so the skill index is already wired.

---

## Expected Output

Running `/autoresearch:learn --mode init --depth standard` on `01-small-project` produces:

### Files created in `01-small-project/docs/`

| File | Content |
|------|---------|
| `project-overview-pdr.md` | Project purpose, goals, non-goals, decisions made |
| `codebase-summary.md` | File inventory, key dependencies (from package.json), LOC breakdown |
| `code-standards.md` | Naming conventions, folder structure, patterns found in codebase |
| `system-architecture.md` | Mermaid diagrams: component map, data flow, service graph |
| `api-reference.md` | Endpoint catalog (from `src/app/api/chat/route.ts` and other routes) |
| `testing-guide.md` | How to run Vitest, coverage config, fixture patterns |
| `configuration-guide.md` | All env vars, Prisma config, SQLite setup |

Root `README.md` is created or updated (max 300 lines).

### Files created in `01-small-project/learn/{YYMMDD}-{HHMM}-{slug}/`

| File | Content |
|------|---------|
| `learn-results.tsv` | Per-doc validation results: name, status, issues |
| `summary.md` | Run summary: mode, docs created, validation score, iteration count |
| `validation-report.md` | Per-doc pass/fail with specific errors flagged |
| `scout-context.md` | Merged scout report cached for incremental future runs |

### Composite metric

```
learn_score = validation% × 0.5 + coverage% × 0.3 + size_compliance% × 0.2
```

A score of 80+ means all core docs exist, pass mechanical checks, and stay under 800 lines each.

---

## Recommended First Run

```
cd 01-small-project
/autoresearch:learn --mode init --depth standard
Iterations: 3
```

This runs the validate-fix loop up to 3 times to fix any stale references or broken links before finalizing. Without `Iterations:`, the loop runs until all docs pass or the user interrupts.

---

## After Integration

Once integrated, update `.claude/xia/XIALOGUE.md` — append one row to the borrow history:

```
| 2026-MM-DD | autoresearch-uditgoenka | learn-workflow | No autonomous documentation engine | .claude/xia/patterns/xia-autoresearch-learn-workflow.md |
```

And save a pattern file at `.claude/xia/patterns/xia-autoresearch-learn-workflow.md`.
