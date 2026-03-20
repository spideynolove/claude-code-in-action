Install the concise-planning workflow constraints into AGENTS.md.

Run:
```bash
cat >> ./AGENTS.md << 'EOF'

## Planning constraints (concise-workflow)
- Output only a concise plan (≤7 bullet points) for task requests
- Do NOT expand into detailed plans unless explicitly asked
- Do NOT generate implementation code during planning phase
- Label all plans with: `[PLAN]` prefix
EOF
echo "Workflow installed into AGENTS.md"
```
