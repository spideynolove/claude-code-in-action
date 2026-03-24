## Complete Claude Code Codebase Workflow — Unified

---

### New Settings Layer

```json
{
  "fileSuggestion": {
    "type": "command",
    "command": "./.claude/file-suggestion.sh"
  },
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1",
    "ENABLE_LSP_TOOL": "1",
    "MAX_THINKING_TOKENS": "10000",
    "CLAUDE_AUTOCOMPACT_PCT_OVERRIDE": "50"
  }
}
```

---

### Canonical Project Structure

```text
project/
├── CLAUDE.md
├── README.md
│
├── docs/
│   ├── architecture.md
│   ├── decisions/
│   └── runbooks/
│
├── tasks/
│   ├── todo.md
│   └── lessons.md
│
├── .claude/
│   ├── settings.json
│   ├── hooks/
│   ├── agents/
│   └── skills/
│       ├── code-review/SKILL.md
│       ├── refactor/SKILL.md
│       └── release/SKILL.md
│
├── tools/
│   ├── scripts/
│   └── prompts/
│
└── src/
    ├── api/
    │   └── CLAUDE.md
    └── persistence/
        └── CLAUDE.md
```

---

## Full Session Lifecycle

```text
SESSION START
──────────────────────────────────────────────────────────────────────────────
~/.claude/CLAUDE.md (global)           ← identity, conventions, toolchain
     +
.claude/CLAUDE.md (project)            ← repo map, hotspots, authoritative modules
     +
src/*/CLAUDE.md (subsystem)            ← layered local context
     +
tasks/lessons.md                       ← self-improvement rules reviewed at start
     +
allowedMcpServers (scoped)             ← only relevant MCPs loaded
     │
     ▼
[SessionStart hook]
     ├── inject token_efficient_cli.md system prompt
     ├── load file-suggestion.sh for JIT file context hints
     └── scope MCP/tool availability to project-relevant set

──────────────────────────────────────────────────────────────────────────────
USER PROMPT
──────────────────────────────────────────────────────────────────────────────
[UserPromptSubmit]
     ├── skill-rules.json match?  ──► inject relevant skill via tool_result
     ├── /common-ground           ──► surface hidden assumptions if needed
     ├── token budget >50%?       ──► suggest /compact at logical breakpoint
     ├── non-trivial task?        ──► force plan mode
     └── file-suggestion.sh       ──► surface candidate files before first tool call

──────────────────────────────────────────────────────────────────────────────
PLAN MODE
──────────────────────────────────────────────────────────────────────────────
Plan / Explore subagent (fresh ctx, read-only)
     ├── Glob + Grep + Read [parallel]
     ├── ast-grep for structural patterns
     └── LSP/Serena for call graph, refs, safe rename
          │
          ▼
Write tasks/todo.md
     └── phase-gated, checkable plan
          │
          ▼
USER APPROVES PLAN
          │
          ▼
Orchestrator activates

──────────────────────────────────────────────────────────────────────────────
EXECUTION LOOP
──────────────────────────────────────────────────────────────────────────────
Phase N:

  [PreToolUse]
       ├── Edit|Write  → block if on main branch
       ├── Bash        → validate-readonly-query.sh for DB-sensitive agents
       └── any tool    → permission / scope check

  Tool execution
       ├── parallel where independent
       ├── use subagents for heavy/noisy/isolated work
       └── use worktrees if parallel edits need filesystem isolation

  [PostToolUse]
       ├── compress verbose git/test/build output via compact_run.py
       ├── trigger memory-writer on failure/correction
       └── return only summary to parent context

  [SubagentStart]
       ├── inject subagent-specific context
       └── ensure hook-spawned agent uses --settings no-hooks.json

  Subagent runs (own isolated 200K ctx)
       ├── output written to $CLAUDE_SCRATCHPAD_DIR if large
       └── returns DONE|{path} or compact summary only

  [SubagentStop]
       ├── validate output
       ├── log tool I/O with correlation ID
       └── summarize before handing result to parent

  VERIFY before marking done
       ├── run tests
       ├── inspect logs
       ├── diff behavior against main / previous state
       └── ask: “Would a staff engineer approve this?”

  Mark tasks/todo.md item complete
  Proceed to next phase

──────────────────────────────────────────────────────────────────────────────
SELF-IMPROVEMENT LOOP
──────────────────────────────────────────────────────────────────────────────
User correction / failure detected
     │
     ▼
PostToolUse hook → memory-writer agent
     │
     ▼
Abstract generalizable mistake pattern
     │
     ▼
Write to tasks/lessons.md
     ├── what went wrong
     ├── general pattern to avoid
     └── imperative, testable rule
     │
     ▼
Update CLAUDE.md if rule is project-global
     │
     ▼
Next session start reviews lessons again

──────────────────────────────────────────────────────────────────────────────
SESSION END
──────────────────────────────────────────────────────────────────────────────
[Stop]
     ├── write session summary → ~/claude-memory/cross-session-notes.md
     ├── update tasks/todo.md review section
     └── desktop notification
```

