import { ensureSchema } from "@/db/bootstrap";
import { listJobs } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { enqueueDemoJob } from "@/services/jobs";
import { JobPanel } from "@/web/fragments/jobs";
import { isHtmx } from "@/web/htmx";
import { Hono } from "hono";

export function createJobRoutes() {
  const jobs = new Hono<{ Bindings: WorkerEnv }>();

  jobs.get("/jobs", async (c) => c.redirect("/#jobs", 302));

  jobs.post("/jobs", async (c) => {
    await ensureSchema(c.env.DB);
    await enqueueDemoJob(c.env);
    if (!isHtmx(c.req.raw.headers)) {
      return c.redirect("/#jobs", 303);
    }
    return c.html(<JobPanel jobs={await listJobs(c.env.DB)} />);
  });

  return jobs;
}
