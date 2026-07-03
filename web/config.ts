export const appConfig = {
  name: "Homix",
  description: "Hono, HTMX, daisyUI, and Cloudflare full-stack template",
  nav: [
    { href: "#projects", label: "Projects" },
    { href: "#theme", label: "Theme" },
    { href: "#files", label: "Files" },
    { href: "#jobs", label: "Jobs" },
    { href: "#api", label: "API" },
    { href: "#components", label: "Components" },
  ],
} as const;

export const queueNames = {
  jobs: "homix-jobs",
} as const;
