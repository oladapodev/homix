import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("compiled app css", () => {
  it("contains design system styles needed for the first viewport", () => {
    const css = readFileSync("public/styles/generated.css", "utf8");

    expect(css).toContain(".badge-soft");
    expect(css).toContain(".btn-primary");
    expect(css).toContain(".timeline-fade");
    expect(css).toContain("--color-primary");
  });

  it("uses real local htmx, Alpine, and gsap builds", () => {
    const htmx = readFileSync("public/assets/htmx.min.js", "utf8");
    const alpine = readFileSync("public/assets/alpine.min.js", "utf8");
    const gsap = readFileSync("public/assets/gsap.min.js", "utf8");

    expect(htmx).toContain("htmx");
    expect(htmx).not.toContain('import "https://');
    expect(alpine).toContain("Alpine");
    expect(alpine).not.toContain('import "https://');
    expect(gsap).toContain("gsap");
    expect(gsap).not.toContain('import "https://');
  });
});
