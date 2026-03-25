# Module 32 — cc-sdd Patterns

Borrowed from: cc-sdd (Kiro-inspired spec-driven development)

Four patterns that upgrade the quality of requirements and design work:

## 1. EARS Format — Acceptance Criteria Syntax

Replace plain checkbox requirements with structured, testable statements:

| Pattern | Template | Use for |
|---|---|---|
| Event-driven | `WHEN [event] THEN [system] SHALL [action]` | Responses to triggers |
| State-driven | `WHILE [precondition] THE [system] SHALL [action]` | State-dependent behavior |
| Unwanted behavior | `IF [trigger] THEN [system] SHALL [action]` | Errors and failures |
| Optional feature | `WHERE [feature included] THE [system] SHALL [action]` | Conditional features |
| Ubiquitous | `THE [system] SHALL [action]` | Always-active properties |

See `ears-format.md` for full rules.

## 2. Steering Files — Persistent Project Memory

`.kiro/steering/` (or `.claude/steering/`) holds 3 files loaded by every planning command:

- `product.md` — Purpose, core value, capabilities, user types
- `tech.md` — Framework choices, architectural decisions, conventions, tooling
- `structure.md` — Directory organization, naming patterns, import conventions

**Bootstrap**: Generate from codebase analysis (README, package.json, source structure).
**Sync**: Detect code drift; update additively — never replace user sections.
**Golden rule**: If new code follows existing patterns, steering shouldn't need updating.

See `steering-templates/` for starter files.

## 3. Feature Type Classification

Before designing, classify the feature to calibrate discovery depth:

| Type | Description | Discovery |
|---|---|---|
| **Greenfield** | New feature, no existing code | Full: research, architecture options, risk assessment |
| **Extension** | Adding to existing system | Light: integration points, compatibility, escalate if complex |
| **Simple addition** | CRUD/UI, follows obvious patterns | Minimal or none |
| **Complex integration** | External services, security-sensitive | Full + extra security/rate-limit analysis |

## 4. `(P)` Parallel Task Markers

Annotate tasks in `tasks.md` that can run concurrently:

```markdown
- [ ] 2.1 (P) Build email worker
- [ ] 2.2 (P) Build SMS worker
- [ ] 2.3 Set up notification router  ← depends on 2.1 and 2.2, no (P)
```

**Mark `(P)` only when ALL true:**
- No data dependency on pending tasks
- No conflicting files or shared mutable state
- No prerequisite review from another task
- Environment/setup already satisfied

Never mark container tasks with `(P)` — evaluate at sub-task level.
