# claude-code-in-action

Personal learning repo — real-world Claude Code workflows built and documented through daily use.

## Structure

| Folder | Topic | What's inside |
|---|---|---|
| `00-materials/` | Course materials | Reference PDFs, docs, skill-building guide |
| `01-small-project/` | Real app (Next.js) | Full-stack app used as the primary sandbox across all lessons |
| `02-mcp/` | MCP servers | Playwright, repomix, mcporter — browser automation and codebase context |
| `03-auto-simplify/` | Hook automation | PostToolUse + UserPromptSubmit hooks that enforce `/simplify` every 5 edits |
| `04-uiux/` | UI generation | Schemas, hooks, and repomix configs for AI-assisted UI workflows |
| `05-subagents/` | Subagent patterns | Orchestrator, codebase-analyst, mcp-manager agent setups |
| `06-github-actions/` | GitHub as event bus | Multi-agent collaboration via GH Actions (`@claude`, `@deepseek` triggers) |
| `07-voice-input/` | Voice → Claude | Whisper-based voice input pipeline to Claude Code |
| `08-superpowers/` | Superpowers integration | Workflow classifier hook, CC vs Codex analysis, verbosity control |
| `09-gstack-specific/` | Personal kit | gstack + ecc-tools merged with superpowers; overlap analysis and install guide |

## Key Artifacts

**`03-auto-simplify`** — hooks that turn `/simplify` from optional to mandatory. Demonstrates `PostToolUse` + `UserPromptSubmit` exit-code mechanics.

**`06-github-actions`** — GitHub as a message queue for AI agents. Multiple agents (`@claude`, `@deepseek`) on one repo, triggered by issue comments, chaining automatically.

**`08-superpowers`** — Why Superpowers doubles Claude Code's capability but reduces Codex's. Includes a `workflow-classifier.sh` hook that injects context-aware guidelines (debug / plan / review / impl) on every prompt — no changes to `CLAUDE.md` required.

**`09-gstack-specific`** — How to audit, deduplicate, and merge multiple shared skill kits (gstack, ecc-tools, superpowers) into a personal stack without overlap or token bloat.

## The Main App (`01-small-project`)

Next.js + Prisma + Vitest. Used as the real codebase for testing every workflow pattern in this repo.

```bash
cd 01-small-project
npm run setup   # install, generate Prisma client, run migrations
npm run dev     # start on :3000
npm run test    # Vitest
```

## Recurring Patterns

- **Hooks over config** — behavioral enforcement via hooks (`PostToolUse`, `UserPromptSubmit`) is more reliable than long `CLAUDE.md` files that agents skip
- **Short injections beat long files** — 1-line hook output is read; 200-line config is skimmed
- **GitHub as coordination layer** — agents don't need direct communication if they share a repo
- **Skill kits need auditing** — more skills ≠ more capability; overlap causes token bloat and tool confusion
