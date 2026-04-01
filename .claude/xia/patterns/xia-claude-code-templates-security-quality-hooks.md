---
source: https://github.com/davila7/claude-code-templates
extracted: 2026-03-25
---

# Security & Quality Gate Hooks from claude-code-templates

**Gap filled:** No PreToolUse hooks enforcing secrets scanning, dangerous command blocking, TDD gating, conventional commits, or spec-before-code discipline
**Constraints applied:** No comments, no docstrings, minimal code, clean outputs

## Pattern

Five PreToolUse hooks wired via `.claude/settings.json`:

1. `secret-scanner.py` — scans staged files against 35+ regex patterns; exits 2 on critical/high secrets
2. `dangerous-command-blocker.py` — 3-level guard: catastrophic block, critical-path block, suspicious warning
3. `conventional-commits.py` — validates git commit -m message format; JSON deny response
4. `tdd-gate.sh` — finds test file for production file being edited; exits 2 if none found
5. `plan-gate.sh` — warns (exit 0) if no .spec.md modified in last 14 days

## Seam

`26-security-quality-hooks/.claude/hooks/` + `.claude/settings.json`

Hook registration pattern:
```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [{ "type": "command", "command": "python3 .claude/hooks/secret-scanner.py" }] },
      { "matcher": "Edit|Write|MultiEdit", "hooks": [{ "type": "command", "command": "bash .claude/hooks/tdd-gate.sh" }] }
    ]
  }
}
```

## Delta from original

- Removed all docstrings and inline comments (CLAUDE.md constraint)
- Simplified stderr output (removed emoji-heavy formatting, kept essential messages)
- Reduced suspicious_patterns in dangerous-command-blocker to 3 most relevant
- Removed scope-guard.sh (requires active .spec.md workflow not yet established in A)
- Removed prevent-direct-push and validate-branch-name (low value for solo learning repo)