---

## Full Hook Lifecycle × Codebase Operations

```text
User Prompt
    │
    ▼
[UserPromptSubmit]
    ├── skill-rules.json: keyword/glob → inject skill JIT
    ├── file-suggestion.sh → candidate files
    ├── /common-ground → expose assumptions if needed
    └── token budget check → suggest /compact if >50%
    │
    ▼
Plan Mode
    └── Explore subagent (fresh ctx, read-only)
         Glob + Grep + Read [parallel]
         ast-grep + LSP if needed
         returns candidates + patterns
    │
    ▼
[PreToolUse]
    ├── Edit|Write → block if on main branch
    ├── Bash → validate-readonly-query.sh where required
    └── * → permission scope check
    │
    ▼
Tool executes
    │
    ▼
[PostToolUse]
    ├── compress verbose output
    ├── trigger memory-writer on failure
    └── format compact result for parent ctx
    │
    ▼
[SubagentStart]
    ├── inject agent-specific context
    └── verify no recursive hooks via no-hooks settings
    │
    ▼
Subagent runs
    │
    ▼
[SubagentStop]
    ├── validate output
    ├── log tool I/O with correlation ID
    └── trigger next stage / return summary
    │
    ▼
[Stop]
    ├── write session summary
    └── notify user
```

---

## Tool Sequencing by Task Type

```text
CODEBASE EXPLORATION
──────────────────────────────────────────────────────────────────
Glob(*.ts) ──┐
Glob(*.py) ──┤── [parallel] ──► candidate file list
Glob(*.go) ──┘
                │
                ▼
Grep(symbol / pattern, files_with_matches)
                │
                ▼
Read(file1) ──┐
Read(file2) ──┤── [parallel batch]
Read(file3) ──┘
                │
                ▼
ast-grep(structural pattern)
                │
                ▼
LSP / Serena
                │
                ▼
THEN WRITE

BUG FIX
──────────────────────────────────────────────────────────────────
Grep(error_msg)
  → Read(file + imports) [parallel]
  → Edit(fix)
  → Bash(test)
  → compressed output
  → Edit(follow-up)
  → Bash(test)
  → Bash(git commit)

REFACTOR / RENAME
──────────────────────────────────────────────────────────────────
TodoWrite(plan)
  → Grep(all occurrences)
  → Read(batch)
  → ast-grep(structural confirmation)
  → LSP rename / reference validation
  → Edit(replace_all)
  → Bash(lint + typecheck)
  → Bash(test)
  → TodoWrite(done)

NEW FEATURE
──────────────────────────────────────────────────────────────────
Glob(similar feature pattern)
  → Read(3-4 existing implementations)
  → JIT skill injection
  → Write(model/service) [parallel if independent]
  → Edit(router / integration point)
  → Write(tests)
  → Bash(test → fix → test)
  → Bash(git commit)

LARGE / NOISY SEARCH
──────────────────────────────────────────────────────────────────
Delegate to Explore subagent
  subagent: Glob + Grep + Read + ast-grep [read-only]
  parent receives: file list + summary only
```

