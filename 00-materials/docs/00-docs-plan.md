# Current Plan — Docs Coverage & Practice Gaps

## Coverage Assessment

| # | Doc | Topic | Evidence of Practice | Status |
|---|-----|-------|---------------------|--------|
| 01 | overview | What Claude Code is, surfaces | — | Conceptual only |
| 02 | quickstart | First-run walkthrough | — | Conceptual only |
| 03 | how-it-works | Agentic loop, tool use, context | — | Conceptual only |
| 04 | authentication | OAuth vs API key, Pro/Max plans | — | Conceptual only |
| 05 | setup | Installation, updates, uninstall | Tool is running | Done |
| 06 | terminal-config | Font, color, iTerm2, Windows Terminal | — | Conceptual only |
| 07 | interactive-mode | Plan mode, thinking modes, UI controls | `01-small-project/` implicitly | **Partial** — no dedicated exercise for plan mode or thinking modes |
| 08 | memory | CLAUDE.md hierarchy, `.claude/rules/`, auto memory | CLAUDE.md in `01-small-project/` and `04-uiux/` | **Partial** — CLAUDE.local.md and @-refs never explicitly practiced |
| 09 | common-workflows | Debugging, PRs, tests, /compact, context, worktrees | `01-small-project/` implicitly | **Partial** — /compact, /clear, git worktrees: no dedicated artifact |
| 10 | best-practices | Prompting, context, trust, checkpointing | — | Conceptual only |
| 11 | features-overview | High-level feature list | — | Conceptual only |
| 12 | settings | settings.json keys, settings.local.json | `settings.local.json` in hooks projects | **Partial** — full settings key space never exercised |
| 13 | permissions | allow/deny rules, tool permissions, trust levels | Hooks block certain tools | **Partial** — explicit allow/deny lists not demonstrated standalone |
| 14 | costs | Token billing, cost reduction | — | Conceptual only |
| 15 | fast-mode | Fast/turbo mode trade-offs | — | Conceptual only |
| 16 | output-styles | Verbose, compact, streaming JSON output | — | Conceptual only |
| 17 | checkpointing | Snapshots, restore, session branching | Nothing | **Gap** |
| 18 | scheduled-tasks | /loop, cron-style triggers | Nothing | **Gap** |
| 19 | model-config | Model selection, configuring which Claude model | — | Conceptual only |
| 20 | keybindings | Full keybinding table | — | Conceptual only |
| 21 | statusline | Status line / terminal UI elements | — | Conceptual only |
| 22 | mcp | MCP servers, registry, config format | `02-mcp/` (browser-mcp, mcporter, playwright, repomix) | Done |
| 23 | hooks-guide | Beginner hooks walkthrough, first hook | `03-auto-simplify/`, `04-uiux/` | Done |
| 24 | hooks | Full hook reference — event schemas, JSON I/O, exit codes | `03-auto-simplify/`, `04-uiux/` | Done |
| 25 | skills | SKILL.md format, `$ARGUMENTS`, bundled skills | `05-subagents/dotfiles/commands/` | **Partial** — `$ARGUMENTS` never demonstrated |
| 26 | sub-agents | Built-in agents, custom agents, `agents/` directory | `05-subagents/` | Done |
| 27 | agent-teams | Parallel multi-agent coordination across sessions | `05-subagents/` (single-session only) | **Partial** — cross-session parallel pattern not exercised |
| 28 | headless | `-p` flag, piping, scripting | Nothing | **Gap** |
| 29 | cli-reference | All CLI flags and options | — | Conceptual only |
| 30 | commands | Built-in slash commands | Interactive use only | **Partial** — /compact, /clear: no artifact |
| 31 | tools-reference | Read, Write, Edit, Bash, Grep, Glob tool specs | — | Conceptual only |
| 32 | env-vars | Full environment variable list | — | Conceptual only |
| 33 | plugins | Creating and installing plugins | Nothing | **Gap** |
| 34 | plugins-reference | Plugin manifest schema | Nothing | **Gap** |
| 35 | discover-plugins | Finding and installing plugins | Nothing | **Gap** |
| 36 | plugin-marketplaces | Community registries | Nothing | **Gap** |
| 37 | security | Trust model, sandboxing philosophy, threat model | — | Conceptual only |
| 38 | sandboxing | Docker, network isolation, file system restrictions | Nothing | **Gap** |
| 39 | code-review | GitHub automatic PR review (no @claude needed) | Nothing | **Gap** |
| 40 | github-actions | @claude mentions, workflow YAML, Bedrock/Vertex | `06-github-actions/` | Done |
| 41 | vs-code | VS Code extension, diff view, inline usage | Nothing | **Gap** |
| 42 | troubleshooting | Common errors, auth failures, network issues | — | Reference only |

