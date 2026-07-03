# Services Layer

Services own workflows that are not just request parsing or rendering.

## Current Services

- `services/auth.ts`: Better Auth configuration boundary.
- `services/jobs.ts`: Queue producer/consumer and cron handling.
- `services/storage.ts`: R2 object helper boundary.

## When To Add A Service

Add a service when behavior crosses multiple concerns, such as:

- writing D1 rows and sending a queue message;
- verifying a webhook and persisting an audit event;
- storing an R2 object and recording metadata;
- composing auth/session behavior for routes.

Keep service functions small and testable.

