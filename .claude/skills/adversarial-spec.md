---
name: adversarial-spec
description: Refine a spec or plan through multi-angle adversarial critique until all perspectives agree. Use when writing PRDs, tech specs, or implementation plans that need stress-testing.
---

# Adversarial Spec Development

Refine specifications through iterative adversarial critique until all reviewers agree.

## Process

### Step 0 — Gather Input

Ask the user:
1. **Document type:** PRD, tech spec, or implementation plan
2. **Starting point:** existing file path, or describe what to build

### Step 1 — Draft or Load Document

If user describes what to build:
1. Ask 2–4 focused clarifying questions before drafting
2. Generate a complete document (all sections, state assumptions explicitly)
3. Present draft for user review — incorporate feedback before debate

If user provides a file: read it, validate it has content, use as starting document.

### Step 2 — Adversarial Critique Loop

Run until ALL perspectives agree:

```
--- Round N ---

Critiques from each lens:
- [Security] <agreed | critiqued: summary>
- [Reliability] <agreed | critiqued: summary>
- [Junior developer] <agreed | critiqued: summary>

Claude's own critique:
<independent analysis — what did the other lenses miss?>

Synthesis:
- Accepted: <what and from which lens>
- Added by Claude: <your contributions>
- Rejected: <what and why>
```

**Default critique lenses (use all unless user specifies):**
- Security engineer — auth, input validation, attack surface
- Oncall engineer — observability, failure modes, debugging at 3am
- Junior developer — ambiguity, tribal knowledge assumptions, unclear specs

**Additional focus modes:** scalability, performance, ux, reliability, cost

**Model personas for deeper critique:** `security-engineer`, `oncall-engineer`, `junior-developer`, `qa-engineer`, `site-reliability`, `product-manager`

### Step 3 — Convergence Rules

- ALL perspectives AND Claude must agree — any dissent = continue
- Maximum 10 rounds (ask user if reached)
- Only agree when you would confidently hand the doc to the team that implements it

**When to say [AGREE]:**
- PRD → a product team starting implementation planning
- Tech Spec → an engineering team starting a sprint
- Plan → Claude Code ready to implement without unresolved questions

### Early Agreement Verification (Anti-Laziness)

If any perspective agrees in rounds 1–2, **press it**:
- List at least 3 specific sections reviewed
- Explain WHY the spec is complete
- Surface any remaining concerns, however minor

If it was lazy, it now has real critiques — continue the loop.
Apply this to your own agreement too.

### Preserve-Intent Rule

When enabled (user says "preserve intent" or spec has deliberate unconventional choices):

Any removal must:
1. **Quote exactly** what's being removed
2. **State the concrete harm** — not "unnecessary", but what breaks
3. **Classify:** ERRORS (wrong/contradictory/broken) → remove. RISKS (security/scalability gaps) → flag. PREFERENCES (style/structure) → never remove.
4. **Ask before removing** unusual but functional choices

Shifts convergence from homogenization to protective addition.

---

## PRD → Tech Spec Continuation

After PRD reaches consensus, offer:

> "PRD is complete. Continue into a Technical Specification based on this PRD?"

If yes:
1. Use finalized PRD as context
2. Generate Tech Spec that implements the PRD (user stories → API contracts, success metrics → SLAs)
3. Run the same adversarial critique loop
4. Output complete PRD + Tech Spec pair with full traceability

---

## Document Critique Criteria

**PRD critique checks:**
- Clear problem definition with evidence
- Personas have names, roles, goals, pain points
- User stories: "As a [persona], I want [action] so that [benefit]"
- Measurable success criteria with specific targets
- Explicit scope: IN and OUT list
- No implementation details

**Tech Spec critique checks:**
- Architectural decisions with rationale
- Complete API contracts (method/path/request schema/response schema/error codes)
- Data models with types, constraints, indexes, relationships
- Security: auth, authz, encryption, input validation
- Performance: specific latency/throughput/availability numbers
- Deployment: repeatable and reversible

---

## Compatible With

- `create_plan` — use adversarial critique to stress-test the plan before approval
- `32-cc-sdd-patterns` EARS format — use for acceptance criteria within the spec
- `33-best-practice-patterns` cross-model review — lighter-weight single-pass variant of this
