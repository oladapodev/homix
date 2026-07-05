import { syncProjectFromGitHub } from "@/api/github";
import { listProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { Hono } from "hono";

export function createSchedulerRoutes() {
  const scheduler = new Hono<{ Bindings: WorkerEnv }>();

  scheduler.post("/api/sync", async (c) => {
    const projects = await listProjects(c.env.DB);
    const results = { synced: 0, failed: 0, errors: [] as string[] };

    for (const project of projects) {
      try {
        const [owner, repo] = project.repo.split("/");
        if (!owner || !repo) {
          results.failed += 1;
          results.errors.push(`Invalid repo format: ${project.repo}`);
          continue;
        }

        const projectId = await syncProjectFromGitHub(
          c.env,
          `${owner}/${repo}`,
        );
        if (projectId) {
          results.synced += 1;
        } else {
          results.failed += 1;
          results.errors.push(`GitHub fetch failed for ${project.repo}`);
        }
      } catch (error) {
        results.failed += 1;
        results.errors.push(
          `Failed to sync ${project.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return c.json(results, 200);
  });

  return scheduler;
}
