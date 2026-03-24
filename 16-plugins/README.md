# 16-plugins

Plugins bundle commands + agents + hooks + MCP config into a single installable unit.

## What a Plugin Is

Everything else in this repo is individual pieces:
- `12-slash-commands` → one command file
- `05-subagents` → agent files
- `03-auto-simplify` → hook files

A plugin is the combination of all of them, packaged so a team installs it in one command:

```bash
/plugin install pr-review
```

That single command wires up commands, agents, hooks, and MCP config simultaneously.

## Plugin Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       ← manifest (name, version, description, author)
├── commands/             ← slash commands (markdown files)
├── agents/               ← subagent definitions (markdown files)
├── hooks/                ← event handlers
│   └── hooks.json        ← hook wiring
└── .mcp.json             ← MCP server config (optional)
```

## Manifest

`.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin does",
  "author": { "name": "Your Name" },
  "license": "MIT"
}
```

## Install / Uninstall

```bash
/plugin install my-plugin          # from marketplace
/plugin install ./path/to/plugin   # from local directory
/plugin list                       # show installed plugins
/plugin uninstall my-plugin
/reload-plugins                    # hot-reload without restart
```

## Commands in Plugins

Same format as `12-slash-commands`. They live in `commands/`:

```
commands/
└── run-checks.md     → becomes /run-checks
```

Name conflict between plugin commands: use `plugin-name:command-name` syntax.

## When to Build a Plugin vs Individual Files

| Scenario | Use |
|----------|-----|
| Personal workflow, one project | Individual files in `.claude/` |
| Team-wide standard (code review, deploy) | Plugin |
| Distributing to others / open source | Plugin |
| Commands that need hooks + agents together | Plugin |

The threshold is: "would a new team member install this in one step?" If yes, it's a plugin.

## Example Plugin in This Folder

`example-plugin/` — a minimal "quality-gate" plugin that:
- Adds a `/quality-check` command
- Wires a `code-auditor` agent for delegation
- Runs a PostToolUse hook to log every file edit

Install it locally:

```bash
/plugin install 16-plugins/example-plugin
```

## Distribution

Plugins can live anywhere:
- **Local**: `./my-plugin/` — check into the repo, install via path
- **npm**: publish as a package, install via `plugin-name@version`
- **Git**: install directly from a GitHub repo URL

For team use, the simplest approach is to check the plugin into the monorepo and document the install command in the project README.
