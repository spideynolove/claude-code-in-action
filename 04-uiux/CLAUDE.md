# UIUX AI Workflow

This repository builds a UI generation workflow that produces distinctive, production-ready interfaces instead of generic AI-generated layouts.

## Operating principles

- Treat Claude Code as the primary operator.
- Treat Codex as a compatible secondary worker.
- Prefer local-first, low-cost workflows.
- Use Repomix output when broad codebase context is needed.
- Avoid API-key-dependent services unless clearly necessary.
- Do not rely on external paid context providers by default.

## Core rule

Never generate final UI in a single shot.

Always decompose work into these stages:

1. IntentSpec
2. LayoutSpec
3. TokenSpec
4. ComponentSpec
5. UI assembly
6. CritiqueReport
7. targeted repair

## Design goals

- distinctive visual identity
- reusable components
- semantic token system
- accessibility
- responsive behavior
- production-ready React + TypeScript output
- low drift between screens
- minimal hardcoded styling

## Anti-generic rules

Avoid these default AI clichés unless explicitly requested:

- purple/indigo gradient-heavy visual direction
- glassmorphism as a default
- excessive rounded corners
- decorative shadows everywhere
- "safe SaaS dashboard" styling without product-specific reasoning
- arbitrary Tailwind values when semantic tokens should exist

## Required workflow

For any non-trivial UI task:

1. infer product and user intent
2. write or update `IntentSpec`
3. write or update `LayoutSpec`
4. write or update `TokenSpec`
5. write or update `ComponentSpec`
6. generate or update implementation
7. run critique
8. repair only the failing layer

## Layer responsibilities

- IntentSpec: user goals, task priorities, risk, tone, density, content priorities
- LayoutSpec: hierarchy, regions, responsive structure
- TokenSpec: semantic colors, spacing, type, radius, motion, themes
- ComponentSpec: primitives, composites, states, legal variants
- CritiqueReport: hierarchy, novelty, consistency, accessibility, implementation drift

## Output defaults

Prefer:

- React + TypeScript
- semantic token JSON
- Tailwind driven by CSS variables / theme variables
- Storybook stories for component states
- Playwright for runtime inspection

## Refactoring rules

Before creating a new component:

- search existing components first
- reuse existing tokens first
- reuse existing layout patterns first
- only create a new component if the need is real and repeated

## Styling rules

- no raw hex colors in component code unless explicitly justified
- no inline spacing values when a token should exist
- no arbitrary radius/shadow values if tokens can represent them
- dark mode must use semantic token mapping, not ad hoc overrides

## Interaction rules

Every interactive component should consider:

- hover
- focus-visible
- pressed
- disabled
- loading
- empty
- error

When relevant, also include:

- optimistic state
- skeleton
- success confirmation
- keyboard support

## Critique rules

When critiquing output, score at least:

- hierarchy
- consistency
- novelty / non-genericity
- accessibility
- responsiveness
- implementation cleanliness

When fixing output, modify the correct layer:

- hierarchy issue -> LayoutSpec
- generic look -> TokenSpec or style direction
- component inconsistency -> ComponentSpec
- hardcoded values -> TokenSpec / implementation cleanup
- broken focus or ARIA -> component implementation
- broken responsive composition -> LayoutSpec

## Context usage

When the task requires whole-repo understanding:

- prefer `repomix-output/` artifacts
- prefer summaries over dumping large raw files
- read only the files needed for the current task

## Figma stance

Figma integration is optional.

If a Figma frame is imported:

- preserve structure first
- then improve tokens
- then improve components
- then improve interactions

Do not destroy the original layout unless explicitly asked.

## Codex compatibility

Keep shared concepts aligned with `AGENTS.md`:

- same stage contracts
- same anti-generic rules
- same token discipline
- same component reuse policy

## Definition of done

A UI task is not done until:

- specs are internally consistent
- implementation builds
- changed stories render
- accessibility checks pass or known failures are documented
- token usage is consistent
- output is not obviously generic
