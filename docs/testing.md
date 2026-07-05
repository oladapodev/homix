# Testing

Tests are grouped by surface.

## Commands

```bash
bun run lint
bun run typecheck
bun run test
bun run docs:build
```

## Web Tests

Use `tests/web/` for:

- full page rendering;
- HTMX fragment behavior;
- fallback redirects;
- static asset forwarding;
- generated CSS and local browser assets.

## DB Tests

Use `tests/db/` for Zod/domain validation and repository behavior.

## API Tests

Add `tests/api/` when JSON APIs grow beyond the health route.

## Docs Tests

`bun run docs:build` must pass before docs changes are considered complete.

