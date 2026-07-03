# Architecture

Homix keeps a flat source tree with clear ownership boundaries. The Cloudflare Worker is the runtime adapter; web routes, API routes, data access, services, and platform bindings live in separate top-level folders.

## Request Flow

1. `worker.tsx` receives the Cloudflare request.
2. `web/app.tsx` composes middleware, static asset routes, web routes, API routes, and error handling.
3. Full-page requests render JSX pages from `web/pages/`.
4. HTMX interactions post to `web/routes/` and receive fragments from `web/fragments/`.
5. API requests are mounted from `api/api.ts` and documented through OpenAPI/Scalar.
6. Data operations go through `db/repositories.ts`.
7. Cloudflare-specific workflows use `platform/` and `services/`.

## Runtime Principles

- Keep `worker.tsx` small.
- Keep JSX fragments free of request parsing.
- Keep D1 SQL in repository helpers.
- Keep Cloudflare bindings typed in `platform/env.ts`.
- Keep app workflows in services when they are not purely HTTP concerns.

## Documentation First On Main

The `main` branch should explain the template. Product demos or task apps belong on separate branches, such as `demo`.

