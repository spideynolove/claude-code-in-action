# Workflow Classifier Hook — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inject a single targeted workflow guideline line into Claude Code's context whenever the incoming prompt matches a known task type (debug / plan / review / impl).

**Architecture:** A standalone bash script reads the `UserPromptSubmit` hook JSON from stdin, extracts the prompt, runs priority-ordered keyword matching, and prints one guideline line (or nothing). It is registered as a second hook entry in `settings.json` — each hook gets its own stdin, so `context-loader.sh` is not modified.

**Tech Stack:** bash, python3 (already present in the environment), Claude Code `settings.json` hook registration.

---

## Architecture Note: Why settings.json, not context-loader.sh

`context-loader.sh` consumes stdin on line 2 (`json.load(sys.stdin)`). Any script called from inside it would receive empty stdin. Registering the classifier as a separate hook entry solves this cleanly — Claude Code gives each hook its own copy of stdin.

---

## File Map

| Action | Path |
|---|---|
| Create | `~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh` |
| Create (test, not shipped) | `~/.claude/hooks/UserPromptSubmit/test-classifier.sh` |
| Modify | `~/.claude/settings.json` — add second hook entry to `UserPromptSubmit` |

---

## Task 1: Write the test script

**Files:**
- Create: `~/.claude/hooks/UserPromptSubmit/test-classifier.sh`

This test script simulates the hook JSON input and checks classifier output. Write it first so we have a target to hit.

- [ ] **Step 1: Create test script**

```bash
cat > ~/.claude/hooks/UserPromptSubmit/test-classifier.sh << 'EOF'
#!/bin/bash
set +e
CLASSIFIER=~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh
pass=0; fail=0

pass=0; fail=0

check() {
  local label="$1" prompt="$2" expected="$3"
  local json="{\"session_id\":\"test\",\"prompt\":\"$prompt\"}"
  local got
  got=$(echo "$json" | bash "$CLASSIFIER" 2>/dev/null)
  if echo "$got" | grep -q "$expected"; then
    echo "  PASS: $label"
    pass=$((pass + 1))
  else
    echo "  FAIL: $label — expected '$expected', got '$got'"
    fail=$((fail + 1))
  fi
}

check_empty() {
  local label="$1" prompt="$2"
  local json="{\"session_id\":\"test\",\"prompt\":\"$prompt\"}"
  local got
  got=$(echo "$json" | bash "$CLASSIFIER" 2>/dev/null)
  if [ -z "$got" ]; then
    echo "  PASS: $label (no output)"
    pass=$((pass + 1))
  else
    echo "  FAIL: $label — expected no output, got '$got'"
    fail=$((fail + 1))
  fi
}

echo "=== workflow-classifier tests ==="
check       "debug error"          "why does the auth error happen"         "[workflow:debug]"
check       "debug not working"    "login is not working after redirect"    "[workflow:debug]"
check       "debug broken"         "the pipeline is broken"                 "[workflow:debug]"
check       "plan"                 "how should i approach the new feature"  "[workflow:plan]"
check       "plan design"          "design the database schema"             "[workflow:plan]"
check       "plan scaffold"        "scaffold a new service"                 "[workflow:plan]"
check       "review"               "code review this PR"                    "[workflow:review]"
check       "review audit"         "audit the auth module"                  "[workflow:review]"
check       "review wins over impl" "check this implementation"             "[workflow:review]"
check       "impl"                 "implement the upload feature"           "[workflow:impl]"
check       "impl build"           "build the rate limiter"                 "[workflow:impl]"
check       "impl create"          "create the endpoint"                    "[workflow:impl]"
check_empty "no match greeting"    "hello how are you"
check_empty "no match file"        "read the config file"
check       "debug wins over impl" "fix the error in the upload feature"   "[workflow:debug]"

echo ""
echo "Results: $pass passed, $fail failed"
[ "$fail" -eq 0 ]
EOF
chmod +x ~/.claude/hooks/UserPromptSubmit/test-classifier.sh
```

