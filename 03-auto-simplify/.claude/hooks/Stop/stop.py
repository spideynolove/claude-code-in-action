#!/usr/bin/env python3
import json
import sys
from datetime import datetime
from pathlib import Path


def format_session_entry(session_id: str, transcript_path: str) -> str:
    # TODO: implement this — return a string to append to last-session.md
    # Options to consider:
    #   - Minimal: just session_id + timestamp (2 lines)
    #   - Rich: parse transcript_path JSONL, count tool calls, extract last user message
    #   - Middle: session_id + timestamp + line count of transcript
    # Trade-off: minimal = always fast + never fails; rich = more useful but adds file I/O risk
    raise NotImplementedError


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    if data.get("stop_hook_active", False):
        sys.exit(0)

    session_id = data.get("session_id", "unknown")
    transcript_path = data.get("transcript_path", "")

    try:
        entry = format_session_entry(session_id, transcript_path)
    except Exception:
        sys.exit(0)

    out = Path(__file__).parents[3] / "last-session.md"
    try:
        with out.open("a") as f:
            f.write(entry + "\n")
    except OSError:
        pass


if __name__ == "__main__":
    main()
