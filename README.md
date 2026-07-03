# Homix

Hono + HTMX + Cloudflare Workers template with VitePress documentation.

The primary experience on `main` is the documentation site in `docs/`. The
Worker dashboard is a small smoke surface for local verification, not a product
demo.

## Run

```bash
bun install
bun run docs:dev
```

Open the VitePress site at `http://localhost:5173`.

## Worker Smoke App

```bash
bun run build:assets
bun run build:css
bun run dev
```

Open the Worker at `http://localhost:8787`.

## Documentation Map

- `docs/index.md`: docs landing page.
- `docs/architecture.md`: runtime and request flow.
- `docs/folder-ownership.md`: folder boundaries.
- `docs/layers/`: web, HTMX, API, DB, services, and Cloudflare binding guides.
- `docs/testing.md`: verification strategy.
- `docs/deployment.md`: Worker and docs deployment.

## Verification

```bash
bun run format
bun run lint
bun run typecheck
bun run test
bun run docs:build
```

## Source Code Map

- `worker.tsx`: small Cloudflare adapter for fetch, queue, cron, and Durable Object exports.
- `api/`: API app unifier, OpenAPI registry, Scalar docs route, route helpers, validators, and middleware.
- `web/`: Hono app composition, page routes, server-rendered JSX components, HTMX fragments, showroom data, themes, and app CSS.
- `db/`: D1 schema bootstrap, Drizzle schema, migrations, repositories, and shared data types.
- `services/`: auth, storage, and background job service logic.
- `platform/`: Cloudflare binding types, Durable Objects, and runtime adapters.
- `public/`: generated CSS and vendored browser assets.
- `tests/`: route, fragment, service, data, and platform tests grouped by surface.

Start with `web/app.tsx`; it shows how the application routes connect. Use
`worker.tsx` only for Cloudflare runtime exports.
