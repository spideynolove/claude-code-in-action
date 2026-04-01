# 26 — Security & Quality Gate Hooks

Borrowed from `davila7/claude-code-templates`. Five PreToolUse hooks forming a defense-in-depth enforcement layer.

## Hooks

| Hook | Trigger | Behavior |
|------|---------|----------|
| `secret-scanner.py` | `Bash` (git commit) | Blocks commit if 35+ secret patterns detected (API keys, tokens, private keys, DB strings) |
| `dangerous-command-blocker.py` | `Bash` | Blocks catastrophic commands (rm /*, dd, mkfs); blocks critical path deletions (.git, .env, node_modules); warns on force-push/reset |
| `conventional-commits.py` | `Bash` (git commit) | Blocks non-conventional commit messages; enforces `type(scope)?: description` |
| `tdd-gate.sh` | `Edit`, `Write`, `MultiEdit` | Blocks editing production code if no corresponding test file exists |
| `plan-gate.sh` | `Edit`, `Write`, `MultiEdit` | Warns (non-blocking) when editing source without a `.spec.md` modified in last 14 days |

## Key Concepts

**Hook exit codes:**
- `exit 0` — allow the tool call
- `exit 2` — block with stderr message shown to Claude
- JSON output with `permissionDecision: "deny"` — structured denial with reason

**Defense layers:**
1. System safety (`dangerous-command-blocker`) — prevents irreversible OS damage
2. Secret safety (`secret-scanner`) — prevents credential leaks
3. Process safety (`conventional-commits`, `tdd-gate`, `plan-gate`) — enforces workflow discipline

## Installation

Copy `.claude/hooks/` and `.claude/settings.json` into your project root.

Run `chmod +x .claude/hooks/*.py .claude/hooks/*.sh` to make executable.
