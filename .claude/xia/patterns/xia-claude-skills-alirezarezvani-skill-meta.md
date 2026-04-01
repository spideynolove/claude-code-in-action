---
source: https://github.com/alirezarezvani/claude-skills
extracted: 2026-03-25
---

# Skill Authoring Standard + Skill Security Auditor from alirezarezvani/claude-skills

**Gap filled:** No formal skill authoring template; no pre-install security audit for third-party skills
**Constraints applied:** No comments/docstrings in adapted code; Python script copied verbatim (stdlib-only, no changes needed)

## Pattern 1: SKILL-AUTHORING-STANDARD

Template DNA for every skill: context-first check (read domain-context.md first), 3 operating modes (build/optimize/specific), practitioner voice, tables + checklists for structured output. Trigger keywords in description frontmatter.

## Pattern 2: skill-security-auditor

1050-line Python stdlib script scanning skills for: prompt injection in markdown, code execution (eval/exec/os.system/shell=True), network exfiltration (requests/socket), credential harvesting (~/.ssh reads), file system abuse (writes outside skill dir), unsafe deserialization (pickle.loads). PASS/WARN/FAIL verdict with --strict and --json flags.

## Seam

`29-skill-authoring/SKILL-AUTHORING-STANDARD.md` — reference when writing new SKILL.md files
`29-skill-authoring/.claude/skills/skill-security-auditor/` — run before installing third-party skills

## Delta from original

- 461 domain skills skipped (marketing, c-level, finance — out of A's scope)
- self-improving-agent skipped (compound-learnings covers this gap already)
- env-secrets-manager skipped (secret-scanner hook covers this)
- Python auditor script copied verbatim — stdlib-only, no modification needed
