---
name: token-efficiency
description: Use when a session is running long, context is getting heavy, or you want Claude to compress its explanations without sacrificing code quality. Covers the symbol system, abbreviation table, compression levels, and when to switch modes. Pairs with context-engineering (18) which covers /compact and observation masking at the tool-output level.
---

# Token Efficiency Mode

A prompt-level compression protocol for Claude's response style. Code quality and accuracy are unchanged — only the prose explanation is compressed. Reduces explanation tokens by 30–50% in long sessions.

## When to Use

- Debugging sessions longer than ~30 minutes
- Large code reviews spanning many files
- CI/CD status monitoring
- Any session where you notice context getting heavy and `/compact` is not enough

Do **not** use for: initial requirements definition, onboarding explanations, or communication with non-technical stakeholders.

## Activation

```
"Token Efficiency Mode on"
"Respond in --uc mode"
"Concise mode"
```

Disable:

```
"Return to normal mode"
"Explain in detail"
```

## Compression Levels

| Flag  | Level              | Use when                          |
|-------|--------------------|-----------------------------------|
| `--uc` | Ultra Compressed   | Very long session, near context limit |
| `--mc` | Moderate Compressed | Default for long work sessions    |
| `--lc` | Light Compressed   | Prefer readability, reduce slightly |

Domain focus flags (combine with level):

| Flag    | Focus        |
|---------|--------------|
| `--dev` | Development  |
| `--ops` | Operations   |
| `--sec` | Security     |

Example: `"Analyze with --uc --sec"`

## Symbol System

### Logic & Flow

| Symbol | Meaning         | Example                            |
|--------|-----------------|------------------------------------|
| →      | leads to/causes | `auth.js:45 → 🛡️ sec vuln`       |
| ⇒      | converts to     | `input ⇒ validated_output`         |
| ←      | rollback        | `migration ← rollback`             |
| ⇄      | bidirectional   | `sync ⇄ remote`                   |
| »      | sequence        | `build » test » deploy`            |
| ∴      | therefore       | `tests ❌ ∴ code broken`           |
| ∵      | because         | `slow ∵ O(n²)`                    |

### Status

| Symbol | Meaning   |
|--------|-----------|
| ✅     | complete  |
| ❌     | failed    |
| ⚠️     | warning   |
| 🔄     | in progress |
| ⏳     | pending   |
| 🚨     | critical  |

### Domain Icons

| Symbol | Domain       |
|--------|--------------|
| ⚡     | Performance  |
| 🛡️     | Security     |
| 🧪     | Testing      |
| 🗄️     | Database     |
| 🏗️     | Architecture |
| 🎨     | Frontend     |
| ⚙️     | Backend      |
| 📦     | Deployment   |
| 🔍     | Analysis     |
| 🔧     | Config       |

## Abbreviation Table

| Abbrev | Full word        |
|--------|-----------------|
| `cfg`  | configuration   |
| `impl` | implementation  |
| `arch` | architecture    |
| `perf` | performance     |
| `ops`  | operations      |
| `env`  | environment     |
| `req`  | requirements    |
| `deps` | dependencies    |
| `val`  | validation      |
| `auth` | authentication  |
| `sec`  | security        |
| `err`  | error           |
| `opt`  | optimization    |
| `sev`  | severity        |

## Compressed Output Examples

**Error report:**
```
Normal:  Security vulnerability found in the user validation function at line 45 of the auth system.
--uc:    auth.js:45 → 🛡️ sec vuln in user val()
```

**Build status:**
```
Normal:  Build completed. Tests running. Deployment scheduled.
--uc:    build ✅ » test 🔄 » deploy ⏳
```

**Performance finding:**
```
Normal:  Performance analysis revealed slow processing due to O(n²) algorithm complexity.
--uc:    ⚡ perf: slow ∵ O(n²) → optimize to O(n)
```

**File scan results:**
```
/src/auth/:  🛡️ issues × 3
/src/api/:   ⚡ bottleneck in handler()
/src/db/:    ✅ clean
/tests/:     🧪 coverage 78%
```

## Relation to Context Engineering (18)

Token Efficiency Mode operates at the **response style** level — it compresses Claude's prose output.

Context Engineering (18) operates at the **tool output** level — it compresses what Claude observes (observation masking, /compact, selective reads).

Use both together in heavy sessions:
1. Enable `--mc` or `--uc` for Claude's explanations
2. Use `/compact` or scoped Reads to keep tool outputs lean
