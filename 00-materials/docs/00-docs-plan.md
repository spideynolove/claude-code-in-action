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
| 07 | interactive-mode | Plan mode, thinking modes, UI controls | `17-advanced-features/` (planning mode, thinking modes, Ctrl+G, worktrees) | Done |
| 08 | memory | CLAUDE.md hierarchy, `.claude/rules/`, auto memory | `13-memory/` (full hierarchy), `18-context-engineering/`, `19-filesystem-context/`, `20-memory-systems/` | Done |
| 09 | common-workflows | Debugging, PRs, tests, /compact, context, worktrees | `15-cli-mastery/` (/compact, context), `28-continuous-patterns/` (handoff, session continuity) | Done |
| 10 | best-practices | Prompting, context, trust, checkpointing | `33-best-practice-patterns/` (monorepo loading, cross-model review, CLAUDE.md anti-patterns) | **Partial** — no dedicated prompting/trust exercise |
| 11 | features-overview | High-level feature list | — | Conceptual only |
| 12 | settings | settings.json keys, settings.local.json | `settings.local.json` in hooks projects; `10-gitnexus/` hook wiring | **Partial** — full settings key space never exercised |
| 13 | permissions | allow/deny rules, tool permissions, trust levels | Hooks block certain tools | **Partial** — explicit allow/deny lists not demonstrated standalone |
| 14 | costs | Token billing, cost reduction | `08-superpowers/` (duplicate plugin = double token cost analysis) | **Partial** — no billing dashboard walkthrough |
| 15 | fast-mode | Fast/turbo mode trade-offs | — | Conceptual only |
| 16 | output-styles | Verbose, compact, streaming JSON output | — | Conceptual only |
| 17 | checkpointing | Snapshots, restore, session branching | `14-checkpoints/` (auto-checkpoint, Esc+Esc rewind, session branching) | Done |
| 18 | scheduled-tasks | /loop, cron-style triggers | Nothing | **Gap** |
| 19 | model-config | Model selection, configuring which Claude model | — | Conceptual only |
| 20 | keybindings | Full keybinding table | — | Conceptual only |
| 21 | statusline | Status line / terminal UI elements | — | Conceptual only |
| 22 | mcp | MCP servers, registry, config format | `02-mcp/` (browser-mcp, mcporter, playwright, repomix); `10-gitnexus/` (gitnexus MCP) | Done |
| 23 | hooks-guide | Beginner hooks walkthrough, first hook | `03-auto-simplify/`, `04-uiux/` | Done |
| 24 | hooks | Full hook reference — event schemas, JSON I/O, exit codes | `03-auto-simplify/`, `04-uiux/`, `10-gitnexus/` | Done |
| 25 | skills | SKILL.md format, `$ARGUMENTS`, bundled skills | `04-uiux/` (6 commands all with `$ARGUMENTS`); `11-xia/` (`/xia` with multi-phase `$ARGUMENTS`) | Done |
| 26 | sub-agents | Built-in agents, custom agents, `agents/` directory | `05-subagents/` | Done |
| 27 | agent-teams | Parallel multi-agent coordination across sessions | `34-nopua-agent-behavior/` (proactive multi-agent patterns), `17-advanced-features/` (agent teams section) | **Partial** — no working parallel-worktree demo |
| 28 | headless | `-p` flag, piping, scripting | `15-cli-mastery/` (full `-p` flag, pipe-in/out, session management, CI/CD patterns) | Done |
| 29 | cli-reference | All CLI flags and options | — | Conceptual only |
| 30 | commands | Built-in slash commands | Interactive use only | **Partial** — /compact, /clear: no artifact |
| 31 | tools-reference | Read, Write, Edit, Bash, Grep, Glob tool specs | — | Conceptual only |
| 32 | env-vars | Full environment variable list | — | Conceptual only |
| 33 | plugins | Creating and installing plugins | `16-plugins/` (plugin structure, manifest, install pattern, example-plugin) | Done |
| 34 | plugins-reference | Plugin manifest schema | `16-plugins/` (manifest schema with commands/agents/hooks/mcp fields) | Done |
| 35 | discover-plugins | Finding and installing plugins | `09-gstack-specific/` (gstack auto-load discovery) | **Partial** — no registry walkthrough |
| 36 | plugin-marketplaces | Community registries | `09-gstack-specific/` (gstack, ecc-tools, agent-skills-standard compared) | **Partial** — no publish flow |
| 37 | security | Trust model, sandboxing philosophy, threat model | `26-security-quality-hooks/` (secret scanner, dangerous-command-blocker), `35-adversarial-spec-patterns/` | **Partial** — no threat model walkthrough |
| 38 | sandboxing | Docker, network isolation, file system restrictions | `17-advanced-features/` (Docker sandboxing concepts, network isolation) | **Partial** — no working Dockerfile demo |
| 39 | code-review | GitHub automatic PR review (no @claude needed) | Nothing | **Gap** |
| 40 | github-actions | @claude mentions, workflow YAML, Bedrock/Vertex | `06-github-actions/` | Done |
| 41 | vs-code | VS Code extension, diff view, inline usage | Nothing | **Gap** |
| 42 | troubleshooting | Common errors, auth failures, network issues | — | Reference only |

