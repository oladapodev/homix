# Web Layer

The web layer is a Hono JSX application. It renders full pages and HTMX fragments from the same Cloudflare Worker.

## Key Files

- `web/app.tsx`: route composition, middleware, API mounting, static assets, and error handling.
- `web/pages/dashboard.tsx`: sample page used to exercise the template.
- `web/components/layout.tsx`: shared HTML shell.
- `web/routes/*.tsx`: route handlers that parse requests and call data/services.
- `web/fragments/*.tsx`: small JSX fragments returned to HTMX.

## Rules

- Routes parse requests and choose responses.
- Fragments only render UI.
- Pages compose fragments and components.
- Do not put D1 SQL or Cloudflare binding logic in JSX components.

## Dashboard Scope

The dashboard on `main` is a smoke surface. Keep it small enough to prove the template works. Build real product experiences on feature branches.

