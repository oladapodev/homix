import type { WorkerEnv } from "@/platform/env";
import { app } from "@/web/app";

export default {
  fetch: (request: Request, env: WorkerEnv, ctx?: ExecutionContext) =>
    app.fetch(request, env, ctx),
};
