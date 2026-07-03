# Database Layer

D1 is the default relational store. Drizzle defines table shape and repository helpers own queries.

## Key Files

- `db/schema.ts`: Drizzle schema.
- `db/bootstrap.ts`: idempotent local schema creation.
- `db/migrations/0001_initial.sql`: D1 migration SQL.
- `db/repositories.ts`: query helpers.
- `db/types.ts`: Zod schemas and shared TypeScript types.

## Change Checklist

When adding or changing a table:

1. Update `db/schema.ts`.
2. Update `db/bootstrap.ts`.
3. Add or update a migration in `db/migrations/`.
4. Update repository helpers.
5. Add tests under `tests/db/` or the route surface that uses the table.

## Runtime Rule

Do not call `env.DB.prepare()` from JSX components. Keep SQL in repositories.

