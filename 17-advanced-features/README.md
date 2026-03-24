# 17-advanced-features

Power-user features: planning mode, permission modes, extended thinking, worktrees, sandboxing, background tasks, agent teams.

---

## Planning Mode

Two-phase workflow: Claude plans first, you approve, then it implements. Prevents wasted work on large tasks.

**Activate:**
```bash
/plan Implement user authentication    # slash command inside REPL
claude --permission-mode plan          # CLI flag
Shift+Tab                              # keyboard toggle
```

**Specialized model:**
```bash
claude --model opusplan "design and build the caching layer"
```
`opusplan` = Opus for planning, Sonnet for execution. Better quality plans, lower cost execution.

**Edit the plan before approving:** `Ctrl+G` opens the plan in your external editor.

**When to use:** multi-file refactors, new feature implementations, database migrations, architectural changes. Not worth it for single-file edits or bug fixes.

---

## Permission Modes

Controls what Claude can do without asking.

| Mode | Behavior | When to use |
|------|----------|-------------|
| `default` | Prompts before risky actions | Normal development |
| `acceptEdits` | Auto-accepts file edits | Trusted refactoring sessions |
| `plan` | Read-only — no writes | Code review, audits |
| `dontAsk` | Auto-denies unallowed actions | Automated pipelines |
| `bypassPermissions` | Skips all checks | Fully trusted automation only |

**Switch mid-session:** `Shift+Tab` (or `Alt+M` on Windows/Linux) cycles through modes.

**Set in settings.json:**
```json
{
  "permissions": {
    "defaultMode": "acceptEdits"
  }
}
```

---

## Extended Thinking

Makes Claude reason step-by-step before answering. Automatic on all models — you can toggle it.

**Toggle:** `Alt+T` (Windows/Linux) or `Option+T` (macOS)

**View the reasoning:** `Ctrl+O` (verbose mode)

**Control budget:**
```bash
export MAX_THINKING_TOKENS=4096          # fixed budget
export CLAUDE_CODE_EFFORT_LEVEL=high     # low / medium / high (Opus 4.6 only)
```

Opus 4.6 shows effort level as ○ / ◐ / ● in the status line.

**When it helps:** architecture decisions, debugging subtle logic bugs, security analysis. Not needed for straightforward tasks.

---

## Git Worktrees

Start Claude in an isolated worktree — separate branch, separate files, no interference with main work.

```bash
claude --worktree
claude -w           # short form
```

Worktree created at `<repo>/.claude/worktrees/<name>`. Auto-deleted if no changes were made.

**Use case:** run an experiment while keeping your main working directory clean. Same as `git worktree add` but Claude-managed.

**Note:** the `Agent` tool in this repo uses `isolation: "worktree"` to do this programmatically. See `05-subagents`.

---

## Sandboxing

OS-level filesystem + network isolation for Bash commands. Defense-in-depth on top of permission rules.

```bash
/sandbox                              # toggle in REPL
claude --permission-mode plan         # plan mode implies read-only (partial overlap)
```

What it prevents:
- Bash commands from writing outside the project directory
- Unintended network calls from generated scripts

**When to use:** running generated code you haven't fully read, untrusted scripts, automated pipelines where you want a hard boundary.

---

## Background Tasks

Long operations run in the background without blocking the conversation.

```bash
/tasks                                # list running background tasks
```

Claude can spawn background tasks automatically for long operations (test runs, builds, installs). You continue the conversation while they run; Claude reports results when done.

**Enable persistent task list across sessions:**
```bash
export CLAUDE_CODE_ENABLE_TASKS=1
export CLAUDE_CODE_TASK_LIST_ID="my-feature"   # share task list across sessions with same ID
```

---

## Scheduled / Recurring Tasks

```bash
/loop 5m /quality-check               # run /quality-check every 5 minutes
```

Or use `CronCreate` for persistent scheduled agents that survive session restarts (see `00-materials/claude-code-cookbook` for examples).

---

## Agent Teams (Experimental)

Multiple agents collaborate on a single task. One orchestrator, multiple specialists working in parallel.

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
claude --teammate-mode tmux "implement feature X using a team approach"
```

Relationship to `05-subagents`: agent teams is the runtime coordination layer; `05-subagents` defines the agent roles. The agent files in `.claude/agents/` are what get instantiated as team members.

---

## Remote Control / Web Sessions

```bash
/remote-control                       # expose this session for remote control from claude.ai
claude --remote "implement the API"   # start a new web session at claude.ai
claude --teleport                     # resume a web session locally
```

Use cases: pair programming, handing off a session to another machine, reviewing Claude's work in a browser UI.

---

## Key Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Shift+Tab` | Cycle permission modes |
| `Alt+T` / `Option+T` | Toggle extended thinking |
| `Ctrl+O` | View extended thinking output |
| `Ctrl+G` | Edit plan in external editor |
| `Esc+Esc` | Open checkpoint browser |
