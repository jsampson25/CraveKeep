# Architecture decisions

## Accepted foundation

- Mobile: Expo SDK 57, React Native, Expo Router, TypeScript.
- Web companion: planned Next.js application after the mobile magic loop is stable.
- API: planned Fastify modular monolith with typed contracts.
- Data: planned PostgreSQL with Supabase Auth and Storage; local mobile data uses a repository boundary so the current AsyncStorage implementation can move to SQLite and cloud sync without changing screens.
- Providers: OCR, transcription, extraction, nutrition, and AI integrations will sit behind replaceable adapters.
- Billing: RevenueCat for app-store entitlements when the subscription slice begins.
- Quality: ESLint, TypeScript, Vitest, and later Maestro end-to-end tests.

## First slice boundary

The first milestone deliberately proves the manual recipe outcome without pretending cloud services are connected. Local persistence is real; authentication, server authorization, synchronization, import jobs, nutrition, and subscription behavior remain explicit future slices.

## Product invariants

- Recipes are private by default.
- An imported original is never silently overwritten.
- Source attribution remains attached.
- AI and nutrition output must expose uncertainty.
- The primary navigation is Home, Recipes, Capture, Plan, and Groceries. Profile is accessed through the header avatar.
