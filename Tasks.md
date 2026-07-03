# Hono + HTMX Cloudflare Template Tasks

## Contract

- [x] Create `Architecture.md` with runtime, workspace, bindings, data flow, UI, and type-safety decisions.
- [x] Create `Plan.md` with implementation strategy and verification approach.
- [x] Create `Tasks.md` with small ordered build steps.

## Workspace

- [x] Create root `package.json`, `tsconfig.json`, `biome.json`, and `.gitignore`.
- [x] Create flat root folders: `api`, `web`, `db`, `services`, `platform`, `public`, and `tests`.
- [x] Add root scripts for lint, typecheck, test, CSS build, Wrangler dry run, and generated type checks.
- [x] Refactor away from nested `apps`, `features`, and `packages` workspaces.

## Cloudflare App

- [x] Add root `wrangler.jsonc`.
- [x] Add Hono Worker entry at `worker.tsx`.
- [x] Add Worker env typing in `platform`.
- [x] Add Durable Object counter demo.
- [x] Add Queue and Cron handlers.

## UI And HTMX

- [x] Add Tailwind v4 and daisyUI CSS entry.
- [x] Add server-rendered JSX layout and components.
- [x] Add typed HTMX helper attributes.
- [x] Add Alpine island script.
- [x] Add showroom list for 68 daisyUI component categories.

## Features

- [x] Add auth feature with Better Auth configuration.
- [x] Add projects CRUD demo and validation.
- [x] Add R2 file upload demo.
- [x] Add jobs feature and audit model.
- [x] Leave payments as an integration slot without a built-in provider.
- [x] Add OpenAPI JSON and Scalar reference.

## Database

- [x] Add Drizzle schema in `db/schema.ts`.
- [x] Add D1 SQL migration at `db/migrations/0001_initial.sql`.
- [x] Add repository helpers for projects, files, and jobs.

## Tests

- [x] Add Vitest config.
- [x] Add domain validation tests.
- [x] Add HTMX fragment tests.
- [x] Add Durable Object state tests.

## Verification

- [x] Run `/home/dev/.bun/bin/bun install`.
- [x] Run `/home/dev/.bun/bin/bun run lint`.
- [x] Run `/home/dev/.bun/bin/bun run typecheck`.
- [x] Run `/home/dev/.bun/bin/bun run test`.
- [x] Run `/home/dev/.bun/bin/bun run build:css`.
- [ ] Run `/home/dev/.bun/bin/bun run test:vitest` in CI or a runtime where Vitest exits cleanly.
- [ ] Run `/home/dev/.bun/bin/bun run cf:types:check` in CI or a runtime where Wrangler exits cleanly.
- [ ] Run `/home/dev/.bun/bin/bun run cf:dry-run` in CI or a runtime where Wrangler exits cleanly.

## Commit Points

- [ ] Commit docs contract.
- [ ] Commit workspace scaffold.
- [ ] Commit feature implementation.
- [ ] Commit tests and CI.
