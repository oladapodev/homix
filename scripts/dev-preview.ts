import { app } from "@/web/app";

type RecordRow = Record<string, unknown>;
type BunServer = {
  serve(options: {
    port: number;
    fetch: (request: Request) => Response | Promise<Response>;
  }): unknown;
};

declare const Bun: BunServer;

const projects: RecordRow[] = [];
const issues: RecordRow[] = [];

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
  port: 8787,
  fetch: (request) => app.fetch(request, env),
});

console.log("Mira preview ready on http://localhost:8787");

function all(sql: string, bindings: unknown[]) {
  if (sql.includes("where slug = ?")) {
    return {
      results: projects.filter((project) => project.slug === bindings[0]),
    };
  }
  if (sql.includes("from projects")) {
    return { results: projects };
  }
  if (sql.includes("from issues")) {
    return { results: issues };
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
  return { success: true };
}
