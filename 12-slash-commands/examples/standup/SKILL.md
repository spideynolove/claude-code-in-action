---
name: standup
description: Generate a daily standup update from recent git activity
disable-model-invocation: true
allowed-tools: Bash(git log:*), Bash(git diff:*)
---

# Standup

## Recent activity

Commits in the last 24 hours:
!`git log --oneline --since="24 hours ago" --author="$(git config user.name)" 2>/dev/null || git log --oneline -10`

Changed files:
!`git diff --name-only HEAD~3..HEAD 2>/dev/null | head -20`

## Your task

Write a standup update in this format:

**Yesterday**: What was completed (from commits above)
**Today**: Logical next steps based on the work in progress
**Blockers**: None (or note if the diff shows something stuck/incomplete)

Keep it under 5 bullet points total. Use plain language, not commit message syntax.
