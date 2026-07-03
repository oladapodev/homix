# Homix

Single-page Cloudflare Worker demo using Hono, HTMX, Alpine, daisyUI,
D1, R2, Queues, Durable Objects, OpenAPI, and Scalar.

## Run

```bash
bun install
bun run dev
```

Open `http://localhost:8787`.

## What The Page Shows

- `Projects`: Hono JSX renders the form; HTMX posts to `/projects` and swaps the project list.
- `Theme`: Alpine switches daisyUI themes and local island state.
- `Files`: R2 upload flow with D1 metadata.
- `Jobs`: Queue producer demo with job audit rows.
- `API`: `/api/health`, `/doc`, and Scalar at `/reference`.
- `Components`: local daisyUI component catalog summary.

The UI is one page. Supporting endpoints still exist because HTMX, API docs,
uploads, queues, assets, and Durable Object demos need server routes.

## Code Map

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
