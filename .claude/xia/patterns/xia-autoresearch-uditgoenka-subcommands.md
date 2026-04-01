---
source: https://github.com/uditgoenka/autoresearch
extracted: 2026-03-25
---

# Autoresearch Subcommands from autoresearch

**Gap filled:** No multi-persona swarm prediction; no structured shipping workflow; no autonomous security audit; no scenario exploration engine
**Constraints applied:** No docstrings, no comments added; protocol .md files copied verbatim

## Pattern

Four specialized subcommands, each a named loop variant:

**predict** — Multi-persona swarm analysis
- 3-8 expert personas (Architect, Security, Performance, Reliability, Devil's Advocate)
- File-based knowledge representation: codebase-analysis.md, dependency-map.md, component-clusters.md
- Structured debate (1-3 rounds) with anti-herd detection
- Chains to: debug, security, fix, ship, scenario via handoff.json

**security** — STRIDE + OWASP autonomous audit
- 7-phase: recon → assets → trust boundaries → STRIDE → attack surface → loop → report
- 4 adversarial personas when --adversarial flag set
- Every finding requires file:line code evidence
- Composite: (owasp_tested/10)*50 + (stride_tested/6)*30 + min(findings,20)

**scenario** — 12-dimension use case exploration
- Dimensions: happy path, error, edge case, abuse, scale, concurrent, temporal, data variation, permission, integration, recovery, state transition
- Every situation: concrete trigger + flow + expected outcome
- Domain templates: software, product, business, security, marketing

**ship** — Universal 8-phase shipping
- Identify → Inventory → Checklist → Prepare loop → Dry-run → Ship → Verify → Log
- Composite: (checklist_passing/total)*80 + (dry_run_passed?15:0) + (no_blockers?5:0)
- Types: code-pr, code-release, deployment, content, marketing-email, sales, research, design

## Seam

`25-autoresearch/.claude/`
- `commands/autoresearch/predict.md`
- `commands/autoresearch/security.md`
- `commands/autoresearch/scenario.md`
- `commands/autoresearch/ship.md`
- `skills/autoresearch/references/predict-workflow.md`
- `skills/autoresearch/references/security-workflow.md`
- `skills/autoresearch/references/scenario-workflow.md`
- `skills/autoresearch/references/ship-workflow.md`

## Delta from original

No changes — files copied verbatim.
