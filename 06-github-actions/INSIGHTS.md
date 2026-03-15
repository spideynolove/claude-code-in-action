# GitHub Actions + Claude Code — Insights

Everything learned from testing multi-user collaboration on `manhhungdt06/gecko-shit`.

## Key Discoveries

### 1. OAuth tokens work in CI (not just API keys)

Initial assumption: "Claude Code in GitHub Actions requires ANTHROPIC_API_KEY — OAuth doesn't work in CI."

**Wrong.** The `anthropics/claude-code-action@v1` has a dedicated `claude_code_oauth_token` input.
Pro/Max users generate a long-lived token with `claude setup-token`.
One token covers all workflows on the repo. Valid for 1 year.

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
```

### 2. GitHub is an event bus, not just version control

Any actor (human or AI) that can write to GitHub can trigger any agent
listening via GitHub Actions. The actor doesn't need to be on the same machine,
same network, or even same organization.

```
Actor writes @claude in issue → GitHub fires issue_comment event →
Actions workflow triggers → Claude Code runs in ephemeral VM →
Claude commits, opens PR, responds → Actor reads the result
```

### 3. Multi-agent on the same repo

Different LLMs coexist via separate workflow files and trigger phrases:

| Workflow | Trigger | Secret | Agent |
|---|---|---|---|
| `claude.yml` | `@claude` | `CLAUDE_CODE_OAUTH_TOKEN` | Claude Code (native action) |
| `deepseek.yml` | `@deepseek` | `DEEPSEEK_API_KEY` | DeepSeek (custom API step) |
| `minimax.yml` | `@minimax` | `MINIMAX_API_KEY` | MiniMax (custom API step) |

Agents can chain: one agent's output (PR, comment) triggers another's workflow.
Claude Code has the most mature action — others need custom `curl` + `jq` steps.

### 4. Same Claude Pro account = one token

If two users on the same PC share one Claude Pro subscription, they share one
`CLAUDE_CODE_OAUTH_TOKEN`. The token is per-account, not per-machine.

Different trigger phrases just distinguish who requested what in the logs.

### 5. SSH aliases solve multi-account git, but NOT gh CLI

SSH config maps aliases to different keys:
```
Host github.com-dt6 → manhhungdt06
Host github.com     → spideynolove
Host github.com-bana → mar1katach1bana
```

`git push/pull` works perfectly through these aliases.
`gh` CLI ignores SSH aliases — it uses its own OAuth token for API calls.
This means `gh api`, `gh secret set`, `gh repo create` always run as
whichever account is in `~/.config/gh/hosts.yml`.

**Solution**: detect the expected user from `ssh -T git@<alias>` and warn
if `gh api user` doesn't match. See `hook/gh-auth-switch.sh`.

### 6. /install-github-app is the official path

Claude Code has a built-in `/install-github-app` command that:
1. Installs the Claude GitHub App on the repo
2. Prompts for the API key or OAuth token
3. Creates a PR with the workflow files

For automated setup without the interactive command, use the skill
`setup-github-actions.md` which does the same thing programmatically.

### 7. custom_instructions is deprecated — use claude_args

The v1 action deprecates `custom_instructions` in favor of:
```yaml
claude_args: |
  --system-prompt "Your project rules here"
  --allowedTools "Read,Write,Edit,Bash(cargo:*)"
  --max-turns 15
```

Also deprecated: `mode`, `direct_prompt`, `allowed_tools`, `model`, `max_turns`.
All replaced by `claude_args` or `prompt`.

### 8. Plugins and MCP servers work in Actions

```yaml
claude_args: |
  --mcp-config '{"mcpServers": {"thinking": {"command": "npx", "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]}}}'
  --allowedTools mcp__thinking__sequentialthinking

plugins: "code-review@claude-code-plugins"
plugin_marketplaces: "https://github.com/user/marketplace.git"
```

### 9. CI failure auto-fix is built-in

With `actions: read` permission, Claude can read CI logs and fix failures:
```yaml
additional_permissions: |
  actions: read
```

This enables tools: `mcp__github_ci__get_ci_status`, `mcp__github_ci__download_job_log`.

### 10. Remote collaborators don't need Claude Code installed

`mar1katach1bana` on a company machine only needs:
- Git + SSH access to clone/push
- A browser to write `@claude` on GitHub

Claude Code runs in GitHub's cloud, not on anyone's machine.

## Test Results from gecko-shit

| Test | Result |
|---|---|
| manhhungdt06 push (SSH via github.com-dt6) | ✅ |
| spideynolove push (SSH via github.com) | ✅ |
| mar1katach1bana push (SSH via github.com-bana) | ✅ |
| spideynolove create branch + push | ✅ |
| Owner fetch guest's branch | ✅ |
| gh CLI access to manhhungdt06 repo | ❌ (authed as hungtran19940412) |
| claude setup-token | ✅ (token generated) |

## Architecture Decision

**GitHub as agent communication bus.**

Why: async, works offline, audit-trailed, no direct machine-to-machine
connection needed. Agents run in ephemeral GH Actions VMs with fresh
repo clones. The local repo on any machine is just one consumer of
the shared state.

Tradeoffs: 1-5 min latency per round-trip, GH Actions minutes cost
(2000 free/month private, unlimited public), `allowed_tools` must be
explicit (no interactive approval in CI).
