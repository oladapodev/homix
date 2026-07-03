import { describe, expect, it } from "vitest";
import app from "../../worker";

describe("worker routes", () => {
  it("serves OpenAPI JSON", async () => {
    const response = await app.fetch(
      new Request("http://localhost/doc"),
      mockEnv(),
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      info: { title: "Homix API" },
    });
  });

  it("renders the dashboard with the styled app shell", async () => {
    const response = await app.fetch(
      new Request("http://localhost/"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain('class="app-shell"');
    expect(html).toContain('class="dashboard-grid"');
    expect(html).toContain("Mira");
    expect(html).toContain("Kanban board");
    expect(html).toContain("Open-source project tracker");
    expect(html).toContain("Built on Homix");
    expect(html).toContain('href="#board"');
    expect(html).toContain('href="#foundation"');
    expect(html).toContain('href="/styles/generated.css"');
  });

  it("forwards compiled CSS to the static asset binding", async () => {
    const response = await app.fetch(
      new Request("http://localhost/styles/generated.css"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain(".app-shell");
  });

  it("returns htmx validation fragments", async () => {
    const body = new FormData();
    body.set("title", "A");
    body.set("projectId", "mira");
    body.set("status", "todo");
    body.set("priority", "medium");
    body.set("type", "task");
    body.set("assignee", "Ada");
    body.set("labels", "docs");
    const response = await app.fetch(
      new Request("http://localhost/issues", {
        method: "POST",
        body,
        headers: { "HX-Request": "true" },
      }),
      mockEnv(),
    );

    expect(response.status).toBe(422);
    await expect(response.text()).resolves.toContain("alert-error");
  });

  it("creates issues through the htmx fragment route", async () => {
    const env = mockEnv();
    const body = new FormData();
    body.set("title", "Add contribution guide");
    body.set("projectId", "mira");
    body.set("status", "todo");
    body.set("priority", "high");
    body.set("type", "task");
    body.set("assignee", "Ada");
    body.set("labels", "docs,good first issue");

    const response = await app.fetch(
      new Request("http://localhost/issues", {
        method: "POST",
        body,
        headers: { "HX-Request": "true" },
      }),
      env,
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Add contribution guide");
    expect(html).toContain("Issue created");
  });

  it("moves issues across the kanban board through htmx", async () => {
    const env = mockEnv();
    const createBody = new FormData();
    createBody.set("title", "Triage stale bugs");
    createBody.set("projectId", "mira");
    createBody.set("status", "todo");
    createBody.set("priority", "medium");
    createBody.set("type", "bug");
    createBody.set("assignee", "Grace");
    createBody.set("labels", "triage");

    const createResponse = await app.fetch(
      new Request("http://localhost/issues", {
        method: "POST",
        body: createBody,
        headers: { "HX-Request": "true" },
      }),
      env,
    );
    expect(createResponse.status).toBe(200);

    const issue = (env as { __issues: Array<{ id: string }> }).__issues[0];
    if (!issue) {
      throw new Error("Expected created issue in mock env");
    }
    const moveResponse = await app.fetch(
      new Request(`http://localhost/issues/${issue.id}/status`, {
        method: "POST",
        body: new URLSearchParams({ status: "review" }),
        headers: { "HX-Request": "true" },
      }),
      env,
    );

    expect(moveResponse.status).toBe(200);
    const html = await moveResponse.text();
    expect(html).toContain("Triage stale bugs");
    expect(html).toContain("Review");
  });

  it("redirects legacy page routes to single-page anchors", async () => {
    const response = await app.fetch(
      new Request("http://localhost/issues"),
      mockEnv(),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/#board");
  });

  it("redirects plain HTML issue form submissions", async () => {
    const body = new FormData();
    body.set("title", "Fallback form issue");
    body.set("projectId", "mira");
    body.set("status", "todo");
    body.set("priority", "low");
    body.set("type", "task");
    body.set("assignee", "Linus");
    body.set("labels", "fallback");

    const response = await app.fetch(
      new Request("http://localhost/issues", {
        method: "POST",
        body,
      }),
      mockEnv(),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/#board");
  });
});

function mockEnv() {
  const projects: Array<Record<string, unknown>> = [];
  const issues: Array<Record<string, unknown>> = [];
  const db = {
    prepare: (sql: string) => ({
      bind: (...bindings: unknown[]) => ({
        all: async () => {
          if (sql.includes("where slug = ?")) {
            return {
              results: projects.filter(
                (project) => project.slug === bindings[0],
              ),
            };
          }
          if (sql.includes("from projects")) {
            return { results: projects };
          }
          if (sql.includes("from issues")) {
            return { results: issues };
          }
          return { results: [] };
        },
        run: async () => {
          if (sql.startsWith("insert into projects")) {
            projects.unshift({
              id: bindings[0],
              name: bindings[1],
              slug: bindings[2],
              repo: bindings[3],
              stars: bindings[4],
              language: bindings[5],
              status: bindings[6],
              summary: bindings[7],
              createdAt: bindings[8],
            });
          }
          if (sql.startsWith("insert into issues")) {
            issues.unshift({
              id: bindings[0],
              projectId: bindings[1],
              title: bindings[2],
              status: bindings[3],
              priority: bindings[4],
              type: bindings[5],
              assignee: bindings[6],
              labels: bindings[7],
              createdAt: bindings[8],
              updatedAt: bindings[9],
            });
          }
          if (sql.startsWith("update issues")) {
            const issue = issues.find((record) => record.id === bindings[2]);
            if (issue) {
              issue.status = bindings[0];
              issue.updatedAt = bindings[1];
            }
          }
          return { success: true };
        },
      }),
      all: async () => {
        if (sql.includes("from projects")) {
          return { results: projects };
        }
        if (sql.includes("from issues")) {
          return { results: issues };
        }
        return { results: [] };
      },
      run: async () => ({ success: true }),
    }),
  };

  return {
    DB: db,
    PUBLIC_ASSETS: {
      fetch: async () =>
        new Response(".app-shell{display:grid}.dashboard-grid{display:grid}", {
          status: 200,
        }),
    },
    ENVIRONMENT: "local",
    __issues: issues,
  } as never;
}
