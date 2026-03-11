# mcp-knowledge-graph Setup

How to install and wire mcp-knowledge-graph into a Claude Code environment.

---

## What this gives you

- `mcp-knowledge-graph` CLI running as MCP server
- 10 `aim_memory_*` tools available in-session via mcporter
- `~/.claude/skills/mcp-knowledge-graph/SKILL.md` skill for Claude to follow
- A per-project `.aim/` directory for persistent knowledge storage

---

## 1. Install globally under your Node version

```bash
npm_config_prefix=~/.nvm/versions/node/v22.22.1 \
  ~/.nvm/versions/node/v22.22.1/bin/npm install -g mcp-knowledge-graph
```

Verify (it will print "Knowledge Graph MCP Server running on stdio" — that's correct):

```bash
~/.nvm/versions/node/v22.22.1/bin/mcp-knowledge-graph --help
```

---

## 2. Add to mcporter

Edit `~/.mcporter/mcporter.json`:

```json
"knowledge-graph": {
  "command": "/home/YOUR_USER/.nvm/versions/node/v22.22.1/bin/mcp-knowledge-graph",
  "args": ["--memory-path", "/home/YOUR_USER/.aim"]
}
```

`--memory-path` is the global fallback directory. Project-local storage (`.aim/` in project root) takes precedence automatically when available.

Verify:

```bash
npx mcporter list knowledge-graph
```

Expect 10 tools: `aim_memory_store`, `aim_memory_link`, `aim_memory_add_facts`, `aim_memory_forget`, `aim_memory_remove_facts`, `aim_memory_unlink`, `aim_memory_read_all`, `aim_memory_search`, `aim_memory_get`, `aim_memory_list_stores`

---

## 3. Create the skill file

Create `~/.claude/skills/mcp-knowledge-graph/SKILL.md` — copy from `~/.claude/skills/mcp-knowledge-graph/SKILL.md` on a configured machine.

---

## 4. Initialize project-local storage

In any project where you want a project-scoped knowledge graph:

```bash
mkdir .aim
```

Add to `.gitignore` if you don't want to commit the graph:

```
.aim/*.jsonl
```

Or commit it if sharing architectural context with a team is valuable.

---

## The combo: repomix + knowledge-graph

The workflow that makes this useful:

```
Session 1 (setup):
  repomix.pack_codebase(directory: "/your/project", compress: true)
  → read and analyze the packed output
  → aim_memory_store entities (services, modules, key files)
  → aim_memory_link relations (depends_on, calls, owns)

Session 2+ (working):
  aim_memory_search("auth")         ← fast, no repacking needed
  aim_memory_get(["AuthService"])   ← exact lookup
```

**Why this combination works:**
- repomix gives you a full content snapshot for initial analysis
- knowledge-graph persists the *distilled structure* — you never re-read 50 files to remember what depends on what
- Together they separate "reading the codebase" (one-time) from "remembering its architecture" (persistent)

---

## Key facts

| Thing | Location |
|-------|----------|
| Global memory | `~/.aim/memory.jsonl` |
| Project memory | `.aim/memory.jsonl` in project root |
| Named context | `.aim/memory-{context}.jsonl` |
| Storage format | JSONL — full rewrite on each write |
| Search type | Case-insensitive substring (not semantic) |
| Concurrency | None — single writer only |

## Limitations to know

- **No semantic search** — keyword precision matters when storing observations
- **Full file rewrite** per operation — keep graphs focused, not exhaustive
- **No locking** — don't run two Claude sessions writing to the same `.aim/` simultaneously
- **Project detection** searches up 5 dirs for `.git`, `package.json`, `.aim`, etc.
