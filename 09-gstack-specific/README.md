# 09 — Personal Kit: Merging gstack + ecc-tools

Building a personal Claude Code workflow kit by selectively merging two public skill systems
(gstack, everything-claude-code) with an existing superpowers setup.

## Relationship to 08-superpowers

| Concern | 08-superpowers | 09-gstack-specific |
|---|---|---|
| Planning | Output verbosity control (`/plan-only`, `/implement`) | Structured workflow artifacts (`/office-hours` → `/plan-eng-review`) |
| CLAUDE.md | Verbosity wrapper (prepend) | Testing/TS/Security rules (append) |
| Commands | workflow-install, plan-only, implement | learn, e2e, loop-start, loop-status |
| Cross-tool | Codex-optimized AGENTS.md | Claude Code only |

These are **additive, not conflicting** — 08 controls how Claude responds; 09 adds what Claude knows how to do.

---

## What's in this folder

```
09-gstack-specific/
├── README.md                          ← this file
├── claude-agents/                     ← language reviewer + automation agents (ecc-tools)
│   ├── typescript-reviewer.md
│   ├── python-reviewer.md
│   ├── go-reviewer.md
│   ├── rust-reviewer.md
│   ├── refactor-cleaner.md
│   ├── loop-operator.md
│   └── e2e-runner.md
├── claude-commands/                   ← slash commands (ecc-tools)
│   ├── learn.md                       ← extract session patterns into skill files
│   ├── e2e.md                         ← invoke e2e-runner for Playwright testing
│   ├── loop-start.md                  ← start autonomous loop
│   └── loop-status.md                 ← check loop progress
└── claude-rules/
    ├── CLAUDE-additions.md            ← append to CLAUDE.md (Testing + TS + Security)
    └── settings-dedup-fix.json        ← fix duplicate superpowers plugin in settings.json
```

**gstack** is cloned directly into `~/.claude/skills/gstack/` — no files to copy here since
the whole repo is the skill. Install: `git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack`

---

## The Three Systems Compared

| System | What it is | Size | Primary value |
|---|---|---|---|
| **gstack** (garrytan/gstack) | Sprint-based workflow skills | 21 skills | Artifact chaining (design docs → planning → ship) |
| **ecc-tools** (affaan-m/everything-claude-code) | Production-hardened agent toolkit | 28 agents, 116 skills, 59 cmds | Session memory hooks + autonomous loops |
| **agent-skills-standard** (HoangNguyen0403) | Framework knowledge compression | 229 skills, ~400 tokens each | On-demand 9x token savings vs full prompts |

---

## Overlap Analysis

When combining kits, the key question is: **when two things do the same job, which one wins?**

| Capability | Winner | Why |
|---|---|---|
| Systematic debugging | superpowers (already installed) | Already available; don't duplicate |
| Code review | gstack `/review` | Auto-fixes obvious issues — unique behavior |
| Feature planning | superpowers | Already installed |
| TDD | superpowers | Already installed |
| Shipping / PR pipeline | gstack `/ship` | Nothing else matches its full pipeline |
| Session memory | Both | episodic-memory plugin + ecc-tools hooks are different mechanisms |
| Pattern learning | ecc-tools `/learn` | Unique: extracts session patterns into skill files |
| Browser / E2E | ecc-tools | More mature than gstack `/qa` |
| Autonomous loops | ecc-tools `/loop-operator` | More flexible than conductor.json |
| Post-ship docs | gstack `/document-release` | No equivalent elsewhere |

---

## Setup on a Fresh Machine

```bash
# 1. gstack — clone as a skill
git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack

# 2. ecc-tools agents — copy from this folder
cp claude-agents/*.md ~/.claude/agents/

# 3. ecc-tools commands — copy from this folder
cp claude-commands/*.md ~/.claude/commands/

# 4. CLAUDE.md rules — append from this folder
cat claude-rules/CLAUDE-additions.md >> ~/.claude/CLAUDE.md

# 5. settings.json — apply dedup fix manually (see claude-rules/settings-dedup-fix.json)
#    Set "superpowers@claude-plugins-official": false in enabledPlugins
```

---

## Stack Filter Applied

Dropped from ecc-tools (not in stack): Java, Kotlin, PHP, Swift, Android, Perl, C++ agents.
Stack: **Python, Go, Rust, TypeScript**.

---

## Process: Adapting Any Shared Kit to Your Workflow

### 1. Capability Audit
List everything. Group into:
`Planning | Debugging | Review | Testing | Shipping | Knowledge | Automation | Memory`

### 2. Stack Filter
Drop anything outside your language/framework stack immediately.

### 3. Overlap Elimination (pick-one rule)
When two items do the same job, keep whichever is:
- More structured (clear phases, defined output)
- Better integrated with other things you keep
- Lower token cost per invocation

### 4. Perspective Filter
Ask: "Would I invoke this on a real project day?"
Drop CEO reviews, investor materials, board-level scope management if you're a solo dev.

### 5. Assemble by Layer
```
Layer 1: Framework Knowledge  (on-demand, per-file context)
Layer 2: Workflow Governance  (planning → review → ship)
Layer 3: Automation/Memory    (hooks, loops, pattern extraction)
Layer 4: Meta-tools           (repomix, sequential-thinking, codegraphcontext)
```

### 6. Calibrate in Practice
After 1-2 weeks: audit which skills you never invoke → delete them.
Run `/learn` at end of productive sessions to grow your kit organically.

---

## Key Findings

**ecc-tools hooks ≠ standalone scripts**
All hooks use `${CLAUDE_PLUGIN_ROOT}` and delegate to Node.js scripts — a cohesive plugin,
not composable pieces. Install via `npm install everything-claude-code` if full hook system needed.

**gstack auto-loads without registration**
After `git clone` into `~/.claude/skills/gstack/`, all skills appear immediately. Claude Code
scans `~/.claude/skills/` on startup — no manifest needed.

**loop-operator is an agent, not a command**
The command layer uses `/loop-start` and `/loop-status` for lifecycle management.

**Duplicate plugin = double token cost**
`superpowers@claude-plugins-official` + `superpowers@superpowers-marketplace` both enabled
loads every skill twice (~600 extra tokens/session). Fix: disable the `claude-plugins-official` copy.