---

## Structural vs Text Search Decision

| Situation                       | Tool                  | Why                              |
| ------------------------------- | --------------------- | -------------------------------- |
| Know exact symbol               | `Grep`                | Fast, exact                      |
| Need file/path filtering        | `Glob`                | Pre-filter before reading        |
| Need structural match           | `ast-grep`            | Syntax-aware                     |
| Need refs / rename / call graph | `LSP` / `Serena`      | Type-aware navigation            |
| Search is large and noisy       | Explore subagent      | Isolated context, summary return |
| Cross-file structural audit     | `ast-grep` + subagent | Accurate + low pollution         |

---

## Parallel Tool Rule

```text
❌ Sequential:
   Read(file1) → wait → Read(file2) → wait → Read(file3)

✅ Parallel batch:
   Read(file1) ┐
   Read(file2) ├── single batched call
   Read(file3) ┘
```

---

## CLAUDE.md Behavioral Rules

| Rule                         | Trigger                                         | Behavior                                        | Never                            |
| ---------------------------- | ----------------------------------------------- | ----------------------------------------------- | -------------------------------- |
| **Plan Mode Default**        | Any non-trivial task                            | Enter plan mode, write `tasks/todo.md` first    | Execute blind                    |
| **Subagent Strategy**        | Heavy research / noisy work / parallel analysis | Delegate bounded task to isolated subagent      | Let verbose output flood parent  |
| **Self-Improvement Loop**    | Any correction or repeated mistake              | Abstract pattern and write rule to `lessons.md` | Fix and forget                   |
| **Verification Before Done** | Before closing task                             | Test, diff, validate behavior                   | Mark done without proof          |
| **Demand Elegance**          | Non-trivial fix / refactor                      | Pause and seek simpler design                   | Accept hacky drift               |
| **Autonomous Bug Fix**       | Bug report exists                               | Investigate and fix directly                    | Ask for unnecessary hand-holding |
| **Lessons Review**           | Session start                                   | Read `tasks/lessons.md`                         | Start cold                       |

---

## Command → Agent → Skill Pattern

```text
User invokes command
       │
       ▼
COMMAND
  ├── handles workflow
  ├── reads plan/spec
  └── coordinates steps
       │
       ▼
AGENT
  ├── isolated context
  ├── bounded task
  └── returns result
       │
       ▼
SKILL
  ├── injected knowledge / constraints
  ├── tool permissions / output pattern
  └── guides execution style
```

```text
Command = what to do
Agent   = who does it
Skill   = how to do it
```

---

## Output Compression Hook

```text
Pre/Post tool hooks intercept verbose Bash classes:

Git ops:    push | pull | commit | merge | rebase | status | diff | log
Test runs:  pytest | cargo test | npm test | pnpm test | vitest | jest | mocha | bun test
Build:      make | gradle | mvn | cargo build | tsc

→ route through compact_run.py
→ parent context receives: exit_code + summary + key error lines
→ full logs saved in $CLAUDE_SCRATCHPAD_DIR if needed
```

---

## Context Budget Thresholds

```text
0%  ──────────────────────────────────────────── 200K
     │         │         │         │          │
     0%        50%       70%       85%        95%+
     │         │         │         │          │
  Work freely  │    Attention    Degraded   Accuracy
               │    zone         quality    collapse
               ▼
          /compact NOW
          at logical breakpoint
```

| Threshold | State     | Action                           |
| --------- | --------- | -------------------------------- |
| 0–50%     | Safe      | Work normally                    |
| 50–70%    | Warning   | Compact at next breakpoint       |
| 70–85%    | Attention | Compact before next complex task |
| 85–90%    | Degraded  | Compact or clear                 |
| 90%+      | Collapse  | Context unreliable; clear/reset  |

---

## Context Budget Map

