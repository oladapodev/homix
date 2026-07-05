import { createApiRoutes } from "@/api/api";
import { ensureSchema } from "@/db/bootstrap";
import {
  getProjectBySlug,
  listActivityEvents,
  listIssueLinks,
  listIssues,
  listProjects,
  listPullRequests,
  seedProjects,
} from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { isHtmx } from "@/web/htmx";
import { IndexPage } from "@/web/pages/index";
import { ProjectDashboardPage } from "@/web/pages/project-dashboard";
import { createAssetRoutes } from "@/web/routes/assets";
import { createIssueRoutes } from "@/web/routes/issues";
import { createProjectRoutes } from "@/web/routes/projects";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";

async function loadMiraData(env: WorkerEnv) {
  await ensureSchema(env.DB);
  await seedProjects(env.DB);
  const [projects, issues, pullRequests, issueLinks, activity] =
    await Promise.all([
      listProjects(env.DB),
      listIssues(env.DB),
      listPullRequests(env.DB),
      listIssueLinks(env.DB),
      listActivityEvents(env.DB),
    ]);
  return { projects, issues, pullRequests, issueLinks, activity };
}

export function createWebApp() {
  const app = new Hono<{ Bindings: WorkerEnv }>();
  const { api, docs } = createApiRoutes();

  app.use("*", logger());
  app.use("*", secureHeaders());
  app.route("/", api);
  app.route("/", docs);
  app.route("/", createAssetRoutes());
  app.route("/", createIssueRoutes());
  app.route("/", createProjectRoutes());

  app.get("/", async (c) => {
    const { projects, issues, pullRequests } = await loadMiraData(c.env);
    return c.html(
      <IndexPage
        projects={projects}
        issues={issues}
        pullRequests={pullRequests}
      />,
    );
  });

  app.get("/projects/:slug", async (c) => {
    await ensureSchema(c.env.DB);
    await seedProjects(c.env.DB);
    const project = await getProjectBySlug(c.env.DB, c.req.param("slug"));
    if (!project) return c.text("Project not found", 404);

    const { issues, pullRequests, issueLinks, activity } = await loadMiraData(
      c.env,
    );
    const tab = new URL(c.req.url).searchParams.get("tab") ?? "issues";

    return c.html(
      <ProjectDashboardPage
        project={project}
        issues={issues.filter((i) => i.projectId === project.id)}
        pullRequests={pullRequests.filter((p) => p.projectId === project.id)}
        issueLinks={issueLinks}
        activity={activity.filter((e) => e.projectId === project.id)}
        activeTab={tab}
      />,
    );
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
