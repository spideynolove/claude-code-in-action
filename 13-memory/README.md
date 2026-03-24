# 13-memory

How Claude loads context automatically — the CLAUDE.md hierarchy and auto-memory system.

## What Memory Is

Memory = files Claude reads before processing any prompt. No retrieval step. No explicit injection. Claude reads them on session start the same way a developer reads a project README before touching the code.

## Load Order (precedence high → low)

```
/etc/claude-code/CLAUDE.md          ← managed policy (org-wide, read-only)
~/.claude/CLAUDE.md                 ← user memory (all projects)
~/.claude/rules/*.md                ← user rules (all projects)
<project>/.claude/CLAUDE.md         ← project memory (team-shared, version controlled)
<project>/CLAUDE.md                 ← also project memory (same scope)
<project>/.claude/rules/*.md        ← project rules (path-scoped instructions)
~/.claude/projects/<id>/memory/     ← auto-memory (Claude's own notes across sessions)
```

Higher entries override lower ones when they conflict. All of them load — it's additive, not exclusive.

## Where to Put What

| Content | Location |
|---------|----------|
| Personal style preferences (tone, code style, no-thanks rule) | `~/.claude/CLAUDE.md` |
| Team standards, project conventions, architecture notes | `<project>/CLAUDE.md` or `<project>/.claude/CLAUDE.md` |
| Topic-specific rules (testing, security, deployment) | `.claude/rules/<topic>.md` |
| Personal overrides for one project only | `CLAUDE.local.md` (gitignored) |
| Things Claude should remember across sessions (auto-written) | `~/.claude/projects/<id>/memory/` |

## Writing Effective CLAUDE.md

Rules Claude follows reliably are:
- **Specific and actionable** — "never use `var`" beats "prefer modern JS"
- **Scoped to real decisions** — things Claude would get wrong without the rule
- **No documentation** — don't put API docs or architecture descriptions here, use `@imports`

```markdown
# Project standards

## Code
- TypeScript strict mode always on
- No `any` type — use `unknown` and narrow it

## Git
- Never commit automatically — only when user explicitly asks

## Commands
- Use `uv pip install` not `pip install`
```

## `@file` Imports

Reference external files inside CLAUDE.md instead of copying content:

```markdown
@README.md
@docs/architecture.md
@package.json
```

Claude reads those files as part of memory. Keeps CLAUDE.md thin and avoids duplication.

## Quick Add During a Session

Start a message with `#` to add a rule to memory mid-session:

```
# always use kebab-case for new filenames in this project
```

Claude asks which memory file to update, adds the rule, and it persists to future sessions.

## Auto-Memory (Claude's Own Notes)

Claude can write its own memory at `~/.claude/projects/<id>/memory/`. This is the system used in this repo (see `05-subagents` — the `context-loader.sh` hook reads these files on every prompt).

Auto-memory is different from CLAUDE.md:
- CLAUDE.md = **you** write rules for Claude
- Auto-memory = **Claude** writes notes about what it learned about you

See `.claude/hooks/context-loader.sh` in this project for how auto-memory gets injected.

## Examples in This Folder

| File | What it shows |
|------|---------------|
| `examples/project-CLAUDE.md` | Realistic project-level memory template |
| `examples/rules/testing.md` | Topic-scoped rule file (goes in `.claude/rules/`) |

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Putting architecture docs in CLAUDE.md | Use `@docs/architecture.md` import instead |
| Duplicating user preferences in every project | Put them in `~/.claude/CLAUDE.md` once |
| Writing vague rules ("write good code") | Write rules Claude would violate without them |
| Committing `CLAUDE.local.md` | Add to `.gitignore` — it's personal overrides |