```text
Unscoped MCPs loaded          ████████████░░░░░░░░░░  ~70K effective remaining
CLAUDE.md global + project    ██░░░░░░░░░░░░░░░░░░░░  ~5-8K
Single JIT skill              █░░░░░░░░░░░░░░░░░░░░░  ~1-3K
All skills upfront            █████░░░░░░░░░░░░░░░░░  ~20-40K ← avoid
Session at 95%                ████████████████████░░  collapse zone
Session at 50%                ██████████░░░░░░░░░░░░  strategic zone
Subagent                      [─────own 200K──────]   isolated from parent
```

---

## Worktree Isolation Model

```text
main repo (.git)
     │
     ├── .claude/worktrees/feature-auth/
     │        branch: worktree-feature-auth
     │        subagent: own ctx + own files
     │
     ├── .claude/worktrees/bugfix-123/
     │        branch: worktree-bugfix-123
     │        subagent: own ctx + own files
     │
     └── main working tree

Shared:   git history, remotes
Isolated: branch, files, context, optional settings
Cleanup:  auto if unchanged; prompt if commits exist
```

---

## Settings Inheritance Hazard + Fix

```text
~/.claude/settings.json
         │
         └─► .claude/settings.json
                      │
                      ├─► Main agent inherits hooks/MCPs/permissions
                      ├─► Subagent A also inherits hooks
                      │      FIX: claude --settings .claude/no-hooks.json
                      └─► Subagent B also inherits all MCPs
                             FIX: allowedMcpServers: []
```

---

## RLM Pattern for Contexts Larger Than Window

```text
Standard:
  User → single session → output

RLM:
  Root agent
       ├── chunk codebase / large document
       ├── spawn subagent per chunk
       ├── each subagent analyzes in own context
       └── root aggregates results
```

```text
Claude Code mapping:
  Root coordinator
      + subsystem subagents
      + isolated context windows
      + synthesized final result
```

---

## Multi-Component Combination Patterns

| Pattern                        | Components                                   | Mechanism                                       | Pollution Prevented                    |
| ------------------------------ | -------------------------------------------- | ----------------------------------------------- | -------------------------------------- |
| **JIT Skill Routing**          | UserPromptSubmit + skill-rules.json + Skills | Inject one relevant skill only when matched     | All skills loaded upfront              |
| **fileSuggestion Hook**        | UserPromptSubmit + file-suggestion.sh        | Surface relevant files before first tool call   | Cold-start file hunting                |
| **SessionStart Injection**     | SessionStart + append_system_prompt          | Load token-efficiency/system guidance once      | Repeating instructions in every prompt |
| **Explore Firewall**           | Explore subagent + SubagentStop              | Research in isolated ctx, summary only returned | Search noise flooding parent           |
| **Bash Output Compression**    | Hooks + compact_run.py                       | Compress git/test/build output                  | Verbose logs bloating ctx              |
| **Strategic Compaction**       | UserPromptSubmit + `/compact` + CLAUDE.md    | Compact at 50% logical breakpoint               | Late compact collapse                  |
| **Self-Improvement Loop**      | PostToolUse + memory-writer + lessons.md     | Correction → pattern → rule → persistence       | Repeating same mistakes                |
| **Verification Gate**          | Todo + tests + git diff                      | Never complete without proof                    | Shipping unverified changes            |
| **Worktree + Parallel Agents** | Subagents + worktrees + coordinator          | Each agent edits in isolated branch/filesystem  | Cross-agent conflicts                  |
| **Command → Agent → Skill**    | Command + Agent + Skill                      | Separate workflow / executor / knowledge        | Monolithic prompts                     |
| **Error → Memory Pipeline**    | PostToolUse + memory-writer + lessons.md     | Failures become reusable rules                  | Silent repetition                      |
| **Reflexion Loop**             | Command + PostToolUse + subagent             | Analyze output, improve, memorize               | First-pass drift                       |
| **MCP Scoped Injection**       | allowedMcpServers + agent defs               | Load only relevant MCPs per agent               | MCP schema bloat                       |
| **Hook Settings Isolation**    | Hook + `--settings no-hooks.json`            | Prevent recursive hook spawning                 | Infinite loop risk                     |
| **PRP Pipeline**               | `/generate-prp` + `/execute-prp` + examples  | Spec-driven execution with bounded context      | Open-ended drift                       |
| **LSP Navigation**             | ENABLE_LSP_TOOL + Serena/LSP                 | Type-aware refs, defs, rename                   | Grep misses semantic links             |
| **Agent Teams**                | Experimental env + coordinator               | Persistent specialist teammates                 | Single-agent bottleneck                |
| **RLM Chunked Context**        | Root + chunk subagents + aggregator          | Partition > window limit workloads              | Single-context overflow                |
| **Observability Layer**        | Hooks + logging MCP                          | Correlation IDs, trace across boundaries        | Silent context drift                   |

