---
name: sync-to-codex
description: Sync Claude Code skills to Codex CLI via filesystem symlinks. One source of truth at ~/.claude/skills/, symlinked into ~/.codex/skills/. Respects targets: frontmatter field.
argument-hint: "[--dry-run]"
---

# sync-to-codex

Syncs skills from `~/.claude/skills/` → `~/.codex/skills/` using symlinks.

Both tools read plain markdown SKILL.md files from their own paths. The sync creates symlinks so there is one source file, two tool paths. No translation needed — the format is identical.

## How it works

```
~/.claude/skills/my-skill/SKILL.md   ← one source
         ↓ symlink
~/.codex/skills/my-skill/            ← Codex CLI reads this
```

The hook at `~/.claude/hooks/sync-skills-to-codex.py` fires automatically after any Edit or Write to a file in `.claude/skills/`.

## Manual sync

```bash
python3 ~/.claude/hooks/sync-skills-to-codex.py
```

Dry-run (preview only, no filesystem changes):

```bash
python3 ~/.claude/hooks/sync-skills-to-codex.py --dry-run
```

Custom source or target:

```bash
SKILLSHARE_SOURCE=~/.claude/skills \
SKILLSHARE_CODEX_TARGET=~/.codex/skills \
python3 ~/.claude/hooks/sync-skills-to-codex.py
```

## Filtering with targets: frontmatter

Add `targets:` to a SKILL.md frontmatter to control which tools receive it:

```yaml
---
name: my-skill
description: ...
targets: [claude, codex]   # both tools
---
```

```yaml
---
targets: [claude]          # Claude Code only — skip Codex
---
```

Omitting `targets:` entirely syncs the skill to all tools (default).

Skills using `$ARGUMENTS` (Claude Code-specific) still work in Codex if Codex ignores unknown variables — but exclude them with `targets: [claude]` if you want clean separation.

## Manifest

`~/.codex/skills/.skillshare-manifest.json` tracks which symlinks were created by this tool vs. manually placed files. The prune step only removes symlinks it created — user-placed files are never touched.

## When to run manually

- After installing a new Claude Code skill globally
- After bulk-editing multiple skills at once
- To verify sync state: `--dry-run` shows what would change
