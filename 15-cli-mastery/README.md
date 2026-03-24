# 15-cli-mastery

`claude` as a scriptable CLI tool — print mode, JSON output, piping, session management, CI/CD.

## Two Modes

```
claude                         ← interactive REPL (default)
claude -p "query"              ← print mode: query → response → exit
```

Print mode (`-p` / `--print`) is the foundation of everything else in this folder. It's what makes Claude scriptable.

## Core Patterns

### Pipe content in

```bash
cat error.log | claude -p "explain this error"
git diff HEAD  | claude -p "summarize these changes"
cat src/auth.ts | claude -p "review for security issues"
```

### Pipe output out

```bash
claude -p "list all API endpoints in src/" | grep "POST"
claude -p "generate SQL migration for adding users table" > migration.sql
```

### JSON output for scripts

```bash
claude -p --output-format json "find all TODO comments and return as {todos: []}"
```

JSON output is stable for `jq` processing:

```bash
claude -p --output-format json "list issues" \
  | jq -r '.issues[] | select(.severity=="high") | .description'
```

Enforce a schema so the shape is guaranteed:

```bash
claude -p \
  --json-schema '{"type":"object","properties":{"secure":{"type":"boolean"},"issues":{"type":"array"}}}' \
  "audit src/auth.ts for vulnerabilities" < src/auth.ts
```

### Limit autonomous turns

```bash
claude -p --max-turns 3 "refactor the auth module"
```

Prevents runaway agentic sessions in CI.

## Session Management

```bash
claude -c                            # continue most recent session
claude -r "feature-auth"             # resume by name
claude -r "feature-auth" "continue implementing password reset"
claude --resume feature-auth --fork-session "try OAuth instead"
```

Named sessions let you context-switch between parallel workstreams:

```bash
claude -r "backend-api"   "add rate limiting"
claude -r "frontend-ui"   "fix the nav mobile layout"
claude -r "backend-api"   "review the rate limit tests"
```

## Permission Control

```bash
# Read-only — won't touch files
claude --permission-mode plan "audit this codebase"

# Pre-approve specific tools
claude --allowedTools "Bash(git log:*)" "Read" "query"

# Block dangerous operations
claude --disallowedTools "Bash(rm:*)" "Bash(git push:*)" "query"
```

## Model Selection

```bash
claude --model opus   "design a caching strategy"    # most capable
claude --model sonnet "implement this feature"        # balanced (default)
claude --model haiku  -p "format this JSON"           # fastest, cheapest
claude --model opusplan "design and build the API"    # Opus plans, Sonnet executes
```

## CI/CD Integration

See `examples/ci-review.yml` for a full GitHub Actions workflow.

Key pattern — structured review in CI:

```bash
claude -p \
  --output-format json \
  --max-turns 1 \
  "Review the staged changes for security issues, performance regressions, and missing tests.
   Return JSON: {issues: [{severity, file, line, description}]}" \
  > review.json

# Fail CI if critical issues found
if jq -e '[.issues[] | select(.severity=="critical")] | length > 0' review.json; then
  echo "Critical issues found — blocking merge"
  jq -r '.issues[] | select(.severity=="critical") | "  \(.file):\(.line) \(.description)"' review.json
  exit 1
fi
```

## Batch Processing

```bash
for file in src/**/*.ts; do
  claude -p --model haiku "one-line summary" < "$file" >> summaries.txt
done
```

## Environment Variables

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Auth (required for non-OAuth) |
| `ANTHROPIC_MODEL` | Override default model |
| `CLAUDE_CODE_EFFORT_LEVEL` | `low` / `medium` / `high` (Opus 4.6) |
| `MAX_THINKING_TOKENS` | Budget for extended thinking |

## Quick Reference

| Use case | Command |
|----------|---------|
| Quick question | `claude -p "how do I..."` |
| File review | `cat file.py \| claude -p "review"` |
| Structured output | `claude -p --output-format json "query"` |
| CI code review | `claude -p --max-turns 1 --output-format json "review"` |
| Continue work | `claude -r "session-name"` |
| Read-only audit | `claude --permission-mode plan "audit"` |
