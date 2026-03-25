#!/usr/bin/env python3
import json
import os
import sys
import tempfile
from pathlib import Path

CONTEXT_THRESHOLD = 85

def get_session_id(data):
    session_id = data.get("session_id", "")
    if session_id:
        return session_id[:8]
    return os.environ.get("CLAUDE_SESSION_ID", str(os.getppid()))

def read_context_pct(data):
    tmp_file = Path(tempfile.gettempdir()) / f"claude-context-pct-{get_session_id(data)}.txt"
    try:
        if tmp_file.exists():
            return int(tmp_file.read_text().strip())
    except (ValueError, OSError):
        pass
    return None

def main():
    data = json.load(sys.stdin)
    if data.get('stop_hook_active'):
        print('{}')
        sys.exit(0)
    pct = read_context_pct(data)
    if pct is None:
        print('{}')
        sys.exit(0)
    if pct >= CONTEXT_THRESHOLD:
        print(json.dumps({"decision": "block", "reason": f"Context at {pct}%. Run: /create-handoff"}))
    else:
        print('{}')

if __name__ == "__main__":
    main()
