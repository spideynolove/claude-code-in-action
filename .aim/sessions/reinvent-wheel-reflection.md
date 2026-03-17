# Sequential Thinking Session: Don't Reinvent the Wheel in Claude Code Tooling

**Problem:** When building Claude Code tooling, how should we apply "don't reinvent the wheel"?
**Success criteria:** Clear decision framework — when to adopt existing solutions vs. build new ones, and what signals drive that choice
**Date:** 2026-03-16

---

## Main Thread

### Thought 1 — What "the wheel" means in the Claude Code ecosystem

In the Claude Code ecosystem, "the wheel" refers to shared primitives that have already been solved: MCP server patterns (tool registration, schema validation, error handling), hook architectures (pre/post-tool, notification routing), skill structures (frontmatter metadata, instruction format), and agent coordination patterns (subagent spawning, context passing). These are not trivial — they encode months of community learning about what works with Claude's tool-use behavior. Reinventing them means rediscovering edge cases that others already hit.

### Thought 2 — The LLM convergence phenomenon

When using an LLM to generate Claude Code tooling, the outputs cluster around similar patterns regardless of the prompt — because the training data contains many similar solutions. This means: (a) your LLM-generated MCP will look like other LLM-generated MCPs, (b) the "unique" solution you built probably exists somewhere, (c) the real differentiation comes from project-specific context the LLM doesn't have. LLM convergence is a signal that the problem space is well-trodden and discovery should precede building.

### Thought 3 — The discovery gap

Most developers don't search before building Claude Code tooling. The discovery gap has two causes: (1) search friction — GitHub search for "claude code hooks" or "CLAUDE.md patterns" returns noise unless you know the right terms; (2) recency bias — Claude Code tooling moves fast, and solutions from 3 months ago may use deprecated APIs. Key discovery signals: awesome-claude-code lists, X/Twitter #claudecode, Claude Discord #tools channel, GitHub topics "claude-code" and "mcp-server". The timebox matters: a 20-minute discovery sprint before a 2+ hour build is almost always ROI-positive.

### Thought 4 — The asymmetry of learning value

Building something you'll later throw away or replace has positive ROI when: the build deepens your mental model of the problem domain, the existing solution is a black box that would block debugging, or the process of building reveals requirements you didn't know you had. This repo IS a learning environment — deliberate reinvention here is feature, not bug. The key distinction: are you building to ship, or building to understand? Production tooling should adopt; learning repos should build, then optionally adopt once you understand the tradeoffs.

---

## Branch A — When adoption beats building

**When to adopt existing solutions:**
1. Source is maintained — check last commit date, open issue response time, star trajectory
2. Integration cost < rebuild cost — if adapting an existing MCP takes 30 min vs 4 hours to rebuild, adopt unless learning is the goal
3. No proprietary context required — generic tool-use patterns, standard MCP schemas, common hook signatures are adoption candidates
4. Operational simplicity argument reverses — adding a well-maintained dep with good error handling is simpler than maintaining your own

**Adoption signals:** >100 stars, commits within 60 days, issues answered within a week, active Discord/community

---

## Branch B — When building beats adoption

**When to build new:**
1. Deep customization required — project-specific hook chaining, custom context injection, proprietary workflow that would require forking anyway
2. Learning is the explicit goal — this repo context applies here
3. Existing solutions don't compose — different transport layer, auth model, or tool schema convention than your stack
4. Operational simplicity argument applies — one fewer dependency, one fewer failure mode, one fewer thing to update

Build when the adoption tax (understanding someone else's abstractions, their bugs, their update cadence) exceeds the build cost.

---

## Branch C — Discovery-first workflow

**Pre-build discovery sprint (timebox: 20 minutes):**
1. GitHub search: `claude-code CLAUDE.md`, `mcp-server claude`, `claude hooks workflow`, `claude code agent`
2. Check awesome-claude-code repos
3. Search X/Twitter: `#claudecode`, `#mcpserver` last 30 days
4. Claude Discord #tools and #mcp channels
5. If you find 2+ similar solutions → adoption likely better
6. If you find 0 → either problem is novel OR wrong search terms — try broader terms before concluding novelty

**Rule:** Document what you searched and what you found before starting any build that takes >2 hours.

---

## Decision Record

**Title:** Discovery-first vs build-first for Claude Code tooling

**Context:** Repeated pattern of building Claude Code tooling (MCPs, skills, hooks, agents) that already exists in some form on GitHub. LLM-generated code converges on similar patterns, making the problem worse.

**Options considered:**
- Always search first (adopt bias)
- Always build first (NIH bias)
- Context-dependent with explicit triggers

**Chosen:** Context-dependent with explicit triggers

**Rationale:** This repo is explicitly a learning environment — building has intrinsic value here even when solutions exist. Production projects should default to discovery-first. The trigger for discovery is: any build that will take >2 hours AND doesn't require proprietary context.

**Consequences:**
- Add a pre-build checklist: (1) Is this a learning build or a production build? (2) If production: run 20-min discovery sprint. (3) Document what was found. (4) If adopting: note why. If building: note what makes this novel or learning-motivated.
- Accept deliberate reinvention as valid when learning is the stated goal.
- LLM convergence = signal to search, not permission to skip searching.

---

## Key Insights Summary

1. **The wheel in Claude Code** = MCP primitives, hook patterns, skill structures — community-encoded knowledge, not just code
2. **LLM convergence** = your generated solution probably exists; use it as a search prompt
3. **20-minute rule** = discovery sprint before any >2h build that isn't project-specific
4. **Learning exception** = deliberate reinvention is valid; be explicit about which mode you're in
5. **Adoption signals** = stars + recency + issue responsiveness; integration cost vs rebuild cost