---

## Practice Plan

### Gap 1 — §08 + §09: CLAUDE.local.md, @-refs, and context control shortcuts

**What to build:** Extend `01-small-project/` with a `CLAUDE.local.md` that adds personal overrides (e.g. preferred test runner flags), and update the project `CLAUDE.md` to `@`-reference a schema or config file. Add a `07-08-context-cheatsheet/NOTES.md` documenting when to use `/compact` vs `/clear` vs Escape-rewind, and a shell alias that opens a planning-mode session.

**Why it matters:** The three-file hierarchy (`~/.claude/CLAUDE.md` → `CLAUDE.md` → `CLAUDE.local.md`) controls what Claude always knows, what the team knows, and what only you know. The `@`-reference pattern keeps docs in sync with the actual files they describe without copy-pasting.

**GitHub references:**
- `anthropics/anthropic-cookbook` — worked examples of CLAUDE.md population and @-reference patterns
- `x1xhlol/system-prompts-and-models-of-ai-tools` — reverse-engineered prompts showing how tools structure persistent context

---

### Gap 2 — §25: Skills with `$ARGUMENTS`

**What to build:** Add two commands to `05-subagents/dotfiles/.claude/commands/`:
- `write-tests.md` — `Write comprehensive tests for: $ARGUMENTS` with project testing conventions
- `explain.md` — `Explain $ARGUMENTS like I'm a senior engineer unfamiliar with this subsystem`

Run them against `01-small-project/` to validate argument substitution.

**Why it matters:** Without `$ARGUMENTS`, every custom command is a fixed script. With it, commands become parameterised workflows — the difference between a macro and a function.

**GitHub references:**
- `anthropics/claude-code` (official repo) — `/.claude/commands/` examples in docs and issue tracker
- `cgpittman/claude-commands` — community collection of reusable slash commands with argument patterns

---

### Gap 3 — §27: Agent teams (parallel sessions)

**What to build:** Add a `07-agent-teams/` folder demonstrating a coordinator that spawns two Claude instances in parallel git worktrees — one running tests, one checking types — and collects results. Use the `--worktree` SDK option or the worktree dispatch pattern from `05-subagents/`.

**Why it matters:** The sub-agents doc (§26) covers single-session delegation; the agent-teams doc (§27) adds cross-session parallelism. The worktree-per-agent pattern prevents state collision and is how production multi-agent pipelines isolate work.

**GitHub references:**
- `anthropics/claude-code` — agent-teams documentation with the worktree dispatch protocol
- `KillianLucas/open-interpreter` — programmatic loop that spawns multiple model calls and aggregates results

---

### Gap 4 — §28: Headless / piping mode

**What to build:** A `08-headless/` folder with three small scripts:
- `analyze.sh` — pipes a file through `claude -p "Summarize this code"` and writes output to a report
- `batch-review.sh` — iterates over `*.py` files and runs a lint prompt on each
- A `Makefile` target that calls `claude -p` as a pre-commit step

**Why it matters:** Headless mode is the bridge between interactive Claude and CI automation. The `-p` flag is simpler than the SDK for one-shot tasks and composes naturally with shell pipelines. It's also the entry point for non-engineers running Claude in scripts.

