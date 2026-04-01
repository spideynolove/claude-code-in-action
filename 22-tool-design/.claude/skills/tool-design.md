---
name: tool-design
description: Use when creating MCP tools, debugging tool-related failures or misuse, evaluating whether to consolidate tools, writing tool descriptions, or setting naming conventions. Tools are contracts between deterministic systems and non-deterministic agents — description quality directly shapes agent behavior.
---

# Tool Design for Agents

Tools are contracts between deterministic systems and non-deterministic agents. Unlike APIs designed for developers, tool APIs must be designed for language models that infer intent and generate calls from natural language. Every ambiguity in a tool definition becomes a failure mode.

## The Consolidation Principle

> If a human engineer cannot definitively say which tool should be used in a situation, an agent cannot be expected to do better.

Prefer one comprehensive tool over multiple narrow tools for the same workflow. Multiple overlapping tools:
- Consume context tokens for each description
- Create selection ambiguity at tool-call time
- Require the agent to correctly chain them

**Guideline:** 10–20 tools for most applications. Namespace if more are needed.

## Architectural Reduction

The extreme form of consolidation: replace specialized tools with primitive, general-purpose capabilities.

Instead of: `list_users`, `get_user`, `list_events`, `create_event` (4 tools, 4 descriptions)
Use: `bash` + well-documented files describing the data layer (1 tool)

**Works when:**
- Underlying data is well-documented and consistently structured
- Model has sufficient reasoning to navigate complexity
- Specialized tools were constraining more than enabling

**Fails when:**
- Data is messy or undocumented
- Safety constraints require limiting what the agent can do
- Operations genuinely benefit from structured workflows

Build for future models: architectures that lock in today's limitations become liabilities as models improve.

## Tool Description Engineering

Every description must answer four questions:

| Question | What to write |
|----------|--------------|
| What does it do? | Specific, no "helps with" or "can be used for" |
| When to use it? | Explicit triggers + indirect signals |
| What inputs? | Type, constraints, defaults, what each param controls |
| What does it return? | Format, example output, error conditions |

**Defaults** should reflect common use cases — they prevent errors from omitted parameters.

**Response format options** (concise vs. detailed) let agents control verbosity. Include guidance in the description about when to use each.

## Error Messages

Error messages are prompt engineering for recovery. For agents, they must be actionable:

```
# Bad: "Invalid parameter"
# Good: "Invalid date format. Expected ISO 8601 (e.g. 2026-03-25). Received: March 25"
```

Design errors that tell the agent what went wrong *and* how to fix it.

## MCP Naming (Sharp Edge)

Always use fully qualified names: `ServerName:tool_name`

```
# Correct:
"Use repomix:pack_codebase to pack the project."
"Use gitnexus:gitnexus_query to find call chains."

# Wrong — fails when multiple MCP servers are loaded:
"Use pack_codebase..."
```

Without the server prefix, tool lookup fails silently when multiple MCP servers are active (the scenario in `02-mcp/`).

## Tool Testing with Claude

Claude can optimize its own tool descriptions. Feed it a tool spec + observed failure examples:

```
Given this MCP tool definition and these failure cases:
[tool spec]
[list of cases where the agent picked the wrong tool or passed wrong params]

Identify:
1. Why agents fail with this tool
2. What's missing from the description
3. Rewrite the description to prevent these failures
```

Production result: 40% reduction in task completion time after description optimization.

## Checklist for New Tools

- [ ] Description answers: what, when, inputs, outputs
- [ ] Parameters have names consistent with other tools in the set
- [ ] Return fields are consistent across the tool collection
- [ ] Error messages are actionable (state fix, not just problem)
- [ ] Defaults reflect common use cases
- [ ] Fully qualified name if used in MCP context
- [ ] One tool per workflow (consolidation check: can you say definitively when to use this vs. an existing tool?)
