# Supabase setup

The migrations define private recipes, structured ingredients and steps, persistent capture jobs, and owner-only row-level security. No service-role key belongs in this repository or the mobile client.

The repository is linked to Supabase project `ymenpwsrmdnnwsykoayo`. The live project currently has both tracked migrations applied:

- `20260811000100_foundation.sql`
- `20260811024409_optimize_rls_auth_uid.sql`

To verify or apply future migrations:

```bash
supabase db push --linked --dry-run
supabase db push
```

Always review the dry run before applying a migration to a shared environment, then run `supabase db advisors --linked --type all`.

`nutrition-lookup` is an authenticated Edge Function. It identifies CraveKeep to Open Food Facts as `CraveKeep/0.1 (api@cravekeep.com)`, caches explicit searches for 24 hours, and never exposes future provider credentials to the client.

FatSecret lookups use OAuth 2 client credentials from `FATSECRET_CLIENT_ID` and `FATSECRET_CLIENT_SECRET`. Full FatSecret responses are never cached because its API documentation limits storable fields; normalized results retain provider and serving IDs for later retrieval.

USDA FoodData Central is the default generic-ingredient provider. Searches use the server-only `USDA_FDC_API_KEY`, return at most five candidates, retain source attribution and confidence, and cache normalized public-domain results for 24 hours.
