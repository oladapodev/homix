import { appConfig } from "@/web/config";
import type { FC, PropsWithChildren } from "hono/jsx";

export const Layout: FC<PropsWithChildren<{ title?: string }>> = ({
  title,
  children,
}) => (
  <html lang="en" data-theme="corporate">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title ? `${title} - ${appConfig.name}` : appConfig.name}</title>
      <link rel="stylesheet" href="/styles/generated.css" />
      <script src="/assets/htmx.min.js" defer />
      <script src="/assets/alpine.min.js" defer />
    </head>
    <body
      class="app-body"
      x-data="{ theme: 'corporate' }"
      x-init="theme = localStorage.getItem('homix-theme') || 'corporate'; $watch('theme', value => { document.documentElement.dataset.theme = value; localStorage.setItem('homix-theme', value) }); document.documentElement.dataset.theme = theme"
    >
      <div class="app-shell">
        <input id="nav-drawer" type="checkbox" class="nav-toggle" />
        <aside class="app-sidebar">
          <nav class="sidebar-panel">
            <a class="brand-link" href="/">
              <span class="brand-mark">H</span>
              <span>{appConfig.name}</span>
            </a>
            <ul class="sidebar-nav">
              {appConfig.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main class="app-main">
          <Header />
          <section class="content-shell">{children}</section>
        </main>
      </div>
    </body>
  </html>
);

export const Header: FC = () => (
  <header class="topbar">
    <div class="mobile-menu">
      <label for="nav-drawer" class="icon-button" aria-label="open sidebar">
        <span class="text-lg">=</span>
      </label>
    </div>
    <div class="topbar-title">
      <span>Open-source project command center</span>
    </div>
    <div class="theme-switcher">
      <button type="button" x-on:click="theme = 'corporate'">
        Corporate
      </button>
      <button type="button" x-on:click="theme = 'emerald'">
        Emerald
      </button>
      <button type="button" x-on:click="theme = 'dark'">
        Dark
      </button>
    </div>
    <div>
      <a class="btn btn-sm btn-primary" href="/reference">
        Docs
      </a>
    </div>
  </header>
);

export const PageTitle: FC<PropsWithChildren<{ eyebrow?: string }>> = ({
  eyebrow,
  children,
}) => (
  <div class="page-title">
    {eyebrow ? <p class="page-eyebrow">{eyebrow}</p> : null}
    <h1>{children}</h1>
  </div>
);

export const Stat: FC<{
  label: string;
  value: string | number;
  detail?: string;
}> = ({ label, value, detail }) => (
  <div class="metric-card">
    <div class="metric-label">{label}</div>
    <div class="metric-value">{value}</div>
    {detail ? <div class="metric-detail">{detail}</div> : null}
  </div>
);

export const Toast: FC<{ message: string }> = ({ message }) => (
  <div id="toast" hx-swap-oob="true" class="toast toast-end">
    <div class="alert alert-success">
      <span>{message}</span>
    </div>
  </div>
);
