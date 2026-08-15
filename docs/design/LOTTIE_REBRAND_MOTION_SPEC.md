# CraveKeep Lottie Rebrand Motion Spec

The bright coral, mint, lavender, yellow, and navy CraveKeep redesign is the source of truth. Lottie is the implementation format for purposeful motion; static mockup boards remain visual references only.

## Motion principles
- Motion should explain capture, organize, plan, shop, cook, or save.
- Keep everyday moments short and calm: 1–2 seconds.
- Use a seamless 3–4 second loop for loading and mascot states.
- Keep text and important UI labels as native React Native text, not baked into Lottie artwork.
- Respect reduced-motion settings with a static frame or simplified fade.
- Keep the mascot supportive; the rebrand and product UI remain the hero.

## Named animation slots
- launch-reveal: initial launch/download screen.
- onboarding-recipe-card: recipe card writes and transitions toward the app.
- onboarding-preferences: food chips and goals organize into a personalized profile.
- recipe-import: camera, URL, YouTube, and Pinterest sources resolve into one recipe.
- recipe-import-success: saved recipe lands in the library.
- plan-my-week: meal cards move into calendar slots.
- grocery-progress: items move from list to checked/pantry state.
- cook-mode: steam, timer, and next-step cues loop gently.
- saved-success: short confirmation for save/favorite/completed actions.
- mascot-morning and mascot-evening: contextual Home moments.

## Asset contract
Approved exports belong in apps/mobile/assets/animations/<slot>.json.
Do not embed recipe names, nutrition values, or user-specific data inside animations; those remain live UI.

## First rollout
1. Add the Lottie runtime and shared component.
2. Wire launch-reveal into the initial screen.
3. Wire onboarding-recipe-card into onboarding.
4. Wire recipe-import and recipe-import-success into Capture Studio.
5. Add remaining screen animations after the bright rebrand surfaces are migrated.