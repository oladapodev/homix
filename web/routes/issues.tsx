import { ensureSchema } from "@/db/bootstrap";
import { createIssue, getProjectById, seedProjects } from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { Toast } from "@/web/components/layout";
import { IssueIntakePanel, parseIssueForm } from "@/web/fragments/mira";
import { isHtmx } from "@/web/htmx";
import { Hono } from "hono";

export function createIssueRoutes() {
  const issues = new Hono<{ Bindings: WorkerEnv }>();

  issues.get("/issues", async (c) => c.redirect("/", 302));

  issues.post("/issues", async (c) => {
    await ensureSchema(c.env.DB);
    await seedProjects(c.env.DB);
    const form = await c.req.formData();
    const projectId = String(form.get("projectId") ?? "");
    const project = await getProjectById(c.env.DB, projectId);
    if (!project) {
      return c.text("Unknown project", 422);
    }

    const parsed = parseIssueForm(form);
    if (!parsed.success) {
      return c.html(
        <IssueIntakePanel
          project={project}
          error={parsed.error.issues[0]?.message ?? "Invalid issue"}
        />,
        422,
      );
    }

    await createIssue(c.env.DB, parsed.data);
    if (!isHtmx(c.req.raw.headers)) {
      return c.redirect(`/projects/${project.slug}`, 303);
    }
    return c.html(
      <>
        <IssueIntakePanel project={project} />
        <Toast message="Issue created" />
      </>,
    );
  });

  return issues;
}
