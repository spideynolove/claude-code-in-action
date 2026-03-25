# Pattern: NoPUA Agent Behavior (agency spectrum + cognitive ladder + responsible exit)

**Source:** wuji-labs/nopua
**Date:** 2026-03-25
**Gap filled:** No self-reflection behavioral frame for stuck agents; no failure-count escalation; no structured handoff format when truly blocked

## What B had

### 1. Agency Spectrum
Passive vs proactive behavior table with inner voice questions replacing threat-based enforcement. Key behaviors: read 50 lines of context not just the error; verify with tools not words; check same-pattern bugs after fixing one; ask only what tools can't answer (with evidence); never claim "done" without running verification. Inner voice questions: "What else can I do?", "Am I going in circles?", "What's the evidence?", "Did I check similar cases?"

### 2. Cognitive Ladder on Failure
Failure count → perspective height (not pressure):
- 2nd: switch eyes — fundamentally different approach
- 3rd: go up a dimension — search full error, read source, list 3 new hypotheses
- 4th: reset to zero — complete 7-item sobriety checklist (read failure signal word-by-word / search / read raw source / verify preconditions / reverse assumption / isolate minimum reproduction / change direction entirely)
- 5th+: surrender — structured handoff, not fabrication

### 3. Responsible Exit
When 7-item checklist exhausted and still stuck: structured handoff with verified facts, excluded possibilities (with evidence), narrowed scope, recommended next steps, handoff notes for next agent. Principle: finding the boundary is not failure — stating it honestly is more valuable than a fabricated solution.

## Key principles extracted

- Evidence before assertion: never claim "done" without tool-verified output
- Failure count signals needed perspective height, not pressure level
- Same methodology as systematic-debugging — different fuel (intrinsic vs threat)
- Responsible exit is a deliverable, not a failure

## What A got

- `34-nopua-agent-behavior/README.md` — all 3 patterns with usage examples
- Compatible with: `superpowers:systematic-debugging`, `superpowers:verification-before-completion`

## Adaptations made

- Removed Daoist 五道 framing (Water/Seed/Forge/Mirror/Non-contention) — content is in systematic-debugging already
- Removed trust frame (three beliefs) — philosophical, less actionable for direct use
- Removed NOPUA-REPORT multi-agent format — complex, low immediate value
- Focused on the 3 most actionable behavioral patterns
