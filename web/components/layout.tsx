import {
  IconActivity,
  IconBell,
  IconHome,
  IconMenu,
  IconPalette,
  IconSearch,
  IconSparkle,
} from "@/web/components/icons";
import { appConfig } from "@/web/config";
import type { FC, PropsWithChildren } from "hono/jsx";

type NavKey = "home" | "activity";

const navIcon: Record<NavKey, typeof IconHome> = {
  home: IconHome,
  activity: IconActivity,
};

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "corporate", label: "Corporate" },
  { value: "emerald", label: "Emerald" },
  { value: "nord", label: "Nord" },
  { value: "cupcake", label: "Cupcake" },
  { value: "synthwave", label: "Synthwave" },
  { value: "dracula", label: "Dracula" },
  { value: "winter", label: "Winter" },
] as const;

export const Layout: FC<PropsWithChildren<{ title?: string }>> = ({
  title,
  children,
}) => (
  <html lang="en" data-theme="corporate">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{title ? `${title} - ${appConfig.name}` : appConfig.name}</title>
      <meta name="description" content={appConfig.description} />
      <link rel="stylesheet" href="/styles/generated.css" />
      <script src="/assets/htmx.min.js" defer />
      <script src="/assets/alpine.min.js" defer />
      <script src="/assets/gsap.min.js" defer />
      <script src="/assets/mira.js" defer />
    </head>
    <body class="min-h-screen bg-base-200 text-base-content">{children}</body>
  </html>
);

export const ThemePicker: FC<{ class?: string }> = ({ class: className }) => (
  <div class={`dropdown dropdown-end ${className ?? ""}`}>
    <button
      type="button"
      tabindex={0}
      class="btn btn-ghost btn-xs gap-1.5 px-2 text-base-content/55"
      aria-label="change theme"
    >
      <IconPalette class="h-4 w-4" />
    </button>
    <ul
      tabindex={0}
      class="dropdown-content menu z-30 mt-2 w-44 gap-0.5 rounded-lg border border-base-300 bg-base-100 p-1.5 shadow-lg"
    >
      {themes.map((theme) => (
        <li key={theme.value}>
          <label class="flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm">
            <input
              type="radio"
              name="mira-theme"
              class="theme-controller radio radio-xs"
              value={theme.value}
              checked={theme.value === "corporate"}
            />
            {theme.label}
          </label>
        </li>
      ))}
    </ul>
  </div>
);

export const AppShell: FC<
  PropsWithChildren<{ title: string; active?: NavKey }>
> = ({ title, active = "home", children }) => (
  <Layout title={title}>
    <div class="mx-auto flex min-h-screen w-full max-w-[1440px]">
      <input id="nav-drawer" type="checkbox" class="peer hidden" />
      <aside class="fixed inset-y-0 left-0 z-30 w-60 -translate-x-full border-r border-base-300 bg-base-200 transition-transform duration-200 peer-checked:translate-x-0 lg:static lg:shrink-0 lg:translate-x-0">
        <nav class="sticky top-0 flex h-screen flex-col gap-5 p-3">
          <a class="flex items-center gap-2 px-1.5 pt-1" href="/">
            <span class="grid h-6 w-6 place-items-center rounded-md bg-primary text-primary-content">
              <IconSparkle class="h-3.5 w-3.5" />
            </span>
            <span class="text-sm font-bold tracking-tight">
              {appConfig.name}
            </span>
          </a>
          <ul class="flex flex-1 flex-col gap-0.5">
            {appConfig.nav.map((item) => {
              const Icon = navIcon[item.icon];
              const isActive = item.icon === active;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    class={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition ${
                      isActive
                        ? "bg-base-300/80 font-semibold text-base-content"
                        : "font-medium text-base-content/55 hover:bg-base-300/50 hover:text-base-content"
                    }`}
                  >
                    <Icon class="h-4 w-4" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="/reference"
            class="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-base-content/40 transition hover:bg-base-300/50 hover:text-base-content"
          >
            API reference
          </a>
        </nav>
      </aside>
      <label
        for="nav-drawer"
        class="fixed inset-0 z-20 hidden bg-black/40 peer-checked:block lg:!hidden"
      >
        <span class="sr-only">Close menu</span>
      </label>
      <main class="min-w-0 flex-1">
        <Header />
        <section class="mx-auto w-[min(100%-2rem,68rem)] py-6">
          {children}
        </section>
      </main>
    </div>
  </Layout>
);

export const Header: FC = () => (
  <header class="sticky top-0 z-10 flex h-13 items-center gap-3 border-b border-base-300 bg-base-100 px-4">
    <label
      for="nav-drawer"
      class="btn btn-circle btn-ghost btn-xs lg:hidden"
      aria-label="open sidebar"
    >
      <IconMenu class="h-4 w-4" />
    </label>
    <button
      type="button"
      class="flex w-56 items-center gap-2 rounded-md border border-base-300 bg-base-100 px-2.5 py-1.5 text-left text-sm text-base-content/40 transition hover:border-base-content/20"
    >
      <IconSearch class="h-3.5 w-3.5" />
      <span class="flex-1">Search…</span>
      <kbd class="kbd kbd-xs">⌘K</kbd>
    </button>
    <div class="flex flex-1 items-center justify-end gap-0.5">
      <button type="button" class="btn btn-circle btn-ghost btn-xs">
        <IconBell class="h-4 w-4 text-base-content/55" />
      </button>
      <ThemePicker />
      <a
        class="btn btn-ghost btn-xs px-2 text-base-content/55"
        href="/reference"
      >
        API
      </a>
    </div>
  </header>
);

export const PageTitle: FC<PropsWithChildren<{ eyebrow?: string }>> = ({
  eyebrow,
  children,
}) => (
  <div class="mb-4">
    {eyebrow ? (
      <p class="mb-0.5 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-base-content/40">
        {eyebrow}
      </p>
    ) : null}
    <h1 class="text-xl font-bold tracking-tight text-base-content">
      {children}
    </h1>
  </div>
);

export const Stat: FC<{
  label: string;
  value: string | number;
  detail?: string;
}> = ({ label, value, detail }) => (
  <div class="rounded-lg border border-base-300 bg-base-100 px-3.5 py-2.5">
    <div class="text-xs font-medium text-base-content/45">{label}</div>
    <div
      class="metric-value mt-0.5 text-xl font-bold leading-none text-base-content"
      data-counter={typeof value === "number" ? value : undefined}
    >
      {value}
    </div>
    {detail ? (
      <div class="mt-0.5 text-xs text-base-content/40">{detail}</div>
    ) : null}
  </div>
);

export const Toast: FC<{ message: string }> = ({ message }) => (
  <div id="toast" hx-swap-oob="true" class="toast toast-end">
    <div class="alert alert-success rounded-lg py-2 text-sm shadow-lg">
      <span>{message}</span>
    </div>
  </div>
);
