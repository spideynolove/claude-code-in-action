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

## Security Baselines

- [e.g. All PII encrypted at rest]
- [e.g. No secrets in code — env vars only]
- [e.g. Parameterized queries everywhere]
