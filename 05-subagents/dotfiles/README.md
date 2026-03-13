# claude-dotfiles

Portable `~/.claude/` configuration — agents, skills, hooks, global instructions.

## What's here

```
.claude/
├── CLAUDE.md                          ← global instructions for all projects
├── settings.json                      ← base settings (edit paths for your machine)
├── hooks/
│   └── context-loader.sh              ← auto-injects .aim/ knowledge graph on session start
├── agents/
│   ├── orchestrator.md                ← full coding workflow: clarify→analyze→plan→implement→review→test
│   ├── codebase-analyst.md            ← repomix + sequential-thinking + knowledge-graph
│   └── mcp-manager.md                 ← MCP executor: gemini→kimi→qwen→codex→mcporter fallback chain
└── skills/
    ├── repomix/SKILL.md
    ├── mcp-knowledge-graph/SKILL.md
    ├── sequential-thinking/SKILL.md
    └── nuxt/SKILL.md
```

## NOT synced (machine-local only)

| Path | Why excluded |
|------|-------------|
| `plugins/` | Managed by Claude Code installer |
| `projects/` | Conversation history JSONL — large, personal |
| `backups/`, `cache/`, `debug/` | Transient, machine-generated |
| `.credentials.json` | Auth tokens — never commit |
| `.mcporter/mcporter.json` | Contains absolute paths to node/python on this machine |

## Install on a new machine

```bash
git clone <this-repo> ~/dotfiles/claude-dotfiles
cd ~/dotfiles/claude-dotfiles
bash install.sh

# Then manually copy and edit settings.json:
cp .claude/settings.json ~/.claude/settings.json
# Update node/python paths if needed
```

## Branch strategy

```
main          ← shared: all skills, agents, hooks, CLAUDE.md
pc-home       ← machine-specific settings.json overrides, local MCP paths
pc-work       ← work machine: different venv, proxy settings
```

Merge improvements to skills/agents/hooks into `main`.
Keep machine-specific path overrides in the branch — never merge to main.

## settings.json — what to update per machine

In `settings.json`, the only portable fields are `enabledPlugins` and `hooks`.
Fields that need updating per machine:
- Any `env` vars with absolute paths
- `effortLevel` (personal preference)

The `mcporter.json` (not included here) needs its own per-machine node/python paths:
```json
"command": "/home/<user>/.nvm/versions/node/v22.x.x/bin/repomix"
```
