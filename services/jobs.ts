import { ensureSchema } from "@/db/bootstrap";
import { recordJob } from "@/db/repositories";
import { nowIso } from "@/db/types";
import type { JobMessage, WorkerEnv } from "@/platform/env";

export async function enqueueDemoJob(env: WorkerEnv, source = "htmx-form") {
  await ensureSchema(env.DB);
  const message: JobMessage = {
    id: crypto.randomUUID(),
    kind: "demo",
    payload: { source },
    createdAt: nowIso(),
  };
  await env.JOBS.send(message);
  await recordJob(env.DB, {
    kind: "queue",
    status: "queued",
    payload: JSON.stringify(message),
  });
  return message;
}

export async function processQueue(
  batch: MessageBatch<JobMessage>,
  env: WorkerEnv,
) {
  await ensureSchema(env.DB);
  for (const message of batch.messages) {
    await recordJob(env.DB, {
      kind: "queue",
      status: "processed",
      payload: JSON.stringify(message.body),
    });
    message.ack();
  }
}

export async function processCron(env: WorkerEnv) {
  await ensureSchema(env.DB);
  await recordJob(env.DB, {
    kind: "cron",
    status: "processed",
    payload: JSON.stringify({ source: "scheduled", processedAt: nowIso() }),
  });
}
