import { healthRoute } from "@/api/openapi";
import { OpenAPIHono } from "@hono/zod-openapi";

export function createHealthApi() {
  const app = new OpenAPIHono();
  app.openapi(healthRoute, (c) => c.json({ ok: true, service: "homix" }));
  return app;
}
