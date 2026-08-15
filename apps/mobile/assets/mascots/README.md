# CraveKeep Mascot Animation Handoff

All PNGs in this package use transparent backgrounds.

## Scene sheets

Each sheet is a left-to-right animation strip. The individual shots are also included in `role-specific-variants/` and `workflow-actions/`.

| Scene | Mascot | Sheet | Shot sequence |
|---|---|---|---|
| Welcome wave | Recipe Keeper | `scene-sheets/welcome-wave-sheet.png` | settle, wave up, wave hold/blink, return |
| Evening check-in | Recipe Keeper | `scene-sheets/evening-checkin-sheet.png` | present clock, check clock, think, invite dinner |
| Weekly planning | Pantry Guide | `scene-sheets/weekly-planning-sheet.png` | show planner, review, organize, approve |
| Grocery shopping | Pantry Guide | `scene-sheets/grocery-shopping-sheet.png` | push cart, reach, add item, check |
| Cook mode | Cardinal Chef | `scene-sheets/cook-mode-sheet.png` | stir, steam, taste, present dish |
| Import recipe | Recipe Keeper | `scene-sheets/importing-recipe-sheet.png` | cards scatter, catch, build, check, logo pulse, spark, ready, reset |
| Recipe loading | Recipe Keeper | `scene-sheets/recipe-keeper-loading-sheet.png` | cards scatter, catch, sort, fill, pulse, spark, ready, reset |
| Save recipe | Recipe Keeper | `scene-sheets/saving-recipe-sheet.png` | cards lift, stack, hold, celebrate |

## Specs and source storyboards

- `scene-sheets/animation-spec.json` contains timing, easing, transitions, reduced-motion behavior, and shot descriptions.
- `scene-sheets/manifest.json` maps every scene to its mascot role and source asset.
- `workflow-actions/` contains the original 3-shot workflow storyboard frames and composite sheet.
- `recipe-card-loop-*` contains the original recipe-card loading storyboard.
- `recipe-keeper-loop-*` contains the original Recipe Keeper loading storyboard.
- `mascot-roles-sheet.png` shows the Recipe Keeper, Cardinal Chef, and Pantry Guide roles together.

## Implementation

Use the scene sheet for a sprite-strip implementation or use the individual frame PNGs for Lottie/animated composition. For reduced motion, show frame 1 only. The detailed choreography is in `scene-sheets/animation-spec.json`.
