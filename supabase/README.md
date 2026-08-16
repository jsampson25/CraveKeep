# Supabase setup

The migrations define private recipes, structured ingredients and steps, persistent capture jobs, and owner-only row-level security. No service-role key belongs in this repository or the mobile client.

The repository is linked to Supabase project `ymenpwsrmdnnwsykoayo`. The migration folder is the source of truth for the complete schema, including profiles, private recipes and captures, nutrition, meal planning, groceries, pantry, cooking history, onboarding, and household data. Do not assume the linked project is current without running the dry run.

Before a production release, verify and apply the tracked migrations:

```bash
supabase db push --linked --dry-run
supabase db push
```

Always review the dry run before applying a migration to a shared environment, then run `supabase db advisors --linked --type all`.

`nutrition-lookup` and `extract-recipe` are authenticated Edge Functions. Browser calls are limited to `https://cravekeep.com` and `https://www.cravekeep.com` by default; set the server-side `CRAVEKEEP_ALLOWED_ORIGINS` secret as a comma-separated origin list when adding another web host. Native requests without an `Origin` header remain supported. It identifies CraveKeep to Open Food Facts as `CraveKeep/0.1 (api@cravekeep.com)`, caches explicit searches for 24 hours, and never exposes future provider credentials to the client.

FatSecret lookups use OAuth 2 client credentials from `FATSECRET_CLIENT_ID` and `FATSECRET_CLIENT_SECRET`. Full FatSecret responses are never cached because its API documentation limits storable fields; normalized results retain provider and serving IDs for later retrieval.

`extract-recipe` uses the server-only `OPENAI_API_KEY` to read signed-in recipe images and returns a reviewable draft; if the secret is absent or extraction fails, the original image remains attached for manual completion.

USDA FoodData Central is the default generic-ingredient provider. Searches use the server-only `USDA_FDC_API_KEY`, return at most five candidates, retain source attribution and confidence, and cache normalized public-domain results for 24 hours.
