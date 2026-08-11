# CraveKeep Product Blueprint v3

**Product name:** **CraveKeep**

**Brand meaning:** Keep every recipe you crave, regardless of where it was discovered.

**Working concept:** A beautiful, AI-powered recipe home that can capture almost any recipe, intelligently adapt it to a user's goals when requested, and turn it into a practical cooking, shopping, and meal-planning workflow.

**Primary product position:** *Keep every recipe you crave.*

**Supporting promise:** *Save it from anywhere. Cook it your way.*

## 1. The Opportunity

Most recipe apps solve storage. The stronger product solves the entire loop:

1. Discover a recipe anywhere.
2. Import it in seconds.
3. Clean and structure it accurately.
4. Optionally adapt it to the user's health goals, allergies, budget, equipment, and household.
5. Plan when to cook it.
6. Buy only what is needed.
7. Guide the user through cooking.
8. Learn from the outcome and improve future recommendations.

ReciMe currently supports imports from Instagram, TikTok, Facebook, Pinterest, YouTube, websites, screenshots, photos, and pasted text. It also offers cookbooks, nutrition calculations, serving scaling, unit conversion, meal planning, smart grocery lists, grocery ordering, cloud sync, cooking mode, and sharing. Its free tier currently includes five smart imports every seven days. Sources: [ReciMe website](https://www.recime.app/), [ReciMe App Store listing](https://apps.apple.com/us/app/recime-recipes-meal-planner/id1593779280), and [ReciMe import-limit guide](https://recime.app/help/en/articles/14999602-how-your-5-free-weekly-imports-work).

## 2. Recommended Differentiation

CraveKeep should lead with universal capture and dependable organization: **the easiest, most polished place to keep recipes from anywhere**. Personalization is an optional differentiator, not a requirement or the primary brand promise. Users can preserve and cook every recipe exactly as imported.

For users who request adaptation, the signature capability is the **Recipe Remix Engine**.

Every imported recipe can be transformed with one tap:

- Healthier overall
- Higher protein
- Lower calorie
- Lower sodium
- Lower sugar
- Lower saturated fat
- Higher fiber
- Diabetic-conscious
- Heart-conscious
- Gluten-free, dairy-free, vegetarian, or vegan
- Allergy-safe for the user's household
- Budget-friendly
- Faster or fewer dishes
- Air fryer, slow cooker, Instant Pot, grill, or oven adaptation
- Kid-friendly or picky-eater-friendly
- Scale to household size or available ingredients

The result must not silently overwrite the original. Show an original-versus-remixed comparison with:

- Ingredient substitutions and exact quantities
- Updated steps, time, and temperature
- Estimated nutrition before and after
- The reason for each change
- Expected taste or texture impact
- A confidence indicator and any uncertainty
- Options such as “keep the cheese,” “less aggressive,” or “maximize protein”
- Version history and one-tap restore

Health transformations should be presented as estimates and preferences, not medical treatment. Nutrient calculations need ingredient normalization, serving-size validation, and clear uncertainty when the source recipe is incomplete.

## 3. Feature Blueprint

### A. CraveKeep Capture Studio

Capture is the product's primary magic moment and must feel like a native CraveKeep experience. It must not resemble a browser search box, Google overlay, generic bottom sheet, or operating-system file dialog with branding placed around it.

The persistent Capture control opens a dedicated full-screen **Capture Studio**. The control expands outward into a warm paper canvas while small source fragments—video frame, link card, handwritten card, and cookbook clipping—settle into an organized composition. The transition should take approximately 300–450 milliseconds and remain interruptible.

#### Capture Studio Home

Use one clear headline: **“Where is this recipe?”**

The initial screen presents five purposeful paths rather than a long utility menu:

1. **From another app** — Instructions for sharing directly from Instagram, TikTok, YouTube, Pinterest, Facebook, or a browser.
2. **Paste a link** — Import from a website, social post, or video URL.
3. **Scan a recipe** — Camera capture for cards, cookbooks, magazines, printouts, and handwriting.
4. **Choose photos or a file** — Screenshots, multi-image recipes, PDFs, and documents.
5. **Create it myself** — Type, paste text, or dictate a recipe.

Each path uses an editorial illustration and a short outcome-oriented explanation. Do not show a grid of small technical icons. The last-used path may appear as a compact **Continue** card, but no option should be hidden.

#### Flow A1: Share From Another App

- Show a branded, animated demonstration of the platform share sheet without recreating or disguising the actual operating-system interface.
- Explain: open the recipe, tap Share, and choose CraveKeep.
- Provide **Open Instagram**, **Open TikTok**, **Open YouTube**, **Open Pinterest**, and **Open browser** shortcuts only where platform policies permit.
- When CraveKeep receives the share, transition directly to Source Preview rather than reopening the Capture Studio menu.
- If a platform provides incomplete content, offer **Add screenshots**, **Paste caption**, or **Review transcript** as contextual recovery actions.

#### Flow A2: Paste a Link

This is a dedicated page, not a pop-up.

**Page composition:**

- Expressive headline: **“Bring that recipe home.”**
- A large paper-card URL field labeled **Recipe, post, or video link**.
- A clearly visible **Paste** action inside the field.
- A small source ribbon that recognizes supported sources after entry.
- A primary **Find the recipe** button that activates only after basic URL validation.
- A secondary **Paste the caption instead** route.

After a valid link is entered, the field transforms in place into a **Source Preview Card** containing the source icon, creator/site, thumbnail when permitted, content title, media type, and original-link confirmation. The user taps **Import this recipe**. Do not send the user into an embedded web search or show unrelated search results.

Clipboard access must follow platform privacy rules. Never read the clipboard silently. The user may tap Paste, or CraveKeep may show a non-invasive suggestion only when the operating system explicitly allows it.

#### Flow A3: Scan a Recipe

Use a full-screen custom camera with a restrained warm-charcoal interface—not a camera view placed inside a generic modal.

**Camera states:**

- **Find edges:** animated corner marks locate the card or page.
- **Hold steady:** the charcoal frame becomes herb green as focus and lighting become usable.
- **Captured:** a quick paper-flash and tactile response confirm the page without imitating a camera shutter gimmick.
- **Add another page:** multi-page tray remains visible for recipes spanning cards or cookbook pages.

Controls include flash, gallery, automatic/manual capture, handwriting mode, multi-page mode, and accessibility guidance. Provide real-time prompts for glare, blur, cut-off text, page curvature, shadows, and insufficient contrast.

After capture, show an edge-correction workspace with crop handles, rotation, perspective correction, page order, retake, and **Looks good**. Preserve the original scan beside the cleaned recipe, especially for family and handwritten recipes.

#### Flow A4: Photos, Screenshots, and Files

- Use a branded selection landing page before invoking the native picker.
- Explain accepted content: screenshots, camera-roll photos, PDFs, and documents.
- Allow multi-select and display selected items as layered paper cards.
- Detect likely page order but let the user reorder by dragging.
- Group multiple screenshots into one recipe when confidence is high; otherwise ask whether they are one recipe or several.
- Identify duplicates before processing and allow **Use existing**, **Replace**, or **Save another version**.

#### Flow A5: Manual, Text, and Voice Creation

- Start with three large choices: **Type a recipe**, **Paste recipe text**, and **Speak it**.
- Voice capture shows a live transcript with ingredient and instruction sections forming as the user speaks.
- Never invent missing quantities without labeling them as estimates.
- Save drafts continuously.

#### Source Preview and Permission Boundary

Before processing, CraveKeep shows exactly what it received and where it came from. Preserve creator name, source platform/site, original URL, thumbnail or media reference when permitted, and import time. CraveKeep must not imply ownership of imported creator content.

#### Branded Processing Experience

Processing receives its own full-screen scene. The source remains visible on the left or top while an empty recipe card assembles on the right or below.

Use truthful, progressive states:

1. **Reading the source**
2. **Finding ingredients**
3. **Building the steps**
4. **Checking quantities and timing**
5. **Preparing your recipe**

As each stage completes, charcoal fragments move into their correct place and gain color. A percentage may be shown only when based on real completed stages; otherwise use completed-state markers without a fake countdown. Users may leave the screen while longer imports continue, and CraveKeep sends an in-app completion notice.

#### Recipe Review Workspace

Review should feel like editing a finished recipe, not correcting a form generated by AI.

- Large food image or preserved source media at the top.
- Recipe title, creator attribution, servings, total time, and source immediately visible.
- Ingredients and directions presented as natural recipe sections.
- Low-confidence text receives a subtle citrus underline and a plain-language **Check this** label.
- Tapping a flagged field opens focused alternatives and the relevant source crop, caption, or video timestamp.
- Users can play only the relevant video moment beside a questioned instruction.
- Sticky actions: **Save original** and **Personalize first**.
- Optional actions: edit, merge duplicate, add notes, assign collection, and add to meal plan.

#### Import Recovery

Never end with a generic “Something went wrong.” Recovery should reflect what CraveKeep successfully obtained:

- **We found the video but not the ingredient amounts** — review transcript, add caption, or enter amounts later.
- **This page blocks automatic reading** — add screenshots or scan the page.
- **The handwriting needs your help** — show uncertain words beside their original crop.
- **This looks like more than one recipe** — split or combine.
- **We already found this in your collection** — open existing, update it, or save a variation.

Keep the source and partial work when the user exits, retries, authenticates, or dismisses a paywall.

#### Import Queue and History

The Capture Studio includes a quiet **Imports** destination for active, completed, and needs-review items. Each import retains source, status, progress stage, time, and recovery action. Bulk imports belong here instead of blocking the main interface.

#### Supported Capture Inputs

- Native share extension on iOS and Android
- Instagram, TikTok, Facebook, YouTube, Pinterest, and supported social URLs
- Recipe websites and blogs
- YouTube transcript and description extraction, with timestamps linked to steps
- Pinterest pin, linked-page, and image extraction
- Screenshot import, including multi-image recipes
- Camera scanning for cards, cookbooks, magazines, and handwritten recipes
- PDF and document upload
- Paste text, URL, or social caption
- Email recipes to a personal import address
- Manual recipe creation and voice dictation
- Bulk import from Paprika, Recipe Keeper, Notes, Google Docs, Notion, and common file formats
- Browser extension and web app
- Import queue with progress, confidence, duplicate detection, and review
- Preservation of original source link, creator attribution, and saved media reference

#### Capture Screen Inventory

| ID | Screen | Primary outcome |
| --- | --- | --- |
| CAP-01 | Capture Studio Home | Choose an understandable source path |
| CAP-02 | Share From Another App | Learn or launch the native share workflow |
| CAP-03 | Paste a Link | Validate a URL without leaving CraveKeep |
| CAP-04 | Source Preview | Confirm source and attribution before import |
| CAP-05 | Scan Camera | Capture a clean page or card |
| CAP-06 | Scan Review | Crop, correct, order, or retake pages |
| CAP-07 | Photo/File Intake | Select and group screenshots or documents |
| CAP-08 | Manual/Voice Entry | Create a recipe without an external source |
| CAP-09 | Processing | Show truthful extraction progress |
| CAP-10 | Recipe Review | Resolve uncertainty and save confidently |
| CAP-11 | Import Recovery | Continue from a specific failure state |
| CAP-12 | Import Queue | Manage active, completed, and blocked imports |

**Important technical constraint:** social-platform extraction must use permitted APIs, user-initiated sharing, accessible page metadata, or licensed mechanisms. Import reliability can change when platforms alter access, so each source needs a fallback path such as screenshot, caption paste, or transcript review.

### B. AI Parsing and Recipe Repair

- Separate ingredients from instructions even when the creator gives them verbally
- Infer quantities only when clearly marked as estimated
- Normalize units and ingredient names
- Detect missing time, temperature, serving count, or steps
- Match video moments to instructions
- Identify likely transcription or OCR errors
- Ask focused questions when confidence is low
- Flag unsafe or implausible cooking instructions
- Detect duplicates and near-duplicates
- Merge multiple screenshots into one recipe
- Let users correct extracted fields before saving

### C. Personal Food Profile

- Household member profiles
- Dietary preferences and hard exclusions
- Allergies with prominent safety warnings
- Nutrition and macro targets
- Health-oriented preferences without diagnosis claims
- Foods users love, dislike, or refuse
- Preferred stores and budget
- Household size and typical leftovers
- Available appliances
- Cooking skill and desired effort
- Weeknight time limit
- Pantry staples

### D. Recipe Library and Discovery

- Visual home feed and searchable library
- Cookbooks, folders, tags, favorites, ratings, and notes
- Filters by cuisine, meal, diet, ingredient, time, equipment, calories, protein, creator, and source
- Natural-language search: “high-protein chicken under 30 minutes without mushrooms”
- Recently imported, most cooked, want to try, family favorites, and expiring-soon collections
- Ingredient and semantic search across ingredients and instructions
- Private recipes by default, with selective household or public sharing
- Original and remixed versions grouped together

### E. Meal Planning

- Weekly and monthly calendar
- Drag-and-drop meal planning
- AI-generated plans based on targets, schedule, budget, preferences, and pantry
- Leftover chaining: cook once and reuse components later
- Batch cooking and meal-prep mode
- Multiple household schedules and serving counts by meal
- “Use what I have” planner
- Cost estimate per recipe, serving, day, and week
- Variety guardrails to prevent repetitive plans
- Planned dining-out and skip days
- Automatic grocery list generation

### F. Calorie and Macro Fit Engine

This should be a signature capability, not simply a nutrition display. Users should be able to enter a daily calorie target and optional targets for protein, carbohydrates, fat, fiber, sodium, or other supported nutrients. The app then makes recipes the user already enjoys fit those goals.

#### Core Actions

- **Fit This Recipe to My Day:** Modify the recipe, portion, side dishes, or remaining meals based on what the user has left.
- **Fit My Entire Day:** Balance breakfast, lunch, dinner, and snacks around selected recipes.
- **Build My Week Around My Targets:** Create a weekly plan using saved favorites while meeting calorie and macro ranges.
- **Rebalance My Day:** Adjust remaining meals after the user eats something unplanned or changes a meal.
- **Find Something That Fits:** Search the user's own library for food that matches the remaining calories, macros, available ingredients, and cooking time.

#### Macro Fit Modes

| Mode | Behavior |
| --- | --- |
| Preserve Recipe | Leaves the favorite recipe mostly unchanged and adjusts other meals around it. |
| Balanced Fit | Makes moderate portion and ingredient changes while protecting taste. |
| Exact Fit | Optimizes serving size, ingredients, sides, and other meals to approach the target closely. |
| Meal Prep Fit | Produces repeatable portions and quantities for several days. |

#### User Experience

- Show calories and macros remaining for the day.
- Let users track calories only, protein only, or a full macro split.
- Offer target ranges rather than demanding exact numbers.
- Display the original recipe beside the fitted version.
- Explain all portion and ingredient changes.
- Show how changes affect taste, texture, cost, and nutrition.
- Let users lock ingredients they refuse to change.
- Allow flexible meals, higher-calorie days, and weekly-average targets.
- Automatically scale the grocery list to the fitted portions.
- Save fitted recipes as versions without overwriting the original.
- Use supportive language and never label food or a day as a failure.

#### Example

A user has 620 calories, 58 grams of protein, 47 grams of carbohydrates, and 18 grams of fat remaining. The app can find a saved chicken recipe, adjust its serving and sauce, pair it with an appropriate side, and show the resulting totals. If the user wants the original dinner unchanged, Preserve Recipe mode adjusts earlier meals or snacks instead.

Nutrition values should be clearly identified as estimates whenever imported quantities, ingredient brands, preparation methods, or serving sizes are uncertain. The feature supports general wellness planning and should not claim to treat a medical condition.

### G. Pantry and Grocery Intelligence

- Smart list merged and organized by aisle
- Pantry inventory with barcode, receipt, voice, and manual entry
- Expiration reminders and “use soon” recipes
- Quantity subtraction based on pantry stock
- Duplicate and unit consolidation
- Multiple stores and custom aisle order
- Price memory and estimated basket total
- Household-shared live list
- Grocery delivery integrations where commercially viable
- Substitution suggestions when an item is unavailable or expensive
- Food-waste insights and savings estimates

### H. Cooking Experience

- Distraction-free, step-by-step Cook Mode
- Screen stays awake
- Voice navigation and hands-free timers
- Multiple concurrent timers linked to steps
- Ingredient quantities visible within each step
- Inline conversions and serving adjustments
- Video clip or source timestamp attached to the relevant step
- Mise en place checklist before cooking begins
- Adaptive timeline for dishes that must finish together
- “I’m missing this” instant substitutions
- Household notes, ratings, photos, and changes after cooking
- Offline access to saved recipes and active meal plans

### I. Sharing and Community

Community should expand CraveKeep from a private utility into a source of trusted cooking inspiration without turning the product into an undifferentiated social feed. Tasty's current product demonstrates the value of community photos, tips, ratings, creator connections, and community recipe variations; CraveKeep should combine those behaviors with stronger ownership, attribution, and personal-library controls. Reference: [Tasty App Store listing](https://apps.apple.com/us/app/tasty-recipes-cooking-videos/id1217456898).

#### Community Discovery

- Community appears within Home through **For You**, **Following**, and **Friends** feed segments instead of adding a sixth bottom-navigation destination.
- Feed cards show the creator, recipe image or video, recipe title, attribution, key dietary or time labels, likes, saves, comments, ratings, and **Made it** count.
- Users can like, save, comment, share, follow, and mark a recipe **Made it**.
- Saving a public recipe creates a private library reference that retains the creator, source, and future-update relationship.
- Users can browse creator profiles, public cookbooks, seasonal collections, trending recipes, friends' cooking activity, and recipes popular with similar households.
- Ranking should emphasize recipe quality, reliability, relevance, and trusted cooking outcomes—not only engagement velocity.

#### Publishing and Cooking Contributions

- Imported recipes remain private by default and cannot be publicly republished unless the user owns the recipe or has permission to share it.
- Publishing requires an ownership or permission confirmation, recipe title, ingredients, instructions, serving count, category, and image-rights confirmation.
- Original creator and source attribution remain visible and cannot be removed from imported material.
- Users may share a photo, rating, practical tip, or clearly labeled personal variation without claiming ownership of the underlying recipe.
- **Made it** posts connect a finished-dish photo and optional notes to the recipe rather than creating disconnected social content.
- Personal variations can be published as **Remixes** with an explicit relationship to the original and a change summary.
- Creators can update recipes while users choose whether to retain their saved version or accept the update.

#### Trust, Safety, and Moderation

- Reporting flows cover copyright, stolen imagery, unsafe instructions, harassment, spam, undisclosed promotion, and inappropriate content.
- Community tips and substitutions are visibly distinguished from verified recipe instructions.
- Recipe Reliability combines completeness, cook outcomes, ratings, safety signals, and extraction confidence.
- Block, mute, comment controls, private profiles, and follower approval are available.
- Automated moderation supports human review and transparent appeal paths.
- Sponsored creator content and affiliate relationships require clear labeling.

#### Private and Collaborative Sharing

- Shared household recipe vault, plan, and grocery list
- Private family cookbook for preserving handwritten recipes
- Collaborative cookbooks for events or friend groups
- Beautiful recipe cards and deep links
- Selective sharing with a person, household, group, or the public
- Creator attribution and links back to original content

#### Community Screen Inventory

| ID | Screen | Primary outcome |
| --- | --- | --- |
| COM-01 | Community Feed | Discover relevant recipes from creators, friends, and similar cooks |
| COM-02 | Community Recipe | Evaluate, save, like, or cook a public recipe |
| COM-03 | Creator Profile | Follow a creator and browse public recipes or cookbooks |
| COM-04 | Publish Recipe | Confirm ownership, complete details, and publish responsibly |
| COM-05 | Made It Post | Share a finished result, rating, photo, and useful tip |
| COM-06 | Tips and Changes | Learn from cooking outcomes and clearly labeled variations |
| COM-07 | Community Remix | Compare a community variation with its attributed original |
| COM-08 | Activity | Review likes, comments, follows, saves, and cooking responses |
| COM-09 | Report and Moderation | Report unsafe, abusive, or rights-violating content |

## 4. Standout Features Beyond ReciMe

1. **Recipe DNA:** Break a dish into protein, base, vegetables, sauce, technique, and flavor profile so the app can make intelligent substitutions.
2. **Health Impact Preview:** Compare calories, protein, fiber, sodium, sugar, and saturated fat before applying changes.
3. **Taste Protection Slider:** Choose “nearly identical,” “balanced,” or “maximum health improvement.”
4. **Pantry Camera:** Photograph a pantry or refrigerator and propose recipes, with user confirmation of detected items.
5. **Cook From the Video:** Convert a long social or YouTube video into concise steps with timestamped clips.
6. **Family Consensus:** Household members swipe yes/no on candidate dinners; the planner chooses meals everyone can accept.
7. **Price-Aware Remix:** Reduce cost while preserving the recipe's style and nutrition.
8. **Leftover Graph:** Show how tonight's chicken becomes tomorrow's bowls and the next day's wraps.
9. **Recipe Reliability Score:** Rate completeness, extraction confidence, tested user outcomes, and possible safety issues.
10. **Personal Learning Loop:** After cooking, ask three fast questions—taste, effort, and repeat—and tune future plans.
11. **Legacy Recipe Restoration:** Preserve the scan and handwriting beside a cleaned, searchable version with family story and voice note.
12. **Meal Rescue:** When plans change, rebuild the week around food already purchased before it expires.

## 5. Signature Onboarding Experience

The onboarding should create real value before asking for commitment. Its signature visual story is that scattered, monochrome food inspiration gradually becomes organized and full of color as the app learns about the user.

### Approved 16-Screen Sequence

1. **CraveKeep Reveal — “Keep every recipe you crave.”** The wordmark is drawn in charcoal while recipe fragments arrive from different sources; a color wash locks them into the CraveKeep mark and illustrated kitchen table.
2. **The Problem — “Your recipes shouldn’t live in twelve different places.”** Social saves, screenshots, cookbook pages, and handwritten notes organize into one recipe.
3. **Sources — “Where do your recipes live?”** Instagram, TikTok, YouTube, Pinterest, websites, photos/cards, documents, and notes.
4. **Goals — “What would make cooking easier?”** Organization, healthier eating, calorie/macro goals, household planning, savings, and faster cooking.
5. **Cooking Life — “Tell us about your kitchen.”** Household size, cooking frequency, available time, skill, and appliances.
6. **Food Preferences — “What belongs on your plate?”** Love, Avoid, and Never Suggest ingredient states, with allergies and intolerances handled separately and prominently.
7. **Nutrition Choice — “Should recipes adapt to your goals?”** Calculate targets, enter known targets, or skip for now.
8. **Calculated-Target Intake — “Let’s find a helpful starting point.”** Age, height, current weight, activity, and goal. Display only when the user requests calculated targets.
9. **Target Confirmation — “A flexible target, built around you.”** Calories and macro ranges with adjustment controls and clear estimate language.
10. **First Import — “Bring in a recipe you actually want to make.”** Enter the same Capture Studio used in the product—share from another app, scan a card, paste a link, choose photos/files, create manually, or use a sample.
11. **Guided Share Walkthrough — “Share it here.”** Demonstrate the native share sheet and how to select the app.
12. **Processing — “Turning inspiration into a recipe.”** Explain reading, organizing, and checking progress while the source becomes structured.
13. **Review — “Check the details.”** Confirm ingredients, instructions, servings, time, source, and low-confidence fields.
14. **Personalized Transformation — “Now make it work for you.”** Compare nutrition, ingredient changes, and Taste Protection settings.
15. **Account Creation and Save — “Keep what you created.”** Preserve the personalized recipe and profile before moving into planning.
16. **Plan, Grocery Value, and Trial — “Your kitchen is ready.”** Demonstrate the first meal placement and grocery merge, recap created value, then present the optional trial.

### Nutrition Intake Rules

- Do not require age, height, weight, activity, sex used for calculation, or weight-related goals from every user.
- Ask for measurements only after the user chooses **Calculate targets for me**.
- Allow users who know their targets to enter calories only, protein only, or a full macro split.
- Let users skip nutrition setup without losing progress or core recipe functionality.
- Present calculated nutrition as a flexible starting range, not a prescription.
- Explain why each personal field is requested, how it is used, and how it can be changed or deleted.
- Do not require a target weight during initial onboarding. Goal direction and pace are sufficient initially.

### Percentage-Based Progress

Use milestone percentages rather than “6 of 8” screen counts because the flow branches and optional nutrition questions change its length.

| Milestone | Progress |
| --- | ---: |
| Welcome completed | 12% |
| Recipe sources selected | 20% |
| Goals selected | 30% |
| Kitchen profile completed | 40% |
| Food preferences completed | 48% |
| Nutrition path completed or skipped | 55% |
| First recipe selected | 65% |
| Recipe imported | 75% |
| Recipe reviewed | 82% |
| Personalized version created | 90% |
| Account created | 95% |
| Recipe saved and setup complete | 100% |

The welcome screen does not display artificial progress. After the user taps Begin, the hand-drawn progress line animates honestly from 0% to 12%. Skipping optional macro questions advances to the same 55% milestone.

### Account Creation and Authentication

Allow the user to explore, configure preferences, import, and preview a personalized recipe in a temporary guest session. Require an account only when the user chooses to save what was created.

Account options:

- **Continue with Apple**
- **Continue with Google**
- **Continue with email**
- **Already have an account? Sign in**

Return the user to the exact same onboarding position after authentication without losing guest-session data. Use official Apple and Google button assets and follow their current branding and platform-review requirements. On iOS, offering Google authentication generally means the app should also offer an Apple-compliant sign-in option unless a current exception applies. References: [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), [Sign in with Apple HIG](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple), and [Google sign-in branding guidelines](https://developers.google.com/identity/branding-guidelines).

### Trial Presentation

Present the trial only after the user has imported, reviewed, personalized, and saved a recipe. Recap concrete value created: recipe imported, personalized version saved, targets configured if applicable, first meal planned, and grocery list started. Clearly disclose price, renewal timing, reminder behavior, cancellation terms, and a free-plan option.

### Onboarding Rules

- Allow skip and resume.
- Save progress after every scene.
- Ask for notifications only when demonstrating a real benefit.
- Ask for account creation after the personalized recipe preview, not on the opening screen.
- Do not request every permission at once.
- Keep the non-nutrition path fast; allow optional personalization to take longer because it creates visible value.
- Offer a quieter reduced-motion experience.
- Never lose the imported recipe when authentication or payment is dismissed.
- Track onboarding completion, skips, backtracking, import success, edit rate, first transformation, account conversion, and trial conversion by milestone.

## 6. Brand and Motion Direction

Avoid both the generic beige cookbook aesthetic and generic AI imagery. Recommended territory: **premium editorial cookbook energy with playful, human-drawn transformation**.

### Visual System

- Warm cream paper texture with charcoal ink drawing
- Brand palette: tomato red, citrus yellow, herb green, and a controlled cobalt-blue accent
- Editorial serif for expressive headlines and highly legible sans serif for functional UI
- Real food photography combined with restrained torn-paper collage and hand-drawn illustrations
- Consistent 8-point spacing, button, field, card, and icon systems
- One hand-drawn line that carries progress and continuity across onboarding
- Ingredient illustrations that exist in matching outline, partial-reveal, and full-color states
- Strong light and dark modes

### Ingredient Illustration System

Treat branded food illustrations separately from functional UI icons.

#### Recommended Production Sources

1. **Primary candidate:** [350 Hand-Drawn Recipe Ingredient SVG Set](https://www.etsy.com/listing/1305763404/food-icons-svg-recipe-ingredients). It currently advertises 350 individually isolated SVG and transparent PNG ingredients across fruits, vegetables, proteins, seafood, dairy, grains, legumes, herbs, spices, and pantry items.
2. **Alternative:** [Streamline Freehand food icon sets](https://site.streamlinehq.com/free/food-icon-sets) for a more compact mono or duotone system.
3. **Alternative:** [Food Icon Pack](https://foodiconpack.com/license), whose paid illustrated SVG packs currently include commercial licensing.
4. **Alternative:** [GetIllustrations food library](https://getillustrations.com/categories/food), which currently offers SVG, PNG, AI, commercial licensing, recoloring, and Figma access.

Do not use marketplace previews, search-result images, or unlicensed downloads in the product. Before adoption, retain a copy of the exact license and verify that it permits commercial mobile/web application embedding, modification, and ongoing distribution.

#### Asset Adaptation Workflow

- Purchase and preserve the original licensed package and license receipt.
- Audit coverage, duplicates, inconsistent styles, and missing common ingredients.
- Recolor the source into the approved brand palette.
- Normalize canvas size, transparent padding, outline weight, shadows, and illustration scale.
- Produce matching outline and full-color SVG variants from the same underlying paths.
- Optimize SVGs and remove unnecessary metadata before app integration.
- Use a consistent filename taxonomy such as `protein-chicken-breast-outline.svg` and `protein-chicken-breast-color.svg`.
- Map ingredient synonyms to a canonical illustration rather than creating a graphic for every database name.
- Create custom additions using the same illustrator/style guide when source coverage is insufficient.

Example canonical mapping:

| Ingredient aliases | Canonical illustration |
| --- | --- |
| chicken breast, boneless chicken, chicken cutlet | `protein-chicken-breast` |
| red bell pepper, bell pepper, capsicum | `vegetable-bell-pepper` |
| baby spinach, spinach leaves, fresh spinach | `vegetable-spinach` |
| parmesan, Parmigiano-Reggiano | `dairy-parmesan` |

Use a conventional UI icon family such as Lucide or Streamline for scan, upload, timer, servings, edit, calendar, and grocery actions. Do not mix those functional icons with decorative ingredient illustrations.

### Outline-to-Color Ingredient Transition

Every branded ingredient should support three purposeful visual states:

1. **Outline:** Charcoal, human-drawn ink illustration with no fill.
2. **Color Reveal:** The exact same paths receive a textured color wash moving lower-left to upper-right while the charcoal contour remains visible.
3. **Ready:** Full brand color settles into place with an optional subtle offset paper shape.

Recommended timing:

| Stage | Timing | Behavior |
| --- | ---: | --- |
| Trace | 0–20% | Outline appears as if drawn by hand. |
| Wash | 20–55% | SVG mask reveals color with a slightly organic painted edge. |
| Settle | 55–85% | Remaining color fills and small elements ease into position. |
| Ready | 85–100% | Motion settles and the state becomes interactive. |

Normal ingredient selection should complete in approximately 500–700 milliseconds. Longer cinematic uses during the opening and recipe transformation may take 900–1,400 milliseconds. Provide reduced-motion behavior using an immediate crossfade or state change.

Preference-state behavior:

- **Unselected:** charcoal outline
- **Love:** full color with a subtle herb-green backing shape
- **Avoid:** partial or muted color with a citrus-yellow warning treatment
- **Never Suggest:** tomato-red crosshatch or strike treatment; do not rely on color alone
- **Allergy:** separate high-visibility safety state with text and icon confirmation

### Motion System

#### Approved CraveKeep Launch and Logo Intro

The first-launch intro uses the central brand idea that **the recipe completes the logo**. It should feel like a continuous transition into onboarding rather than a disposable splash screen.

| Time | Motion and state |
| --- | --- |
| 0.00–0.40s | Warm-cream paper background appears; a faint C outline begins drawing clockwise. |
| 0.40–0.90s | The C changes from outline to solid charcoal. |
| 0.75–1.15s | Three tomato-coral recipe lines slide in individually with a soft stagger. |
| 1.05–1.45s | The K stem appears and the upper and lower K arms unfold with a restrained spring. The K must remain crisp and immediately readable. |
| 1.45–1.90s | The **CraveKeep** wordmark rises slightly and fades into place below the monogram. |
| 1.90–2.20s | Two or three restrained coral line accents dissipate around the completed mark. Do not use generic confetti or AI sparkles. |
| 2.20–2.70s | The logo scales down and glides into the onboarding header while the hero food illustration develops from charcoal linework into full color. |

Implementation requirements:

- Use subtle haptic feedback when the K locks into place.
- Keep all motion interruptible and keep the complete first-launch sequence under three seconds.
- Show the cinematic sequence only on first launch or after a meaningful brand reset.
- On normal app launches, use a shortened 600–800 millisecond assembly only when loading time requires a launch state.
- Continue directly into the onboarding headline **“Your recipes. Kept your way.”** and primary action **“Let's begin.”**
- Use the same logo geometry in the splash, app icon, onboarding header, and navigation capture control.
- Respect Reduce Motion by replacing drawing, spring, and travel effects with short crossfades.
- Never delay access solely to finish the animation; if the app is ready, allow the transition to complete immediately.

- Brand progress: a hand-drawn line traces forward and gains color at milestone percentages
- Personalization: monochrome food becomes full color as the app learns a preference
- Import: scattered source fragments organize into a clean recipe card
- AI processing: structured ingredients and steps appear progressively with explicit status labels
- Healthy remix: ingredient tiles flip into substitutions while nutrition values count smoothly
- Grocery merge: repeated ingredients combine into one item
- Meal planning: recipe cards glide onto a calendar and leave color trails by meal type
- Account save: the personalized recipe folds into the user’s cookbook before authentication options appear
- Success: the onboarding kitchen becomes fully colored rather than using generic confetti
- Loading: always explain the current task—reading, structuring, checking, calculating—not an indefinite spinner

Motion must stay fast, interruptible, and accessible. Effects should reinforce progress and meaning rather than delay common actions. Avoid sparkles, glowing AI dust, floating 3D ingredients, excessive gradients, and unrelated animations on every screen.

## 7. Core Navigation

Recommended mobile tabs:

1. **Home** — personalized actions, community feeds, planned meals, pantry alerts, and recent imports. Use **For You**, **Following**, and **Friends** feed segments for community discovery.
2. **Recipes** — library, search, cookbooks, versions
3. **Plan** — meal calendar and AI planning
4. **Groceries** — shopping lists, saved lists, checked items, aisle organization, and pantry. Use a recognizable checklist-inside-a-shopping-basket icon; do not use a generic shopping bag or marketplace storefront.
5. **Profile access** — place the profile avatar in the top-right header instead of consuming a bottom-navigation destination.

The five bottom-bar positions are **Home**, **Recipes**, the persistent central **Capture** button, **Plan**, and **Groceries**. Capture expands into the full-screen CraveKeep Capture Studio and must never open a generic action sheet containing an undifferentiated list of utilities.

### Recipe, Nutrition, and Remix Screen Inventory

| ID | Screen | Primary outcome |
| --- | --- | --- |
| REC-01 | Recipe Detail | View source, rating, time, servings, nutrition summary, ingredients, and steps |
| REC-02 | Ingredients | Check ingredients, scale servings, convert units, and add selected items to Groceries |
| REC-03 | Steps | Cook normally or enter guided Cook Mode |
| REC-04 | Nutrition | Review estimated calories, macros, nutrients, serving assumptions, and daily-target fit |
| REC-05 | Remix Goal | Choose healthier overall, higher protein, lower calorie, lower sodium, or another adaptation |
| REC-06 | Taste Protection | Select nearly identical, balanced, or maximum change and lock ingredients |
| REC-07 | Remix Processing | See substitutions, quantities, instructions, and nutrition recalculate truthfully |
| REC-08 | Before and After | Compare original and proposed nutrition, ingredients, taste, texture, cost, and confidence |
| REC-09 | Remix Adjustment | Keep or undo individual changes and recalculate the result |
| REC-10 | Save Version | Save the remix as a new version without overwriting the original |
| REC-11 | Version History | Switch, compare, rename, restore, or delete personal recipe versions |

Recipe Detail should expose **Make it healthier** as a visible coral action near the nutrition summary rather than hiding it inside an overflow menu. Nutrition remains available to everyone; adaptation is optional. The default view always preserves the imported recipe.

### Platform Strategy

**Launch should be mobile-first.** The primary discovery and capture behaviors happen on a phone: sharing from social apps, scanning cards, taking photos, shopping, and following steps in the kitchen. Launching a polished iOS and Android experience is more important than dividing attention across a complete desktop product.

The launch architecture should still use shared APIs, cloud data, responsive design foundations, and platform-neutral recipe models so desktop access does not require rebuilding the product later.

**Version 2 should introduce a full desktop web app** optimized for tasks where a larger screen materially helps:

- Bulk importing and organizing large recipe collections
- Side-by-side original and remixed recipe editing
- Weekly or monthly meal planning
- Calorie and macro planning across an entire day or week
- Pantry management and large grocery-list review
- Cookbook creation, printing, and recipe export
- Household administration and profile management
- Accessing recipes when a phone is unavailable

A lightweight launch website may support account management, shared recipe links, marketing, and perhaps read-only recipe access. The complete interactive desktop workspace can follow in Version 2.

## 8. Retention Without Dark Patterns

The durable habit loop is:

**Discover → Capture → Personalize → Plan → Shop → Cook → Rate → Improve**

Retention features:

- Weekly personalized plan ready for review
- Pantry and expiration reminders
- Household collaboration
- Cooking history and personal notes
- Savings, waste avoided, and nutrition progress
- Recipe streaks only if they feel supportive, not guilt-based
- Monthly “your kitchen” recap
- New remixes of saved favorites as goals change
- Seasonal suggestions based on the user's actual library

The app should offer full recipe export and straightforward cancellation. Data portability increases trust and makes users more comfortable committing their family recipes.

## 9. Monetization Recommendation

### Free

- Limited smart imports per week
- Manual recipes
- Basic library, cookbooks, Cook Mode, and sharing
- One household profile
- Limited Recipe Remix previews

### Plus

- Unlimited imports and scans
- Full Recipe Remix Engine
- Calorie and Macro Fit Engine with daily remaining targets
- Nutrition estimates and detailed comparisons
- Advanced search and organization
- Meal planning and smart grocery lists
- Offline access and multi-device sync

### Household

- Multiple member profiles
- Shared planning, pantry, lists, and cookbooks
- Family Consensus
- Individual restrictions and serving needs

### Optional Later Revenue

- Grocery affiliate or delivery revenue
- Creator collections and marketplace revenue share
- Printed family cookbooks
- Premium dietitian-created templates or reviewed recipe packs

Avoid placing basic access to a user's own saved recipes behind the paywall. Charge for repeated automation, intelligence, advanced planning, and collaboration.

## 10. Recommended MVP and Phasing

### Phase 1: The Magic Loop

- Polished iOS and Android apps with a shared API and responsive web foundation
- Lightweight website for marketing, account management, and shared recipe links
- Share extension, URL import, social-link import, screenshot/photo/card OCR, pasted text, and manual creation
- Structured recipe editor with source attribution
- Library, cookbooks, tags, search, favorites
- Serving scaling and unit conversion
- Recipe Remix Engine v1: healthier, high-protein, lower-calorie, dietary substitutions
- Calorie and Macro Fit Engine v1: fit a recipe to a meal or remaining daily targets
- Preserve Recipe, Balanced Fit, and Exact Fit modes
- Remaining-calorie and remaining-macro display
- Before/after nutrition and change explanations
- Cook Mode, timers, notes, cloud sync
- High-impact onboarding and subscription flow

### Phase 2: Planning and Household Value

- Full desktop web application with synchronized recipes, plans, grocery lists, and household profiles
- Desktop-optimized bulk organization, recipe editing, and drag-and-drop planning
- Meal calendar
- Smart grocery lists
- Household accounts and shared lists
- Personal food profiles and allergy controls
- Pantry basics and “use what I have”
- AI weekly planner
- Full-day and weekly macro-aware planning
- Rebalance My Day and Find Something That Fits
- Meal Prep Fit and weekly-average targets
- Offline access
- Browser extension and broader bulk import

### Phase 3: Defensibility

- Video-to-timestamped-step extraction
- Pantry camera and receipt capture
- Leftover Graph and Meal Rescue
- Price-aware meal planning
- Recipe reliability and community feedback
- Grocery commerce integrations
- Creator tools and optional public discovery

## 11. MVP Success Metrics

- First recipe successfully imported within five minutes of install
- Import success rate by source
- Percentage of imports requiring edits
- Time from source share to saved recipe
- Onboarding completion and first remix rate
- Percentage of users who fit a recipe to their remaining daily targets
- Daily and weekly plans completed within the user's selected calorie and macro ranges
- Percentage of new users who cook or plan a saved recipe in week one
- Weekly recipes imported, remixed, planned, and cooked
- Grocery-list generation and completion rate
- Four-week retention by activated behavior
- Trial start, paid conversion, refund, and voluntary churn
- Trust metrics: export use, cancellation complaints, extraction corrections, and allergy-related reports

The key activation event should not be account creation. It should be: **the user imports a real recipe, sees a useful personalized version, and places it into a plan or starts cooking it.**

## 12. Key Risks to Design Around

- Social-platform terms and changing technical access
- Copyright, creator attribution, and avoiding redistribution of protected media
- OCR and transcription errors
- Nutrition estimates that imply false precision
- Allergy substitutions that users mistake for guarantees
- AI changes that damage texture, flavor, cooking chemistry, or food safety
- Incomplete recipes spoken casually in videos
- High inference cost for long videos and repeated transformations
- Motion that makes the app slower or inaccessible
- User distrust if originals are changed or family recipes cannot be exported

## 13. Immediate Product Decisions

Before detailed screen design, decide:

1. The primary audience: general home cooks, health-conscious households, macro-focused users, or busy families.
2. Whether health transformation or universal capture leads the brand promise.
3. Initial platforms: mobile-first with web companion is recommended.
4. Free import allowance and trial structure.
5. Whether grocery ordering launches later through partners.
6. How aggressively AI may infer missing recipe details.
7. Final brand identity execution for the approved name **CraveKeep**.

8. Capture Studio usability testing across link, share-sheet, scan, screenshot, document, and recovery flows.

**Platform recommendation:** Launch the consumer product on iOS and Android. Build the data model and APIs for cross-platform use from day one, offer only essential web functionality at launch, and release the complete desktop web workspace in Version 2.

## 14. Approved Product Screen Architecture

The approved mockups establish a consistent product architecture across onboarding and the five completed application groups. Mockups are directional product specifications: final implementation must preserve hierarchy, actions, states, accessibility, and brand behavior while using production components and validated content.

### Group 1: Home and Recipe Organization

| ID | Screen | Required behavior |
| --- | --- | --- |
| HOME-01 | Personalized Home | Combine tonight's plan, optional nutrition context, unfinished imports, recent recipes, and a restrained community preview. |
| LIB-01 | Recipe Library | Support All, Favorites, and Cookbooks with grid/list views, version badges, sorting, and saved filters. |
| LIB-02 | Search and Filters | Support natural-language search plus calories, protein, time, source, ingredient, equipment, and dietary filters. |
| LIB-03 | Cookbook Detail | Show privacy, collaborators, featured recipes, add, share, and management controls. |
| LIB-04 | Empty Library | Use the scattered-to-organized illustration and offer Add my first recipe or Try a sample. |

### Group 2: Meal Planning and Macro Fitting

| ID | Screen | Required behavior |
| --- | --- | --- |
| PLAN-01 | Weekly Plan | Organize meals by day and meal type with planned calories, macros, servings, leftovers, and empty slots. |
| PLAN-02 | Add a Meal | Rank personal and permitted community recipes by goal fit, time, preference, and availability. |
| FIT-01 | Fit My Day | Show remaining calories and macros and offer Preserve Recipe, Balanced Fit, and Exact Fit. |
| FIT-02 | Daily Nutrition | Separate eaten, planned, and remaining values and label estimates clearly. |
| PLAN-03 | Plan Preview | Let users lock, swap, remove, or regenerate individual meals before accepting a generated plan. |
| FIT-03 | Rebalance My Day | Explain how an unplanned meal changes the remainder and offer reversible adjustments without judgment. |

### Group 3: Groceries and Pantry

| ID | Screen | Required behavior |
| --- | --- | --- |
| GROC-01 | Groceries Home | Surface the active list, saved lists, recent trips, household sharing, and pantry alerts. |
| GROC-02 | Active List | Group by aisle, merge quantities, retain recipe origin, support live household updates, and collapse checked items. |
| GROC-03 | Add Item | Support search, voice, and barcode with editable quantity, unit, aisle, note, and destination list. |
| GROC-04 | Recipe to List | Separate needed items from pantry stock, explain merged quantities, and flag uncertain inventory. |
| PAN-01 | Pantry | Track known, low-stock, expiring, frozen, and uncertain items and connect them to Use Soon recipes. |
| GROC-05 | Trip Complete | Review purchased and skipped items before updating pantry; receipt sharing remains optional. |

The navigation label is **Groceries**, never Shop. Its functional icon is a checklist inside a shopping basket so it cannot be confused with a marketplace.

### Group 4: Cooking Experience

| ID | Screen | Required behavior |
| --- | --- | --- |
| COOK-01 | Get Ready | Present mise en place, equipment, timing, servings, and hands-free guidance. |
| COOK-02 | Cook Mode | Show one large step, inline quantities, progress, safety temperature, image, timer, and voice navigation. |
| COOK-03 | Active Timers | Support multiple labeled timers linked to recipe steps with sound, vibration, pause, and add-minute controls. |
| COOK-04 | Missing Ingredient | Compare substitutions by quantity, taste, texture, nutrition, dietary effect, and instruction changes. |
| COOK-05 | Video Moment | Show only the relevant attributed source-video moment beside the written step. |
| COOK-06 | Finished Cooking | Capture taste, effort, repeat intent, photo, private notes, saved changes, and optional Made It sharing. |

Focused Cook Mode, timers, and video moments temporarily remove bottom navigation to reduce accidental taps. The screen remains awake while cooking unless the user disables that behavior.

### Group 5: Account, Profile, and Household

| ID | Screen | Required behavior |
| --- | --- | --- |
| AUTH-01 | Create Account | Recap protected guest-session value and offer Apple, Google, email, and sign-in routes without pricing. |
| AUTH-02 | Email Sign-Up | Request only name, email, password, terms acceptance, and verification. |
| PROF-01 | My Profile | Show privacy state, recipes, cookbooks, Made It activity, and shortcuts to personal settings. |
| PROF-02 | Food Profile | Separate Loves, Avoid, Never Suggest, dietary preferences, and high-visibility allergies. |
| PROF-03 | Nutrition Goals | Support manual or calculated targets, ranges, weekly averages, flexible days, editing, and pausing. |
| HH-01 | Household | Maintain per-member preferences, allergies, servings, roles, invitations, and shared resources. |
| SET-01 | Settings | Make privacy, notifications, units, imports, accessibility, subscription, export, sign-out, and deletion discoverable. |

Authentication and subscription are separate decisions. Age, height, weight, activity, and calculation inputs are requested only after a user explicitly chooses **Calculate for me**.

### Remaining Mockup Groups

The following are defined but still require approved visual boards:

1. **Group 6 — Subscription and Offers:** value recap, standard offer, annual offer, feature limit, and subscription management.
2. **Group 7 — Community Creation:** publish recipe, Made It post, comments and tips, creator profile, activity, and reporting.
3. **Group 8 — System and Recovery States:** notifications, import queue, offline access, no results, import recovery, nutrition uncertainty, loading, unavailable content, permissions, and success states.

## 15. Visual Mockup Register

The project mockup package is the visual source of truth for current design direction.

| File | Coverage | Status |
| --- | --- | --- |
| `00-logo-final-directions.png` | Current CK logo construction and small-size behavior | Current direction |
| `01-logo-intro-animation.png` | First-launch logo assembly and transition to onboarding | Approved concept |
| `02-onboarding-part-1.png` | Early onboarding flow | Approved direction |
| `03-onboarding-part-2.png` | Preference and personalization onboarding | Approved direction |
| `04-onboarding-account-value.png` | Account/value transition during onboarding | Approved direction |
| `05-capture-studio.png` | Link, scan, upload, processing, review, and recovery capture experiences | Approved direction |
| `06-ingredient-outline-to-color.png` | Ingredient illustration states and transition behavior | Approved direction |
| `07-recipe-remix-nutrition-community.png` | Recipe detail, nutrition, healthy remix, comparison, and community | Approved direction |
| `08-group-1-home-recipe-organization.png` | Home, library, search, cookbook, and empty state | Approved direction |
| `09-group-2-meal-planning-macros.png` | Planning, daily nutrition, macro fit, plan preview, and rebalancing | Approved direction |
| `10-group-3-groceries-pantry.png` | Grocery lists, item entry, pantry, and shopping completion | Approved direction |
| `11-group-4-cooking-experience.png` | Preparation, Cook Mode, timers, substitutions, video, and review | Approved direction |
| `12-group-5-account-profile-household.png` | Authentication, profiles, goals, household, and settings | Approved direction |

Earlier logo and onboarding explorations are retained in `mockups/explorations/` for design history only and must not be treated as implementation references.

## Recommended Product Thesis

**CraveKeep keeps every recipe a user craves, turns scattered inspiration into a dependable personal cookbook, and offers intelligent adaptation only when the user asks for it.**
