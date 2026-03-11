# mcporter + repomix + knowledge-graph: Context Stack

## The problem mcporter solves alone

mcporter gives on-demand MCP tool access — tools are loaded only when called, keeping the
main context clean. But mcporter itself has no memory. Every session starts cold:

- No knowledge of what was analyzed before
- No persistent structure of what the codebase contains
- Claude must re-read files or re-pack with repomix to rebuild understanding

This is fine for small, simple tasks. For ongoing work on a large codebase, it means
constant re-loading of the same context.

---

## What the combination adds

```
mcporter alone:         on-demand tool access
+ repomix:              full codebase content, on demand, compressed
+ knowledge-graph:      persistent architectural structure across sessions
```

Together they create a **context stack** with three distinct layers:

```
┌──────────────────────────────────────────────────────────┐
│  LIVE LAYER (this session)                                │
│  mcporter.repomix.pack_codebase()                        │
│  → full current code, any format, compressed or not       │
│  → disposable after session                               │
├──────────────────────────────────────────────────────────┤
│  STRUCTURAL LAYER (persists across sessions)              │
│  mcporter.knowledge-graph.aim_memory_search()            │
│  → entities, relations, architectural decisions           │
│  → written once, queried many times                       │
├──────────────────────────────────────────────────────────┤
│  TOOL ACCESS LAYER (always available)                     │
│  mcporter itself                                          │
│  → on-demand MCP tools, no permanent schema overhead      │
└──────────────────────────────────────────────────────────┘
```

---

## The workflow: pack once, index once, query always

### Session 1 (initial analysis)

```
1. mcporter call repomix.pack_codebase(
     directory: "/your/project",
     compress: true           ← ~70% token reduction via Tree-sitter
   )
   → returns outputId

2. mcporter call repomix.grep_repomix_output(
     outputId: "<id>",
     pattern: "class|interface|export default"
   )
   → find key entities without reading everything

3. mcporter call knowledge-graph.aim_memory_store(
     context: "my-project",
     location: "project",
     entities: [
       {"name": "AuthService", "entityType": "service",
        "observations": ["Handles JWT", "Stateless"]},
       {"name": "UserRepository", "entityType": "repository",
        "observations": ["PostgreSQL", "Owns user table"]}
     ]
   )

4. mcporter call knowledge-graph.aim_memory_link(
     context: "my-project",
     location: "project",
     relations: [
       {"from": "AuthService", "to": "UserRepository", "relationType": "depends_on"}
     ]
   )
```

### Session 2+ (working sessions)

```
Skip repomix entirely. Query the graph instead:

mcporter call knowledge-graph.aim_memory_search(
  query: "auth",
  context: "my-project"
)
→ AuthService + its relations, instantly, no file reads
```

### On code change

```
# Only re-pack the changed module, not the whole repo
mcporter call repomix.pack_codebase(
  directory: "/your/project/src/auth",
  includePatterns: "*.ts"
)
→ update only the affected entities in knowledge-graph
```

---

## Architectural implications

### repomix provides temporal context

repomix answers: **what does the code look like right now?**

- Content is current but ephemeral — valid for this session
- Full detail, down to implementation
- High token cost, especially for large repos (offset by compression)
- Best for: initial analysis, debugging specific files, understanding implementation

### knowledge-graph provides structural context

knowledge-graph answers: **what have we learned about this codebase?**

- Content is persistent but requires manual upkeep
- High-level — entities and relations, not raw code
- Low token cost — only retrieves what you query
- Best for: architectural navigation, dependency tracking, onboarding in a new session

### Together they cover both dimensions

```
             NOW ←──────────────────────→ ACROSS TIME
             │                                   │
        repomix                         knowledge-graph
   (what code exists today)          (what we know about it)
```

Neither replaces the other. A query to knowledge-graph tells you *what* to look at;
a query to repomix shows you *what it contains*.

---

## Integration assessment

### Does this meaningfully improve context management?

**Yes, for codebases where:**
- Sessions recur on the same project (persistent structure pays off)
- The codebase is large enough that re-reading files is expensive
- Architectural decisions and component relationships matter across sessions

**No, for:**
- One-off analysis of unknown repos (knowledge-graph never built)
- Small projects where repomix tokens are negligible
- Throwaway work with no session continuity

### Limitations that don't go away

1. **knowledge-graph is keyword-searched, not semantic** — naming consistency when storing
   is required. Searching "authentication" won't find entities named "AuthService" unless
   "authentication" appears in the observations.

2. **repomix is ephemeral** — `outputId` from `pack_codebase` doesn't persist between
   sessions. You can write to disk with the CLI, but MCP tool output is session-scoped.

3. **knowledge-graph has no diff awareness** — it doesn't know when code changes. If
   `AuthService` is refactored, you must manually update the graph.

4. **No automated bridge** — currently, the pipeline from repomix output to knowledge-graph
   entries requires Claude (or a subagent) to do the extraction step. There's no hook that
   auto-populates the graph on repomix pack.

---

## Potential future: automated bridge

The gap between repomix and knowledge-graph could be closed with a subagent:

```
Hook: on session start for known project
  → if .aim/ exists but graph is stale (check mtime vs git HEAD)
    → launch analysis subagent:
        1. repomix.pack_codebase(compress: true)
        2. extract changed components
        3. aim_memory_store/aim_memory_add_facts the delta
        4. report: "graph updated for 3 changed modules"
```

This would make the structural layer self-maintaining. Not implemented — documenting
as a direction worth pursuing.

---

## Summary

| Tool | Role | When used |
|------|------|-----------|
| mcporter | Gatekeeper — on-demand tool access | Always |
| repomix | Content scanner — full codebase snapshot | Session start, targeted re-analysis |
| knowledge-graph | Structural memory — entity/relation index | After first analysis, every session |

The combination shifts the model from "re-read the codebase every session" to
"read once, index what matters, query the index." For ongoing projects, this is
a meaningful improvement in both token efficiency and session startup speed.
