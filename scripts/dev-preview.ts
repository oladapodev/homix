import { app } from "@/web/app";

type RecordRow = Record<string, unknown>;
type BunServer = {
  env: Record<string, string | undefined>;
  serve(options: {
    port: number;
    fetch: (request: Request) => Response | Promise<Response>;
  }): unknown;
};

declare const Bun: BunServer;

const projects: RecordRow[] = [];
const issues: RecordRow[] = [];
const pullRequests: RecordRow[] = [];
const issueLinks: RecordRow[] = [];
const activityEvents: RecordRow[] = [];
const commits: RecordRow[] = [];

const db = {
  prepare: (sql: string) => ({
    bind: (...bindings: unknown[]) => ({
      all: async () => all(sql, bindings),
      run: async () => run(sql, bindings),
    }),
    all: async () => all(sql, []),
    run: async () => run(sql, []),
  }),
} as D1Database;

const port = Number(Bun.env.PORT ?? 8917);

const env = {
  DB: db,
  PUBLIC_ASSETS: {
    fetch: (request: Request) => {
      const url = new URL(request.url);
      return fetch(new URL(`../public${url.pathname}`, import.meta.url));
    },
  },
  ENVIRONMENT: "local",
} as never;

Bun.serve({
  port,
  fetch: (request) => app.fetch(request, env),
});

console.log(`Mira preview ready on http://localhost:${port}`);

function all(sql: string, bindings: unknown[]) {
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
