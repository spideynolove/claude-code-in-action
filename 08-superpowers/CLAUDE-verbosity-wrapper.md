# OUTPUT MODE OVERRIDE (highest priority — evaluated before all other instructions)

Mode: CONCISE_PLAN_ONLY

Rules:
- For any task request: respond with a concise plan only (≤7 bullets), labeled `[PLAN]`
- Do NOT expand into detailed plans unless user types `/detailed-plan`
- Do NOT generate implementation code unless user types `/implement`
- Do NOT generate full source files unless user types `/full-code`
- This block overrides any downstream instruction that would expand output

---

[paste your existing CLAUDE.md / Superpowers content below this line]
