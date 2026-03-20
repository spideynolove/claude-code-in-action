## Testing

Minimum 80% test coverage. TDD workflow: write test (RED) → implement (GREEN) → refactor.
All features require unit + integration tests. E2E tests for critical user flows.

## TypeScript

- Explicit types on exported functions and public APIs; let TypeScript infer locals
- Use `interface` for extendable object shapes, `type` for unions/intersections
- Avoid `any`; use `unknown` for external input and narrow safely
- Immutable updates via spread: `return { ...obj, field: value }`
- No `console.log` in production code; use proper logging libraries
- Validate external input with Zod; infer types from schemas

## Security

Before any commit:
- No hardcoded secrets — use environment variables only
- Validate all user inputs at system boundaries
- Parameterized queries (no string interpolation in SQL)
- Sanitize HTML outputs (XSS prevention)
- Error messages must not leak internal state

Security issue found → STOP → use `security-reviewer` agent → fix before continuing.
