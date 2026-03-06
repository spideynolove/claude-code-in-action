# Auto-Simplify Workflow Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Automatically enforce the `/simplify` step after 5+ file edits, blocking further prompts until simplify has run.

**Architecture:** Two Claude Code hooks in `.claude/hooks/` organized by event-type folder. `PostToolUse/counter.py` tracks edits per session in temp files and signals Claude via stderr at threshold. `UserPromptSubmit/gate.py` detects `/simplify` invocations (resets the cycle) and gates subsequent prompts until simplify runs.

**Tech Stack:** Python 3 stdlib only, Claude Code hooks API, session-scoped temp files in `/tmp/`.

---

### Task 1: Scaffold folder structure

**Files:**
- Create: `03-auto-simplify/.claude/settings.json`
- Create: `03-auto-simplify/.claude/hooks/PostToolUse/` (dir)
- Create: `03-auto-simplify/.claude/hooks/UserPromptSubmit/` (dir)

**Step 1: Create directories**

```bash
mkdir -p 03-auto-simplify/.claude/hooks/PostToolUse
mkdir -p 03-auto-simplify/.claude/hooks/UserPromptSubmit
mkdir -p 03-auto-simplify/docs/plans
```

**Step 2: Create `.claude/settings.json`**

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write|NotebookEdit",
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/PostToolUse/counter.py\""
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "python3 \"$CLAUDE_PROJECT_DIR/.claude/hooks/UserPromptSubmit/gate.py\""
          }
        ]
      }
    ]
  }
}
```

**Step 3: Commit**

```bash
git add 03-auto-simplify/
git commit -m "chore: scaffold 03-auto-simplify hook structure"
```

---

### Task 2: Write `PostToolUse/counter.py`

Fires after every `Edit`, `Write`, or `NotebookEdit`. Increments a per-session counter. At threshold, exits 2 so Claude sees the stderr message and invokes simplify.

**Files:**
- Create: `03-auto-simplify/.claude/hooks/PostToolUse/counter.py`

**Step 1: Write the hook**

```python
#!/usr/bin/env python3
import json
import sys
from pathlib import Path

THRESHOLD = 5


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    session_id = data.get("session_id", "unknown")
    count_file = Path(f"/tmp/cc-edits-{session_id}")
    done_file = Path(f"/tmp/cc-simplified-{session_id}")

    if done_file.exists():
        done_file.unlink()
        count_file.write_text("0")
        sys.exit(0)

    count = int(count_file.read_text()) if count_file.exists() else 0
    count += 1
    count_file.write_text(str(count))

    if count >= THRESHOLD:
        print(
            f"[AUTO-SIMPLIFY] {count} file edits this session. "
            "Invoke the simplify skill now before continuing. "
            "Use: Skill(skill='simplify')",
            file=sys.stderr,
        )
        sys.exit(2)


if __name__ == "__main__":
    main()
```

**Step 2: Make executable**

```bash
chmod +x 03-auto-simplify/.claude/hooks/PostToolUse/counter.py
```

**Step 3: Commit**

```bash
git add 03-auto-simplify/.claude/hooks/PostToolUse/counter.py
git commit -m "feat: add PostToolUse edit counter hook"
```

---

### Task 3: Write `UserPromptSubmit/gate.py`

Fires before every user prompt. Two roles:
1. If prompt is `/simplify` → mark done, reset counter, let through
2. If count ≥ threshold and simplify not done → exit 2 (blocks prompt, shows error to user)

**Files:**
- Create: `03-auto-simplify/.claude/hooks/UserPromptSubmit/gate.py`

**Step 1: Write the hook**

```python
#!/usr/bin/env python3
import json
import sys
from pathlib import Path

THRESHOLD = 5


def main():
    try:
        data = json.load(sys.stdin)
    except json.JSONDecodeError:
        sys.exit(0)

    session_id = data.get("session_id", "unknown")
    prompt = data.get("prompt", "").strip()
    count_file = Path(f"/tmp/cc-edits-{session_id}")
    done_file = Path(f"/tmp/cc-simplified-{session_id}")

    if prompt.lower().startswith("/simplify"):
        done_file.touch()
        count_file.write_text("0")
        sys.exit(0)

    count = int(count_file.read_text()) if count_file.exists() else 0

    if count >= THRESHOLD and not done_file.exists():
        print(
            f"[AUTO-SIMPLIFY] {count} edits pending simplification. "
            "Type /simplify before continuing.",
            file=sys.stderr,
        )
        sys.exit(2)


if __name__ == "__main__":
    main()
```

**Step 2: Make executable**

```bash
chmod +x 03-auto-simplify/.claude/hooks/UserPromptSubmit/gate.py
```

**Step 3: Commit**

```bash
git add 03-auto-simplify/.claude/hooks/UserPromptSubmit/gate.py
git commit -m "feat: add UserPromptSubmit simplify gate hook"
```

---

### Task 4: Write README.md

**Files:**
- Create: `03-auto-simplify/README.md`

**Step 1: Write README covering:**
- What this does and why
- Hook folder structure (event-type folders, not prefixed filenames)
- The workflow cycle: code → 5 edits → auto-signal → /simplify → reset → repeat
- How to test: open a project with this `.claude/`, edit 5 files, observe the block

**Step 2: Commit**

```bash
git add 03-auto-simplify/README.md
git commit -m "docs: add 03-auto-simplify README"
```

---

## Cycle Diagram

```
[edit file] → counter.py increments
                  │
                  ▼
             count < 5? → continue normally
                  │
             count >= 5?
                  │
                  ▼
         exit 2 → stderr shown to Claude
                  │
                  ▼
         Claude invokes Skill(simplify)
                  │
         User types /simplify
                  │
                  ▼
         gate.py detects /simplify
         → done_file.touch(), count reset to 0
                  │
                  ▼
         Next edit: done_file exists
         → counter.py clears done_file, resets
         → new cycle begins
```

## Testing

1. Open Claude Code with cwd = `03-auto-simplify/`
2. Ask Claude to edit any 5 files
3. On the 5th edit, Claude should receive the stderr message and invoke simplify
4. After simplify, ask Claude to edit again — counter resets, cycle restarts
5. If you type a prompt before running simplify, the prompt is blocked with an error
