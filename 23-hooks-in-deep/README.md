# 23-hooks-in-deep

Advanced Claude Code hook types adapted from [disler/claude-code-hooks-mastery](https://github.com/disler/claude-code-hooks-mastery).

## Hooks

### SubagentStop
Fires when a spawned subagent finishes. Reads the subagent's transcript (`agent_transcript_path`) to extract the original task, then logs to `logs/subagent_stop.jsonl`.

**Key field:** `agent_transcript_path` — distinct from the parent session's `transcript_path`. Falls back to `transcript_path` if absent.

### PreCompact
Fires before `/compact` rewrites the conversation. Copies the full transcript JSONL to `logs/transcript_backups/` with a timestamp. This is the only moment the full transcript is available before compaction.

**Key field:** `trigger` — `"manual"` (user ran `/compact`) or `"auto"` (context limit hit).

## Sharp edges

| Hook | Trap | Guard |
|------|------|-------|
| Stop (see 03-auto-simplify) | Outputting text triggers another Stop → infinite loop | Check `stop_hook_active` first; exit 0 immediately if True |
| SubagentStop | `agent_transcript_path` may be absent in older Claude Code versions | Fall back to `transcript_path` |
| PreCompact | Transcript may not exist yet at hook fire time | Check `Path(transcript_path).exists()` before copying |

## Structure

```
23-hooks-in-deep/
├── .claude/
│   ├── hooks/
│   │   ├── SubagentStop/subagent_stop.py
│   │   └── PreCompact/pre_compact.py
│   └── settings.json
├── logs/
│   ├── subagent_stop.jsonl
│   └── transcript_backups/
└── README.md
```
