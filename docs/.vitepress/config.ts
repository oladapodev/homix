import { defineConfig } from "vitepress";

export default defineConfig({
  title: "Homix",
  description: "Hono, HTMX, and Cloudflare Workers template documentation",
  base: "/homix/",
  cleanUrls: true,
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.svg",
    search: {
      provider: "local",
    },
    nav: [
      { text: "Guide", link: "/setup" },
      { text: "Architecture", link: "/architecture" },
      { text: "Deployment", link: "/deployment" },
    ],
    sidebar: [
      {
        text: "Start",
        items: [
          { text: "Overview", link: "/" },
          { text: "Setup", link: "/setup" },
          { text: "Architecture", link: "/architecture" },
          { text: "Folder Ownership", link: "/folder-ownership" },
        ],
      },
      {
        text: "Layers",
        items: [
          { text: "Web Layer", link: "/layers/web" },
          { text: "HTMX Patterns", link: "/layers/htmx" },
          { text: "API Layer", link: "/layers/api" },
          { text: "Database Layer", link: "/layers/db" },
          { text: "Services Layer", link: "/layers/services" },
          { text: "Cloudflare Bindings", link: "/layers/cloudflare" },
        ],
      },
      {
        text: "Operations",
        items: [
          { text: "Testing", link: "/testing" },
          { text: "Deployment", link: "/deployment" },
          { text: "Agent Workflow", link: "/agent-workflow" },
        ],
      },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/oladapodev/homix" },
    ],
  },
});
