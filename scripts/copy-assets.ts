import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));

mkdirSync(join(root, "public/assets"), { recursive: true });

copyFileSync(
  join(root, "node_modules/htmx.org/dist/htmx.min.js"),
  join(root, "public/assets/htmx.min.js"),
);
copyFileSync(
  join(root, "node_modules/alpinejs/dist/cdn.min.js"),
  join(root, "public/assets/alpine.min.js"),
);
copyFileSync(
  join(root, "node_modules/gsap/dist/gsap.min.js"),
  join(root, "public/assets/gsap.min.js"),
);
