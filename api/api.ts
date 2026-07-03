import { createDocsRoutes } from "@/api/routes/docs";
import { createHealthApi } from "@/api/routes/health";
import { createMiraApi } from "@/api/routes/mira";
import { OpenAPIHono } from "@hono/zod-openapi";

export function createApiApp() {
  const api = new OpenAPIHono();
  api.route("/", createHealthApi());
  api.route("/", createMiraApi());
  return api;
}

export function createApiRoutes() {
  const api = createApiApp();
  return {
    api,
    docs: createDocsRoutes(api),
  };
}
