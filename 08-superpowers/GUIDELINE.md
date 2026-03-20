# Workflow Classifier — Spot Check Guide

The `workflow-classifier.sh` hook runs on every `UserPromptSubmit` event. It injects one line into Claude's context before it responds. This file shows what to expect for each task type.

---

## How to verify

Start a **new** Claude Code session (existing sessions won't pick up the hook until restarted). Send each prompt below and look for the `[workflow:*]` line at the top of Claude's system context output before the response.

---

## What each tag injects

### `[workflow:debug]`
**Triggers on:** bug, error, fail, not working, broken, trace, why does/is/isn't/should/do

**Injected line:**
```
[workflow:debug] Root cause first, not symptoms. Trace → identify → fix. No plan needed for single bugs.
```

**Test prompts:**
- `why does the login fail after redirect`
- `the pipeline is broken, help me trace it`
- `error: cannot read property of undefined`

---

### `[workflow:plan]`
**Triggers on:** plan, design, architect, how should i, structure, scaffold

**Injected line:**
```
[workflow:plan] Concise plan first (≤7 bullets). No code until plan is approved. Verify steps upfront.
```

**Test prompts:**
- `how should i design the caching layer`
- `scaffold a new auth service`
- `plan the database migration`

---

### `[workflow:review]`
**Triggers on:** review, audit, code review, pr review, look at this, check this

**Injected line:**
```
[workflow:review] Verify before done. Run tests/checks. Would a senior engineer approve this?
```

**Test prompts:**
- `code review this PR`
- `audit the auth module`
- `look at this implementation`

---

### `[workflow:impl]`
**Triggers on:** implement, build, add feature, create, write a, make a

**Injected line:**
```
[workflow:impl] Minimal change. Touch only what's needed. Follow existing patterns. No new abstractions.
```

**Test prompts:**
- `implement the export feature`
- `build a rate limiter`
- `create the upload endpoint`

---

### *(no output)*
**Triggers on:** anything that doesn't match the above

**Test prompts:**
- `what time is it`
- `read the config file`
- `hello`

---

## Success criterion

8 out of 10 representative prompts produce the correct tag. If a tag is missing or wrong, run:

```bash
bash ~/.claude/hooks/UserPromptSubmit/test-classifier.sh
```

to diagnose and tune the regex in `workflow-classifier.sh`.
