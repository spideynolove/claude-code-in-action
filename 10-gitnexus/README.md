# GitNexus — Setup Guide

Graph-powered code intelligence for Claude Code. Indexes any codebase via AST parsing, provides call chains, blast-radius analysis, and ambient context injection via hooks.

---

## What GitNexus gives you

| Capability | How |
|---|---|
| Structural graph of your codebase | Tree-sitter AST parsing of 13 languages |
| Call chain tracing | Cross-file import + call resolution |
| Blast radius analysis | Who calls what, at depth 1/2/3 |
| Ambient context | PreToolUse hooks auto-augment every Grep/Glob/Bash |
| Session startup context | SessionStart hook prints tool guide |
| Stale index detection | PostToolUse hook checks HEAD vs last indexed commit |
| 7 task-specific skills | exploring, debugging, impact-analysis, refactoring, pr-review, cli, guide |

---

## Installation (any machine)

### 1. Install gitnexus globally

```bash
npm install -g gitnexus
# or with npx (no global install needed):
npx gitnexus --version
```

### 2. Register MCP with Claude Code

```bash
claude mcp add gitnexus npx gitnexus mcp
```

Verify:
```bash
claude mcp list
# → gitnexus: npx gitnexus mcp
```

### 3. Copy hooks to ~/.claude/hooks/gitnexus/

```bash
mkdir -p ~/.claude/hooks/gitnexus
cp .claude/hooks/pre-tool-use.sh ~/.claude/hooks/gitnexus/
cp .claude/hooks/session-start.sh ~/.claude/hooks/gitnexus/
chmod +x ~/.claude/hooks/gitnexus/*.sh
```

### 4. Wire hooks in ~/.claude/settings.json

Merge this into your `~/.claude/settings.json` under `"hooks"`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Grep|Glob|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash /home/YOUR_USER/.claude/hooks/gitnexus/pre-tool-use.sh"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "bash /home/YOUR_USER/.claude/hooks/gitnexus/pre-tool-use.sh"
          }
        ]
      }
    ],
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash /home/YOUR_USER/.claude/hooks/gitnexus/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

Replace `YOUR_USER` with your actual username.

### 5. Copy skills to ~/.claude/skills/

```bash
mkdir -p ~/.claude/skills/gitnexus
cp .claude/skills/*.md ~/.claude/skills/gitnexus/
```

### 6. Index a project

```bash
cd /path/to/your/project
npx gitnexus analyze
```

This creates `.gitnexus/` in the project root (a LadybugDB graph database). Run once, then hooks keep it current.

---

## Session Continuation

### Same machine, new session

`.gitnexus/` persists on disk. The SessionStart hook fires automatically and injects the tool guide. **Nothing to do** — just start Claude Code.

### Different machine

**Option A: Commit `.gitnexus/` to git** (fast resume, adds ~MB to repo)
```bash
# Remove .gitnexus from .gitignore, then:
git add .gitnexus/
git commit -m "Add gitnexus index"
git push
# On other machine: git pull → .gitnexus/ present → hooks work immediately
```

**Option B: Re-analyze on each machine** (clean, no storage overhead)
```bash
# On new machine after git pull:
npm install -g gitnexus
claude mcp add gitnexus npx gitnexus mcp
npx gitnexus analyze   # fast for most repos
```

### When to re-run `gitnexus analyze`

| Situation | Action |
|---|---|
| First time in project | `npx gitnexus analyze` |
| After major refactor (new modules, renamed files) | `npx gitnexus analyze` |
| After `git pull` with large changes | `npx gitnexus analyze` (PostToolUse hook will remind you) |
| Minor code changes | Not needed — index stays valid for call chains |
| `gitnexus://repo/{name}/context` says "Index is stale" | `npx gitnexus analyze` |

---

## Repomix + GitNexus: how they complement each other