---

## CLAUDE.md Codebase Map — Canonical Schema

```markdown
## Repo Map
src/api/        - HTTP handlers; entry: src/api/router.ts
src/services/   - Business logic; no direct DB calls
src/db/         - All DB access; repository pattern only
src/types/      - Shared interfaces; no implementation
tests/          - mirrors src/ structure

## Authoritative Modules
Auth:    src/services/auth/tokens.ts
Config:  src/config/index.ts
Errors:  src/lib/errors.ts

## Hotspots
- src/db/migrations/
- src/api/middleware/auth.ts

## Do Not Touch
- src/vendor/
- src/generated/

## Navigation Patterns
Unhandled promises: `$A.then($B)` without `.catch`
Raw SQL: `db.query($SQL)` string literal
Components w/ hook: JSX function using `useAuth`

## Build & Test
npm run build
npm test
npm run lint
npm run typecheck
```

---

## Built-in / Common Subagents

| Subagent            | Tools                          | Context         | Best For                           |
| ------------------- | ------------------------------ | --------------- | ---------------------------------- |
| **Explore**         | Glob, Grep, Read, limited Bash | Fresh           | Search, mapping, pattern discovery |
| **Plan**            | Explore delegation only        | Fresh           | Pre-write planning                 |
| **General-purpose** | Broad tool access              | Inherits parent | Multi-step tasks                   |
| **Custom**          | Declared subset only           | Own 200K        | Bounded specialized tasks          |

---

## OSS Projects × Coverage Map

| Repo                                            | Skills | Hooks | Agents | Commands | MCP | Worktrees | Self-Improve | Output Compress | Key Pattern                  |
| ----------------------------------------------- | ------ | ----- | ------ | -------- | --- | --------- | ------------ | --------------- | ---------------------------- |
| **context-engineering-kit**                     | ✅      | ✅     | ✅      | ✅        | —   | —         | ✅            | —               | Reflexion + memory           |
| **everything-claude-code**                      | ✅      | ✅     | ✅      | ✅        | ✅   | —         | ✅            | —               | Strategic compaction         |
| **compound-engineering-plugin**                 | ✅      | ✅     | ✅      | ✅        | —   | ✅         | ✅            | —               | Error→lesson loop            |
| **claude-code-infrastructure-showcase**         | ✅      | ✅     | —      | —        | —   | —         | —            | —               | Hook-based dynamic routing   |
| **workflow-orchestration**                      | ✅      | ✅     | ✅      | —        | —   | —         | —            | ✅               | DONE|{path} + compression    |
| **shinpr/claude-code-workflows**                | ✅      | —     | ✅      | ✅        | —   | —         | —            | —               | Command→Agent→Skill          |
| **claude-code-hooks-multi-agent-observability** | —      | ✅     | ✅      | —        | ✅   | —         | —            | —               | Correlation-ID observability |
| **trailofbits/claude-code-config**              | ✅      | ✅     | —      | —        | ✅   | —         | —            | —               | ast-grep + project guidance  |
| **awesome-claude-code-subagents**               | —      | —     | ✅      | —        | —   | —         | —            | —               | Domain-scoped agents         |

---

Merged by:

* removing duplicated sections between the two versions
* keeping the newer, more complete content when they overlapped
* preserving the narrative order: settings → structure → session start → hooks → execution → memory → scaling patterns → reference tables