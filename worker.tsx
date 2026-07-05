import type { WorkerEnv } from "@/platform/env";
import { app } from "@/web/app";

export default {
  fetch: (request: Request, env: WorkerEnv, ctx?: ExecutionContext) =>
    app.fetch(request, env, ctx),
  scheduled: async (
    _event: ScheduledEvent,
    env: WorkerEnv,
    _ctx: ExecutionContext,
  ) => {
    try {
      const response = await app.fetch(
        new Request("http://localhost/api/sync", { method: "POST" }),
        env,
      );
      const result = await response.json();
      console.log("Scheduled sync completed:", result);
    } catch (error) {
      console.error("Scheduled sync failed:", error);
    }
  },
};
