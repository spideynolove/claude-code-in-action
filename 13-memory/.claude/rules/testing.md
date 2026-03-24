# Testing Rules

Applies to all test files (`*.test.ts`, `*.spec.ts`, `**/__tests__/**`).

- Test behavior, not implementation — if a refactor breaks a test without changing behavior, the test is wrong
- One assertion concept per test — a test named "creates user" should only assert user creation
- No mocks for DB or external services in integration tests — use real connections to the test DB
- Test file mirrors source file: `src/auth/login.ts` → `src/auth/login.test.ts`
- Use `describe` blocks to group by scenario, not by function name
- Failing tests block commit — fix them, don't skip them
