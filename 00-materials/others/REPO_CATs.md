# Repo Categorization — `00-materials/repo/`

> Purpose: group repos by intent to avoid duplicating `/xia` work and to surface conflicts before integration.
>
> **Workflow:** group → compare within group → distill best ideas → integrate once.
> **Order:** use existing anchors first (fast baseline), save the hardest group (Orchestration) for last.

---

## `/xia` Execution Order

| Priority | Group | Anchor in codebase | Difficulty | Why this order |
|---|---|---|---|---|
| **1** | Autonomous Loops | `ralph-loop` skill installed | Low | Anchor exists; compare 6 repos on one axis (exit / rate-limit / session); result feeds all long-running work |
| **2** | Context / Memory | Modules 18–22 | Medium | Anchor exists; foundational — better context improves every group that follows |
| **3** | Spec-Driven Workflow | `04-uiux`, `08-superpowers` (partial) | Medium | Improves how you approach every subsequent `/xia` distillation; do before Orchestration |
| **4** | Skill Libraries | — | Low per pick | Cherry-pick on-demand as groups 1–3 reveal gaps; never import wholesale |
| **5** | Agent Orchestration | — | High | Highest leverage but most complex; needs loops + context + spec patterns solid first |
| **6** | Domain-Specific | — | Very low | Self-contained leaf nodes; pull when you need them, no conflict risk |
| **—** | Awesome Lists | — | N/A | Discovery only — use as input to group comparisons above, not a `/xia` target |
| **—** | Reference / Guides | Already in 00-materials | N/A | Study material; skip `/xia` |

### What to compare within each group

**Group 3 — Autonomous Loops** (`ralph-claude-code` as baseline)
Compare: exit detection strategy · rate-limit handling · session resume · unattended safety

**Group 5 — Context / Memory** (modules 18–22 as baseline)
Compare: memory persistence model · knowledge graph vs flat file · retrieval strategy · cross-session continuity

**Group 6 — Spec-Driven Workflow** (`04-uiux` pipeline as baseline)
Compare: spec refinement loops · multi-model debate · human-in-the-loop gates · decomposition depth

**Group 4 — Agent Orchestration** (no anchor — read all 7 first, then decide baseline)
Compare: topology (star vs mesh vs pipeline) · worktree isolation · CI integration · failure recovery

---

## 1 — Awesome Lists / Curated Collections

Index repos only — no runnable code, just links. Low `/xia` value; use as discovery sources.

| Repo | Summary |
|---|---|
| `awesome-claude-code` | Selectively curated skills, agents, plugins, hooks, and tools for Claude Code |
| `awesome-agent-skills` | 680+ real-world agent skills from engineering teams |
| `awesome-claude-skills-travisvn` | Curated list of Claude skills and resources |
| `awesome-claude-plugins` | Curated list of production-ready plugins |
| `awesome-claude-code-plugins` | Curated production plugins combining commands, subagents, MCP, hooks |
| `awesome-claude-skills-composio` | Practical Claude skills across Claude.ai, Claude Code, and API |

---

## 2 — Skill / Command Libraries

Large collections of installable skills, commands, or agents. High `/xia` value — cherry-pick specific skills.

| Repo | Summary |
|---|---|
| `claude-skills-jezweb` | 10 plugins, 59 skills for scaffolding, deployment, documentation |
| `claude-skills-alirezarezvani` | 205 skills across 9 domains with 268 Python tools |
| `claude-skills-jeffallan` | 66 skills across 12 categories, full-stack, progressive disclosure |
| `claude-skills-marketplace` | (description unavailable — check README directly) |
| `ccplugins` | Professional commands saving 2–3 hours/week on repetitive tasks |
| `agents` | 112 agents, 146 skills, 79 tools in 72 focused plugins |
| `claude-code-templates` | 600+ agents, commands, MCPs, hooks, project templates |
| `everything-claude-code` | Agents, skills, hooks, MCP configs from 10 months of daily use |
| `continuous-claude-v3` | 109 skills, 32 agents with persistent learning across sessions |

---

## 3 — Autonomous Loop / Unattended Execution

Repos focused on keeping Claude running without human intervention. Conflicts likely — pick one pattern.

| Repo | Summary |
|---|---|
| `ralph-claude-code` | Autonomous loop with intelligent exit detection and rate limiting |
| `ralphy` | Autonomous coding loop with task list / PRD support |
| `ralphex` | Plan execution in fresh sessions with multi-phase reviews |
| `sleepless-agent` | 24/7 AgentOS daemon processing tasks while you sleep |
| `auto-claude-code-research-in-sleep` | ML research autonomously with cross-model collaboration |
| `claude-auto-resume` | Shell script that auto-resumes Claude when usage limits lift |

