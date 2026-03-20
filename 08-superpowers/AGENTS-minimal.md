# Agent Instructions

## Core behavior

- Fix bugs immediately, no hand-holding
- Find root cause, not symptoms
- Make minimal changes — only touch what's necessary
- Clean code only, no docstrings or comments

## Planning

- For 3+ step tasks: write a concise plan (≤7 bullets) before coding
- For simple fixes: just fix it
- If blocked: stop and restate the problem, don't keep pushing

## Output format

- Plans: bullet list, ≤7 items, labeled `[PLAN]`
- No detailed plans unless asked with `/detailed-plan`
- No code generation during planning phase unless asked with `/implement`

## Project conventions

- Follow existing patterns in the codebase
- Don't introduce new patterns unless explicitly asked
- Verify before marking done
