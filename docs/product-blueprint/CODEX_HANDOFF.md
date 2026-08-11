# CraveKeep — Codex Project Handoff

**Product:** CraveKeep  
**Tagline:** Keep every recipe you crave.  
**Status:** Product definition and approved visual direction; application implementation has not started.  
**Last updated:** August 10, 2026

## 1. Purpose of This Handoff

This document gives Codex or a development team enough context to begin CraveKeep without reconstructing prior product decisions. It explains which files are authoritative, what the product must do, what is approved, what remains unresolved, and how implementation should be staged.

Do not begin by generating the entire application. First inspect the project references, reconcile requirements, recommend the technical architecture, and create an implementation plan with clear vertical slices.

## 2. Required Reading and Source-of-Truth Order

Read these resources before changing code:

1. `CODEX_HANDOFF.md` — execution context, guardrails, and delivery expectations.
2. `CraveKeep_Product_Blueprint.md` — complete product, UX, motion, screen, monetization, risk, and phasing specification.
3. `mockups/approved/` — current visual direction and screen concepts.
4. `README.md` — package navigation and status.
5. `mockups/explorations/` — historical context only; never treat these as approved designs.

When sources appear to conflict, use this precedence:

1. Explicit decisions in the latest user request or approved implementation ticket
2. `CraveKeep_Product_Blueprint.md`
3. This handoff document
4. Approved mockups
5. README

The approved mockups communicate hierarchy, tone, flows, and intended features. They are concept boards rather than complete production specifications. Do not invent missing behavior from an image when the blueprint is more specific. Flag genuine conflicts before implementation.

## 3. Product Summary

CraveKeep is a mobile-first recipe platform that turns recipes scattered across websites, social media, screenshots, photos, PDFs, cookbooks, handwritten cards, and personal notes into a dependable private cookbook.

The primary experience is saving and organizing recipes. Nutrition, macro fitting, healthier adaptations, planning, groceries, pantry tools, guided cooking, households, and community add value around that core. CraveKeep is not primarily a diet tracker and should never force nutrition features on users who only want recipe storage.

### Core promise

> Keep every recipe you crave. Save it from anywhere. Cook it your way.

### Durable product loop

> Discover → Capture → Personalize → Plan → Shop → Cook → Rate → Improve

### Primary differentiation

- A polished, full-screen Capture Studio instead of a browser-like pop-up or generic action sheet
- Universal capture from links, social shares, scans, screenshots, photos, documents, text, and voice
- Structured recipe repair with source comparison and honest confidence indicators
- Original recipe preservation plus optional healthier or macro-aware versions
- Before-and-after nutrition, ingredient, taste, texture, cost, and confidence comparisons
- Meal planning that can preserve a recipe, moderately fit it, or optimize it precisely
- Recipe-to-grocery-to-pantry continuity
- Guided Cook Mode with timers, substitutions, and source-video moments
- Private household collaboration and permission-aware community publishing

## 4. Audience and Product Positioning

The product should serve general home cooks first while being especially valuable to busy households and health-conscious users. Macro-focused users receive advanced optional tools, but the interface must not make every user feel as if they joined a dieting application.

Brand priorities:

- Modern, warm, premium, and useful
- Food-forward without looking like a restaurant, delivery, or old cookbook brand
- Supportive rather than judgmental
- Honest about AI, nutrition estimates, and extraction uncertainty
- High motion quality without slowing down common tasks

## 5. Approved Brand and Motion Direction

The current logo direction is an integrated **C + recipe lines + K** mark. The charcoal monogram and coral recipe lines should keep the K clearly readable at small sizes. The current board is a direction for refinement, not a final production vector asset.

The logo intro expresses “the recipe completes the logo”:

1. Cream background appears and the C draws clockwise.
2. The C fills into solid charcoal.
3. Three coral recipe lines enter with a restrained stagger.
4. The K stem and arms assemble with a subtle spring.
5. The CraveKeep wordmark rises into place.
6. Minimal coral accents dissipate.
7. The logo moves into the onboarding header while food artwork transitions from outline to color.

