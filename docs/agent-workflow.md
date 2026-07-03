# Agent Workflow

Follow `AGENTS.md` first. This page summarizes the docs-specific workflow.

## Main Branch

`main` is the template and documentation branch. Keep docs accurate and avoid building product demos here.

## Demo Branches

Use separate branches for product demos. Do not mix demo app scope into docs-only changes on `main`.

## Docs Changes

When changing documentation:

1. Update the relevant page under `docs/`.
2. Update `docs/.vitepress/config.ts` if navigation changes.
3. Run `bun run docs:build`.
4. Run the normal source checks if code changed.

