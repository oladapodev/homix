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

  it("renders the landing page", async () => {
    const response = await app.fetch(
      new Request("http://localhost/"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Mira");
    expect(html).toContain("Track open-source projects");
    expect(html).toContain('href="/projects/mira-core"');
  });

  it("renders a project dashboard page", async () => {
    const response = await app.fetch(
      new Request("http://localhost/projects/mira-core"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Mira Core");
    expect(html).toContain("Issues");
    expect(html).toContain("Pull Requests");
  });

  it("renders issues tab by default", async () => {
    const response = await app.fetch(
      new Request("http://localhost/projects/mira-core"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Issues");
  });

  it("renders board tab", async () => {
    const response = await app.fetch(
      new Request("http://localhost/projects/mira-core?tab=board"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("kanban-board");
    expect(html).toContain("Backlog");
  });

  it("renders activity tab", async () => {
    const response = await app.fetch(
      new Request("http://localhost/projects/mira-core?tab=activity"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Activity");
  });

  it("renders pull requests tab", async () => {
    const response = await app.fetch(
      new Request("http://localhost/projects/mira-core?tab=prs"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Pull Requests");
  });

  it("forwards compiled CSS to the static asset binding", async () => {
    const response = await app.fetch(
      new Request("http://localhost/styles/generated.css"),
      mockEnv(),
    );

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain("--color-primary");
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
    expect(html).toContain("Issue created");
    expect(html).toContain('id="issue-intake"');

    const board = await app.fetch(
      new Request("http://localhost/projects/mira-core?tab=board"),
      env,
    );
    await expect(board.text()).resolves.toContain("Add contribution guide");
  });

  it("redirects legacy issue routes to the landing page", async () => {
    const response = await app.fetch(
      new Request("http://localhost/issues"),
      mockEnv(),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/");
  });

  it("redirects plain HTML issue form submissions to the project page", async () => {
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
    expect(response.headers.get("location")).toBe("/projects/mira-core");
  });
});

function mockEnv() {
  const projects: Array<Record<string, unknown>> = [];
  const issues: Array<Record<string, unknown>> = [];
  const pullRequests: Array<Record<string, unknown>> = [];
  const issueLinks: Array<Record<string, unknown>> = [];
  const activityEvents: Array<Record<string, unknown>> = [];
  const commits: Array<Record<string, unknown>> = [];

  function selectAll(sql: string, bindings: unknown[]) {
    if (sql.includes("where slug = ?")) {
      return {
        results: projects.filter((project) => project.slug === bindings[0]),
      };
    }
    if (sql.includes("where id = ?") && sql.includes("from projects")) {
      return {
        results: projects.filter((project) => project.id === bindings[0]),
      };
    }
    if (sql.includes("from projects")) {
      return { results: projects };
    }
    if (sql.includes("from issues")) {
      return { results: issues };
    }
    if (sql.includes("from pull_requests")) {
      return { results: pullRequests };
    }
    if (sql.includes("from issue_links")) {
      return { results: issueLinks };
    }
    if (sql.includes("from activity_events")) {
      return { results: activityEvents };
    }
    if (sql.includes("from commits")) {
      return { results: commits };
    }
    return { results: [] };
  }

  function run(sql: string, bindings: unknown[]) {
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
    if (sql.startsWith("insert into pull_requests")) {
      pullRequests.unshift({
        id: bindings[0],
        projectId: bindings[1],
        number: bindings[2],
        title: bindings[3],
        state: bindings[4],
        author: bindings[5],
        createdAt: bindings[6],
        mergedAt: bindings[7],
      });
    }
    if (sql.startsWith("insert into issue_links")) {
      issueLinks.unshift({
        id: bindings[0],
        issueId: bindings[1],
        pullRequestId: bindings[2],
        linkType: bindings[3],
        createdAt: bindings[4],
      });
    }
    if (sql.startsWith("insert into activity_events")) {
      activityEvents.unshift({
        id: bindings[0],
        projectId: bindings[1],
        entityType: bindings[2],
        entityId: bindings[3],
        verb: bindings[4],
        actor: bindings[5],
        summary: bindings[6],
        createdAt: bindings[7],
      });
    }
    if (sql.startsWith("insert into commits")) {
      commits.unshift({
        id: bindings[0],
        pullRequestId: bindings[1],
        projectId: bindings[2],
        sha: bindings[3],
        message: bindings[4],
        author: bindings[5],
        createdAt: bindings[6],
      });
    }
    return { success: true };
  }

  const db = {
    prepare: (sql: string) => ({
      bind: (...bindings: unknown[]) => ({
        all: async () => selectAll(sql, bindings),
        run: async () => run(sql, bindings),
      }),
      all: async () => selectAll(sql, []),
      run: async () => run(sql, []),
    }),
  };

  return {
    DB: db,
    PUBLIC_ASSETS: {
      fetch: async () =>
        new Response(".app-shell{display:grid}:root{--color-primary:#000}", {
          status: 200,
        }),
    },
    ENVIRONMENT: "local",
    __issues: issues,
  } as never;
}
