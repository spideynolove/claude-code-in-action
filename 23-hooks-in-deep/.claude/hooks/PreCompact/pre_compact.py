#!/usr/bin/env python3
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    transcript_path = data.get("transcript_path", "")
    trigger = data.get("trigger", "manual")

    if not transcript_path or not Path(transcript_path).exists():
        sys.exit(0)

    backup_dir = Path(__file__).parents[3] / "logs" / "transcript_backups"
    try:
        backup_dir.mkdir(parents=True, exist_ok=True)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        stem = Path(transcript_path).stem
        backup_path = backup_dir / f"{stem}_{trigger}_{ts}.jsonl"
        shutil.copy2(transcript_path, backup_path)
    except OSError:
        pass


if __name__ == "__main__":
    main()
