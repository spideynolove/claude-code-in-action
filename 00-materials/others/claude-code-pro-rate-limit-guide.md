# Claude Code Pro Rate Limit — Diagnosis & Fix Guide

## The Problem

Claude Code Pro (OAuth) has no usage dashboard like the API. You cannot inspect per-request token counts. The only visible signal is the status line:

```
Usage ⚠ Limit reached (resets Xh Ym)
```

The limit resets on a rolling window (typically 1 hour). Heavy sessions can hit it in under 10 minutes.

---

## Why It Happens: Token Accounting

The rate limit counts **all effective tokens**, including cache reads — not just raw input/output. Every API turn re-reads the entire accumulated context from cache. This is the multiplier that burns through limits fast.

```
Effective tokens per turn = input_tokens + cache_read_input_tokens + cache_creation_input_tokens + output_tokens
```

A session with a 20k-token system prompt and 50 turns = ~1M tokens from cache reads alone, before any output.

---

## How to Diagnose a Session

Claude Code stores every session as a JSONL file:

```
~/.claude/projects/<project-path-slugified>/<session-id>.jsonl
```

The session ID appears in the Claude Code status line (e.g. `a42cd553-8d4a-4759-a528-afdbda3fe3cc`).

### Parse token usage

```python
import json

lines = open('~/.claude/projects/.../SESSION_ID.jsonl').readlines()

total_input, total_output, total_cache_read, total_cache_write = 0, 0, 0, 0
turns = []

for i, line in enumerate(lines):
    try:
        obj = json.loads(line)
        usage = obj.get('message', {}).get('usage', {})
        if not usage:
            continue
        inp = usage.get('input_tokens', 0)
        out = usage.get('output_tokens', 0)
        cr  = usage.get('cache_read_input_tokens', 0)
        cw  = usage.get('cache_creation_input_tokens', 0)
        total_input      += inp
        total_output     += out
        total_cache_read += cr
        total_cache_write+= cw
        turns.append((i, inp + cr + cw, cr + cw + inp))  # (line, effective, ctx_size)
    except:
        pass

print(f'Turns with usage: {len(turns)}')
print(f'Raw input:     {total_input:,}')
print(f'Output:        {total_output:,}')
print(f'Cache reads:   {total_cache_read:,}')
print(f'Cache writes:  {total_cache_write:,}')
print(f'TOTAL:         {total_input+total_output+total_cache_read+total_cache_write:,}')
```

### What to look for

- **First turn `cache_creation_input_tokens`** = your system prompt baseline size. This is written once and re-read every subsequent turn.
- **Growing `cache_read_input_tokens` across turns** = context accumulating from tool outputs.
- **High turn count** = multiplier on both of the above.

---

## Root Causes (Ranked by Impact)

### 1. Commands bloat — biggest single lever

Files in `~/.claude/commands/` are **fully injected into the system prompt every session**, whether you use the command or not. Each file's entire content is loaded.

Check your baseline:
```bash
du -sh ~/.claude/commands/*.md | sort -rh
wc -c ~/.claude/commands/*.md | sort -rn
```

Common offenders and their approximate token cost:

| File | Bytes | ~Tokens | Typical content |
|------|-------|---------|-----------------|
| `e2e.md` | 10,838 | 2,709 | Full Playwright example suite |
| `xia.md` | 7,584 | 1,896 | Multi-phase protocol |
| `xia-group.md` | 5,250 | 1,312 | Group orchestration |
| `detect-roles.md` | 3,794 | 948 | Detection logic |
| `create_plan.md` | 3,526 | 881 | Planning workflow |

**Fix:** If a command has a corresponding skill (available via the `Skill` tool), replace its body with a 1-line stub. The skill's full content only loads when actually invoked.

```markdown
---
description: Generate and run end-to-end tests with Playwright.
---

Invoke: `Skill(skill="e2e", args="$ARGUMENTS")`
```

Commands worth stubbing (have skill equivalents): `e2e`, `xia`, `xia-group`, `loop-start`, `loop-status`, `learn`, `onboard`, `detect-roles`, `startup`, `init-project`.

**Expected saving:** ~8,000–10,000 tokens per session on a 16-command setup.

### 2. Conflicting plugins

Enabled plugins inject their own system prompt fragments. Two specific ones also fight your CLAUDE.md rules:

- `explanatory-output-style` — overrides your conciseness rules
- `learning-output-style` — same

One also duplicates a system already in place:

- `episodic-memory` — competes with any auto-memory system you already have

**Fix in `~/.claude/settings.json`:**
```json
"explanatory-output-style@claude-plugins-official": false,
"learning-output-style@claude-plugins-official": false,
"episodic-memory@superpowers-marketplace": false
```

**Expected saving:** ~500–2,000 tokens per session.

### 3. Context accumulation from tool outputs

Each bash command result, file write echo, and agent return value is appended to the context and re-read every subsequent turn. A session that grows from 20k → 73k tokens over 50 turns accumulates:

```
avg ~47k × 50 turns = 2.35M cache-read tokens
```

**Fix:** Use `/compact` after each major task block (after research, before writing). This compresses accumulated tool outputs and resets the growth curve.

### 4. Parallel agents

Spawning two agents in parallel doubles token consumption: each agent gets a full copy of the current context. For research tasks (web fetches, file reads), sequential execution is only marginally slower but uses 2–3x fewer tokens.

