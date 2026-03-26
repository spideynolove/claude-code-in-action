---
source: https://github.com/runkids/skillshare
extracted: 2026-03-26
---

# Skill Sync Adapter from runkids/skillshare

**Gap filled:** No mechanism to export Claude Code skills to Codex CLI; skills lived only in .claude/skills/ with no cross-tool reach
**Constraints applied:** No comments, no docstrings; stdlib only (json, os, sys, pathlib); no Windows junction code; no web UI

## Pattern

`~/.claude/hooks/sync-skills-to-codex.py` — PostToolUse hook + standalone sync script

Core: walk source dir, find dirs containing SKILL.md, check `targets:` frontmatter, create symlink at target path, track in manifest JSON, prune removed skills.

```python
def parse_targets(skill_md_path):
    content = skill_md_path.read_text()
    if not content.startswith("---"):
        return None
    try:
        end = content.index("---", 3)
    except ValueError:
        return None
    front = content[3:end]
    for line in front.splitlines():
        if line.strip().startswith("targets:"):
            val = line.split(":", 1)[1].strip().strip("[]")
            return [t.strip() for t in val.split(",") if t.strip()]
    return None
```

Hook entry: reads stdin JSON event, gates on `tool_name in (Edit, Write)` and `".claude/skills" in file_path`, then runs sync. Direct invocation skips the gate.

```python
def is_skill_edit(event):
    tool_name = event.get("tool_name", "")
    if tool_name not in ("Edit", "Write"):
        return False
    file_path = event.get("tool_input", {}).get("file_path", "")
    return ".claude/skills" in file_path or "SKILL.md" in file_path
```

Manifest at `~/.codex/skills/.skillshare-manifest.json`:
```json
{"managed": {"skill-name": "symlink"}}
```
Prune step removes symlinks whose keys are no longer in found set.

## Seam

- `~/.claude/settings.json` → `PostToolUse` hook array
- `~/.claude/skills/` → source directory (env: `SKILLSHARE_SOURCE`)
- `~/.codex/skills/` → target directory (env: `SKILLSHARE_CODEX_TARGET`)

## Delta from original

- Stripped: Windows junction support, web UI, TUI, security audit engine, hub sync, GitLab support, extras system, copy mode, cross-machine git sync
- Kept: symlink mode, merge strategy, manifest tracking, prune, targets frontmatter filter, dry-run, env var overrides
- Added: Claude Code PostToolUse hook integration (stdin JSON event parsing); dual-mode invocation (hook vs. direct CLI)
- Renamed: no renaming needed; script is standalone
