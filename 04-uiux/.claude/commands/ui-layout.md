Create or update a `LayoutSpec` for the current task.

Arguments: $ARGUMENTS

## Your job

Design the structural layout of the screen independent of final styling.

## Must include

- screen_id
- top-level regions
- role of each region
- priority order
- responsive rules
- information hierarchy
- primary action placement
- overflow behavior for smaller screens

## Rules

- preserve imported structure when working from an existing frame
- solve hierarchy before decoration
- do not hardcode visual style here
- prefer reusable layout patterns already present in the repo
