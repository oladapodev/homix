import type { WorkerEnv } from "@/platform/env";
import { Hono } from "hono";

export function createPlatformRoutes() {
  const platform = new Hono<{ Bindings: WorkerEnv }>();

  platform.get("/showroom", (c) => c.redirect("/#components", 302));
  platform.get("/showroom/:slug", (c) => c.redirect("/#components", 302));

  platform.get("/counter/:id", (c) => {
    const id = c.env.COUNTER.idFromName(c.req.param("id"));
    const object = c.env.COUNTER.get(id);
    return cloneMutable(object.fetch(c.req.raw));
  });

  platform.post("/counter/:id", (c) => {
    const id = c.env.COUNTER.idFromName(c.req.param("id"));
    const object = c.env.COUNTER.get(id);
    return cloneMutable(object.fetch(c.req.raw));
  });

  return platform;
}

async function cloneMutable(response: Promise<Response>) {
  const original = await response;
  return new Response(original.body, original);
}
