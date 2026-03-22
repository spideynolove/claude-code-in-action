# GitNexus — Claude Instructions

This directory is a setup guide for GitNexus. When working here, help the user install and configure GitNexus on their machine.

## Context

GitNexus is an MCP server + CLI that provides graph-powered code intelligence. It indexes codebases via AST parsing and injects structural context (call chains, dependencies, execution flows) into Claude's searches automatically via hooks.

## Session Continuation Model

**repomix + knowledge-graph (.aim/):**
- `.aim/memory.jsonl` persists on disk — always present after `/onboard`
- `context-loader.sh` UserPromptSubmit hook reads it automatically on every prompt
- User does NOT need to manually load it or re-run `/onboard` unless the codebase changed significantly
- `/handoff` checkpoints the current session state to `.claude/handoff.md` for cross-machine continuation

**GitNexus (.gitnexus/):**
- `.gitnexus/` is the LadybugDB graph database — persists on disk after `gitnexus analyze`
- Hooks auto-augment every Grep/Glob/Bash — no manual invocation needed
- PostToolUse hook detects staleness after git commits and notifies the agent
- If `.gitnexus/` is committed to git, another machine just needs `npm install -g gitnexus` + `claude mcp add gitnexus`
- If not committed, run `gitnexus analyze` on the new machine (takes 1-5 minutes for most repos)

## When to recommend re-running `/onboard` or `gitnexus analyze`

Re-run `/onboard`:
- First time setting up a project
- After adding new major modules or services
- After significant architectural refactoring

Re-run `gitnexus analyze`:
- First time in a project
- After `git pull` with large structural changes
- When `gitnexus://repo/{name}/context` reports "Index is stale"
- When the PostToolUse hook notifies that HEAD changed since last index

## Installing on a new machine

1. `npm install -g gitnexus`
2. `claude mcp add gitnexus npx gitnexus mcp`
3. Copy hooks from `.claude/hooks/` → `~/.claude/hooks/gitnexus/`
4. Merge `.claude/settings.json` hook config into `~/.claude/settings.json`
5. Copy `.claude/skills/*.md` → `~/.claude/skills/gitnexus/`
6. In each project: `npx gitnexus analyze`

## Key paths

| Resource | Path |
|---|---|
| Global skills | `~/.claude/skills/gitnexus/*.md` |
| Global hooks | `~/.claude/hooks/gitnexus/*.sh` |
| Hook config | `~/.claude/settings.json` → `hooks` |
| MCP registration | `~/.claude/claude_desktop_config.json` or via `claude mcp add` |
| Per-project index | `.gitnexus/` in project root |
| Global repo registry | `~/.gitnexus/registry.json` |
