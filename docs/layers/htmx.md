# HTMX Patterns

HTMX keeps the frontend server-driven. The Worker returns HTML fragments for targeted swaps instead of shipping a large client application.

## Form Pattern

```tsx
<form method="post" action="/projects" hx-post="/projects" hx-target="#project-list" hx-swap="outerHTML">
  ...
</form>
```

Always include normal `method` and `action` attributes so the form has a browser fallback.

## Response Pattern

- Return status `422` with an error fragment for validation failures.
- Return a focused fragment for successful HTMX requests.
- Redirect non-HTMX form submissions back to a stable page or anchor.
- Use out-of-band swaps for counters, toasts, and aggregate totals.

## Testing

Route tests should send `HX-Request: true` and assert the returned fragment contains the updated UI.

