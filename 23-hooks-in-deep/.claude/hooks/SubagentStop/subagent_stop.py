#!/usr/bin/env python3
import json
import sys
from datetime import datetime
from pathlib import Path


def extract_first_user_message(transcript_path: str) -> str:
    if not transcript_path:
        return ""
    try:
        with open(transcript_path) as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    entry = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if entry.get("type") == "user":
                    content = entry.get("message", {}).get("content", "")
                    if isinstance(content, list):
                        for block in content:
                            if isinstance(block, dict) and block.get("type") == "text":
                                return block.get("text", "")[:200]
                    if isinstance(content, str):
                        return content[:200]
    except OSError:
        pass
    return ""


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    transcript_path = data.get("agent_transcript_path") or data.get("transcript_path", "")
    task = extract_first_user_message(transcript_path)

    log_path = Path(__file__).parents[3] / "logs" / "subagent_stop.jsonl"
    try:
        log_path.parent.mkdir(parents=True, exist_ok=True)
        entry = {
            "ts": datetime.now().isoformat(),
            "session_id": data.get("session_id", ""),
            "task": task,
        }
        with log_path.open("a") as f:
            f.write(json.dumps(entry) + "\n")
    except OSError:
        pass


if __name__ == "__main__":
    main()
