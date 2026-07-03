import type { WorkerEnv } from "@/platform/env";
import { Hono } from "hono";

export function createAssetRoutes() {
  const assets = new Hono<{ Bindings: WorkerEnv }>();

  assets.get("/styles/*", (c) => {
    if (!c.env.PUBLIC_ASSETS) {
      return c.notFound();
    }
    return c.env.PUBLIC_ASSETS.fetch(c.req.raw);
  });

  assets.get("/assets/*", (c) => {
    if (!c.env.PUBLIC_ASSETS) {
      return c.notFound();
    }
    return c.env.PUBLIC_ASSETS.fetch(c.req.raw);
  });

  return assets;
}
