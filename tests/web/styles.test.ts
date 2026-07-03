import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("compiled app css", () => {
  it("contains shell styles needed for the first viewport", () => {
    const css = readFileSync("public/styles/generated.css", "utf8");

    expect(css).toContain(".app-shell");
    expect(css).toContain(".app-sidebar");
    expect(css).toContain(".dashboard-grid");
    expect(css).toContain(".metric-card");
    expect(css).toContain("var(--color-primary)");
  });

  it("uses real local htmx and Alpine builds", () => {
    const htmx = readFileSync("public/assets/htmx.min.js", "utf8");
    const alpine = readFileSync("public/assets/alpine.min.js", "utf8");

    expect(htmx).toContain("htmx");
    expect(htmx).not.toContain('import "https://');
    expect(alpine).toContain("Alpine");
    expect(alpine).not.toContain('import "https://');
  });
});
