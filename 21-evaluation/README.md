# 21 — Evaluation

Adapted from [agent-skills-for-context-engineering](../00-materials/repo/agent-skills-for-context-engineering/): two skills (evaluation + advanced-evaluation) collapsed into one reference.

## Install

```bash
cp .claude/skills/evaluation.md ~/.claude/skills/evaluation.md
```

## Key takeaways

- Token budget explains 80% of performance variance — diagnose this before prompt-tuning
- Justification before score improves LLM-as-judge reliability by 15–25%
- Position bias in pairwise: always evaluate twice with swapped order
- Start with 10–20 test cases; large improvements are visible immediately

## What's in the skill

- Evaluation approaches (direct scoring, pairwise, end-state)
- Bias catalogue + mitigations
- LLM-as-judge prompt template
- Multi-dimensional rubric pattern
- PostToolUse hook sketch for automated output evaluation
