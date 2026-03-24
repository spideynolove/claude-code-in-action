---
name: evaluation
description: Use when evaluating agent performance, building test frameworks, measuring Claude Code output quality, implementing LLM-as-judge, comparing model outputs, creating evaluation rubrics, or setting up quality gates. Covers evaluation methods, bias mitigation, and rubric design for non-deterministic agent systems.
---

# Agent Evaluation

Agent evaluation differs from traditional software testing: agents are non-deterministic, may take multiple valid paths to the same goal, and fail in context-dependent ways. Evaluation must be outcome-focused, multi-dimensional, and budget-aware.

## The 95% Finding (BrowseComp benchmark)

Three factors explain 95% of agent performance variance:

| Factor | Variance | Implication |
|--------|----------|-------------|
| Token budget | **80%** | Insufficient budget → poor output; diagnose this first |
| Tool calls | ~10% | More exploration generally helps |
| Model choice | ~5% | Upgrading model > doubling token budget |

**Diagnostic priority:** Before rewriting prompts, check token budget. Before increasing budget, try a better model.

## Evaluation Approaches

### Direct Scoring
Rate one response against explicit criteria. Best for objective criteria (factual accuracy, instruction following). Requires justification *before* score (chain-of-thought first improves reliability 15–25%).

### Pairwise Comparison
Compare two responses; pick the better one. Best for subjective preferences (tone, style). More reliable than direct scoring for preference-based tasks. Requires position-bias mitigation (evaluate twice with swapped order).

### End-State Evaluation
Judge whether final state matches expectations (not how the agent got there). Best for agents that mutate files, databases, or system state.

## Biases to Mitigate

| Bias | Description | Mitigation |
|------|-------------|------------|
| Position bias | First response preferred in pairwise | Evaluate twice, swap positions, majority vote |
| Length bias | Longer = rated higher | Explicit prompt to ignore length |
| Self-enhancement | Models rate own outputs higher | Use different model as judge |
| Authority bias | Confident tone rated higher regardless of accuracy | Require evidence citation |

## LLM-as-Judge Prompt Template

```
You are evaluating an agent's response.

## Task
{original_task}

## Response
{agent_output}

## Criteria
{criterion_name}: {description}
Scale: 1 (poor) → 5 (excellent)

## Instructions
1. Find specific evidence in the response for each criterion
2. Write your justification
3. Then assign a score (1–5)
4. Suggest one concrete improvement

## Output
{
  "criterion": "...",
  "justification": "...",
  "score": <int>,
  "improvement": "..."
}
```

Justification before score is non-negotiable — it prevents post-hoc rationalization.

## Multi-Dimensional Rubric

| Dimension | What it measures | Weight |
|-----------|-----------------|--------|
| Factual accuracy | Claims match ground truth | High |
| Completeness | Covers all requested aspects | High |
| Tool efficiency | Used right tools, reasonable number of times | Medium |
| Process quality | Followed expected reasoning path | Low |

Agents may find alternative valid paths — judge outcomes, not process steps.

## Test Set Design

- Start small (10–20 cases) during development — large effects are visible early
- Stratify by complexity: simple (1 tool call) → medium → complex → very complex
- Include real usage patterns + known edge cases
- Add regression cases for every fixed bug

## Degradation Testing

Run agents at different context sizes on the same test set. Find the performance cliff where quality drops. Set `/compact` triggers before that cliff.

## For Claude Code Hooks

An LLM-as-judge hook fires after `Write|Edit` and re-evaluates the output:

```python
import json, subprocess, sys

def main():
    data = json.load(sys.stdin)
    if data.get("tool_name") not in ("Write", "Edit"):
        sys.exit(0)

    file_path = data.get("tool_input", {}).get("file_path", "")
    output = data.get("tool_response", {}).get("content", "")

    result = subprocess.run(
        ["claude", "-p", f"Rate this code output for correctness and completeness (1-5). Justify first, then score.\n\n{output}"],
        capture_output=True, text=True, timeout=30
    )
    if result.stdout:
        print(result.stdout, file=sys.stderr)

if __name__ == "__main__":
    main()
```

Wire it in `settings.json` as a PostToolUse hook with matcher `Write|Edit`.
