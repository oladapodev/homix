import { describe, expect, it } from "vitest";
import { createProjectSchema, slugify } from "../../db/types";

describe("domain schemas", () => {
  it("validates project input", () => {
    const result = createProjectSchema.safeParse({
      name: "Launch Plan",
      status: "active",
      summary: "Ship the first Cloudflare-backed release.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects short names", () => {
    expect(
      createProjectSchema.safeParse({
        name: "A",
        status: "active",
        summary: "",
      }).success,
    ).toBe(false);
  });

  it("creates URL slugs", () => {
    expect(slugify(" Hono + HTMX Template ")).toBe("hono-htmx-template");
  });
});
