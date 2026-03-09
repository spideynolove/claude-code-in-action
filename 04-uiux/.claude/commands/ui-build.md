Build or update implementation from approved stage specs.

Arguments: $ARGUMENTS

## Required inputs

- IntentSpec
- LayoutSpec
- TokenSpec
- ComponentSpec, if present

## Output targets

- React + TypeScript
- token-driven styling
- stories for changed interactive components
- responsive implementation

## Rules

- search for reusable components first
- avoid raw hex values and arbitrary spacing
- avoid adding new components unless reuse is clearly insufficient
- implement required interaction states
- keep structure aligned with the layout spec