First launch should remain under three seconds. Returning launches should use a shortened 0.6–0.8 second version only when loading time warrants it. Reduced Motion replaces drawing and spring effects with fades. Do not add generic AI sparkles, glowing dust, excessive gradients, or animation that blocks interaction.

## 6. Navigation and Information Architecture

The primary mobile navigation is:

- **Home** — personalized actions, planned meals, recent imports, macro context, grocery reminders, and community previews/feeds
- **Recipes** — library, favorites, cookbooks, search, versions, and personal recipes
- **Capture** — persistent elevated center action opening the full-screen Capture Studio
- **Plan** — meal calendar, daily nutrition, Fit My Day, generated plans, and rebalancing
- **Groceries** — active and saved lists, aisle organization, recipe-to-list review, pantry, and shopping completion

Profile is accessed through the top-right avatar and does not consume a bottom-navigation position. Use “Groceries,” not “Shop.” The icon should read as a checklist inside a shopping basket, not a store, marketplace, or generic shopping bag.

Community lives within Home through **For You**, **Following**, and **Friends** segments. Do not add a sixth bottom tab unless later usability evidence justifies changing the architecture.

## 7. Required Product Domains

Keep domain boundaries explicit even if the first release is implemented in a modular monolith.

- Identity and authentication
- User profile, food preferences, allergies, appliances, and nutrition goals
- Household membership, invitations, and shared permissions
- Recipe source and attribution
- Capture jobs, imports, OCR/transcription, parsing, confidence, and recovery
- Recipes, ingredients, steps, media, cookbooks, tags, favorites, and search
- Immutable original recipe plus user-created versions/remixes
- Nutrition estimates, serving assumptions, goals, and macro fitting
- Meal plans, planned meals, swaps, locks, and rebalancing
- Grocery lists, merged line items, aisle grouping, and list collaboration
- Pantry inventory, quantity confidence, expiration, and purchase updates
- Cook sessions, preparation, steps, timers, substitutions, notes, and outcomes
- Community creators, follows, published recipes, Made It posts, likes, saves, comments, tips, reports, and moderation
- Subscription, entitlements, trials, offers, and limits
- Notifications, activity, audit events, analytics, export, and account deletion

## 8. Foundational Data Rules

- A captured source and its attribution must remain linked to the resulting recipe.
- Preserve the imported/original recipe. A healthier or adapted recipe is a new version, never a silent overwrite.
- Nutrition is an estimate and must retain serving assumptions, calculation source, confidence, and last-calculated time.
- Allergy-aware suggestions are assistance, not guarantees. High-risk uncertainty requires a warning or refusal to make an unsafe inference.
- Imported recipes are private by default.
- Public publishing is allowed only for user-owned or permission-cleared content. Saving a recipe privately does not grant redistribution rights.
- Household data must be permission-scoped. A user’s personal goals and restrictions should not automatically become public to all community users.
- Pantry quantities can be confirmed, estimated, or unknown. Never present estimates as exact stock.
- AI-generated changes must be explainable, individually reversible, and traceable to the version that produced them.
- Store timestamps, actor identity, and relevant before/after state for important account, recipe, household, moderation, and subscription actions.
- Support complete recipe export and clear account deletion.

## 9. Capture Studio Requirements

Capture is the defining experience and should be implemented as a first-class workflow.

Supported inputs:

- Share sheet from another application
- Pasted website or social link
- Camera scan of cards, books, magazines, handwriting, or printed pages
- Screenshot, photo, PDF, or document upload
- Pasted text, manual entry, or voice creation

Required workflow states:

1. Capture Studio entry
2. Input-specific collection
3. Source preview and permission boundary
4. Truthful processing stages
5. Structured recipe review
6. Confidence warnings and source comparison where needed
7. Save to library/cookbook
8. Specific recovery path when extraction fails
9. Import queue/history for active, completed, and needs-review jobs

