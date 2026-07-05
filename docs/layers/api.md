# API Layer

The API layer is separate from the browser page surface.

## Key Files

- `api/api.ts`: creates and returns the API Hono app.
- `api/openapi.ts`: OpenAPI/Scalar setup.
- `api/routes/health.ts`: health route example.
- `api/routes/docs.ts`: docs/reference route wiring.

## OpenAPI

Use `@hono/zod-openapi` for typed route declarations. JSON routes should describe request and response schemas with Zod so `/doc` and Scalar stay accurate.

## Browser Integration

The browser-facing app may link to `/reference`, but web routes should not depend on Scalar. Keep API docs optional from the page flow.

