# Hono + HTMX Cloudflare Template Plan

## Build Strategy

1. Keep the project flat around root-level application surfaces: `api`, `web`, `db`, `services`, `platform`, `public`, and `tests`.
2. Use `worker.tsx` as a small Cloudflare Worker adapter for fetch, Queue consumers, Cron, and Durable Object exports.
3. Use `web/app.tsx` as the main Hono app composer for web routes, API mounting, middleware, and error handling.
4. Use `api/api.ts` as the API unifier for OpenAPI routes and API documentation routes.
5. Use Tailwind v4, daisyUI v5, htmx, typed HTMX helpers, and small Alpine islands for the UI layer.
6. Keep reusable JSX in `web/components`, page-level JSX in `web/pages`, server-swapped pieces in `web/fragments`, and daisyUI showroom/theme material in `web/showroom` and `web/themes`.
7. Keep schema, migrations, repositories, and shared data validation in `db`.
8. Keep integration workflows in `services`: auth, storage, and jobs.
9. Keep Cloudflare-only adapters in `platform`.
10. Verify with Bun scripts for lint, typecheck, tests, CSS build, asset copy, Wrangler types, and dry-run deployment where the local runtime allows it.

## App Shell

`worker.tsx` exports:

- `default.fetch` through `web/app.tsx`.
- `queue` for Cloudflare Queue consumers.
- `scheduled` for cron triggers.
- `CounterDurableObject` for stateful demos.

`worker.tsx` must not own application routes. `web/app.tsx` composes web routes and mounts `api/api.ts`.

## HTMX Patterns

- Use `hx-get`, `hx-post`, `hx-target`, `hx-swap`, and `hx-trigger` for server interactions.
- Return validation errors as fragments with status `422`.
- Use out-of-band swaps for counters, toasts, and list totals.
- Use polling only for job status and mark polling targets clearly.
- Keep Alpine islands small and state-local.

## UI Showroom

`web/showroom/components.ts` lists daisyUI component categories and example snippets. The showroom validates that theme, controls, cards, data displays, feedback states, navigation, mockups, and layout components are represented locally.

## Auth

`services/auth.ts` exposes Better Auth configuration. The default template includes email/password-ready configuration, D1 persistence, and placeholder social provider slots. Secrets are provided through Cloudflare environment variables.

## Database

`db/schema.ts` owns the Drizzle schema, `db/repositories.ts` owns data access, and `db/migrations/0001_initial.sql` mirrors the schema for D1. Seed data is generated at runtime for demos.

## Files

`web/fragments/files.tsx` renders upload/list fragments. `services/storage.ts` defines the storage boundary. File metadata is stored in D1 and objects are stored in R2.

## Jobs

`services/jobs.ts` demonstrates:

- Queue producer route support.
- Queue consumer handler.
- Cron maintenance handler.
- Job audit rows in D1.

`web/fragments/jobs.tsx` renders the dashboard panel for those records.

## API Docs

`api/openapi.ts` owns OpenAPI route declarations, `api/routes/health.ts` implements the health route, `api/routes/docs.ts` renders `/doc` and `/reference`, and `api/api.ts` unifies the API surface for mounting.

## CI And Deployment

Expected verification commands:

```bash
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test
bun run build:assets
bun run build:css
bun run cf:types:check
bun run cf:dry-run
```

Deployment uses Wrangler. `wrangler.jsonc` includes local bindings and Cloudflare resource placeholders that teams can replace without changing application code.
