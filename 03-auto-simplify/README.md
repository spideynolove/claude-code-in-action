# 03-auto-simplify

Automated code simplification enforcement via Claude Code hooks.

## What This Does

Turns `/simplify` from an on-demand command into a mandatory pipeline step. After 5 file edits in a session:

- **Claude is signaled** (via PostToolUse stderr) to invoke the simplify skill immediately
- **User prompts are blocked** (via UserPromptSubmit exit 2) until `/simplify` has run
- After simplify runs, the counter resets and the cycle starts over

## Workflow

```
code → edit file (x5) → [AUTO-SIMPLIFY signal]
     → Claude runs /simplify
     → counter resets
     → code again
```

## Hook Structure

Hooks are organized by event-type folder, matching the Claude Code hook event names:

```
.claude/
  settings.json                    ← registers hooks
  hooks/
    PostToolUse/
      counter.py                   ← tracks edits, signals at threshold
    UserPromptSubmit/
      gate.py                      ← detects /simplify, blocks prompts
```

This mirrors the event names in the docs (`PostToolUse`, `UserPromptSubmit`) rather than using filename prefixes like `posttooluse_counter.py`. The path makes the event type self-evident.

## How Hooks Are Wired

`settings.json` registers each script with its event and matcher:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|NotebookEdit",
        "hooks": [{ "type": "command", "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/PostToolUse/counter.py\"" }]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [{ "type": "command", "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/UserPromptSubmit/gate.py\"" }]
      }
    ]
  }
}
```

## State

Both hooks share two per-session temp files:

| File | Purpose |
|------|---------|
| `/tmp/cc-edits-{session_id}` | Current edit count |
| `/tmp/cc-simplified-{session_id}` | Flag: simplify was run this cycle |

Session ID comes from the hook's stdin JSON (`session_id` field), so state is isolated per Claude Code session automatically.

## Exit Code Mechanics

| Hook | Exit | Effect |
|------|------|--------|
| `PostToolUse/counter.py` | 2 | stderr shown to Claude → Claude invokes simplify |
| `UserPromptSubmit/gate.py` | 2 | Prompt blocked, erased, error shown to user |
| Both | 0 | Allow through, no action |

## Testing

1. Open Claude Code with cwd set to this folder (`03-auto-simplify/`)
2. Ask Claude to edit 5+ files
3. On the 5th edit: Claude should receive the `[AUTO-SIMPLIFY]` stderr and call the simplify skill
4. Try submitting a prompt before `/simplify` runs: it should be blocked
5. Type `/simplify` or let Claude run it: counter resets, next batch starts clean

## Threshold

Default is 5 edits. Change `THRESHOLD = 5` in both hooks to adjust.
