import { createDocsRoutes } from "@/api/routes/docs";
import { createHealthApi } from "@/api/routes/health";
import { OpenAPIHono } from "@hono/zod-openapi";

export function createApiApp() {
  const api = new OpenAPIHono();
  api.route("/", createHealthApi());
  return api;
}

export function createApiRoutes() {
  const api = createApiApp();
  return {
    api,
    docs: createDocsRoutes(api),
  };
}