---

## 4 — Agent Orchestration / Multi-Agent Systems

Spawning and coordinating fleets of specialized agents. High overlap — evaluate before integrating multiple.

| Repo | Summary |
|---|---|
| `swe-af` | Autonomous engineering team (PM + architect + coder + reviewer) as one call |
| `agent-orchestrator` | Parallel agents in git worktrees fixing CI and review comments |
| `takt` | Structured review loops, managed prompts, quality guardrails for agents |
| `ruflo` | Enterprise orchestration: 60+ agents, self-learning, fault-tolerant consensus |
| `agentsys` | Modular runtime: 19 plugins, 47 agents, 39 skills |
| `ccpm` | PM agent turning ideas into PRDs → epics → production code |
| `claude-code-game-studios` | 48 coordinated game-dev agents, 37 workflows, quality gates |

---

## 5 — Context Engineering / Memory / Knowledge

Managing context windows, persistent memory, and knowledge graphs.
**Conflict risk with `13-memory`, `18-22` modules** — check overlap before `/xia`.

| Repo | Summary |
|---|---|
| `agent-skills-for-context-engineering` | Skills for curating LLM attention budget (already sourced for modules 18–22) |
| `arscontexta` | Generates persistent knowledge systems / second brain from conversation |
| `autocontext` | Closed-loop agent improvement via multi-agent evaluation and knowledge updates |
| `code-review-graph` | Tree-sitter structural code maps for 6.8× more efficient reviews |
| `understand-anything` | Interactive knowledge graphs of codebases for visual Q&A |
| `claude-reflect` | Captures corrections and discovers patterns for permanent memory |

---

## 6 — Spec-Driven / Planning / Development Workflow

Structured pipelines from requirements → design → implementation.
**Conflict risk with `04-uiux` (multi-agent pipeline) and `08-superpowers`.**

| Repo | Summary |
|---|---|
| `get-shit-done` | Meta-prompting + spec-driven dev solving context rot |
| `adversarial-spec` | Multi-model debate to refine specs to consensus |
| `cc-sdd` | Spec-driven dev: requirements → design → decomposition → code |
| `humanlayer` | Human-in-the-loop orchestration for complex codebases |
| `nopua` | Teaches agents honesty/self-awareness over fear-driven compliance |
| `claude-code-best-practice` | Reference implementation: orchestration, skills, hooks, subagents |

---

## 7 — Reference / Guides / Tips

Documentation and learning resources. Use as study material; low `/xia` value (already covered by `00-materials`).

| Repo | Summary |
|---|---|
| `claude-code-cheat-sheet` | Basic to advanced usage guide (levels 1–6 + subagents) |
| `claude-code-tips` | 45 tips: status lines, context, worktrees, DevOps |
| `claude-code-guide` | Community guide: tables, commands, configs, workflows |
| `claude-code-system-prompts` | Extracted Claude Code system prompts with changelog |

---

## 8 — Domain-Specific Skills

Skills targeting a single domain. Safe to `/xia` — minimal conflict risk with existing modules.

| Repo | Summary |
|---|---|
| `anthropic-cybersecurity-skills` | 753 cybersecurity skills mapped to MITRE ATT&CK + NIST CSF |
| `ai-marketing-claude` | Website audit, copy generation, client-ready marketing reports |
| `claude-seo` | Technical SEO, content quality, schema markup, local business |
| `meigen-ai-design-mcp` | MCP server: Claude as design assistant with ComfyUI + 1300 prompts |
| `claude-talk-to-figma-mcp` | MCP server connecting Claude to Figma for design operations |
| `last30days-skill` | Researches what a community upvotes across 8+ sources in last 30 days |

---

## Integration Notes

| Risk | Repos involved | Action |
|---|---|---|
| **Already sourced** | `agent-skills-for-context-engineering` | Modules 18–22 cover this — do not re-import |
| **Autonomous loop overlap** | ralph-claude-code / ralphy / ralphex / sleepless-agent | Pick one pattern; `ralph-claude-code` is the reference implementation for the `/ralph-loop` skill already installed |
| **Skill library sprawl** | claude-skills-* / agents / everything-claude-code | Cherry-pick by topic, don't import wholesale |
| **Orchestration redundancy** | swe-af / ruflo / agentsys / takt | Concepts overlap heavily — study before importing any |
| **Context/memory duplication** | arscontexta / autocontext / claude-reflect | Risk conflict with `13-memory` and `20-memory-systems` |