Processing should show meaningful stages such as reading the source, finding ingredients, building steps, and checking details. Use a branded recipe-card assembly animation instead of an indefinite generic spinner. Never fake completion percentages that are not tied to actual work.

## 10. Recipe, Remix, and Nutrition Rules

Recipe Detail must expose source, rating, time, servings, nutrition summary, ingredients, and steps. “Make it healthier” is a visible coral action near nutrition; it should not be hidden in an overflow menu.

Users can choose goals such as healthier overall, higher protein, lower calorie, or lower sodium. Taste Protection should allow nearly identical, balanced, or maximum change and allow ingredient locking.

The comparison must explain:

- Calories and macros
- Ingredient and quantity changes
- Expected taste and texture effects
- Cost or availability impact when known
- Confidence and important uncertainty

Users can keep or undo individual changes before saving the result as a new version. Do not overwrite the original.

Macro fitting modes are:

- **Preserve Recipe** — keep the recipe intact and adjust serving or sides
- **Balanced Fit** — use moderate changes while protecting the dish
- **Exact Fit** — optimize more aggressively for the target, with clear tradeoffs

## 11. Community and Rights Model

Community includes discovery, creators, follows, likes, saves, comments, cooking tips, ratings, Made It photos, and remixes. It should feel integrated with CraveKeep rather than like a separate social application.

Required controls:

- Private by default for imported recipes
- Ownership/permission acknowledgment before publishing
- Source and creator attribution
- Separate private saves from public publication
- Reporting, blocking, moderation status, and takedown handling
- Privacy controls for profiles and activity
- Safe handling of unavailable or removed content

Do not copy Tasty or ReciMe screens. Category references can validate user needs, but the interaction and visual implementation must remain recognizably CraveKeep.

## 12. Monetization Principles

Planned tiers are Free, Plus, and Household. Basic access to a user’s own saved recipes must not be held hostage behind a paywall.

Free should support a useful library with limited smart automation. Plus monetizes repeated imports, scans, remixing, advanced nutrition/macro tools, planning, smart groceries, offline use, and multi-device sync. Household adds multiple profiles, shared planning, pantry, lists, cookbooks, and preference consensus.

Paywalls must:

- Appear after value is demonstrated, not be mixed into basic account creation
- Clearly disclose trial length, immediate charge, renewal price, and cadence
- Offer restore purchase and a visible free path where applicable
- Preserve unfinished work when a limit is reached
- Avoid fake countdowns, disguised dismiss controls, or deceptive urgency

## 13. Platform and Technical Direction

The approved product strategy is mobile-first for iOS and Android, with shared APIs and platform-neutral data models. A lightweight launch website may handle marketing, shared recipe links, and account management. A full desktop workspace follows later.

The technology stack is intentionally not locked in this handoff. Before implementation, Codex should recommend and justify:

- Mobile framework and native integration approach, including share extension, camera, media upload, deep links, background jobs, push notifications, offline storage, and accessibility
- Backend architecture and deployment model
- Relational data store, object storage, search, cache, and job queue
- Authentication and household authorization model
- OCR, transcription, recipe extraction, nutrition, and AI provider boundaries
- Subscription and app-store billing approach
- Observability, analytics, feature flags, environments, and CI/CD
- Web companion strategy and what code should actually be shared

Prefer a modular architecture and replaceable provider adapters. Do not couple recipe storage directly to one AI model, OCR vendor, social network, or nutrition database. Use typed API contracts, database migrations, environment validation, seed data, and automated tests from the beginning.

Do not claim support for importing from a source until the method complies with that platform’s technical and legal constraints. Prefer user-initiated share flows, public metadata, permissioned APIs, and user-provided media.

## 14. Security, Privacy, and Safety Baseline

