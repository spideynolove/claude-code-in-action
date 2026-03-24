# 24 — Token Efficiency Mode

Adapted from [wasabeef/claude-code-cookbook](../00-materials/claude-code-cookbook/plugins/en/commands/token-efficient.md).

Prompt-level compression protocol for Claude's response style. Reduces explanation tokens by 30–50% in long sessions without changing code quality or accuracy.

Complements `18-context-engineering` (tool-output-level compression) — together they cover both sides of context management.

## Install

```bash
mkdir -p ~/.claude/skills/token-efficiency
cp .claude/skills/token-efficiency.md ~/.claude/skills/token-efficiency/SKILL.md
```

## Activation

Tell Claude at the start of a long session:

```
"Token Efficiency Mode on"
"Respond in --uc mode"
```

Disable: `"Return to normal mode"`

## Compression levels

| Flag | Level | When |
|------|-------|------|
| `--lc` | Light | Prefer readability, reduce slightly |
| `--mc` | Moderate | Default for long sessions |
| `--uc` | Ultra | Near context limit |

Combine with domain flags: `--dev`, `--ops`, `--sec`

## Key takeaways

- Code output is unchanged — only prose explanations are compressed
- Use `--mc` as the default; switch to `--uc` when context gets heavy
- Symbols (`→ ⇒ » ∴ ∵`) replace verbose logical connectives
- Domain icons (`⚡ 🛡️ 🧪 🗄️ 🏗️`) replace domain category words
- Abbreviation table (`cfg`, `impl`, `arch`, `perf`, `auth`, `sec`…) replaces long technical nouns

## Two-level context management

| Level | What is compressed | Tool |
|-------|--------------------|------|
| Response style | Claude's prose explanations | Token Efficiency Mode (this module) |
| Tool outputs | Read/Bash/Grep observation data | `/compact`, scoped reads (`18-context-engineering`) |

Use both together in heavy sessions: enable `--mc` for explanations, use `/compact` for tool outputs.

## When NOT to use

- Initial requirements or onboarding conversations
- Explanations for non-technical stakeholders
- Generating documentation