## Beyond-Curriculum Practice

| # | Folder | Docs it exercises | Notes |
|---|--------|------------------|-------|
| B1 | `07-voice-input/` | §28 headless (partial), §03 how-it-works | Python subprocess pipeline; Whisper → translate → Claude |
| B2 | `08-superpowers/` | §33 plugins, §14 costs, §10 best-practices | Plugin behavioral analysis; Superpowers vs Codex comparison |
| B3 | `09-gstack-specific/` | §35 discover-plugins, §36 marketplaces, §26 sub-agents | Multi-toolkit audit methodology; gstack + ecc-tools + agent-skills-standard |
| B4 | `10-gitnexus/` | §22 mcp, §24 hooks, §12 settings | AST graph MCP; PreToolUse ambient context injection; SessionStart hook |
| B5 | `11-xia/` | §25 skills, §09 common-workflows | `/xia` comparative borrowing; project-local git-portable Xỉa log |
| B6 | `12-slash-commands/` | §25 skills | Skill frontmatter reference; skills vs old commands/ format |
| B7 | `13-memory/` | §08 memory | Full CLAUDE.md load-order hierarchy; auto-memory system |
| B8 | `14-checkpoints/` | §17 checkpointing | Auto-checkpoint per prompt; Esc+Esc rewind; session branching |
| B9 | `15-cli-mastery/` | §28 headless, §29 cli-reference | Full `-p` flag patterns; pipe-in/out; JSON output; CI/CD integration |
| B10 | `16-plugins/` | §33 plugins, §34 plugins-reference | Plugin manifest schema; bundled commands+agents+hooks+mcp |
| B11 | `17-advanced-features/` | §07 interactive-mode, §27 agent-teams, §38 sandboxing | Planning mode, opusplan model, Docker sandboxing concepts, background tasks |
| B12 | `18-context-engineering/` | §08 memory, §09 common-workflows | Context degradation, /compact semantics, KV-cache, sub-agent partitioning |
| B13 | `19-filesystem-context/` | §08 memory, §31 tools-reference | Filesystem-as-context-extension; write-once-read-selectively pattern |
| B14 | `20-memory-systems/` | §08 memory | Agent memory framework comparison; Letta filesystem vs graph DBs |
| B15 | `21-evaluation/` | §10 best-practices | LLM-as-judge patterns; token budget diagnostics; position bias in pairwise eval |
| B16 | `22-tool-design/` | §31 tools-reference, §22 mcp | Tool consolidation principles; applies directly to MCP server design |
| B17 | `23-hooks-in-deep/` | §24 hooks | SubagentStop + PreCompact hooks; sharp edges (stop_hook_active, transcript timing) |
| B18 | `26-security-quality-hooks/` | §13 permissions, §37 security, §24 hooks | Secret scanner, dangerous-command-blocker, conventional-commits, TDD gate, plan gate |
| B19 | `27-tdd-conductor-llmdev/` | §14 hooks (advanced), §18 SDK | TDD 6-phase orchestration; conductor multi-agent commands; LLM dev skill patterns |
| B20 | `28-continuous-patterns/` | §09 common-workflows | YAML handoff skill; session continuity; self-improvement loop |
| B21 | `29-skill-authoring/` | §25 skills | Skill authoring standard; rigid vs flexible skill types |
| B22 | `30-plan-lifecycle/` | §09 common-workflows | Plan template; lifecycle phases from brief to review |
| B23 | `31-gsd-planning-patterns/` | §09 common-workflows | GSD forensics command; requirements + state templates |
| B24 | `32-cc-sdd-patterns/` | §25 skills, §07 interactive-mode | EARS format; spec-driven development; steering templates |
| B25 | `33-best-practice-patterns/` | §10 best-practices | Monorepo CLAUDE.md loading; cross-model review; CLAUDE.md anti-patterns |
| B26 | `34-nopua-agent-behavior/` | §26 sub-agents, §27 agent-teams | Agency spectrum; cognitive ladder; responsible-exit protocol |
| B27 | `35-adversarial-spec-patterns/` | §37 security | Adversarial spec techniques; prompt injection patterns |

---

## Practice Plan

### Gap 1 — §08 + §09: CLAUDE.local.md, @-refs, and context control shortcuts

**What to build:** Extend `01-small-project/` with a `CLAUDE.local.md` that adds personal overrides (e.g. preferred test runner flags), and update the project `CLAUDE.md` to `@`-reference a schema or config file. Add a `07-08-context-cheatsheet/NOTES.md` documenting when to use `/compact` vs `/clear` vs Escape-rewind, and a shell alias that opens a planning-mode session.

