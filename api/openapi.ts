import { createRoute, z } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";

export function scalarReference() {
  return apiReference({
    theme: "saturn",
    url: "/doc",
  });
}

export const healthRoute = createRoute({
  method: "get",
  path: "/api/health",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({ ok: z.boolean(), service: z.string() }),
        },
      },
      description: "Health check",
    },
  },
});
