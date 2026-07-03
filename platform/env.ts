export interface WorkerEnv {
  DB: D1Database;
  PUBLIC_ASSETS?: Fetcher;
  ENVIRONMENT: "local" | "staging" | "production";
}

export function isProduction(env: WorkerEnv) {
  return env.ENVIRONMENT === "production";
}
