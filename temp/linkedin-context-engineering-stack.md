# LinkedIn Post — Context Engineering Stack

---

We spent a session turning three MCP tools into a coherent context engineering stack for Claude Code. Here's what we built and what we learned.

---

**The starting point: repomix was installed but doing nothing**

repomix was documented as the "preferred broad-context tool" in our AI-assisted UI workflow — but no skill file existed, no config existed, no outputs existed. It was mentioned but never wired up.

The fix wasn't just running a command. It was understanding *why* repomix matters and *where* each piece belongs.

---

**Lesson 1: A skill file is not just documentation — it's a behavioral contract**

When you add an MCP server, Claude doesn't automatically know when to use it or how to use it well.

A skill file (in ~/.claude/skills/tool-name/SKILL.md) fills that gap. It tells Claude:
- When this tool is appropriate (and when it isn't)
- Which tools to call, in what order
- What the output means and how to act on it

The pattern: "turning an MCP into a Claude Code skill" = ship the tool + ship the instructions for using it. One without the other is half the integration.

We made this mistake: placed the repomix skill inside the plugin cache directory, which is managed by the plugin installer and would be overwritten on the next update. The correct location is ~/.claude/skills/ — owned by the user, not the plugin system.

---

**Lesson 2: Read the source, not just the README**

Before integrating mcp-knowledge-graph, we used repomix to pack the entire repo — not just read the README.

That revealed things the README didn't mention:
- Every write operation does a full file rewrite (no append mode) — meaning large graphs degrade performance
- Search is case-insensitive substring matching, not semantic — naming consistency when storing facts is critical for retrieval
- There's no write locking — running two Claude sessions writing to the same graph simultaneously will corrupt it
- Project detection searches up 5 directory levels for markers like .git, .aim, package.json

These details change how you use the tool. README-only integration produces brittle setups.

---

**Lesson 3: The context stack**

The combination of mcporter + repomix + mcp-knowledge-graph creates three distinct layers:

Live layer — mcporter calls repomix.pack_codebase() to get the current codebase content. High fidelity, high token cost, expires when the session ends. Answers: what does the code look like right now?

Structural layer — knowledge-graph stores what you've learned about the codebase as entities and typed relations (AuthService depends_on UserRepository). Low token cost, persists across sessions. Answers: what have we mapped about this system?

Tool access layer — mcporter itself, keeping MCP tool schemas out of the main context until needed.

The workflow becomes: pack once on session 1, extract architecture, store in the graph. Session 2 onwards, skip repacking — query the graph directly.

This separates "reading the codebase" (a one-time operation) from "remembering its architecture" (persistent).

---

**Lesson 4: Multi-agent is just subprocess delegation**

The MCP_MANAGEMENT pattern from the claudekit project looks complex in its workflow diagram but reduces to one idea: don't load MCP tool schemas into the main agent's context — load them in a subagent.

Extended further: Claude doesn't have to execute every task. It can delegate to gemini-cli for long-context retrieval (1M window), codex for structured planning, or any other CLI coding agent — then review the output. Claude as orchestrator and reviewer, other tools as executors.

The result handling is simple: bash stdout flows back to the main context automatically. No orchestration infrastructure needed for sequential pipelines. Complexity only enters when you have true parallelism or conditional branching.

---

**What's now in place**

repomix and mcp-knowledge-graph are both installed under Node v22, wired into mcporter, and paired with skill files built from source analysis — not just the README.

The 04-uiux workflow has a repomix config, explicit instructions for when to run it, and initial outputs committed. The mcporter-in-depth directory has an analysis of how these three tools compose into a context stack.

Every piece is documented in the repo under 02-mcp/ so the same setup can be replicated on another machine.

---

The meta-pattern worth naming: the best way to understand a tool well enough to write a skill for it is to use repomix on its own codebase. Read the implementation, not the marketing.

---

#ClaudeCode #AIEngineering #ContextEngineering #MCP #DeveloperTools #AIAgents
