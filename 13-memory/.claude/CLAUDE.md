# Project Memory Template

Copy to `<project>/CLAUDE.md` or `<project>/.claude/CLAUDE.md` and edit.

---

# <Project Name>

## Stack

- Runtime: Node 20 / Python 3.12
- Framework: Next.js 14 / FastAPI
- DB: PostgreSQL via Prisma

## Code Rules

- TypeScript strict mode — no `any`, no `as` casts without comment
- No default exports — named exports only
- File names: kebab-case
- No `console.log` in committed code — use the logger at `src/lib/logger.ts`

## Testing

- All new functions need a unit test
- Integration tests use the real DB (no mocks)
- Run `npm test` before marking a task complete

## Git

- Never commit automatically
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`
- Never force-push main

## External docs

@README.md
@docs/architecture.md
