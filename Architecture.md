# Hono + HTMX Cloudflare Template Architecture

## Runtime And Tooling

This template is a Bun-first, flat Cloudflare Workers application. Bun handles installs, scripts, tests, and local development. Cloudflare Workers is the production runtime, Hono provides routing and typed JSX rendering, and HTMX keeps the browser interaction model server-driven.

Core versions are pinned in `package.json` and should be refreshed deliberately:

- TypeScript: `5.9.3`
- Hono: `4.12.27`
- htmx: `2.0.10`
- typed-htmx: `0.3.1`
- Tailwind CSS: `4.3.2`
- daisyUI: `5.6.10`
- Alpine.js: `3.15.12`
- Drizzle ORM: `0.44.7`
- Better Auth: `1.6.23`
- Wrangler: `4.107.0`
- Vitest: `3.2.6`

## Folder Shape

The repository is intentionally flat so new contributors can find the runtime surface quickly:

```text
worker.tsx                 Small Cloudflare adapter for fetch, queues, cron, DO exports
wrangler.jsonc             Cloudflare bindings, assets, migrations, queues, cron
api/                       API app, OpenAPI, Scalar, route helpers, validators, middleware
web/                       Hono app, page routes, JSX layouts, fragments, themes, CSS
db/                        D1 bootstrap, Drizzle schema, migrations, repositories, types
services/                  Auth, storage, jobs, integration boundaries
platform/                  Cloudflare binding types, Durable Objects, runtime adapters
public/                    Generated CSS and browser assets served by Workers assets
tests/                     API, web, db, service, and platform tests
scripts/                   Build and asset helper scripts
```

Root-level folders are grouped by application surface instead of by package boundary. Shared behavior stays close to the concept it serves: data code in `db`, browser-facing fragments in `web`, Cloudflare-specific adapters in `platform`, and integration workflows in `services`.

## Request Flow

1. Cloudflare invokes `worker.tsx`.
2. `worker.tsx` delegates fetches to `web/app.tsx`.
3. `web/app.tsx` attaches logging and security middleware.
4. Full-page routes render typed JSX pages from `web/pages`.
5. HTMX routes in `web/routes` return focused fragments from `web/fragments`.
6. API routes are mounted from `api/api.ts` and expose JSON endpoints plus OpenAPI metadata.
7. Background work runs through Cloudflare Queues and scheduled cron handlers in `services/jobs.ts`.
8. Durable Objects handle strongly consistent per-id state demos from `platform/durable.ts`.

HTMX is the default interaction layer. Alpine is reserved for browser-only islands such as theme previews, local dropdown state, and controls that do not own server state.

## Cloudflare Bindings

`wrangler.jsonc` defines local-first bindings:

- `DB`: D1 database for app data and Better Auth tables.
- `ASSETS`: R2 bucket for uploaded files.
- `JOBS`: Queue producer and consumer binding.
- `COUNTER`: Durable Object namespace for the counter demo.
- `PUBLIC_ASSETS`: Workers assets binding for `public/`.
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`: runtime environment values.
- Cron trigger: runs maintenance tasks every 15 minutes.

Generated Worker binding types live in `platform/worker-configuration.d.ts`.

## Data Model

Drizzle schema lives in `db/schema.ts`, with D1 SQL migrations in `db/migrations`.

Tables cover:

- Better Auth-compatible `user`, `session`, `account`, and `verification` records.
- `projects`: demo project records.
- `files`: uploaded R2 object metadata.
- `jobs`: queue and cron job audit records.

Runtime demo data is seeded through `worker.tsx` when the local database is empty.

## Type Safety Strategy

- Hono owns typed route composition at the Worker boundary.
- Shared validation uses Zod schemas from `db/types.ts`.
- OpenAPI routes are declared with `@hono/zod-openapi`.
- HTMX attributes are wrapped by `web/htmx.ts` so JSX props stay predictable.
- Cloudflare bindings are typed through `platform/env.ts` and generated Wrangler declarations.
- Route, fragment, data, and service tests live under `tests/` beside the surfaces they validate.

## UI System

The UI uses server-rendered JSX, Tailwind v4, daisyUI v5, htmx, and small Alpine islands. The showroom exposes daisyUI component categories as local examples so teams can validate theme coverage without leaving the app.

Routes:

- `/`: dashboard shell.
- `/projects`: CRUD demo with HTMX form validation and fragment swaps.
- `/files`: R2 upload form and file list.
- `/jobs`: Queue and cron status demo.
- `/counter/:id`: Durable Object state demo.
- `/showroom`: daisyUI component index.
- `/showroom/:component`: component example page.
- `/doc`: OpenAPI JSON.
- `/reference`: Scalar API reference.

## Operational Boundaries

Cloudflare-specific code is isolated in `worker.tsx`, `wrangler.jsonc`, and `platform/`. Route composition belongs in `web/app.tsx` and `api/api.ts`; new routes should not be added directly to `worker.tsx`. Domain data, schemas, UI fragments, and service functions remain portable enough to reuse in future adapters without rebuilding the whole app shape.
