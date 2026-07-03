import { CounterDurableObject } from "@/platform/durable";
import type { WorkerEnv } from "@/platform/env";
import { processCron, processQueue } from "@/services/jobs";
import { app } from "@/web/app";

export { CounterDurableObject };

export default {
  fetch: app.fetch,
  queue: processQueue,
  scheduled: (_event: ScheduledEvent, env: WorkerEnv) => processCron(env),
};
