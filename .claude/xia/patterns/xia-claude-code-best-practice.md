# Pattern: Best Practice Patterns (CLAUDE.md loading + cross-model review + agent fields)

**Source:** shanraisshan/claude-code-best-practice
**Date:** 2026-03-25
**Gap filled:** CLAUDE.md loading behavior undocumented; no cross-model review workflow; 3 agent frontmatter fields missing from A's documentation

## What B had

### 1. CLAUDE.md Monorepo Loading Behavior
Two mechanisms:
- **Ancestor loading** (upward, immediate at startup): Claude walks up from CWD, loads all CLAUDE.md found
- **Descendant loading** (downward, lazy): Subdirectory CLAUDE.md files only load when Claude reads files there
- **Siblings never load** — different branches are always excluded
- **Global**: `~/.claude/CLAUDE.md` always loads regardless of project
Implications: put shared conventions at root (propagates down), component rules in component dirs (lazy/isolated), personal prefs in `CLAUDE.local.md` (git-ignored).

### 2. Cross-Model Review Workflow
4-step cycle using two models with different strengths:
1. Plan with Claude Opus (plan mode) → `plans/{feature}.md`
2. QA review with second model (e.g., Codex) — reads plan + codebase, inserts "Phase 2.5" findings, NEVER rewrites original phases — additive only
3. Implement with Claude Opus (new session) — phase-by-phase with test gates
4. Verify with second model — checks implementation against plan
Key rule: reviewing model is strictly additive. Preserves planner intent while catching blind spots each model misses.

### 3. Agent Frontmatter — Three Underdocumented Fields
- `isolation: "worktree"` — runs agent in temporary git worktree, auto-cleaned if no changes; enables safe parallel agents with no file conflicts
- `background: true` — always runs as background task, non-blocking
- `color` — CLI output color for visual distinction when running multiple agents simultaneously

## Key principles extracted

- Ancestor/descendant loading is asymmetric and non-obvious — knowing this prevents both missing context and context bloat
- Cross-model review is additive — inserting findings as new phases preserves planner intent and creates an audit trail
- `isolation: "worktree"` is the safe default for any agent doing risky or parallel work

## What A got

- `33-best-practice-patterns/README.md` — all 3 patterns with examples

## Adaptations made

- RPI workflow not borrowed (covered by plan lifecycle from humanlayer)
- Settings/MCP reference not borrowed (covered in 02-mcp + 05-subagents)
- Focused only on the 3 non-obvious patterns missing from prior modules
