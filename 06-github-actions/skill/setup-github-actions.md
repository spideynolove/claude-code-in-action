---
name: setup-github-actions
description: Auto-detect SSH identity, set up Claude Code GitHub Actions workflows, configure secrets, and install the Claude GitHub App. Handles multi-account SSH configs.
---

# Setup GitHub Actions for Claude Code

Automate the full GitHub Actions setup for any project with Claude Code integration.

## Phase 1 — Detect identity from SSH config

Do NOT ask the user which GitHub account to use. Detect it:

```bash
REMOTE_URL=$(git remote get-url origin 2>/dev/null)
SSH_HOST=$(echo "$REMOTE_URL" | sed -n 's/^git@\([^:]*\):.*/\1/p')
GITHUB_USER=$(ssh -T "git@${SSH_HOST}" 2>&1 | grep -oP 'Hi \K[^!]+')
REPO_PATH=$(echo "$REMOTE_URL" | sed -n 's/^git@[^:]*:\(.*\)\.git$/\1/p')
```

Report to the user: "Detected: repo **$REPO_PATH** owned by **$GITHUB_USER** (via SSH host `$SSH_HOST`)"

If the remote is HTTPS (not SSH), extract the owner from the URL directly.

## Phase 2 — Check gh CLI auth

```bash
GH_USER=$(gh api user -q '.login' 2>/dev/null)
```

If `$GH_USER` != `$GITHUB_USER`:
- Tell the user: "gh CLI is authenticated as **$GH_USER**, but the repo belongs to **$GITHUB_USER**."
- Ask: "Should I proceed with git-only operations (workflows will be pushed but secrets can't be set via CLI), or do you want to switch gh auth first?"
- If the user wants to switch: guide them to run `gh auth login -h github.com` in another terminal, then resume.
- If proceeding without gh: skip Phase 4 (secret) and Phase 5 (app install), but still create and push workflow files.

## Phase 3 — Generate workflow files

Check if `.github/workflows/` already exists. If so, list existing files and ask before overwriting.

Create these workflows:

### claude.yml (mention + issue support)
```yaml
name: Claude Code
on:
  issue_comment:
    types: [created]
  pull_request_review_comment:
    types: [created]
  pull_request_review:
    types: [submitted]
  issues:
    types: [opened, assigned]

jobs:
  claude:
    if: |
      (github.event_name == 'issue_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review_comment' && contains(github.event.comment.body, '@claude')) ||
      (github.event_name == 'pull_request_review' && contains(github.event.review.body, '@claude')) ||
      (github.event_name == 'issues' && (contains(github.event.issue.body, '@claude') || contains(github.event.issue.title, '@claude')))
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      issues: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 1
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          additional_permissions: |
            actions: read
```

### claude-pr-review.yml (auto PR review)
```yaml
name: Claude PR Review
on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      id-token: write
      actions: read
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: anthropics/claude-code-action@v1
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          additional_permissions: |
            actions: read
```

If the project has language-specific needs (detected from Cargo.toml, package.json, pyproject.toml, go.mod), add setup steps before the Claude action:

| File detected | Add before Claude step |
|---|---|
| `Cargo.toml` | `dtolnay/rust-toolchain@stable` + `Swatinem/rust-cache@v2` |
| `package.json` | `actions/setup-node@v4` with `.nvmrc` or `lts/*` |
| `pyproject.toml` | `actions/setup-python@v5` |
| `go.mod` | `actions/setup-go@v5` |

Also add `custom_instructions` in `claude_args --system-prompt` if CLAUDE.md exists — extract key rules from it.

## Phase 4 — Set CLAUDE_CODE_OAUTH_TOKEN secret

Check if the user already has a token:
```bash
# Check environment
echo $CLAUDE_CODE_OAUTH_TOKEN
```

If not set, tell the user:
"Run `claude setup-token` in another terminal to generate a token, then paste it here."

Once the token is available:
```bash
echo "$TOKEN" | gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo "$REPO_PATH"
```

If gh CLI auth is mismatched (Phase 2), provide the web UI URL:
"Add the secret at: https://github.com/$REPO_PATH/settings/secrets/actions"

## Phase 5 — Install Claude GitHub App

Check if already installed:
```bash
gh api repos/$REPO_PATH/installation -q '.app_slug' 2>/dev/null
```

If not installed, tell the user:
"Install the Claude app at: https://github.com/apps/claude — select the repo **$REPO_PATH**"

## Phase 6 — Commit and push

```bash
git add .github/workflows/
git commit -m "feat: add Claude Code GitHub Actions integration"
git push origin $(git branch --show-current)
```

## Phase 7 — Verify

Tell the user how to test:
"Open an issue on https://github.com/$REPO_PATH and comment: `@claude list all files in this repo`"

## Customization hooks

If the user asks for:
- **Multiple agent triggers**: Create additional workflow files with different `trigger_phrase` values, all pointing to the same `CLAUDE_CODE_OAUTH_TOKEN`
- **Different AI agents**: Create separate workflows (deepseek.yml, etc.) with their own API key secrets and custom run steps
- **CI workflow**: Detect project language and generate appropriate CI workflow (cargo/npm/pytest/go test)
- **MCP servers in Actions**: Use `claude_args: --mcp-config <path>` with a generated config file step
