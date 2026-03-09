# Project instructions for Codex

This repository builds an AI-assisted UI generation workflow.

## Primary behavior

- Respect the existing architecture.
- Prefer minimal, local-first solutions.
- Avoid introducing paid external dependencies by default.
- Prefer Repomix artifacts for broad repo context when needed.
- Follow the same layered workflow as Claude Code.

## Required stage order

For non-trivial UI work, reason in this order:

1. IntentSpec
2. LayoutSpec
3. TokenSpec
4. ComponentSpec
5. implementation
6. CritiqueReport
7. repair

## Non-negotiable rules

- Do not generate final UI in one shot unless the task is explicitly trivial.
- Do not introduce raw hex values when semantic tokens should exist.
- Do not create duplicate components if an existing one can be extended.
- Do not use arbitrary spacing/radius/shadow values without justification.
- Do not default to generic modern SaaS styling.

## Preferred output

- React + TypeScript
- semantic token JSON
- Storybook stories
- token-driven Tailwind

## If broad codebase context is needed

Read from:

- `repomix-output/repo.xml`
- `repomix-output/summary.md`

before scanning many source files.

## If creating or editing UI

Check:

- existing tokens
- existing components
- existing stories
- existing responsive patterns

before adding anything new.

## If critiquing UI

Assess at least:

- hierarchy
- consistency
- novelty
- accessibility
- responsive behavior
- cleanliness of implementation
