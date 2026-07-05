import { syncProjectFromGitHub } from "@/api/github";
import { listProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { Hono } from "hono";

export function createSchedulerRoutes() {
  const scheduler = new Hono<{ Bindings: WorkerEnv & { trigger?: { cron: string } } }>();

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

        await syncProjectFromGitHub(c.env, `${owner}/${repo}`);
        results.synced += 1;
      } catch (error) {
        results.failed += 1;
        results.errors.push(
          `Failed to sync ${project.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    return c.json(results, 200);
  });

  scheduler.on("scheduled", async (event, env: WorkerEnv) => {
    try {
      const projects = await listProjects(env.DB);
      let synced = 0;
      let failed = 0;

      for (const project of projects) {
        try {
          const [owner, repo] = project.repo.split("/");
          if (!owner || !repo) {
            failed += 1;
            continue;
          }

          await syncProjectFromGitHub(env, `${owner}/${repo}`);
          synced += 1;
        } catch {
          failed += 1;
        }
      }

      console.log(`Scheduled sync: ${synced} synced, ${failed} failed`);
    } catch (error) {
      console.error("Scheduled sync failed:", error);
    }
  });

  return scheduler;
}
