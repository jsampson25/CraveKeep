# CraveKeep

CraveKeep is a mobile-first home for recipes captured from anywhere. This repository currently implements the first vertical slice: create a manual recipe, keep it in a local library, favorite and organize it, then follow it in Cook Mode.

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

## Repository

- `apps/mobile` — Expo Router mobile application
- `packages/domain` — platform-neutral recipe rules and types
- `docs/product-blueprint` — authoritative v3 product blueprint and Codex handoff
- `docs/design/approved` — approved concept boards

The imported product blueprint takes precedence over visual boards when they conflict. Imported recipes are private by default, originals remain immutable, and nutrition/remixing stay optional.
