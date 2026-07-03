import { issuesRoute, projectsRoute } from "@/api/openapi";
import { ensureSchema } from "@/db/bootstrap";
import { listIssues, listProjects, seedProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { OpenAPIHono } from "@hono/zod-openapi";

export function createMiraApi() {
  const app = new OpenAPIHono<{ Bindings: WorkerEnv }>();

  app.openapi(projectsRoute, async (c) => {
    await ensureSchema(c.env.DB);
    await seedProjects(c.env.DB);
    return c.json({ projects: await listProjects(c.env.DB) });
  });

  app.openapi(issuesRoute, async (c) => {
    await ensureSchema(c.env.DB);
    await seedProjects(c.env.DB);
    return c.json({ issues: await listIssues(c.env.DB) });
  });

  return app;
}
