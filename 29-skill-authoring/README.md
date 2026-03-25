# 29 — Skill Authoring & Security Auditing

Borrowed from `alirezarezvani/claude-skills`. Two meta-skill patterns.

## 1. SKILL-AUTHORING-STANDARD.md

Template for writing high-quality SKILL.md files:
- Frontmatter: name, description (include trigger keywords), metadata
- Context-first pattern: check `{domain}-context.md` before asking questions
- 3 modes: Build from Scratch / Optimize Existing / Situation-Specific
- Structured output: tables, checklists, practitioner voice (not textbook)

Use this when creating new skills for `~/.claude/skills/`.

## 2. skill-security-auditor (`.claude/skills/skill-security-auditor/`)

Pre-install security audit for skills. PASS / WARN / FAIL verdict.

```bash
python3 .claude/skills/skill-security-auditor/scripts/skill_security_auditor.py /path/to/skill/
python3 .claude/skills/skill-security-auditor/scripts/skill_security_auditor.py https://github.com/user/repo --skill name
python3 .claude/skills/skill-security-auditor/scripts/skill_security_auditor.py /path/to/skill/ --strict --json
```

Scans for:
- Prompt injection in SKILL.md (`ignore previous instructions`, `you are now...`)
- Code execution risks (`eval`, `exec`, `os.system`, `subprocess shell=True`)
- Network exfiltration (`requests.post`, `socket.connect`)
- Credential harvesting (reads from `~/.ssh`, `~/.aws`)
- File system abuse (writes outside skill directory)
- Supply chain risks in dependencies
