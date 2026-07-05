import { syncProjectFromGitHub } from "@/api/github";
import type { WorkerEnv } from "@/platform/env";
import { z } from "zod";
import { Hono } from "hono";

const addProjectSchema = z.object({
  repo: z.string().min(1, "Repo required").regex(/^[\w-]+\/[\w.-]+$/, "Format: owner/repo"),
});

export function createProjectsApi() {
  const api = new Hono<{ Bindings: WorkerEnv }>();

  api.post("/projects/add", async (c) => {
    const body = await c.req.json().catch(() => ({}));
    const parsed = addProjectSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          error: parsed.error.errors[0]?.message || "Invalid input",
        },
        400,
      );
    }

    const projectId = await syncProjectFromGitHub(c.env, parsed.data.repo);
    if (!projectId) {
      return c.json({ error: "Failed to fetch repo from GitHub" }, 422);
    }

    return c.json({
      success: true,
      projectId,
      message: `Project ${parsed.data.repo} synced. Check back in a moment.`,
    });
  });

  return api;
}
