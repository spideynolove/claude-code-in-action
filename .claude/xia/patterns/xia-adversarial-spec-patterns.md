# Pattern: Adversarial Spec Patterns (consensus loop + early agreement check + preserve-intent + PRD→tech flow)

**Source:** adversarial-spec
**Date:** 2026-03-25
**Gap filled:** No multi-round consensus loop for specs; no anti-laziness check for early agreement; no removal-justification protocol; no PRD→tech spec continuation flow

## What B had

### 1. Consensus-Based Spec Convergence
Loop: draft → parallel critique (all models + Claude) → synthesize → revise → repeat until ALL agree. Claude is active participant not orchestrator — provides own critique, evaluates opponents, synthesizes. Convergence requires unanimous agreement; any dissent = continue. Max 10 rounds.

### 2. Early Agreement Verification (Anti-Laziness Check)
If any model agrees in rounds 1–2, press it: must list 3 sections reviewed + explain why spec is complete + surface any minor concerns. If model was lazy, it now has real critiques. If genuinely complete, display its verification output. Applies to Claude's own agreement too.

### 3. Preserve-Intent Flag
Removals must be justified: quote exactly what's being removed, state concrete harm, classify as error/risk/preference. ERRORS (factually wrong/contradictory) → remove. RISKS (security/scalability gaps) → flag. PREFERENCES (style/structure) → never remove. Prevents consensus rounds from sanding off intentional unconventional choices.

### 4. PRD → Tech Spec Flow
After PRD reaches consensus: use finalized PRD as context, generate Tech Spec that implements it (reference user stories → API contracts, success metrics → SLAs), run same adversarial debate, output to tech-spec-output.md. Full PRD + Tech Spec pair from one session with traceability.

## Key principles extracted

- Consensus means ALL agree — one dissent continues the loop
- Agreement in round 1–2 is a smell, not a signal — press it
- Removal burden of proof: error or risk, not preference
- PRD and Tech Spec are one flow, not two separate sessions

## What A got

- `35-adversarial-spec-patterns/README.md` — all 4 patterns with manual application guide
- Compatible with: `create_plan`, `32-cc-sdd-patterns` (EARS), `33-best-practice-patterns` (cross-model review)

## Adaptations made

- Removed tooling-specific CLI flags (debate.py, --session, --resume, --telegram, cost tracking) — focused on the behavioral patterns that work without the script
- Added "Applying Without Tooling" section for manual use in Claude Code sessions
- Skipped export-tasks (covered by implement_plan), session persistence (covered by YAML handoff), cost tracking (low value)
