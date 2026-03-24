# claude-hud Setup Guide

## Prerequisites

- Claude Code CLI installed
- `bun` or `node` available in PATH

---

## Linux: Cross-Device Filesystem Check

Run this first on Linux before installing anything:

```bash
[ "$(df --output=source ~ /tmp 2>/dev/null | tail -2 | uniq | wc -l)" = "2" ] && echo "CROSS_DEVICE" || echo "OK"
```

If `CROSS_DEVICE` is printed, `/tmp` and home are on different filesystems. All `claude plugin` commands must be prefixed with `TMPDIR=~/.cache/tmp`:

```bash
mkdir -p ~/.cache/tmp
```

Use `TMPDIR=~/.cache/tmp claude plugin ...` instead of `claude plugin ...` for every command below.

---

## Step 1: Add the Marketplace

```bash
claude plugin marketplace add jarrodwatts/claude-hud
```

---

## Step 2: Install the Plugin

```bash
claude plugin install claude-hud
```

Check state after install:

```bash
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
CACHE_EXISTS=$(ls -d "$CLAUDE_DIR/plugins/cache/claude-hud" 2>/dev/null && echo "YES" || echo "NO")
REGISTRY_EXISTS=$(grep -q "claude-hud" "$CLAUDE_DIR/plugins/installed_plugins.json" 2>/dev/null && echo "YES" || echo "NO")
echo "Cache: $CACHE_EXISTS | Registry: $REGISTRY_EXISTS"
```

| Cache | Registry | Action |
|-------|----------|--------|
| YES   | YES      | Proceed |
| YES   | NO       | Ghost install — run cleanup below |
| NO    | YES      | Ghost install — run cleanup below |
| NO    | NO       | Installation failed — retry |

**Cleanup (ghost install):**
```bash
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
rm -rf "$CLAUDE_DIR/plugins/cache/claude-hud"
rm -rf "$CLAUDE_DIR/plugins/cache/temp_local_"*
echo '{"version": 2, "plugins": {}}' > "$CLAUDE_DIR/plugins/installed_plugins.json"
```
Then restart Claude Code and reinstall from Step 1.

---

## Step 3: Detect Runtime

```bash
command -v bun 2>/dev/null || command -v node 2>/dev/null
```

- If result ends in `bun` → source file is `src/index.ts`
- If result ends in `node` → source file is `dist/index.js`

Install Node.js or Bun if neither found.

---

## Step 4: Test the Command

```bash
bash -c 'plugin_dir=$(ls -d "${CLAUDE_CONFIG_DIR:-$HOME/.claude}"/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | tail -1); exec "/path/to/runtime" "${plugin_dir}src/index.ts"' 2>&1
```

Replace `/path/to/runtime` with the path from Step 3. Expected output: `[claude-hud] Initializing...`

> **Note**: Use `tail -1` to resolve the version subdirectory — avoids the awk/cut approach which breaks on trailing-slash paths.

---

## Step 5: Apply Settings

The `/claude-hud:setup` skill only loads after a restart, so configure `~/.claude/settings.json` directly in the current session. Add the `statusLine` field:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bash -c 'plugin_dir=$(ls -d \"${CLAUDE_CONFIG_DIR:-$HOME/.claude}\"/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | tail -1); exec \"/path/to/runtime\" \"${plugin_dir}src/index.ts\"'"
  }
}
```

Replace `/path/to/runtime` with the full path from Step 3.

---

## Step 6: Optional Features

Create `~/.claude/plugins/claude-hud/config.json`:

```json
{
  "display": {
    "showTools": true,
    "showAgents": true,
    "showTodos": true,
    "showDuration": true,
    "showConfigCounts": true,
    "showSessionName": true
  }
}
```

Include only the keys you want — omit any key to use the default (off).

| Key | What it shows |
|-----|---------------|
| `showTools` | Running/completed tools |
| `showAgents` | Subagent status |
| `showTodos` | Todo progress |
| `showDuration` | Session duration |
| `showConfigCounts` | CLAUDE.md, rules, MCP counts |
| `showSessionName` | Session slug or custom title |

---

## Step 7: Restart Claude Code

Quit and rerun `claude`. The HUD appears below the input field.
