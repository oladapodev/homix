import { IconMira } from "@/web/components/icons";
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
  <div
    class="mb-6 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm"
    data-reveal
  >
    <div class="flex items-start justify-between gap-4">
      <div class="flex-1">
        <h1 class="text-2xl font-bold tracking-tight text-base-content">
          {name}
        </h1>
        <p class="mt-1 text-xs font-medium text-base-content/40">
          {language} • ⭐{stars.toLocaleString()} • Updated {updated}
        </p>
      </div>
    </div>
    <div class="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <div
          class="text-xl font-bold text-base-content"
          data-counter={stats.issues}
        >
          {stats.issues}
        </div>
        <div class="text-xs text-base-content/40">Issues</div>
      </div>
      <div>
        <div
          class="text-xl font-bold text-base-content"
          data-counter={stats.prs}
        >
          {stats.prs}
        </div>
        <div class="text-xs text-base-content/40">Open PRs</div>
      </div>
      <div>
        <div
          class="text-xl font-bold text-base-content"
          data-counter={stats.active}
        >
          {stats.active}
        </div>
        <div class="text-xs text-base-content/40">Active</div>
      </div>
      <div>
        <div
          class="text-xl font-bold text-base-content"
          data-counter={stats.contributors}
        >
          {stats.contributors}
        </div>
        <div class="text-xs text-base-content/40">Contributors</div>
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
        class="select select-sm select-bordered rounded-full"
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
