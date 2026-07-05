# Folder Ownership

## Root Files

- `worker.tsx`: Cloudflare Worker adapter and exported handlers.
- `wrangler.jsonc`: Cloudflare runtime configuration and bindings.
- `package.json`: Bun scripts for Worker, docs, checks, and deployment.
- `AGENTS.md`: rules for future coding agents.

## `web/`

Owns the browser-facing app surface.

- `web/app.tsx`: Hono web app composition.
- `web/pages/`: full-page JSX screens.
- `web/routes/`: browser and HTMX route handlers.
- `web/fragments/`: server-rendered fragments.
- `web/components/`: reusable layout and UI components.
- `web/styles/`: Tailwind/daisyUI CSS entry.

## `api/`

Owns JSON API routes, OpenAPI registration, and Scalar docs wiring.

## `db/`

Owns D1 schema, SQL bootstrap, migrations, repositories, and shared Zod contracts.

## `services/`

Owns workflows that cross HTTP, data, and platform concerns.

## `platform/`

Owns Cloudflare-specific binding types and Durable Object classes.

## `docs/`

Owns the VitePress documentation site. Keep product demo content out of this folder unless it explains template usage.

