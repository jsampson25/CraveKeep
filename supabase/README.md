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
