# Route Split And Payments Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove provider-specific payment callback scaffolding completely and split the oversized Worker entry into clear API, web, platform, and service modules.

**Architecture:** `worker.tsx` becomes a small Cloudflare adapter. `web/app.tsx` composes the main Hono app, `api/api.ts` owns API and docs routes, `web/pages/dashboard.tsx` owns the dashboard JSX, and `web/routes/*` owns web/HTMX route groups.

**Tech Stack:** Bun, Hono, Hono JSX, HTMX, Cloudflare Workers, D1, R2, Queues, Durable Objects, Zod OpenAPI, Scalar.

---

### Task 1: Remove Provider-Specific Payment Callback Scaffolding

**Files:**
- Delete: the provider-specific callback service file
- Delete: the provider-specific callback test file
- Modify: `worker.tsx`
- Modify: `platform/env.ts`
- Modify: `db/types.ts`
- Modify: `db/schema.ts`
- Modify: `db/bootstrap.ts`
- Modify: `db/migrations/0001_initial.sql`
- Modify: `db/repositories.ts`
- Modify: `wrangler.jsonc`
- Modify: docs files

- [x] Remove all provider-specific payment callback route, env, schema, repository, and test code.
- [x] Keep payments as an integration slot only; do not add Paystack code yet.

### Task 2: Split Worker App

**Files:**
- Create: `api/api.ts`
- Create: `api/routes/health.ts`
- Create: `api/routes/docs.ts`
- Create: `web/app.tsx`
- Create: `web/pages/dashboard.tsx`
- Create: `web/routes/assets.ts`
- Create: `web/routes/projects.tsx`
- Create: `web/routes/files.tsx`
- Create: `web/routes/jobs.tsx`
- Create: `web/routes/platform.ts`
- Modify: `api/openapi.ts`
- Modify: `worker.tsx`
- Modify: `tests/web/worker.test.tsx`

- [x] Move API health/docs into `api/`.
- [x] Move web routes into `web/routes/`.
- [x] Move dashboard JSX into `web/pages/dashboard.tsx`.
- [x] Keep `worker.tsx` focused on Cloudflare exports.

### Task 3: Document Agent Architecture

**Files:**
- Create: `AGENTS.md`
- Modify: `README.md`
- Modify: `Architecture.md`
- Modify: `Plan.md`
- Modify: `Tasks.md`

- [x] Document where future agents should add routes, pages, services, DB code, and platform bindings.
- [x] Explicitly forbid dumping app routes into `worker.tsx`.

### Task 4: Verify

**Files:**
- Run commands only.

- [x] Run `/home/dev/.bun/bin/bun run format`.
- [x] Run `/home/dev/.bun/bin/bun run build:assets`.
- [x] Run `/home/dev/.bun/bin/bun run build:css`.
- [x] Run `/home/dev/.bun/bin/bun run lint`.
- [x] Run `/home/dev/.bun/bin/bun run typecheck`.
- [x] Run `/home/dev/.bun/bin/bun run test`.
