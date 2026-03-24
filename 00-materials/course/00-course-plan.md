# Current Plan — Course Coverage & Practice Gaps

## Coverage Assessment

| # | Section | Evidence of Practice | Status |
|---|---------|---------------------|--------|
| 01 | Introduction | — | Conceptual only |
| 02 | What is a coding assistant | — | Conceptual only |
| 03 | Claude Code in action | — | Conceptual only |
| 04 | Claude Code setup | Tool is running | Done |
| 05 | Project setup | `01-small-project/` (Next.js + Prisma + Vitest) | Done |
| 06 | Adding context | CLAUDE.md in `01-small-project/` and `04-uiux/` | **Partial** — `#`-memory-mode, CLAUDE.local.md, and @-file-refs inside CLAUDE.md never explicitly practiced |
| 07 | Making changes | `01-small-project/` implicitly | **Partial** — planning mode, thinking modes, Ctrl+V screenshot workflow: no dedicated exercise |
| 08 | Controlling context | Nothing | **Gap** — /compact, /clear, Escape, double-Escape: all interactive, no practice artifact |
| 09 | Custom commands | `04-uiux/` (6 commands all using `$ARGUMENTS`) + `11-xia/` (`/xia` command) | Done |
| 10 | MCP servers | `02-mcp/` (browser-mcp, mcporter, playwright, repomix) | Done |
| 11 | GitHub integration | `06-github-actions/` (@claude mention + PR review workflows) | Done |
| 12 | Introducing hooks | `03-auto-simplify/`, `04-uiux/` | Done |
| 13 | Defining hooks | Both projects with matchers, exit codes, stdin JSON | Done |
| 14 | Implementing a hook | `04-uiux/` PostToolUse hooks | **Partial** — no basic PreToolUse .env-blocking example |
| 15 | Gotchas around hooks | `03-auto-simplify/` uses `$CLAUDE_PROJECT_DIR` | Done |
| 16 | Useful hooks | `04-uiux/hooks/run-typecheck.sh` ✓; `10-gitnexus/` PreToolUse + SessionStart hooks | **Partial** — SDK-spawning duplicate-detection hook not built |
| 17 | Advanced hook types | UserPromptSubmit + SessionStart in `03-auto-simplify/`; `10-gitnexus/` SessionStart hook | **Partial** — Stop, SubagentStop, Notification, PreCompact unexplored |
| 18 | Claude Code SDK | `07-voice-input/voice_claude.py` (subprocess SDK pattern, Whisper → Claude pipeline) | **Partial** — no TypeScript SDK script; no programmatic `query()` loop |
| 19 | Quiz | — | N/A |
| 20 | Summary | — | N/A |

## Beyond-Curriculum Practice

| # | Folder | What it covers | Status |
|---|--------|---------------|--------|
| B1 | `07-voice-input/` | Voice → Whisper → Claude pipeline; native language input bypass | Done |
| B2 | `08-superpowers/` | Superpowers vs Codex behavioral analysis; verbosity wrapper; workflow commands | Done |
| B3 | `09-gstack-specific/` | Multi-toolkit merge (gstack + ecc-tools); capability audit + overlap elimination methodology | Done |
| B4 | `10-gitnexus/` | AST-based code intelligence MCP; PreToolUse/SessionStart hooks for ambient context | Done |
| B5 | `11-xia/` | Comparative borrowing from GitHub (`/xia` command); project-local git-portable evolution log | Done |

---

## Practice Plan

### Gap 1 — §06: Context techniques (CLAUDE.local.md, @-refs, `#`-memory-mode)

**What to build:** A new folder `06-context-patterns/` with a minimal project that demonstrates all three CLAUDE.md locations, a CLAUDE.local.md with personal overrides, and a CLAUDE.md that @-references a schema file. Document the `#` command to merge instructions without manual editing.

**Why it matters:** The three-file hierarchy (`~/.claude/CLAUDE.md` → `CLAUDE.md` → `CLAUDE.local.md`) controls what Claude always knows, what the team knows, and what only you know. Getting this wrong makes Claude ignore context or expose personal config to teammates.

**GitHub references:**
- `anthropics/anthropic-cookbook` — worked examples of CLAUDE.md population and memory patterns
- `x1xhlol/system-prompts-and-models-of-ai-tools` — reverse-engineered system prompts showing how major tools structure their persistent context

---

