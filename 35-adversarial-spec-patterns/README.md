# Module 35 — Adversarial Spec Patterns

Borrowed from: adversarial-spec (multi-model debate system for spec refinement)

Four patterns for tightening specs through adversarial consensus. Can be applied manually (no tooling required) or with the full adversarial-spec skill.

---

## 1. Consensus-Based Spec Convergence

**Rule:** A spec is not done until ALL reviewers agree. One dissenting model = another revision round.

The loop:
```
describe → draft → [parallel critique by all models + Claude] → synthesize → revise → repeat until ALL agree
```

Claude is an **active participant**, not just an orchestrator. After receiving opponent model responses, Claude provides its own independent critique, evaluates opponent critiques for validity, then synthesizes all feedback.

Round display format:
```
--- Round N ---
Opponent Models:
- [Model A]: <agreed | critiqued: summary>
- [Model B]: <agreed | critiqued: summary>

Claude's Critique:
<independent analysis — what did you find that opponents missed?>

Synthesis:
- Accepted from Model A: <what>
- Accepted from Model B: <what>
- Added by Claude: <your contributions>
- Rejected: <what and why>
```

**Convergence rules:**
- ALL models AND Claude must agree — any single dissent = continue
- Maximum 10 rounds (ask user to continue if reached)
- More models = stricter convergence (each adds a distinct perspective)
- Quality over speed: 7 tight rounds beats 2 sloppy ones

**When to say [AGREE]:** Only when you would confidently hand this document to:
- PRD → a product team starting implementation planning
- Tech Spec → an engineering team starting a sprint

---

## 2. Early Agreement Verification (Anti-Laziness Check)

**Problem:** Models that agree in rounds 1–2 may not have read the full document.

**Rule:** If any model says `[AGREE]` within the first 2 rounds, press it.

Press prompt instructs the model to:
- Confirm it read the ENTIRE document
- List at least 3 specific sections it reviewed
- Explain WHY it agrees (what makes the spec complete)
- Identify ANY remaining concerns, however minor

**Outcomes:**
- Model confirms agreement with section list + reasoning → accept, display to user
- Model was being lazy and now has critiques → continue debate normally

Apply this to your own Claude critiques too: don't agree early unless you can list which sections you checked and why each is complete.

---

## 3. Preserve-Intent Flag

**Problem:** Consensus rounds tend toward lowest-common-denominator specs — adversarial convergence sands off novel design choices.

**Rule:** When enabled, any removal requires explicit justification.

Models must:
1. **Quote exactly** what they want to remove or substantially change
2. **Justify the harm** — not "unnecessary" but what concrete problem it causes
3. **Distinguish error from preference:**
   - ERRORS: Factually wrong, contradictory, technically broken → remove/fix
   - RISKS: Security holes, missing error handling, scalability gap → flag prominently
   - PREFERENCES: Different style, structure, approach → DO NOT remove
4. **Ask before removing** unusual but functional choices

Shifts the default: from "sand off anything unusual" → "add protective detail while preserving distinctive choices."

**Use when:**
- Spec contains intentional unconventional design choices
- Previous rounds removed things you wanted to keep
- Refining an existing spec that represents deliberate decisions

---

## 4. PRD → Tech Spec Flow

**Pattern:** Continue from a finalized PRD into a Technical Specification in a single session.

After PRD consensus is reached:
1. Use the finalized PRD as context and requirements input
2. Optionally run interview mode again for technical details
3. Generate initial Tech Spec that implements the PRD
4. Reference PRD sections throughout (user stories → API contracts, success metrics → SLAs)
5. Run the same adversarial debate with the same models
6. Output to `tech-spec-output.md`

**Result:** A complete PRD + Tech Spec pair from one session, with full traceability.

**Document types and critique criteria:**

PRD critique checks: clear problem definition, well-defined personas, proper user story format (As a… I want… So that…), measurable success criteria, explicit scope (in AND out), no implementation details.

Tech Spec critique checks: architectural decisions with rationale, complete API contracts (method/path/request/response/errors), data models with types + constraints + indexes, security section (auth/authz/encryption/input validation), specific performance targets (latency/throughput/availability), deployment is repeatable and reversible.

---

## Applying These Patterns Without Tooling

You can apply all four patterns in a Claude Code session manually:

```
Apply adversarial spec convergence:
- Draft the spec, then critique it yourself from 3 angles: security-engineer, oncall-engineer, junior-developer
- Revise until your own critique produces [AGREE]
- If you agree in round 1, press yourself: list 3 sections reviewed + reason for agreement
- For any removal: quote what you'd remove, state the concrete harm, classify as error/risk/preference
- Only remove errors and risks — preserve preferences unless harmful
```

---

## Compatible With

- `create_plan` — use adversarial critique to stress-test the plan before implementation
- `32-cc-sdd-patterns` — EARS format for acceptance criteria within the spec
- `33-best-practice-patterns` — cross-model review (additive-only QA) is a lighter-weight variant of this pattern
