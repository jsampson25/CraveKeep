# CraveKeep

CraveKeep is a mobile-first home for recipes captured from anywhere. The current runnable slices support manual recipe creation and a link-capture workflow with source preview, persistent import history, truthful processing, structured review, recovery, and private saving.

## Requirements

- Node.js 22 LTS
- pnpm 11.9.0 through Corepack
- Expo Go or an iOS/Android simulator

## Start

```bash
corepack enable
pnpm install
pnpm dev
```

Run `pnpm verify` for lint, type checking, and domain tests.

Run `pnpm build:web` to create the Vercel-ready Expo web export in `apps/mobile/dist`.

## Deployment

The production web deployment follows the `main` branch.

## Repository

- `apps/mobile` — Expo Router mobile application
- `packages/domain` — platform-neutral recipe rules and types
- `supabase` — database migrations and owner-only row-level security
- `docs/product-blueprint` — authoritative v3 product blueprint and Codex handoff
- `docs/design/approved` — approved concept boards

The imported product blueprint takes precedence over visual boards when they conflict. Imported recipes are private by default, originals remain immutable, and nutrition/remixing stay optional.

## Link-capture acceptance fixture

Use `https://cravekeep.com/samples/lemon-herb-chicken` in Capture Studio to exercise the deterministic extraction success path. Other public URLs deliberately enter a needs-review recovery state until an external extraction provider is selected and connected.

Copy `apps/mobile/.env.example` to `apps/mobile/.env.local` and fill in the Supabase project URL and publishable key. Never place a secret or service-role key in a client environment file.

Open the profile avatar to create an account or sign in. Authenticated recipes are written to the live Supabase project under owner-only row-level security; signed-out recipes remain local to the device.
