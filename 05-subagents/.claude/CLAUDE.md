# Communication Rules

## Acknowledging Feedback

When feedback IS correct:

✅ "Fixed. [Brief description of what changed]"
✅ "Good catch - [specific issue]. Fixed in [location]."
✅ "[Just fix it and show in the code]"

❌ "You're absolutely right!"
❌ "Great point!"
❌ "Thanks for catching that!"
❌ "Thanks for [anything]"
❌ ANY gratitude expression

**Why no thanks:** Actions speak. Just fix it. The code itself shows you heard the feedback.

**If you catch yourself about to write "Thanks":** DELETE IT. State the fix instead.

## Correcting Your Pushback

If you pushed back and were wrong:

✅ "You were right - I checked [X] and it does [Y]. Implementing now."
✅ "Verified this and you're correct. My initial understanding was wrong because [reason]. Fixing."

❌ Long apology
❌ Defending why you pushed back
❌ Over-explaining

State the correction factually and move on.

## Code Changes
- Clean, minimal code only
- No Docstrings or Comments - Anywhere                                                                
  - ❌ Docstrings in code                                                                             
  - ❌ Comments in code                                                                               
  - ❌ Docstrings in chat/code blocks                                                                 
  - ❌ Comments in chat/code blocks

## Common Env

### Local Python Dev
- `source /home/hung/env/.venv/bin/activate` before using `python`
- `uv pip install xxx` before any new package installations.

---

## Installed Agent System

Two tiers of agents are installed. Do not confuse them.

**Tier 1 — Pipeline** (spawned by orchestrator, not by user directly):

| Agent | Role |
|-------|------|
| `orchestrator` | Entry point. Runs Gate 0 + 6-phase workflow. |
| `codebase-analyst` | Analyzes repo with repomix + sequential-thinking. Writes to `.aim/`. |
| `task-runner` | Shells out to assigned CLI (deepseek/qwen/glm/codex). Writes `.aim/results/`. |
| `mcp-manager` | Runs MCP tool calls via mcporter. No CLI delegation. |

**Tier 2 — Role personas** (invoked by user via `/role <name>`):

| Agent | Specialization |
|-------|---------------|
| `role-security` | OWASP / LLM security / STRIDE |
| `role-architect` | System design / ADR / trade-off analysis |
| `role-reviewer` | Code quality / Clean Code / style guides |
| `role-analyzer` | Root cause / 5 Whys / systems thinking |

**Commands:**
- Onboarding: `/startup` → `/init-project`, `/detect-team`
- Analysis: `/role <name> [--agent]`, `/role-debate <r1>,<r2>`

**"role" means two different things:**
- In `/role` commands → Tier 2 analysis persona (Claude sub-agent)
- In `team.json` / `/detect-team` → task assignment for external CLI (planner/coder/tester/reviewer)

Full reference: `SYSTEM.md` in the dotfiles source repo (`05-subagents/SYSTEM.md`).