**Avoid:**
```
Agent(task="research gitlab") + Agent(task="research gitea")  # parallel
```

**Prefer:**
```
Agent(task="research gitlab")  # wait for result
Agent(task="research gitea")   # then run
```

---

## Quick Audit for Any Machine

```bash
# 1. Check command baseline
echo "=== Commands ===" && wc -c ~/.claude/commands/*.md 2>/dev/null | sort -rn | head -10

# 2. Check which plugins are enabled
python3 -c "
import json
d = json.load(open('$HOME/.claude/settings.json'))
enabled = [k for k,v in d.get('enabledPlugins',{}).items() if v]
print(f'Enabled plugins ({len(enabled)}):')
for p in sorted(enabled): print(f'  {p}')
"

# 3. Count agents and skills
echo "=== Agents ===" && ls ~/.claude/agents/ 2>/dev/null | wc -l
echo "=== Skills ===" && ls ~/.claude/skills/ 2>/dev/null | wc -l

# 4. Estimate session baseline (bytes / 4 = rough tokens)
python3 -c "
import os, glob
base = os.path.expanduser('~/.claude')
cmds = sum(os.path.getsize(f) for f in glob.glob(f'{base}/commands/*.md'))
agents = sum(os.path.getsize(f) for f in glob.glob(f'{base}/agents/*.md'))
skills = sum(os.path.getsize(f) for f in glob.glob(f'{base}/skills/*/SKILL.md'))
claude_md = os.path.getsize(f'{base}/CLAUDE.md') if os.path.exists(f'{base}/CLAUDE.md') else 0
total = cmds + agents + claude_md
print(f'Commands: {cmds:,}b (~{cmds//4:,} tokens)')
print(f'CLAUDE.md: {claude_md:,}b (~{claude_md//4:,} tokens)')
print(f'Agents:   {agents:,}b (~{agents//4:,} tokens)')
print(f'Skills:   {skills:,}b (~{skills//4:,} tokens) [loaded on-demand, not baseline]')
print(f'Baseline estimate: ~{total//4:,} tokens + Claude Code internals (~8k)')
"
```

---

## Fix Script (apply to any machine)

Copy to the machine and run once:

```bash
#!/bin/bash
# claude-reduce-baseline.sh
# Stubs skill-wrapper commands and disables conflicting plugins.
# Safe to run multiple times (idempotent).

COMMANDS_DIR="$HOME/.claude/commands"
SETTINGS="$HOME/.claude/settings.json"

# Commands that have skill equivalents -> stub them
declare -A SKILL_MAP=(
  [e2e]="e2e|Generate and run end-to-end tests with Playwright."
  [xia]="xia|Borrow and adapt patterns from GitHub projects into the current codebase."
  [xia-group]="xia|Run sequential /xia rounds against a ranked list of repos."
  [loop-start]="loop-start|Start a managed autonomous loop pattern with safety defaults."
  [loop-status]="loop-status|Inspect active loop state, progress, and failure signals."
  [learn]="learn|Extract reusable patterns from the current session and save as skills."
  [onboard]="onboard|Spawn codebase-analyst to build a persistent knowledge graph."
  [detect-roles]="detect-roles|Detect project type and generate developer roles."
  [startup]="startup|Single entry point for project onboarding."
  [init-project]="init-project|Generate a CLAUDE.md for the current project."
)

for cmd in "${!SKILL_MAP[@]}"; do
  file="$COMMANDS_DIR/${cmd}.md"
  if [ ! -f "$file" ]; then
    continue
  fi
  IFS='|' read -r skill desc <<< "${SKILL_MAP[$cmd]}"
  current=$(cat "$file")
  # Skip if already stubbed
  if echo "$current" | grep -q "Invoke:.*Skill(skill="; then
    echo "  [skip] $cmd — already stubbed"
    continue
  fi
  cat > "$file" <<EOF
---
description: $desc
---

Invoke: \`Skill(skill="$skill", args="\$ARGUMENTS")\`
EOF
  echo "  [stub] $cmd -> skill=$skill"
done

# Disable conflicting plugins in settings.json
if [ -f "$SETTINGS" ]; then
  python3 - "$SETTINGS" <<'PYEOF'
import json, sys
path = sys.argv[1]
with open(path) as f:
    d = json.load(f)

plugins = d.setdefault('enabledPlugins', {})
to_disable = [
    'explanatory-output-style@claude-plugins-official',
    'learning-output-style@claude-plugins-official',
    'episodic-memory@superpowers-marketplace',
]
changed = []
for key in to_disable:
    if plugins.get(key) is True:
        plugins[key] = False
        changed.append(key)

if changed:
    with open(path, 'w') as f:
        json.dump(d, f, indent=2)
    for k in changed:
        print(f'  [disabled] {k}')
else:
    print('  [skip] plugins — already disabled')
PYEOF
fi

echo "Done. Restart Claude Code for changes to take effect."
```

---

## Ongoing Habits

| Habit | Impact |
|---|---|
| `/compact` after each major task block | Resets context growth — biggest runtime lever |
| Run research agents sequentially, not parallel | 2–3x fewer tokens for same result |
| Only add commands you type at least weekly | Every command = always-on token tax |
| Keep `~/.claude/commands/*.md` stubs thin | Body text = baseline tokens, not docs |
| Check `wc -c ~/.claude/commands/*.md` periodically | Catches drift before it hurts |
