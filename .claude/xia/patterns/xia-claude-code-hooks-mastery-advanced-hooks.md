---
source: https://github.com/disler/claude-code-hooks-mastery
extracted: 2026-03-24
---

# Advanced Hook Types from claude-code-hooks-mastery

**Gap filled:** Stop, Notification, SubagentStop, PreCompact hooks — none existed in A
**Constraints applied:** no comments, no docstrings; TTS stack replaced with notify-send; LLM summarizer in SubagentStop dropped; stop_hook_active guard preserved

## Pattern

Stop hook — session end logging with infinite-loop guard:

```python
def main():
    data = json.load(sys.stdin)
    if data.get("stop_hook_active", False):
        sys.exit(0)
    # ... log session_id + timestamp to .claude/last-session.md
```

Notification hook — stdin → notify-send:

```python
def main():
    data = json.loads(sys.stdin.read())
    title = data.get("title", "Claude Code")
    message = data.get("message", "Waiting for input")
    subprocess.run(["notify-send", title, message], capture_output=True, timeout=5)
```

SubagentStop hook — extract task from agent transcript JSONL:

```python
transcript_path = data.get("agent_transcript_path") or data.get("transcript_path", "")
```

PreCompact hook — backup transcript before /compact rewrites it:

```python
trigger = data.get("trigger", "manual")  # "manual" | "auto"
shutil.copy2(transcript_path, backup_dir / f"{stem}_{trigger}_{ts}.jsonl")
```

## Seam

- Stop + Notification → `03-auto-simplify/.claude/hooks/` + `settings.json`
- SubagentStop + PreCompact → `12-hooks-in-deep/.claude/hooks/` + `settings.json`

## Delta from original

- Dropped entire TTS stack (ElevenLabs → OpenAI → pyttsx3 fallback chain)
- Replaced TTS in Notification with `notify-send` (Linux desktop notification, zero deps)
- Dropped LLM summarizer from SubagentStop (adds anthropic dependency; out of scope for learning repo)
- Stop hook writes to `.claude/last-session.md` (markdown append) instead of `logs/stop.json` (JSON array) — simpler, human-readable
- SubagentStop logs to `.jsonl` (one entry per line) instead of JSON array — better for streaming append without read-parse-write cycle
- format_session_entry() left as user contribution point — meaningful design choice with real trade-offs