### Gap 2 — §07 + §08: Making changes / Controlling context (interactive techniques)

**What to build:** A `07-08-workflow-cheatsheet/` folder containing a CLAUDE.md that documents when to use planning mode vs. thinking mode vs. normal mode, with a companion shell alias or small script that opens a session in a specific mode. Include a short `NOTES.md` summarising the keyboard shortcuts and when each context-control technique applies.

**Why it matters:** Planning mode + thinking modes are where token cost lives. Knowing when to use `/compact` vs. `/clear` vs. Escape-rewind determines whether a long session stays coherent or degrades into noise.

**GitHub references:**
- `ricklamers/shell-ask` — CLI tool that models the clarify → plan → execute loop in code; good reference for how to structure AI interactions around approval gates
- `BuilderIO/ai-shell` — implements the review-before-execute pattern that planning mode mirrors

---

### Gap 3 — §14: PreToolUse .env protection hook

**What to build:** A `06-hooks-basics/` folder with the canonical PreToolUse hook that blocks `Read|Grep` on `.env` files, reading stdin as JSON, checking `tool_input.file_path`, and exiting 2 with a message. Wire it into a `settings.local.json`.

**Why it matters:** This is the simplest complete hook — stdin parsing + exit code + error message. It's the base pattern every more complex hook builds on. Having it as a standalone reference is valuable.

**GitHub references:**
- `anthropics/claude-code` — official hooks documentation with the exact stdin schema per tool
- `nicholasgasior/cc-hooks` — community collection of production PreToolUse/PostToolUse hooks with patterns for file-path filtering

---

### Gap 4 — §16 + §18: SDK-driven hooks + Claude Code SDK (TypeScript)

**What to build:** A `16-18-sdk/` folder with two things:
1. `duplicate-query-hook.ts` — a PostToolUse hook (matching `Write|Edit` on `*.sql` or `queries/`) that launches a second Claude instance via the SDK to check for duplicate queries and feeds results back via stdout
2. `analyze.ts` — a standalone script using `@anthropic-ai/claude-code` that takes a directory argument and produces a summary report (read-only, no file writes)

Note: `07-voice-input/voice_claude.py` covers the Python subprocess SDK pattern. This fills the TypeScript SDK + programmatic `query()` loop gap.

**Why it matters:** The SDK is what turns Claude from an interactive tool into automation infrastructure. The query-duplication hook specifically teaches the most powerful pattern in the course: one Claude instance reviewing another's work.

**GitHub references:**
- `anthropics/anthropic-quickstarts` — `computer-use-demo` and `agents` examples show programmatic SDK usage patterns; the `claude-code` quickstart demonstrates the `query()` loop
- `KillianLucas/open-interpreter` — closest analogue to the SDK approach: a programmatic loop that calls a model, processes tool calls, and feeds results back

---

### Gap 5 — §17: Advanced hook types (Stop, SubagentStop, Notification)

**What to build:** Extend `03-auto-simplify/` with three more hooks:
- `Stop` hook — writes a session summary to `.claude/last-session.md` when Claude finishes responding
- `SubagentStop` hook — logs completed subagent task IDs to `/tmp/subagent-log-{session_id}.jsonl`
- `Notification` hook — sends a desktop notification via `notify-send` when Claude needs permission

**Why it matters:** Stop and SubagentStop are critical for multi-agent pipelines — they're how you know when a spawned task is actually done. The `stop_hook_active` flag in the Stop hook stdin is a sharp edge: triggering another response from within a Stop hook causes an infinite loop.

**GitHub references:**
- `anthropics/claude-code` — official hook event schema reference; the Stop hook's `stop_hook_active` field is only documented here
- `Saqib2000/claude-hooks` — includes Stop and Notification hook implementations with notify-send patterns

---

## Priority Order

| Priority | Section | Effort | Value |
|----------|---------|--------|-------|
| 1 | §18 + §16: TypeScript SDK + SDK-driven hook | Medium | Highest — fills remaining SDK gap (Python done via 07-voice-input) |
| 2 | §17: Advanced hook types | Low | Medium — Stop/SubagentStop critical for multi-agent work |
| 3 | §14: PreToolUse .env hook | Very low | Medium — canonical reference pattern |
| 4 | §06: Context techniques | Low | Medium — foundational but CLAUDE.md already in use |
| 5 | §07+§08: Interactive cheatsheet | Low | Low — mostly interactive, a reference doc suffices |