**GitHub references:**
- `ricklamers/shell-ask` — CLI tool that models the clarify → plan → execute loop; shows piped AI usage patterns
- `BuilderIO/ai-shell` — review-before-execute pattern that headless mode mirrors

---

### Gap 5 — §17: Checkpointing

**What to build:** A `09-checkpointing/NOTES.md` documenting the checkpoint workflow with annotated screenshots or terminal output showing: (1) a checkpoint created mid-task, (2) a restore to that checkpoint, (3) a branch from a checkpoint into a different direction.

**Why it matters:** Checkpointing is the safety net for long agentic sessions. Without practice, developers skip it and lose work when a session degrades. The branch-from-checkpoint pattern enables A/B exploration of different implementation directions.

**GitHub references:**
- `anthropics/claude-code` — official checkpointing documentation with session branching semantics

---

### Gap 6 — §33–§36: Plugins

**What to build:** A `10-plugins/` folder with a minimal plugin that bundles:
- One skill (the existing `simplify` skill) repackaged as a distributable plugin
- One hook (the PreToolUse `.env` blocker)
- A `PLUGIN.md` manifest with correct frontmatter

Publish to a local registry or document the publish flow.

**Why it matters:** Plugins are how skills and hooks are packaged for distribution across projects and teams. Without a plugin example, the distinction between "skill file in dotfiles" and "installable plugin from a registry" stays abstract. The manifest schema has sharp edges that only surface when building one.

**GitHub references:**
- `anthropics/claude-code` — official plugin manifest schema and registry format
- Community plugin registry examples showing metadata, versioning, and install flow

---

### Gap 7 — §39: GitHub Code Review (automatic, not @claude)

**What to build:** Extend `06-github-actions/` with a `claude-code-review.yml` workflow that triggers `on: pull_request` (no @claude mention required) and runs automatic review on every PR. Include a `NOTES.md` explaining how this differs from the @claude mention workflow and when to use each.

**Why it matters:** The GitHub Actions integration has two modes: mention-triggered (@claude) and automatic-on-PR. The automatic mode is more powerful for teams but requires different configuration. Conflating the two leads to missed reviews or unexpected automated comments.

**GitHub references:**
- `anthropics/claude-code-action` — official GitHub Action; the `review_type: "automatic"` input is underdocumented
- `greptile-ai/greptile` — production PR review agent; shows realistic `custom_instructions` for code review personas

---

### Gap 8 — §38: Sandboxing

**What to build:** A `11-sandboxing/` folder with:
- A `Dockerfile` that runs Claude in a container with no network access and read-only mounts except a `/workspace` volume
- A `docker-compose.yml` that mounts the project and launches a sandboxed session
- A `NOTES.md` explaining what sandboxing prevents and what it doesn't

**Why it matters:** Sandboxing is the last line of defense when Claude's tool permissions are broad. Understanding what Docker-level isolation actually restricts (vs. what Claude's own permission system covers) prevents false security assumptions.

**GitHub references:**
- `anthropics/claude-code` — official sandboxing documentation with Docker configuration
- `nicholasgasior/cc-hooks` — community hooks that complement sandboxing with PreToolUse blockers

---

## Priority Order

| Priority | Doc(s) | Gap | Effort | Value |
|----------|--------|-----|--------|-------|
| 1 | §25 | `$ARGUMENTS` commands | Very low | High — quick win, fills obvious skill gap |
| 2 | §28 | Headless / piping | Low | High — unlocks CI automation without the SDK |
| 3 | §27 | Agent teams (parallel sessions) | Medium | High — completes the multi-agent picture |
| 4 | §39 | GitHub Code Review (automatic) | Low | High — distinct from @claude workflow |
| 5 | §08+§09 | CLAUDE.local.md, @-refs, context cheatsheet | Low | Medium — foundational but CLAUDE.md already in use |
| 6 | §17 | Checkpointing | Low | Medium — safety net for long sessions |
| 7 | §33–36 | Plugins | Medium | Medium — distribution pattern; not needed for local use |
| 8 | §38 | Sandboxing | Medium | Low–Medium — production safety; overkill for solo dev |
