# 19 — Filesystem Context

Adapted from [agent-skills-for-context-engineering](../00-materials/repo/agent-skills-for-context-engineering/skills/filesystem-context/).

Six patterns for using the filesystem as an unlimited context extension. The core idea: write once, read selectively — only the relevant portion enters the context window when needed.

## Install

```bash
cp .claude/skills/filesystem-context.md ~/.claude/skills/filesystem-context.md
```

## What's here

```
19-filesystem-context/
├── .claude/skills/filesystem-context.md  ← install to ~/.claude/skills/
├── README.md
└── .claude/
    └── scratch/      ← convention: session-local offload directory
```

## Key patterns vs folders in this repo

| Pattern | Maps to |
|---------|---------|
| Scratch pad (tool output offloading) | New convention; add `.claude/scratch/` to any project |
| Plan persistence | `.claude/last-session.md` written by Stop hook in `03-auto-simplify/` |
| Sub-agent communication via files | Extends `05-subagents/` (implicit → explicit convention) |
| Dynamic skill loading | `~/.claude/skills/` — already the production implementation |
| Self-modification | `~/.claude/projects/<hash>/memory/` — already running |

## Add to .gitignore

```
.claude/scratch/
```
