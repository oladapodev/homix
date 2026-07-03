import { ensureSchema } from "@/db/bootstrap";
import { listFiles, recordFile } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { FileList } from "@/web/fragments/files";
import { isHtmx } from "@/web/htmx";
import { Hono } from "hono";

export function createFileRoutes() {
  const files = new Hono<{ Bindings: WorkerEnv }>();

  files.get("/files", async (c) => c.redirect("/#files", 302));

  files.post("/files", async (c) => {
    await ensureSchema(c.env.DB);
    const form = await c.req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return c.text("Missing file", 422);
    }
    const key = `${crypto.randomUUID()}-${file.name}`;
    await c.env.ASSETS.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "application/octet-stream" },
    });
    await recordFile(c.env.DB, {
      key,
      filename: file.name,
      contentType: file.type || "application/octet-stream",
      size: file.size,
    });
    if (!isHtmx(c.req.raw.headers)) {
      return c.redirect("/#files", 303);
    }
    return c.html(<FileList files={await listFiles(c.env.DB)} />);
  });

  files.get("/files/:key{.+}", async (c) => {
    const object = await c.env.ASSETS.get(c.req.param("key"));
    if (!object) {
      return c.notFound();
    }
    return new Response(object.body, {
      headers: {
        "content-type":
          object.httpMetadata?.contentType ?? "application/octet-stream",
      },
    });
  });

  return files;
}