- [ ] **Step 2: Run test script to confirm it fails (classifier doesn't exist yet)**

```bash
bash ~/.claude/hooks/UserPromptSubmit/test-classifier.sh
```

Expected: several FAIL lines, exit code 1 — this is correct, classifier doesn't exist yet.

---

## Task 2: Create the classifier script skeleton

**Files:**
- Create: `~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh`

Start with just the skeleton: reads stdin, extracts prompt, exits cleanly. No matching yet.

- [ ] **Step 1: Create skeleton**

```bash
cat > ~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh << 'EOF'
#!/bin/bash
set +e

PROMPT=$(python3 -c "
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get('prompt', '').lower())
except:
    pass
" 2>/dev/null)

[ -z "$PROMPT" ] && exit 0

exit 0
EOF
chmod +x ~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh
```

- [ ] **Step 2: Verify skeleton handles bad input gracefully**

```bash
echo '{}' | bash ~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh
echo 'not json' | bash ~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh
echo '' | bash ~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh
```

Expected: no output, exit 0 for all three.

---

## Task 3: Add keyword matching and injection

**Files:**
- Modify: `~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh`

Add the priority-ordered matching block after the `[ -z "$PROMPT" ]` guard.

- [ ] **Step 1: Add matching logic**

Replace the `exit 0` at the bottom of the classifier with:

```bash
# Priority 1: debug
if echo "$PROMPT" | grep -qE "(bug|error|fail|not working|broken|trace|why does|why is|why isn't)"; then
  echo "[workflow:debug] Root cause first, not symptoms. Trace → identify → fix. No plan needed for single bugs."
  exit 0
fi

# Priority 2: plan
if echo "$PROMPT" | grep -qE "(plan|design|architect|how should i|how do i approach|structure|scaffold)"; then
  echo "[workflow:plan] Concise plan first (≤7 bullets). No code until plan is approved. Verify steps upfront."
  exit 0
fi

# Priority 3: review
if echo "$PROMPT" | grep -qE "(review|audit|code review|pr review|look at this|check this)"; then
  echo "[workflow:review] Verify before done. Run tests/checks. Would a senior engineer approve this?"
  exit 0
fi

# Priority 4: impl
if echo "$PROMPT" | grep -qE "(implement|build|add feature|create|write a|make a)"; then
  echo "[workflow:impl] Minimal change. Touch only what's needed. Follow existing patterns. No new abstractions."
  exit 0
fi

exit 0
```

- [ ] **Step 2: Run tests**

```bash
bash ~/.claude/hooks/UserPromptSubmit/test-classifier.sh
```

Expected: `Results: 15 passed, 0 failed`

- [ ] **Step 3: Fix any failing tests before continuing**

If any tests fail, adjust the regex patterns in the matching block. Re-run until all 15 pass.

- [ ] **Step 4: Commit classifier and test script**

```bash
git -C ~ add .claude/hooks/UserPromptSubmit/workflow-classifier.sh .claude/hooks/UserPromptSubmit/test-classifier.sh
git -C ~ commit -m "feat: add workflow classifier hook for context-aware guideline injection"
```

---

## Task 4: Register classifier in settings.json

**Files:**
- Modify: `~/.claude/settings.json`

Add the classifier as a second entry in the existing `UserPromptSubmit` hooks array.

- [ ] **Step 1: Read current settings.json**

```bash
cat ~/.claude/settings.json
```

Locate the `UserPromptSubmit` block. It currently looks like:

```json
"UserPromptSubmit": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/UserPromptSubmit/context-loader.sh"
      }
    ]
  }
]
```

- [ ] **Step 2: Add classifier entry**

Add the classifier as a second entry in the `hooks` array (same matcher object):

```json
"UserPromptSubmit": [
  {
    "hooks": [
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/UserPromptSubmit/context-loader.sh"
      },
      {
        "type": "command",
        "command": "bash ~/.claude/hooks/UserPromptSubmit/workflow-classifier.sh"
      }
    ]
  }
]
```

- [ ] **Step 3: Verify settings.json is valid JSON**

```bash
python3 -m json.tool ~/.claude/settings.json > /dev/null && echo "valid JSON"
```

Expected: `valid JSON`

- [ ] **Step 4: Commit settings change**

```bash
git -C ~ add .claude/settings.json
git -C ~ commit -m "feat: register workflow-classifier.sh as UserPromptSubmit hook"
```

---

## Task 5: End-to-end spot check

No automated test for this — manual verification in a real Claude Code session.

- [ ] **Step 1: Start a new Claude Code session in any project**

- [ ] **Step 2: Send 4 test prompts and verify hook output appears**

| Prompt | Expected prefix |
|---|---|
| `why does the login fail after redirect` | `[workflow:debug]` |
| `how should i design the caching layer` | `[workflow:plan]` |
| `implement the export feature` | `[workflow:impl]` |
| `what time is it` | _(no output)_ |

Hook output appears at the top of Claude's context as a system message before the response.

- [ ] **Step 3: Confirm success criterion from spec**

8 out of 10 representative prompts must produce the correct tag. If accuracy is below threshold, tune regex patterns in `workflow-classifier.sh` and re-run Task 3 Step 2.