| Tool | Gives you |
|---|---|
| `repomix` | WHAT the code says — full text, comments, logic |
| `gitnexus` | HOW the code is connected — call chains, dependencies |

**Ideal workflow:**
```
gitnexus_query("payment processing")  → find WHERE the relevant code lives
repomix.file_system_read_file(path)   → read WHAT that code does
```

---

## Workflow: repomix + knowledge-graph + handoff (the other MCPs)

This answers: **do I need to run /onboard again after updates?**

```
Session 1 (setup):
  /onboard → codebase-analyst → packs with repomix → stores in .aim/
  .aim/memory.jsonl is now populated on disk

Session 2+ (same PC):
  context-loader.sh UserPromptSubmit hook fires on EVERY prompt
  → reads .aim/memory.jsonl automatically
  → injects first 15 entities into Claude's context
  → NO manual loading needed, NO /onboard needed

After significant code changes:
  /onboard again → updates .aim/ with new architecture

/handoff:
  Generates .claude/handoff.md with current task state
  Commit it (or copy it) to continue on another PC
  On other PC: context-loader reads .aim/, Claude reads handoff.md
  → continuation without re-running /onboard
```

**Rule of thumb:**
- `/onboard` = initial setup OR after major structural changes
- `.aim/` = auto-loaded every session via hook (never manual)
- `/handoff` = checkpoint for cross-session or cross-machine continuation

---

## Quick Reference

```bash
npx gitnexus analyze          # Index / refresh the project
npx gitnexus status           # Check index freshness
npx gitnexus clean            # Delete index (before re-indexing)
npx gitnexus list             # List all indexed repos
npx gitnexus wiki             # Generate docs from the graph
```

MCP tools (available in Claude Code after `claude mcp add gitnexus`):

| Tool | Use |
|---|---|
| `gitnexus_query` | Find execution flows related to a concept |
| `gitnexus_context` | 360-degree symbol view (callers, callees, processes) |
| `gitnexus_impact` | Blast radius — what breaks if you change X |
| `gitnexus_detect_changes` | Map current git diff to affected flows |
| `gitnexus_rename` | Multi-file coordinated rename |
| `gitnexus_cypher` | Raw Cypher graph queries |
| `list_repos` | Discover indexed repos |

MCP resources (lightweight reads):

| Resource | Content |
|---|---|
| `gitnexus://repo/{name}/context` | Codebase overview + staleness check |
| `gitnexus://repo/{name}/clusters` | Functional areas |
| `gitnexus://repo/{name}/processes` | All execution flows |
| `gitnexus://repo/{name}/process/{name}` | Step-by-step trace |
| `gitnexus://repo/{name}/schema` | Graph schema for Cypher |

---

## Files in this directory

```
10-gitnexus/
├── README.md                        ← This file
└── .claude/
    ├── CLAUDE.md                    ← Instructions for Claude
    ├── settings.json                ← Hook config snippet (merge into ~/.claude/settings.json)
    ├── hooks/
    │   ├── pre-tool-use.sh          ← PreToolUse: augment Grep/Glob/Bash with graph context
    │   └── session-start.sh         ← SessionStart: print tool guide into Claude's context
    └── skills/
        ├── gitnexus-guide.md        ← Tool reference + when to use each skill
        ├── gitnexus-cli.md          ← CLI commands (analyze, status, clean, wiki, list)
        ├── gitnexus-exploring.md    ← Explore unfamiliar code
        ├── gitnexus-debugging.md    ← Trace bugs through call chains
        ├── gitnexus-impact-analysis.md  ← Blast radius before changes
        ├── gitnexus-pr-review.md    ← Review PRs using dependency context
        └── gitnexus-refactoring.md  ← Safe rename/extract/split
```

---

## Supported Languages

TypeScript, JavaScript, Python, Java, C, C++, C#, Go, Rust, PHP, Kotlin, Swift, Ruby

License: PolyForm Noncommercial 1.0.0 — free for personal and non-commercial use.
