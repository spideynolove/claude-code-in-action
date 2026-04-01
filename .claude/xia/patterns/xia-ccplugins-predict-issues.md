---
source: https://github.com/brennercruvinel/CCPlugins
extracted: 2026-03-25
---

# predict-issues command from CCPlugins

**Gap filled:** No proactive risk analysis command — reactive debugging only
**Constraints applied:** Copied verbatim (markdown command)

## Pattern

`/predict-issues` — extended thinking block analyzes codebase for:
- O(n²) algorithms, memory leaks, inefficient queries
- High-complexity hotspots and tight coupling
- Hardcoded limits and scalability cliffs
- Input validation gaps, exposed secrets
- Files with high change frequency

Output: Critical/High/Medium/Low risk levels, timeline estimates, remediation steps.
Ends with user choice: create todos / create GitHub issues / summary only.

## Seam

`29-skill-authoring/.claude/commands/predict-issues.md`

## Delta from original

- 23 other ccplugins commands skipped (review, scaffold, commit, format — covered by existing tools or trivial)
- jezweb, jeffallan, marketplace repos: 0 new patterns (platform-specific or already covered)
