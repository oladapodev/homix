import { describe, expect, it } from "vitest";
import {
  createIssueSchema,
  createProjectSchema,
  slugify,
} from "../../db/types";

describe("domain schemas", () => {
  it("validates project input", () => {
    const result = createProjectSchema.safeParse({
      name: "Launch Plan",
      repo: "open-mira/mira",
      stars: 18420,
      language: "TypeScript",
      status: "active",
      summary: "Ship the first Cloudflare-backed release.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short names", () => {
    expect(
      createProjectSchema.safeParse({
        name: "A",
        repo: "broken",
        stars: -1,
        language: "",
        status: "active",
        summary: "",
      }).success,
    ).toBe(false);
  });

  it("validates issue input", () => {
    const result = createIssueSchema.safeParse({
      projectId: "mira",
      title: "Add good first issue filters",
      status: "todo",
      priority: "medium",
      type: "feature",
      assignee: "Ada",
      labels: "ui,contributors",
    });

    expect(result.success).toBe(true);
  });

  it("creates URL slugs", () => {
    expect(slugify(" Hono + HTMX Template ")).toBe("hono-htmx-template");
  });
});
