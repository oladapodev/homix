import { ensureSchema } from "@/db/bootstrap";
import {
  createIssue,
  listIssues,
  listProjects,
  updateIssueStatus,
} from "@/db/repositories";
import type { WorkerEnv } from "@/platform/env";
import { enqueueDemoJob } from "@/services/jobs";
import { Toast } from "@/web/components/layout";
import {
  IssueForm,
  KanbanBoard,
  parseIssueForm,
  parseIssueStatus,
} from "@/web/fragments/mira";
import { isHtmx } from "@/web/htmx";
import { Hono } from "hono";

export function createIssueRoutes() {
  const issues = new Hono<{ Bindings: WorkerEnv }>();

  issues.get("/issues", async (c) => c.redirect("/#board", 302));

  issues.post("/issues", async (c) => {
    await ensureSchema(c.env.DB);
    const projects = await listProjects(c.env.DB);
    const parsed = parseIssueForm(await c.req.formData());
    if (!parsed.success) {
      return c.html(
        <IssueForm
          projects={projects}
          error={parsed.error.issues[0]?.message ?? "Invalid issue"}
        />,
        422,
      );
    }

    await createIssue(c.env.DB, parsed.data);
    await enqueueDemoJob(c.env, "issue-created");
    if (!isHtmx(c.req.raw.headers)) {
      return c.redirect("/#board", 303);
    }
    const records = await listIssues(c.env.DB);
    return c.html(
      <>
        <KanbanBoard issues={records} projects={projects} />
        <Toast message="Issue created" />
      </>,
    );
  });

  issues.post("/issues/:id/status", async (c) => {
    await ensureSchema(c.env.DB);
    const parsed = parseIssueStatus(await c.req.formData());
    if (!parsed.success) {
      return c.text("Invalid status", 422);
    }
    await updateIssueStatus(c.env.DB, c.req.param("id"), parsed.data);
    await enqueueDemoJob(c.env, "issue-moved");
    const [records, projects] = await Promise.all([
      listIssues(c.env.DB),
      listProjects(c.env.DB),
    ]);
    if (!isHtmx(c.req.raw.headers)) {
      return c.redirect("/#board", 303);
    }
    return c.html(<KanbanBoard issues={records} projects={projects} />);
  });

  return issues;
}
