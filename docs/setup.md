# Setup

## Prerequisites

- Bun 1.2 or newer.
- Node.js 20 or newer for VitePress and Wrangler CLI compatibility.
- A Cloudflare account when creating real D1, R2, Queue, and Durable Object resources.

## Install

```bash
bun install
```

## Documentation

```bash
bun run docs:dev
bun run docs:build
bun run docs:preview
```

The docs source lives in `docs/`. VitePress uses `docs/.vitepress/config.ts` for navigation and build settings.

## Worker Development

```bash
bun run build:assets
bun run build:css
bun run dev
```

`bun run dev` starts the Cloudflare Worker with Wrangler on port `8787`. The sample dashboard is intentionally small; it exists to verify the template wiring, not to be an application.

## Verification

```bash
bun run format
bun run lint
bun run typecheck
bun run test
bun run docs:build
```

Run Wrangler dry-run checks when the local Wrangler runtime exits cleanly:

```bash
bun run cf:types:check
bun run cf:dry-run
```

