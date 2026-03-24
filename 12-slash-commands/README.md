# 12-slash-commands

Custom slash commands as skills — reusable prompts invoked with `/command-name`.

## Concept

Skills live in `.claude/skills/<name>/SKILL.md`. They become `/command-name` in any Claude Code session that loads them. The old `.claude/commands/<name>.md` still works but skills are the current standard — they support auto-invocation, bundled files, and subagent execution.

```
.claude/
└── skills/
    └── my-command/
        └── SKILL.md        ← frontmatter + prompt body
```

## Frontmatter Fields

```yaml
---
name: command-name               # becomes /command-name
description: When and why to use this. Claude reads this for auto-invocation.
argument-hint: <arg>             # shown in autocomplete
allowed-tools: Bash(git *), Read # tools usable without permission prompt
disable-model-invocation: true   # user-only — Claude won't auto-trigger
context: fork                    # run in isolated subagent context
---
```

## Three Patterns

### 1. Static prompt
No dynamic data. Just instructions.

```yaml
---
name: debug
description: Systematic debug analysis for the current problem
---
Analyze the error, trace the root cause, propose a fix.
```

### 2. Dynamic context via `!`
Shell commands run at invocation time, output injected into the prompt.

```yaml
---
name: standup
description: Generate a standup report
allowed-tools: Bash(git log:*)
---
Commits since yesterday: !`git log --oneline --since="1 day ago"`
Write a standup update from the above.
```

### 3. Arguments via `$ARGUMENTS`
```yaml
---
name: fix-issue
description: Fix a GitHub issue by number
---
Fix issue #$ARGUMENTS following project conventions.
```

Individual args: `$0`, `$1`, etc. — invoke as `/fix-issue 123 high`

## Install

```bash
# Project-scoped (team)
mkdir -p .claude/skills/debug
cp 12-slash-commands/examples/debug/SKILL.md .claude/skills/debug/

# Personal (all projects)
mkdir -p ~/.claude/skills/standup
cp 12-slash-commands/examples/standup/SKILL.md ~/.claude/skills/standup/
```

## Examples in This Folder

| Example | Pattern | Shows |
|---------|---------|-------|
| `examples/debug/` | Static | Focused instructions, no side effects |
| `examples/standup/` | Dynamic + `disable-model-invocation` | Shell context injection, user-only trigger |
| `examples/review/` | Arguments + allowed-tools | `$ARGUMENTS`, permission scoping |

## Key Rules

- `description` is how Claude decides when to auto-invoke — be specific about trigger conditions
- Use `disable-model-invocation: true` for commands with side effects (deploy, push, standup)
- `allowed-tools` pre-approves specific tool patterns so Claude doesn't prompt for permission
- If a skill and a legacy command share the same name, **skill wins**
