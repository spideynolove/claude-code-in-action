# Structure Steering

> Persistent project memory — loaded by every planning command.
> Document organization patterns with examples, not exhaustive file lists.

## Directory Layout

```
[project root]/
├── [src/]           — [what lives here, e.g. "application code, feature-first"]
│   ├── [feature/]   — [pattern description]
│   └── [shared/]    — [pattern description]
├── [tests/]         — [test organization pattern]
└── [config/]        — [configuration files]
```

## Naming Conventions

- Files: [e.g. kebab-case.ts]
- Components: [e.g. PascalCase]
- Functions: [e.g. camelCase]
- Constants: [e.g. SCREAMING_SNAKE_CASE]
- Database tables: [e.g. snake_case, plural]

## Import Patterns

- [e.g. Absolute imports from `src/` — no relative `../../`]
- [e.g. Barrel exports via `index.ts` per feature]
- [e.g. External imports before internal]

## Key Patterns

- [Pattern name]: [Description with example path]
- [Pattern name]: [Description with example path]

## What NOT to Put Here

Settings and agent tooling (`.claude/`, `.kiro/`, etc.) are infrastructure — not project structure.
