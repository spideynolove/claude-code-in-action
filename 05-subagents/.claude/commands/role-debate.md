Structured 4-phase debate between specialized roles to resolve trade-off decisions.

## Usage

```
/role-debate <role1>,<role2> [topic]
/role-debate <role1>,<role2>,<role3> [topic]
```

## Examples

```bash
/role-debate security,performance
"JWT token expiry: 15 min vs 2 hours"

/role-debate architect,security
"Session tokens: JWT vs server-side sessions"

/role-debate frontend,security
"2-factor auth UX — how much friction is acceptable?"

/role-debate architect,security,performance
"Microservices vs monolith for this project"
```

## The 4 Phases

**Phase 1 — Position Statements**

Each role independently states its recommendation with:
- Specific proposal
- Grounds (official docs, standards, empirical cases)
- Anticipated risks
- Success metrics

**Phase 2 — Rebuttal**

Cross-discussion: each role challenges the others on overlooked perspectives, conflicting evidence, and field-specific concerns. Alternatives are offered.

**Phase 3 — Compromise Search**

Roles identify common ground and explore win-win solutions. Phased implementation approaches and risk mitigation are considered.

**Phase 4 — Integrated Conclusion**

Final recommendation that addresses each role's core requirements, with an implementation roadmap and measurable success metrics.

## When to Use Debate vs Single Role

| Situation | Recommendation |
|-----------|---------------|
| 1 concern domain | `/role security` |
| 2–3 domains in tension | `/role-debate security,performance` |
| Complex architecture choice | `/role-debate architect,security,performance` |
| Unsure | Start with `/role-debate` |

## Role Debate Characteristics

| Role | Stance | Typical Bias |
|------|--------|-------------|
| `security` | Risk-minimization, worst-case | Excessive conservatism |
| `performance` | Data-driven, UX priority | Downplays security |
| `architect` | Long-term, proven patterns | Clinging to ideal designs |
| `reviewer` | Constructive, educational | Perfectionism |
| `analyzer` | Evidence-first, hypothesis-testing | Analysis paralysis |

Knowing each role's biases helps you weight the integrated conclusion appropriately.
