# Cloudflare Bindings

Bindings are declared in `wrangler.jsonc` and typed in `platform/env.ts`.

## Current Bindings

- `DB`: D1 database.
- `ASSETS`: R2 bucket for file uploads.
- `JOBS`: Queue producer binding.
- `COUNTER`: Durable Object namespace.
- `PUBLIC_ASSETS`: static asset binding for compiled CSS and browser assets.

## Events

`worker.tsx` exports:

- `fetch`: Hono web app.
- `queue`: Queue consumer.
- `scheduled`: Cron handler.
- `CounterDurableObject`: Durable Object class.

## Local Development

Wrangler simulates bindings locally. D1 schema bootstrap exists for local development, but production should use migrations.

