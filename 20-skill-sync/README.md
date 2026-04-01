# 20 — Skill Sync (Claude → Codex + Qwen)

One source of truth at `~/.claude/skills/`. Symlinked to every AI CLI tool that reads plain SKILL.md files.

```
~/.claude/skills/my-skill/SKILL.md   ← write here once
         ↓ ln -s
~/.codex/skills/my-skill/            ← Codex CLI reads this
~/.qwen/skills/my-skill/             ← Qwen Code reads this
```

## Files

| File | Purpose |
|------|---------|
| `hooks/sync-skills-to-codex.py` | The sync script — walk source, create symlinks, prune orphans |
| `skills/sync-to-codex/SKILL.md` | Claude Code skill that documents the workflow |

## Installation (new PC)

### 1 — Copy the hook script

```bash
mkdir -p ~/.claude/hooks
cp hooks/sync-skills-to-codex.py ~/.claude/hooks/
chmod +x ~/.claude/hooks/sync-skills-to-codex.py
```

Or if using `claude-dotfiles`:

```bash
cd ~/Documents/spideynolove/claude-dotfiles
bash install.sh
```

### 2 — Register the PostToolUse hook in settings.json

Add to `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 ~/.claude/hooks/sync-skills-to-codex.py --hook"
          }
        ]
      }
    ]
  }
}
```

If `PostToolUse` already exists, append to its array.

### 3 — Copy the skill (optional)

```bash
mkdir -p ~/.claude/skills/sync-to-codex
cp skills/sync-to-codex/SKILL.md ~/.claude/skills/sync-to-codex/
```

### 4 — Run the first sync

```bash
python3 ~/.claude/hooks/sync-skills-to-codex.py
```

## Testing

### Verify sync ran

```bash
ls -la ~/.codex/skills/     # should show symlinks → ~/.claude/skills/
ls -la ~/.qwen/skills/      # same
cat ~/.codex/skills/.skillshare-manifest.json
```

### Dry-run (safe preview)

```bash
python3 ~/.claude/hooks/sync-skills-to-codex.py --dry-run
```

### Test the hook fires

In a Claude Code session, edit any skill file. The PostToolUse hook should print `[codex] linked: ...` / `[qwen] linked: ...` output.

### Test targets: filtering

Add `targets: [claude]` to a skill's frontmatter, run sync, verify that skill disappears from `~/.codex/skills/` (pruned).

### Test prune

```bash
rm -rf ~/.claude/skills/some-skill/
python3 ~/.claude/hooks/sync-skills-to-codex.py
# Output: [codex] pruned: some-skill
```

## Env vars

| Variable | Default | Purpose |
|----------|---------|---------|
| `SKILLSHARE_SOURCE` | `~/.claude/skills` | Source skill directory |
| `SKILLSHARE_CODEX_TARGET` | `~/.codex/skills` | Override codex target only |
| `SKILLSHARE_QWEN_TARGET` | `~/.qwen/skills` | Override qwen target only |

## Tools detected on this PC

| Tool | Version | Skills path |
|------|---------|-------------|
| Codex CLI | 0.116.0 | `~/.codex/skills/` |
| Qwen Code | 0.12.0 | `~/.qwen/skills/` |
