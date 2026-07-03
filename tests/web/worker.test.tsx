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
    expect(html).toContain("Project board");
    expect(html).toContain("Theme island");
    expect(html).toContain("API contract");
    expect(html).toContain('href="#projects"');
    expect(html).toContain('href="#api"');
    expect(html).toContain('x-on:click="theme = &#39;dark&#39;"');
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
    body.set("name", "A");
    body.set("status", "active");
    body.set("summary", "");
    const response = await app.fetch(
      new Request("http://localhost/projects", {
        method: "POST",
        body,
        headers: { "HX-Request": "true" },
      }),
      mockEnv(),
    );

    expect(response.status).toBe(422);
    await expect(response.text()).resolves.toContain("alert-error");
  });

  it("creates projects through the htmx fragment route", async () => {
    const env = mockEnv();
    const body = new FormData();
    body.set("name", "Client Portal");
    body.set("status", "active");
    body.set("summary", "A typed HTMX route updates this list.");

    const response = await app.fetch(
      new Request("http://localhost/projects", {
        method: "POST",
        body,
        headers: { "HX-Request": "true" },
      }),
      env,
    );

    expect(response.status).toBe(200);
    const html = await response.text();
    expect(html).toContain("Client Portal");
    expect(html).toContain("Project created");
  });

  it("allows duplicate project names by generating unique slugs", async () => {
    const env = mockEnv();

    for (let index = 0; index < 2; index += 1) {
      const body = new FormData();
      body.set("name", "Client Portal");
      body.set("status", "active");
      body.set("summary", `Duplicate submit ${index}`);

      const response = await app.fetch(
        new Request("http://localhost/projects", {
          method: "POST",
          body,
          headers: { "HX-Request": "true" },
        }),
        env,
      );

      expect(response.status).toBe(200);
    }
  });

  it("redirects legacy page routes to single-page anchors", async () => {
    const response = await app.fetch(
      new Request("http://localhost/projects"),
      mockEnv(),
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe("/#projects");
  });

  it("redirects plain HTML project form submissions", async () => {
    const body = new FormData();
    body.set("name", "Fallback Form");
    body.set("status", "planning");
    body.set("summary", "Works without htmx.");

    const response = await app.fetch(
      new Request("http://localhost/projects", {
        method: "POST",
        body,
      }),
      mockEnv(),
    );

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe("/#projects");
  });
});

function mockEnv() {
  const projects: Array<Record<string, unknown>> = [];
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
          return { results: [] };
        },
        run: async () => {
          if (sql.startsWith("insert into projects")) {
            projects.unshift({
              id: bindings[0],
              name: bindings[1],
              slug: bindings[2],
              status: bindings[3],
              summary: bindings[4],
              createdAt: bindings[5],
            });
          }
          return { success: true };
        },
      }),
      all: async () => {
        if (sql.includes("from projects")) {
          return { results: projects };
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
    ASSETS: {
      put: async () => undefined,
      get: async () => null,
    },
    JOBS: {
      send: async () => undefined,
    },
    COUNTER: {
      idFromName: (name: string) => name,
      get: () => ({ fetch: async () => new Response("Count 0") }),
    },
    ENVIRONMENT: "local",
    BETTER_AUTH_URL: "http://localhost:8787",
  } as never;
}
