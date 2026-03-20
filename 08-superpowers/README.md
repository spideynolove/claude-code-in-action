# 08 — Superpowers Integration

## Why Superpowers works differently on CC vs Codex

**Claude Code** → doubles capability
**Codex** → reduces capability by ~10%

### Root cause

Superpowers is a meta-instruction system tuned against Claude's reasoning style. The mechanism differs per tool:

| | Claude Code | Codex |
|---|---|---|
| Instruction reading | Contextual / soft heuristics | Literal / uniform application |
| When planning fires | Selectively (Claude applies judgment) | On every task |
| TDD instructions | Applied when relevant | Applied always |
| Result | Amplifies existing judgment | Overrides existing judgment |

Claude Code reads `CLAUDE.md` as guidelines and decides when to apply them. Codex treats `AGENTS.md` instructions as unconditional rules. Superpowers' TDD + planning scaffolding adds a **second planning layer on top of Codex's already-strong internal planner** — creating redundant reasoning that burns tokens without adding signal.

### What this folder contains

```
08-superpowers/
├── README.md                    ← this file
├── AGENTS-minimal.md            ← Codex-optimized alternative (~20 lines)
├── CLAUDE-verbosity-wrapper.md  ← prepend to CLAUDE.md to constrain Superpowers output
└── claude-commands/
    ├── workflow-install.md      ← /workflow-install slash command
    ├── workflow-uninstall.md    ← /workflow-uninstall slash command
    ├── plan-only.md             ← /plan-only slash command
    └── implement.md             ← /implement slash command
```

### Recommended setup per tool

**Claude Code** — keep Superpowers, optionally add verbosity wrapper:
```
CLAUDE.md
  └── [optional] prepend CLAUDE-verbosity-wrapper.md content
  └── existing Superpowers content
.claude/commands/
  └── plan-only.md, implement.md
```

**Codex** — replace Superpowers with minimal file:
```
AGENTS.md  ← copy content from AGENTS-minimal.md
            (no Superpowers, no TDD bias, ~20 lines)
```
