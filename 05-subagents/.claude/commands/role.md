Switch to a specialized role for focused, Evidence-First analysis.

## Usage

```
/role <role-name> [--agent]
```

## Available Roles

| Role | Specialization | Model |
|------|---------------|-------|
| `security` | OWASP / LLM security / threat modeling | opus |
| `architect` | System design / ADR / evolutionary architecture | opus |
| `reviewer` | Code quality / Clean Code / style guides | sonnet |
| `analyzer` | Root cause / 5 Whys / systems thinking | opus |

## Options

- (no flag) — activates role persona in current session context
- `--agent` — spawns role as a sub-agent with independent context (use for large-scale analysis: full codebase security audit, large PR review, deep root cause investigation)

## Examples

```bash
/role security
"Check authentication for vulnerabilities"

/role architect
"Evaluate whether to split this service into microservices"

/role reviewer
"Review the changes in PR #42"

/role analyzer
"Investigate why the API response time spiked yesterday at 14:00"

/role security --agent
"Full OWASP audit of the entire codebase"
```

## When to Use --agent

| Situation | Use |
|-----------|-----|
| Simple focused check | `/role security` |
| Full codebase audit | `/role security --agent` |
| Interactive discussion | `/role architect` |
| Independent audit report | `/role architect --agent` |

## Combining Roles

For trade-off decisions involving multiple domains, use `/role-debate` instead.

```bash
/role-debate security,performance
"JWT expiry time: what's the right setting?"
```

## Return to Normal

```
/role default
```
