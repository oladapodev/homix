import { scalarReference } from "@/api/openapi";
import type { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";

export function createDocsRoutes(api: OpenAPIHono) {
  const docs = new Hono();

  docs.get("/doc", (c) =>
    c.json(
      api.getOpenAPI31Document({
        openapi: "3.1.0",
        info: {
          title: "Homix API",
          version: "0.1.0",
        },
      }),
    ),
  );
  docs.get("/reference", scalarReference());

  return docs;
}
