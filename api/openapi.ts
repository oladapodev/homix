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

export const projectsRoute = createRoute({
  method: "get",
  path: "/api/projects",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            projects: z.array(
              z.object({
                id: z.string(),
                name: z.string(),
                repo: z.string(),
                stars: z.number(),
                language: z.string(),
                status: z.string(),
              }),
            ),
          }),
        },
      },
      description: "Tracked open-source repositories",
    },
  },
});

export const issuesRoute = createRoute({
  method: "get",
  path: "/api/issues",
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            issues: z.array(
              z.object({
                id: z.string(),
                projectId: z.string(),
                title: z.string(),
                status: z.string(),
                priority: z.string(),
                type: z.string(),
                assignee: z.string(),
              }),
            ),
          }),
        },
      },
      description: "Mira issue board records",
    },
  },
});
