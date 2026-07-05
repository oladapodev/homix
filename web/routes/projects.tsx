import { syncProjectFromGitHub } from "@/api/github";
import { ensureSchema } from "@/db/bootstrap";
import { seedProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { isHtmx } from "@/web/htmx";
import { Hono } from "hono";

export function createProjectRoutes() {
  const projects = new Hono<{ Bindings: WorkerEnv }>();

  projects.post("/api/projects/add", async (c) => {
    await ensureSchema(c.env.DB);
    await seedProjects(c.env.DB);

    const form = await c.req.formData();
    const repo = String(form.get("repo") ?? "").trim();

    if (!repo || !/^[\w-]+\/[\w.-]+$/.test(repo)) {
      return c.html(
        <span class="text-error">Invalid format — use owner/repo</span>,
        422,
      );
    }

    const projectId = await syncProjectFromGitHub(c.env, repo);
    if (!projectId) {
      return c.html(
        <span class="text-error">
          Could not fetch {repo} from GitHub — check the name and try again
        </span>,
        422,
      );
    }

    if (!isHtmx(c.req.raw.headers)) {
      return c.json({
        success: true,
        projectId,
        message: `Project ${repo} synced.`,
      });
    }

    return c.html(
      <span class="text-success">
        Tracking {repo} —{" "}
        <a href={`/projects/${projectId.toLowerCase()}`} class="link">
          view project
        </a>
      </span>,
    );
  });

  return projects;
}
