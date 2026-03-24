#!/usr/bin/env python3
import json
import subprocess
import sys


def main():
    try:
        data = json.loads(sys.stdin.read())
    except json.JSONDecodeError:
        sys.exit(0)

    title = data.get("title", "Claude Code")
    message = data.get("message", "Waiting for input")

    try:
        subprocess.run(
            ["notify-send", title, message],
            capture_output=True,
            timeout=5,
        )
    except (FileNotFoundError, subprocess.TimeoutExpired, OSError):
        pass


if __name__ == "__main__":
    main()
