---
name: review
description: Code review for a specific file or the current diff. Invoke as /review path/to/file.ts or /review for the staged diff.
argument-hint: [file-path]
allowed-tools: Read, Bash(git diff:*), Bash(git show:*)
---

# Code Review

## Target

$ARGUMENTS

## Context

Current diff:
!`git diff HEAD -- $ARGUMENTS 2>/dev/null || git diff HEAD`

## Review checklist

Go through in this order:

1. **Correctness** — does the logic do what it claims? Edge cases?
2. **Security** — injection risks, unvalidated input, exposed secrets
3. **Error handling** — unhandled exceptions, silent failures
4. **Simplicity** — anything that could be shorter without losing clarity
5. **Naming** — variables, functions, files — are they honest about what they do?

Format each finding as:

```
[severity: critical/high/medium/low] file:line
Issue: <what is wrong>
Fix: <exact change>
```

Skip categories with no findings. No summary paragraph.
