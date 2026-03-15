# 06 — Claude Code GitHub Actions

Multi-user, multi-agent collaboration through GitHub as an event bus.

## Core Insight

GitHub is not just version control — it's a **message queue** for AI agents.
Any actor (human or AI) that can write to GitHub (issue, PR comment, label)
can trigger any agent listening via GitHub Actions workflows.

```
Machine A (you)          GitHub (event bus)           GH Actions (compute)
─────────────            ──────────────────           ───────────────────
git push ──────────────→ push event
                         PR opened ──────────────────→ claude-pr-review.yml
@claude fix X ─────────→ issue_comment ──────────────→ claude.yml
@deepseek implement Y ─→ issue_comment ──────────────→ deepseek.yml
                         ←── Claude commits, opens PR
git pull ←───────────── PR merged
```

## Authentication

| Method | Input | Who | How to get |
|---|---|---|---|
| OAuth token (Pro/Max) | `claude_code_oauth_token` | Interactive users | `claude setup-token` |
| API key | `anthropic_api_key` | API billing users | console.anthropic.com |
| Bedrock OIDC | `use_bedrock: true` | AWS users | IAM role |
| Vertex OIDC | `use_vertex: true` | GCP users | Service account |

Pro/Max users: **one token covers all workflows** on the same repo.
The token is per-account, not per-machine.

## Contents

| File | Purpose |
|---|---|
| `workflows/` | Ready-to-copy workflow templates |
| `skill/` | Claude Code skill for automated setup |
| `hook/` | SSH-aware `gh` auth helper |
| `INSIGHTS.md` | Full analysis from our testing session |

## Quick Start

```bash
# Inside any project with a git remote:
/setup-github-actions
```

The skill auto-detects your SSH identity, handles `gh` auth,
generates workflows, and adds the OAuth token as a secret.

## Multi-Agent Pattern

Multiple AI agents on the same repo, each with their own trigger:

| Trigger | Agent | Workflow | Secret |
|---|---|---|---|
| `@claude` | Claude Code | `claude.yml` | `CLAUDE_CODE_OAUTH_TOKEN` |
| `@claude-spidey` | Claude (alt user) | `claude-spidey.yml` | Same token (shared account) |
| `@deepseek` | DeepSeek | `deepseek.yml` | `DEEPSEEK_API_KEY` |

Agents can chain: Claude reviews DeepSeek's PR automatically.

## References

- [anthropics/claude-code-action](https://github.com/anthropics/claude-code-action) — official action
- [Setup guide](https://github.com/anthropics/claude-code-action/blob/main/docs/setup.md)
- [Custom automations](https://github.com/anthropics/claude-code-action/blob/main/docs/custom-automations.md)
- [Configuration](https://github.com/anthropics/claude-code-action/blob/main/docs/configuration.md)
- [Example workflows](https://github.com/anthropics/claude-code-action/tree/main/examples)
