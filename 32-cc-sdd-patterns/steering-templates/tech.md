# Tech Steering

> Persistent project memory — loaded by every planning command.
> Document decisions and conventions, not dependency lists.

## Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Language | [e.g. TypeScript 5.x] | |
| Runtime | [e.g. Node 22 / Python 3.12] | |
| Framework | [e.g. Next.js 14] | |
| Database | [e.g. PostgreSQL + Prisma] | |
| Testing | [e.g. Vitest + Playwright] | |

## Architectural Decisions

- **[Decision]**: [What was chosen and why] — [what was rejected]
- **[Decision]**: [What was chosen and why]

## Coding Conventions

- [Convention 1 — e.g. "feature-first directory layout, not layer-first"]
- [Convention 2 — e.g. "Zod schemas at API boundary, infer types from schemas"]
- [Convention 3 — e.g. "no default exports"]

## Testing Strategy

- Unit: [what/where]
- Integration: [what/where]
- E2E: [what/where]

## Acceptance Criteria Format (EARS)

Write acceptance criteria using EARS syntax — one behavior per statement, independently testable:

| Pattern | Syntax | Use for |
|---------|--------|---------|
| Event-driven | `WHEN [event], THE [system] SHALL [response]` | Responses to triggers |
| State-driven | `WHILE [precondition], THE [system] SHALL [response]` | State-dependent behavior |
| Error/failure | `IF [trigger], THEN THE [system] SHALL [response]` | Error handling |
| Optional feature | `WHERE [feature included], THE [system] SHALL [response]` | Conditional capabilities |
| Always active | `THE [system] SHALL [response]` | Non-functional requirements |

Rules: Use `SHALL` for mandatory, `SHOULD` for recommended. Name the concrete service, not "the system". No implementation details (WHAT not HOW).

## Security Baselines

- [e.g. All PII encrypted at rest]
- [e.g. No secrets in code — env vars only]
- [e.g. Parameterized queries everywhere]