- Use established authentication; do not build a custom password system.
- Enforce authorization server-side for recipes, households, lists, pantry, plans, subscriptions, and moderation actions.
- Use least-privilege storage access and short-lived upload/download authorization.
- Encrypt data in transit and at rest through managed platform controls.
- Keep secrets server-side and out of client bundles, logs, and repositories.
- Validate file type, size, and content; scan uploads where appropriate.
- Rate-limit expensive imports, OCR, AI transformations, community actions, and authentication endpoints.
- Protect against prompt injection from captured content; imported text is untrusted data, not system instruction.
- Minimize sensitive profile collection. Age, height, and weight appear only when a user explicitly requests calculated nutrition goals.
- Provide privacy, export, and deletion controls.
- Log moderation and critical authorization changes.
- Include clear food-safety and nutrition uncertainty messaging. Do not make medical claims.

## 15. Accessibility and UX Quality Bar

- Support Dynamic Type/font scaling and screen readers.
- Maintain usable color contrast and do not encode status through color alone.
- Provide meaningful labels and focus order for capture, timers, lists, charts, and nutrition comparisons.
- Respect Reduced Motion.
- Make touch targets appropriate for cooking and shopping contexts.
- Preserve progress during interruptions, backgrounding, failed imports, expired sessions, and subscription prompts.
- Provide skeleton, empty, offline, error, retry, and success states for every major workflow.
- Avoid precision that the system cannot justify.

## 16. MVP Scope

The blueprint defines three phases. Begin with the Phase 1 “Magic Loop,” but reduce it into demonstrable vertical slices.

### Recommended implementation order

1. **Foundation** — repository structure, environments, authentication, typed contracts, database migrations, design tokens, navigation shell, test setup, analytics events, and CI.
2. **Manual recipe loop** — create/edit recipe, library, recipe detail, favorites/cookbooks, and basic Cook Mode using seeded and manually entered data.
3. **Link capture loop** — paste URL, source preview, background import job, extraction review, recovery, and import history.
4. **Photo/scan capture** — image upload/camera, OCR, multi-page review, confidence, and structured save.
5. **Recipe versions and remix** — immutable original, adaptation goals, comparison, reversible edits, and save as version.
6. **Nutrition and macro fit** — serving assumptions, estimates, daily targets, Preserve/Balanced/Exact fit modes.
7. **Planning and groceries** — weekly plan, add/swap meals, recipe-to-list merge, aisle list, pantry confidence.
8. **Guided cooking** — preparation, step mode, timers, substitution assistance, notes, and outcome feedback.
9. **Subscriptions** — entitlements, value recap, offers, limits, restore, and management.
10. **Household and community** — permissioned household sharing first; public publishing and moderation only after rights and safety controls are ready.

Each slice should be usable end-to-end with error handling and tests. Avoid building isolated screens that are not connected to real domain behavior.

## 17. Definition of Done for a Vertical Slice

A slice is not complete because the happy-path UI renders. It must include:

- Approved behavior and states traced to blueprint screen IDs
- Responsive and accessible UI using shared design tokens/components
- Real validation and server-side authorization
- Loading, empty, offline where applicable, recoverable error, and success states
- Typed API contract and persistent data model
- Unit tests for domain logic
- Integration tests for key boundaries
- End-to-end coverage for the primary path
- Analytics events with no sensitive recipe or profile content in event payloads
- Logging and actionable error context
- Seed/demo data and brief developer documentation
- No unresolved high-severity security, privacy, data-loss, accessibility, or food-safety defect

## 18. Approved Visual Register

Use these files under `mockups/approved/`:

- `00-logo-final-directions.png` — current CK logo direction and small-size behavior
- `01-logo-intro-animation.png` — first-launch logo assembly
- `02-onboarding-part-1.png` — early onboarding
- `03-onboarding-part-2.png` — preferences and personalization
- `04-onboarding-account-value.png` — account/value transition
- `05-capture-studio.png` — capture, processing, review, and recovery
- `06-ingredient-outline-to-color.png` — branded ingredient transition
- `07-recipe-remix-nutrition-community.png` — recipe, nutrition, healthier version, and community
- `08-group-1-home-recipe-organization.png` — Home, library, search, cookbook, and empty state
- `09-group-2-meal-planning-macros.png` — planning, macro fit, generated plan, and rebalancing
- `10-group-3-groceries-pantry.png` — lists, pantry, and shopping completion
- `11-group-4-cooking-experience.png` — preparation, Cook Mode, timers, substitutions, video, and feedback
- `12-group-5-account-profile-household.png` — authentication, profiles, nutrition goals, household, and settings

## 19. Known Open Work and Decisions

The following visual groups remain incomplete:

- Group 6 — Subscription and Offers
- Group 7 — Community Creation
- Group 8 — System and Recovery States

The following decisions should be documented before or during architecture planning:

- Exact free import allowance, trial length, and tier prices
- Final production logo/vector refinement and typography
- Initial nutrition data provider and how branded ingredients are handled
- Social-source support matrix and permitted extraction approach per platform
- AI/OCR/transcription providers and cost/quality fallback strategy
- Initial community launch scope versus later phase
- Target launch geography, units, languages, and regulatory requirements
- Whether initial mobile code should use a cross-platform framework or native apps
- Exact offline scope and conflict-resolution behavior
- Grocery commerce integrations, which should not block the core grocery-list experience

Codex should not silently decide high-impact product or legal questions. Record assumptions and ask for a decision when the choice materially changes cost, architecture, risk, or user experience.

## 20. First Codex Assignment

Before writing feature code:

1. Inspect every file listed in the Required Reading section.
2. Summarize the product in your own words.
3. List conflicts, ambiguities, and missing implementation-critical requirements.
4. Recommend the architecture, stack, repository structure, environments, data boundaries, and provider interfaces.
5. Produce a phased backlog organized around the vertical slices above.
6. Identify which decisions require owner approval.
7. Propose the smallest first implementation milestone and its acceptance criteria.

Do not scaffold until the architecture recommendation has been reviewed unless explicitly instructed to proceed.

## 21. Copy/Paste Startup Prompt for Codex

```text
You are taking over implementation of CraveKeep.

Read CODEX_HANDOFF.md first, then read the complete
CraveKeep_Product_Blueprint.md, README.md, and inspect every image under
mockups/approved. Treat mockups/explorations as historical only.

The blueprint is the product source of truth. The mockups communicate approved
direction but are concept boards, not permission to invent missing behavior.

Before writing application code:
1. Summarize the product, its primary user loop, and MVP.
2. Identify conflicting, ambiguous, or missing implementation requirements.
3. Recommend a mobile-first architecture and technology stack, including
   authentication, authorization, database, storage, search, background jobs,
   offline behavior, share extension, camera/OCR, AI provider boundaries,
   nutrition data, subscriptions, web companion, analytics, observability,
   testing, environments, CI/CD, and security.
4. Propose the repository structure and core domain model.
5. Create a vertical-slice implementation backlog with acceptance criteria.
6. Separate decisions you can safely make from decisions requiring product-owner
   approval.
7. Recommend the smallest first milestone that demonstrates a real end-to-end
   user outcome.

Preserve the imported recipe, keep nutrition/remixing optional, keep imported
recipes private by default, use Groceries rather than Shop, and do not copy
ReciMe or Tasty interfaces. Do not begin scaffolding until I approve the
architecture recommendation.
```

## 22. Handoff Success Check

A new Codex session should be able to answer all of these after reading the package:

- What problem does CraveKeep solve?
- What is the primary user loop?
- Which files are authoritative?
- What is approved versus exploratory?
- What must be mobile-first?
- How should capture, originals, remixes, nutrition, household data, and public publishing behave?
- What is in Phase 1, and what should wait?
- Which screens still need visual design?
- Which product decisions remain open?
- What must be proposed and approved before feature code begins?

If any answer is unclear, update the blueprint or this handoff before relying on implementation assumptions.
