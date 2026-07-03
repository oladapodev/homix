export interface WorkerEnv {
  DB: D1Database;
  ASSETS: R2Bucket;
  JOBS: Queue<JobMessage>;
  COUNTER: DurableObjectNamespace;
  PUBLIC_ASSETS?: Fetcher;
  ENVIRONMENT: "local" | "staging" | "production";
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET?: string;
}

export interface JobMessage {
  id: string;
  kind: "demo" | "maintenance";
  payload: Record<string, unknown>;
  createdAt: string;
}

export function isProduction(env: WorkerEnv) {
  return env.ENVIRONMENT === "production";
}
