import { createApiRoutes } from "@/api/api";
import { ensureSchema } from "@/db/bootstrap";
import { listIssues, listProjects, seedProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { isHtmx } from "@/web/htmx";
import { DashboardPage } from "@/web/pages/dashboard";
import { createAssetRoutes } from "@/web/routes/assets";
import { createIssueRoutes } from "@/web/routes/issues";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

export function createWebApp() {
  const app = new Hono<{ Bindings: WorkerEnv }>();
  const { api, docs } = createApiRoutes();

  app.use("*", logger());
  app.use("*", secureHeaders());
  app.route("/", api);
  app.route("/", docs);
  app.route("/", createAssetRoutes());
  app.route("/", createIssueRoutes());

  app.get("/", async (c) => {
    await ensureSchema(c.env.DB);
    await seedProjects(c.env.DB);
    const [projects, issues] = await Promise.all([
      listProjects(c.env.DB),
      listIssues(c.env.DB),
    ]);

    return c.html(<DashboardPage projects={projects} issues={issues} />);
  });

  app.onError((error, c) => {
    console.error(error);
    if (isHtmx(c.req.raw.headers)) {
      return c.html(<div class="alert alert-error">Request failed</div>, 500);
    }
    return c.text("Internal Server Error", 500);
  });

  return app;
}

export const app = createWebApp();
export type AppType = typeof app;
