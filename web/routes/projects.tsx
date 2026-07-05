import { syncProjectFromGitHub } from "@/api/github";
import { ensureSchema } from "@/db/bootstrap";
import { seedProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { Toast } from "@/web/components/layout";
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
        <div class="text-xs text-error">Invalid format. Use owner/repo</div>,
        400,
      );
    }

    const projectId = await syncProjectFromGitHub(c.env, repo);
    if (!projectId) {
      return c.html(
        <div class="text-xs text-error">Failed to fetch repo from GitHub</div>,
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
      <>
        <form hx-post="/api/projects/add" hx-swap="innerHTML">
          <input
            type="text"
            name="repo"
            placeholder="owner/repo"
            class="input input-bordered input-sm flex-1"
          />
          <button type="submit" class="btn btn-primary btn-sm">
            Add
          </button>
        </form>
        <Toast message={`Added ${repo}. Syncing...`} />
      </>,
    );
  });

  return projects;
}
