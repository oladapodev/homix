# Agent Architecture Guide

This project is a flat Hono + HTMX Cloudflare Workers template. Keep the flat shape, but preserve clear ownership between runtime adapter, route composition, UI, data, services, and platform bindings.

## Runtime Entry

`worker.tsx` is only the Cloudflare adapter. It should stay small and only export:

- `default.fetch` from `web/app.tsx`
- Queue consumer handlers from `services/jobs.ts`
- Cron handlers from `services/jobs.ts`
- Durable Object classes from `platform/durable.ts`

Do not add application routes, JSX pages, API handlers, database queries, or business workflows directly to `worker.tsx`.

## API Layer

Use `api/api.ts` as the API unifier. It creates the API Hono/OpenAPI app and returns the docs routes that `web/app.tsx` mounts.

Add API code here:

- `api/routes/`: concrete API route modules, such as `health.ts`
- `api/openapi.ts`: OpenAPI route declarations and Scalar setup
- `api/validators/`: request/response validators when they are API-specific
- `api/middleware/`: API-only middleware

Keep API route modules focused on HTTP concerns. Put durable workflows, storage calls, and data access behind `services/` or `db/`.

## Web Layer

Use `web/app.tsx` as the main Hono web app composer. It owns middleware, route mounting, error handling, and the root dashboard route.

Add web code here:

- `web/pages/`: full-page JSX screens
- `web/routes/`: web and HTMX route groups
- `web/fragments/`: server-rendered fragments swapped by HTMX
- `web/components/`: reusable JSX components
- `web/showroom/`: local component catalog data
- `web/themes/`: theme definitions and theme documentation
- `web/styles/`: Tailwind and app CSS entry files

Do not mix route handlers into fragments. Fragments should render UI. Routes should parse requests, call services/repositories, and return pages or fragments.

## Documentation Layer

Use `docs/` for the VitePress documentation site. On `main`, docs are the primary project experience. Keep product demos and task applications out of `docs/` unless they explain how the template works.

Add documentation code here:

- `docs/.vitepress/config.ts`: VitePress navigation and site configuration
- `docs/index.md`: documentation landing page
- `docs/layers/`: architecture and ownership guides for each source layer
- `docs/testing.md`: verification workflow
- `docs/deployment.md`: deploy workflow

When adding or moving docs pages, update `docs/.vitepress/config.ts` and run `bun run docs:build`.

## Data Layer

Use `db/` for D1 and shared data contracts:

- `db/schema.ts`: Drizzle schema
- `db/bootstrap.ts`: local runtime schema bootstrap
- `db/migrations/`: SQL migrations for D1
- `db/repositories.ts`: D1 query helpers
- `db/types.ts`: shared Zod schemas and TypeScript types

When adding a table, update schema, bootstrap SQL, migration SQL, repository helpers, and tests together.

## Services Layer

Use `services/` for workflows that are not purely HTTP or rendering:

- `services/auth.ts`: auth configuration
- `services/jobs.ts`: queue and cron workflows
- `services/storage.ts`: storage boundary helpers

Payment providers are not implemented by default. Add a future provider as a clearly named service module, route module, env binding, schema change, and test set.

## Platform Layer

Use `platform/` for Cloudflare runtime bindings and platform-specific adapters:

- `platform/env.ts`: Worker binding types
- `platform/durable.ts`: Durable Object classes

Keep platform code narrow. Application behavior should be in `web/`, `api/`, `services/`, or `db/`.

## Tests

Use `tests/` grouped by surface:

- `tests/web/`: web app routes, HTMX fragments, CSS asset behavior
- `tests/api/`: API route behavior
- `tests/db/`: schema and domain validation
- `tests/platform/`: Durable Objects and binding adapters

Add tests near the surface changed. For route moves, keep behavior tests stable while updating imports.

## Verification

Prefer the local Bun binary:

```bash
/home/dev/.bun/bin/bun run build:assets
/home/dev/.bun/bin/bun run build:css
/home/dev/.bun/bin/bun run lint
/home/dev/.bun/bin/bun run typecheck
/home/dev/.bun/bin/bun run test
/home/dev/.bun/bin/bun run docs:build
```

Run Wrangler checks when the local runtime allows them to exit cleanly:

```bash
/home/dev/.bun/bin/bun run cf:types:check
/home/dev/.bun/bin/bun run cf:dry-run
```
