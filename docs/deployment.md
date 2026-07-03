# Deployment

## Worker

Generate binding types and run a dry-run deploy before publishing:

```bash
bun run cf:types
bun run cf:dry-run
```

Deploy with Wrangler after real Cloudflare resource IDs are configured in `wrangler.jsonc`.

## Documentation

Build the VitePress site:

```bash
bun run docs:build
```

The generated output is `docs/.vitepress/dist`. Host it with any static hosting target, including Cloudflare Pages.

## CI

CI should install with Bun, then run lint, typecheck, tests, docs build, CSS build, and Wrangler dry-run checks when credentials/configuration are available.

