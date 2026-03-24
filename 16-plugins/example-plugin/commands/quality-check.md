---
name: quality-check
description: Run a quality gate on the current diff — security, logic, tests. Use before opening a PR.
allowed-tools: Bash(git diff:*), Bash(git log:*), Read, Grep
---

# Quality Check

## Scope

Changed files:
!`git diff --name-only HEAD`

Diff summary:
!`git diff --stat HEAD`

## Checks

Run these in order, stop and report if any fail:

1. **Security** — scan for hardcoded secrets, unvalidated input, SQL concatenation
2. **Logic** — look for off-by-one errors, null dereferences, missing error handling
3. **Tests** — verify new functions have corresponding test cases
4. **Cleanup** — flag leftover debug statements, commented-out code, TODO without ticket

## Output format

For each issue found:

```
[severity] file:line
Issue: <description>
Fix:   <specific change needed>
```

If no issues: output `✓ Quality gate passed`.
