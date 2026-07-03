export const appConfig = {
  name: "Mira",
  description: "Open-source project tracking demo for the Homix template",
  nav: [
    { href: "#board", label: "Board" },
    { href: "#new-issue", label: "New Issue" },
    { href: "#repositories", label: "Repos" },
    { href: "#files", label: "Files" },
    { href: "#jobs", label: "Jobs" },
    { href: "#api", label: "API" },
    { href: "#theme", label: "Theme" },
    { href: "#components", label: "Components" },
  ],
} as const;

export const queueNames = {
  jobs: "homix-jobs",
} as const;
