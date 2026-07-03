import { ensureSchema } from "@/db/bootstrap";
import { createProject, listProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { Toast } from "@/web/components/layout";
import {
  ProjectForm,
  ProjectList,
  parseProjectForm,
} from "@/web/fragments/projects";
import { isHtmx } from "@/web/htmx";
import { Hono } from "hono";

export function createProjectRoutes() {
  const projects = new Hono<{ Bindings: WorkerEnv }>();

  projects.get("/projects", async (c) => c.redirect("/#projects", 302));

  projects.post("/projects", async (c) => {
    const parsed = parseProjectForm(await c.req.formData());
    if (!parsed.success) {
      return c.html(
        <ProjectForm
          error={parsed.error.issues[0]?.message ?? "Invalid project"}
        />,
        422,
      );
    }

    await ensureSchema(c.env.DB);
    await createProject(c.env.DB, parsed.data);
    const records = await listProjects(c.env.DB);
    if (!isHtmx(c.req.raw.headers)) {
      return c.redirect("/#projects", 303);
    }
    return c.html(
      <>
        <ProjectList projects={records} />
        <Toast message="Project created" />
      </>,
    );
  });

  return projects;
}
