import { IconMira, IconSearch } from "@/web/components/icons";
import { ThemePicker } from "@/web/components/layout";
import { appConfig } from "@/web/config";
import type { FC, PropsWithChildren } from "hono/jsx";

export const AppLayout: FC<PropsWithChildren<{ title?: string }>> = ({
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
    <body class="min-h-screen bg-base-200 text-base-content">
      <header class="sticky top-0 z-40 flex h-13 items-center gap-3 border-b border-base-300 bg-base-100 px-4">
        <a href="/" class="flex items-center gap-2">
          <span class="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-content">
            <IconMira class="h-3.5 w-3.5" />
          </span>
          <span class="text-sm font-bold tracking-tight">{appConfig.name}</span>
        </a>
        <div class="flex flex-1 items-center justify-end gap-2">
          <button
            type="button"
            class="flex w-40 items-center gap-2 rounded-md border border-base-300 bg-base-100 px-2.5 py-1.5 text-left text-sm text-base-content/40 transition hover:border-base-content/20"
          >
            <IconSearch class="h-3.5 w-3.5" />
            <span class="flex-1">Search…</span>
            <kbd class="kbd kbd-xs">⌘K</kbd>
          </button>
          <ThemePicker class="ms-auto" />
        </div>
      </header>
      <main class="mx-auto w-[min(100%-2rem,80rem)] py-6">{children}</main>
    </body>
  </html>
);

export const ProjectHeader: FC<{
  name: string;
  language: string;
  stars: number;
  stats: { issues: number; prs: number; active: number; contributors: number };
  updated: string;
}> = ({ name, language, stars, stats, updated }) => (
  <div class="mb-4 rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm">
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-xl font-bold text-base-content">{name}</h1>
        <p class="mt-0.5 text-xs font-medium text-base-content/40">
          {language} • ⭐{stars.toLocaleString()} • Updated {updated}
        </p>
      </div>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div class="text-xs">
        <div class="font-bold text-base-content">{stats.issues}</div>
        <div class="text-base-content/40">Issues</div>
      </div>
      <div class="text-xs">
        <div class="font-bold text-base-content">{stats.prs}</div>
        <div class="text-base-content/40">Open PRs</div>
      </div>
      <div class="text-xs">
        <div class="font-bold text-base-content">{stats.active}</div>
        <div class="text-base-content/40">Active</div>
      </div>
      <div class="text-xs">
        <div class="font-bold text-base-content">{stats.contributors}</div>
        <div class="text-base-content/40">Contributors</div>
      </div>
    </div>
  </div>
);

export const TabNav: FC<{
  tabs: Array<{ key: string; label: string }>;
  active: string;
  baseUrl: string;
}> = ({ tabs, active, baseUrl }) => (
  <div role="tablist" class="tabs tabs-border mb-4">
    {tabs.map((tab) => (
      <a
        key={tab.key}
        role="tab"
        href={`${baseUrl}?tab=${tab.key}`}
        class={`tab text-sm ${
          active === tab.key
            ? "tab-active font-semibold text-base-content"
            : "font-medium text-base-content/50"
        }`}
      >
        {tab.label}
      </a>
    ))}
  </div>
);

export const FilterBar: FC<{
  filters: Array<{ key: string; label: string; options: string[] }>;
}> = ({ filters }) => (
  <div class="mb-4 flex flex-wrap gap-2 sm:gap-3">
    {filters.map((filter) => (
      <select
        key={filter.key}
        name={filter.key}
        class="select select-sm select-bordered rounded-md"
      >
        <option value="">{filter.label}</option>
        {filter.options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    ))}
  </div>
);
