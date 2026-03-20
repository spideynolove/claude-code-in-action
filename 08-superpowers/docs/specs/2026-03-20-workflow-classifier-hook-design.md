# Workflow Classifier Hook — Design Spec

**Date:** 2026-03-20
**Status:** Draft
**Scope:** Claude Code only

## Problem

`~/.claude/CLAUDE.md` contains workflow guidelines (plan mode, debugging approach, implementation constraints, verification). Long files get skimmed by the agent — length causes unreliability. Guidelines are not followed consistently.

## Goal

Inject a single, targeted workflow guideline line automatically when Claude Code receives a prompt that matches a known task type. The correct tag must appear in hook output for any prompt whose primary intent matches one of the four task types.

Success criterion: manual spot-check of 10 representative prompts shows correct tag injected on ≥8. No injection on clearly unrelated prompts (greetings, file reads, config questions).

## Approach

Extend the existing `UserPromptSubmit` hook to classify the incoming prompt by task type and inject a single targeted guideline line. Nothing is injected for unclassified prompts.

## Architecture

```
UserPromptSubmit hook fires
       │
       ├─ Stage 1 (existing): load knowledge-graph, roles, handoff  [context-loader.sh]
       └─ Stage 2 (new): classify prompt → inject micro-guideline   [workflow-classifier.sh]
```

Stage 1 and Stage 2 both write to stdout. Claude Code concatenates all stdout from the hook into the session context. Stage 2 appends after Stage 1 output — no merging or coordination needed between the two scripts.

### Files

| File | Change |
|---|---|
| `~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh` | New file — classifier + injector |
| `~/.claude/settings.json` | Add second hook entry to `UserPromptSubmit` array |

No changes to `CLAUDE.md`, `context-loader.sh`, skills, or plugins.

**Why settings.json, not context-loader.sh:** `context-loader.sh` reads stdin on line 1 (`json.load(sys.stdin)`). Stdin is exhausted after that line — any subprocess called from inside the script would receive empty stdin. Registering the classifier as a separate hook entry in `settings.json` gives it its own stdin copy from Claude Code, keeping both scripts independent.

## Hook Output Contract

`UserPromptSubmit` hooks communicate via plain text on stdout. Claude Code prepends all stdout output to the session context as a system-level message. The classifier prints one plain-text line (or nothing). No JSON wrapping required.

On any failure (malformed JSON input, script error), the classifier exits 0 silently — hook failure must never block the user's prompt. `set +e` is used throughout.

## Classifier Logic

Input: full hook JSON on stdin (same payload as `context-loader.sh` already receives). Extract `.prompt` field using `python3 -c` (already available in the environment).

Matching is **priority-order, first-match-wins**. Keywords are matched case-insensitively against the full prompt string.

| Priority | Task type | Match keywords |
|---|---|---|
| 1 | `debug` | ` bug `, `error`, `fail`, `not working`, `broken`, `trace`, `why does`, `why is`, `why isn't` |
| 2 | `plan` | `plan`, `design`, `architect`, `how should i`, `how do i approach`, `structure`, `scaffold` |
| 3 | `review` | `review`, `audit`, `code review`, `pr review`, `look at this`, `check this` |
| 4 | `impl` | `implement`, `build`, `add feature`, `create`, `write a`, `make a` |

**Keyword notes:**
- `fix` is intentionally excluded from `debug` — "fix X" alone is ambiguous (could be impl). Only `fix` combined with error/failure signals (e.g., "fix the error", "fix why it fails") would match debug via other keywords.
- `create` and `build` are scoped with context (`build X`, `create X`) to reduce overlap with planning prompts. Plain "how should I build" matches `plan` first by priority.
- `is this correct` is removed — too many false positives on non-review prompts.
- No match → no output, no injection.

## Injection Format

Single plain-text line printed to stdout:

```
[workflow:debug] Root cause first, not symptoms. Trace → identify → fix. No plan needed for single bugs.
[workflow:plan] Concise plan first (≤7 bullets). No code until plan is approved. Verify steps upfront.
[workflow:review] Verify before done. Run tests/checks. Would a senior engineer approve this?
[workflow:impl] Minimal change. Touch only what's needed. Follow existing patterns. No new abstractions.
```

**Format constraints:**
- Single line — harder to skip than a paragraph
- `[workflow:type]` prefix — scannable, distinguishable from knowledge-graph output
- Imperative tone — commands, not suggestions
- Silent on unmatched prompts — no noise

## Error Handling

- Classifier exits 0 in all cases — never blocks the prompt
- If JSON parse fails: exit silently
- If no match found: exit silently (no output)
- `set +e` at top of script to prevent any `errexit` propagation

## Out of Scope

- Codex / AGENTS.md — Codex handles instruction files differently; this hook mechanism is Claude Code-specific
- LLM-based classification — adds latency and cost
- Skills or plugin changes
- Superpowers modification
- Multi-label injection (one prompt → multiple tags) — YAGNI; single tag is sufficient
