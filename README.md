# Mira

Mira is the demo app for Homix: a compact open-source project tracker inspired by Jira, focused on repositories, issues, kanban movement, and API consumers.

## Run

```bash
/home/dev/.bun/bin/bun install
/home/dev/.bun/bin/bun run build:assets
/home/dev/.bun/bin/bun run build:css
/home/dev/.bun/bin/bun run dev:preview
```

Open `http://localhost:8787`.

`dev:preview` runs the real Hono app with local in-memory bindings so the demo works even when `wrangler dev` hangs in this environment.

## What Mira Shows

- Open-source repositories with repo path, language, status, and star count.
- Issues with status, priority, type, assignee, and labels.
- A kanban board with HTMX create and move actions.
- Alpine-powered local issue filtering.
- D1-backed repository and issue persistence.
- OpenAPI routes for `/api/projects` and `/api/issues`.
- Scalar API docs at `/reference`.

## Built On Homix

Mira is built on the Homix stack:

- Hono
- HTMX
- Alpine
- daisyUI
- Cloudflare Workers
- D1
- Zod OpenAPI
- Scalar

## Verification

```bash
/home/dev/.bun/bin/bun run build:assets
/home/dev/.bun/bin/bun run build:css
/home/dev/.bun/bin/bun run lint
/home/dev/.bun/bin/bun run typecheck
/home/dev/.bun/bin/bun run test
```
