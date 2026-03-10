# Repomix + Claude Code Setup

How to wire repomix into a Claude Code environment on a new machine.

---

## What this gives you

- `repomix` CLI under the correct Node version
- `repomix` MCP server registered in mcporter (6 tools available in-session)
- A `~/.claude/skills/repomix.md` skill that tells Claude when and how to use it
- A per-project `repomix.config.json` for consistent output

---

## 1. Install repomix globally under your Node version

Replace `v22.22.1` with whatever version you're standardizing on.

```bash
npm_config_prefix=~/.nvm/versions/node/v22.22.1 \
  ~/.nvm/versions/node/v22.22.1/bin/npm install -g repomix@latest
```

Verify:

```bash
~/.nvm/versions/node/v22.22.1/bin/repomix --version
```

---

## 2. Add to mcporter

Edit `~/.mcporter/mcporter.json` and add:

```json
"repomix": {
  "command": "/home/YOUR_USER/.nvm/versions/node/v22.22.1/bin/repomix",
  "args": ["--mcp"]
}
```

Verify the 6 tools are visible:

```bash
npx mcporter list repomix
```

Expected tools: `pack_codebase`, `pack_remote_repository`, `read_repomix_output`, `grep_repomix_output`, `file_system_read_file`, `file_system_read_directory`

---

## 3. Create the skill file

Create `~/.claude/skills/repomix.md` — this file lives alongside other user skills (e.g. `nuxt.md`, `sequential-thinking`). **Do not put it inside `~/.claude/plugins/cache/...`** — that's the plugin system's internal cache and will be overwritten on updates.

Copy the skill from this repo:

```bash
cp /path/to/this/repo/04-uiux/  # see ~/.claude/skills/repomix.md in this machine's setup
```

Or copy the content from `~/.claude/skills/repomix.md` on a configured machine.

The skill covers: when to invoke repomix, MCP tool reference, CLI usage, config format, 04-uiux integration.

---

## 4. Add a repomix.config.json to your project

In your project root (e.g. `04-uiux/`):

```json
{
  "output": {
    "filePath": "repomix-output/repo.xml",
    "style": "xml",
    "compress": false,
    "fileSummary": true,
    "directoryStructure": true
  },
  "ignore": {
    "useGitignore": true,
    "customPatterns": ["repomix-output/**", "dist/**", "node_modules/**", "*.lock"]
  },
  "tokenCount": {
    "encoding": "o200k_base"
  }
}
```

---

## 5. Generate outputs

```bash
cd your-project/
repomix                                          # → repomix-output/repo.xml
repomix --style markdown -o repomix-output/summary.md  # optional human-readable version
```

---

## Key facts to remember

| Thing | Location |
|-------|----------|
| User skills | `~/.claude/skills/*.md` |
| Plugin skills (don't touch) | `~/.claude/plugins/cache/.../skills/` |
| mcporter config | `~/.mcporter/mcporter.json` |
| Per-project config | `repomix.config.json` in project root |
| MCP start flag | `repomix --mcp` |

## MCP vs CLI

- **MCP tools** (`pack_codebase`, etc.) — preferred during active Claude sessions, no file writes needed
- **CLI** (`repomix`) — use when you want to write `repo.xml` / `summary.md` to disk for later reference

Use `compress: true` (or `--compress`) on large repos to cut token count ~70% via Tree-sitter signature extraction.