**Why it matters:** The three-file hierarchy (`~/.claude/CLAUDE.md` → `CLAUDE.md` → `CLAUDE.local.md`) controls what Claude always knows, what the team knows, and what only you know. The `@`-reference pattern keeps docs in sync with the actual files they describe without copy-pasting.

**GitHub references:**
- `anthropics/anthropic-cookbook` — worked examples of CLAUDE.md population and @-reference patterns
- `x1xhlol/system-prompts-and-models-of-ai-tools` — reverse-engineered prompts showing how tools structure persistent context

---

### Gap 2 — §27: Agent teams (parallel sessions)

**What to build:** Add a `07-agent-teams/` folder demonstrating a coordinator that spawns two Claude instances in parallel git worktrees — one running tests, one checking types — and collects results. Use the `--worktree` SDK option or the worktree dispatch pattern from `05-subagents/`.

**Why it matters:** The sub-agents doc (§26) covers single-session delegation; the agent-teams doc (§27) adds cross-session parallelism. The worktree-per-agent pattern prevents state collision and is how production multi-agent pipelines isolate work.

**GitHub references:**
- `anthropics/claude-code` — agent-teams documentation with the worktree dispatch protocol
- `KillianLucas/open-interpreter` — programmatic loop that spawns multiple model calls and aggregates results

---

### Gap 3 — §28: Headless / piping mode (`-p` flag)

**What to build:** A `08-headless/` folder with three small scripts:
- `analyze.sh` — pipes a file through `claude -p "Summarize this code"` and writes output to a report
- `batch-review.sh` — iterates over `*.py` files and runs a lint prompt on each
- A `Makefile` target that calls `claude -p` as a pre-commit step

Note: `07-voice-input/voice_claude.py` shows the Python subprocess SDK pattern but not the `-p` CLI flag shell pipeline pattern — both are worth having.

**Why it matters:** Headless mode is the bridge between interactive Claude and CI automation. The `-p` flag is simpler than the SDK for one-shot tasks and composes naturally with shell pipelines.

**GitHub references:**
- `ricklamers/shell-ask` — CLI tool that models the clarify → plan → execute loop; shows piped AI usage patterns
- `BuilderIO/ai-shell` — review-before-execute pattern that headless mode mirrors

---

### Gap 4 — §17: Checkpointing

**What to build:** A `09-checkpointing/NOTES.md` documenting the checkpoint workflow with annotated screenshots or terminal output showing: (1) a checkpoint created mid-task, (2) a restore to that checkpoint, (3) a branch from a checkpoint into a different direction.

**Why it matters:** Checkpointing is the safety net for long agentic sessions. Without practice, developers skip it and lose work when a session degrades. The branch-from-checkpoint pattern enables A/B exploration of different implementation directions.

**GitHub references:**
- `anthropics/claude-code` — official checkpointing documentation with session branching semantics

---

### Gap 5 — §39: GitHub Code Review (automatic, not @claude)

**What to build:** Extend `06-github-actions/` with a `claude-code-review.yml` workflow that triggers `on: pull_request` (no @claude mention required) and runs automatic review on every PR. Include a `NOTES.md` explaining how this differs from the @claude mention workflow and when to use each.

**Why it matters:** The GitHub Actions integration has two modes: mention-triggered (@claude) and automatic-on-PR. The automatic mode is more powerful for teams but requires different configuration. Conflating the two leads to missed reviews or unexpected automated comments.

**GitHub references:**
- `anthropics/claude-code-action` — official GitHub Action; the `review_type: "automatic"` input is underdocumented
- `greptile-ai/greptile` — production PR review agent; shows realistic `custom_instructions` for code review personas

---

### Gap 6 — §38: Sandboxing

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

Previously completed gaps: §28 headless (B9), §17 checkpointing (B8), §33/34 plugins (B10), §07 interactive-mode (B11), §08 memory (B7/B12-B14), §09 common-workflows (B20).

| Priority | Doc(s) | Gap | Effort | Value |
|----------|--------|-----|--------|-------|
| 1 | §27 | Agent teams (working parallel-worktree demo) | Medium | High — only behavioral patterns exist; no live coordination demo |
| 2 | §39 | GitHub Code Review (automatic, no @claude) | Low | High — distinct from @claude workflow; underdocumented |
| 3 | §18 | Scheduled tasks (/loop, cron triggers) | Low | Medium — /loop and schedule skill exist but no dedicated exercise |
| 4 | §38 | Sandboxing (working Dockerfile) | Medium | Medium — concepts in 17-advanced-features; no runnable demo |
| 5 | §41 | VS Code extension | Low | Low — IDE-specific; lower priority for CLI-focused workflow |
