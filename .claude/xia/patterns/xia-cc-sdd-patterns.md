# Pattern: cc-sdd Patterns (EARS + Steering + Feature Types + (P) Markers)

**Source:** cc-sdd (Kiro-inspired spec-driven development)
**Date:** 2026-03-25
**Gap filled:** Plain checkbox requirements; no persistent project memory across planning sessions; no design depth calibration; no parallel task annotation

## What B had

### 1. EARS Format
Five structured acceptance criteria patterns replacing plain checkboxes:
- Event-driven: `WHEN [event] THE [system] SHALL [action]`
- State-driven: `WHILE [precondition] THE [system] SHALL [action]`
- Unwanted behavior: `IF [trigger] THEN THE [system] SHALL [action]`
- Optional feature: `WHERE [feature] THE [system] SHALL [action]`
- Ubiquitous: `THE [system] SHALL [action]`
Rules: one behavior per statement, `SHALL` for mandatory, name concrete system not "the system", testable/verifiable, WHAT not HOW.

### 2. Steering Files
Three files in `.kiro/steering/` (adapted to `.claude/steering/`) as persistent project memory loaded by every planning command:
- `product.md` — purpose, core value, user types, non-goals
- `tech.md` — stack, architectural decisions, coding conventions, testing strategy
- `structure.md` — directory layout pattern, naming, import conventions
Golden rule: document patterns not catalogs. Update additively; never replace user sections. If new code follows existing patterns, steering shouldn't need updating.

### 3. Feature Type Classification
Four types determine design discovery depth:
- **Greenfield** → Full discovery: architecture options, web research, risk assessment, dependency investigation
- **Extension** → Light discovery: integration points, compatibility check, escalate if complex
- **Simple addition** (CRUD/UI) → Minimal or none
- **Complex integration** (external services, security-sensitive) → Full + extra security/rate-limit analysis

### 4. `(P)` Parallel Task Markers
Annotate tasks eligible for concurrent execution with `(P)` after task ID:
`- [ ] 2.1 (P) Build email worker`
Mark only when ALL true: no data dependency, no conflicting files/shared state, no prerequisite review, environment already satisfied. Never mark container tasks — evaluate at sub-task level.

## Key principles extracted

- EARS makes requirements independently testable — each maps directly to a test case
- Steering is read-once project memory, not re-derived each session
- Feature type drives research investment — don't do full discovery for a CRUD screen
- `(P)` is a planning artifact that survives into execution; agents use it to dispatch parallel work

## What A got

- `32-cc-sdd-patterns/README.md`
- `32-cc-sdd-patterns/ears-format.md` — full EARS syntax reference
- `32-cc-sdd-patterns/steering-templates/product.md`
- `32-cc-sdd-patterns/steering-templates/tech.md`
- `32-cc-sdd-patterns/steering-templates/structure.md`
- `~/.claude/commands/steering.md` — bootstrap/sync slash command

## Adaptations made

- `.kiro/steering/` → `.claude/steering/` (fits existing dotfiles convention)
- Removed Kiro-specific tooling (spec.json approval gates, template engine)
- Simplified steering command to pure git-analysis-based bootstrap
