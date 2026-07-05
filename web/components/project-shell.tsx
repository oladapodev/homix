import type { Project } from "@/db/types";
import { ProjectStatusChip } from "@/web/components/chip";
import { IconArrowRight, IconStar } from "@/web/components/icons";
import type { FC, PropsWithChildren } from "hono/jsx";

type ProjectTab = "overview" | "board" | "activity";

const tabs: Array<{ key: ProjectTab; label: string; path: string }> = [
  { key: "overview", label: "Overview", path: "" },
  { key: "board", label: "Mira Board", path: "/board" },
  { key: "activity", label: "Activity", path: "/activity" },
];

export const ProjectShell: FC<
  PropsWithChildren<{ project: Project; active: ProjectTab }>
> = ({ project, active, children }) => (
  <div>
    <a
      href="/app"
      class="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/40 hover:text-base-content"
    >
      <IconArrowRight class="h-3.5 w-3.5 rotate-180" />
      All projects
    </a>

    <div class="flex flex-wrap items-center gap-2.5 pb-3">
      <span class="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-sm font-bold text-primary">
        {project.name.slice(0, 1).toUpperCase()}
      </span>
      <h1 class="text-base font-bold tracking-tight text-base-content">
        {project.name}
      </h1>
      <ProjectStatusChip status={project.status} />
      <span class="ml-auto flex items-center gap-3 text-xs font-medium text-base-content/40">
        <span>{project.repo}</span>
        <span class="inline-flex items-center gap-1">
          <IconStar class="h-3.5 w-3.5 text-warning" />
          {project.stars.toLocaleString()}
        </span>
      </span>
    </div>

    <div role="tablist" class="tabs tabs-border">
      {tabs.map((tab) => (
        <a
          key={tab.key}
          role="tab"
          href={`/app/p/${project.slug}${tab.path}`}
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

    <div class="mt-4">{children}</div>
  </div>
);

export const ProjectCard: FC<{
  project: Project;
  openIssues: number;
  openPrs: number;
}> = ({ project, openIssues, openPrs }) => (
  <a
    href={`/app/p/${project.slug}`}
    data-reveal
    class="flex flex-col gap-3 rounded-lg border border-base-300 bg-base-100 p-4 transition hover:border-base-content/20"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-start gap-2.5">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/10 text-sm font-bold text-primary">
          {project.name.slice(0, 1).toUpperCase()}
        </span>
        <div>
          <h2 class="text-sm font-bold text-base-content">{project.name}</h2>
          <p class="text-xs font-medium text-base-content/40">{project.repo}</p>
        </div>
      </div>
      <ProjectStatusChip status={project.status} />
    </div>
    <p class="text-sm leading-relaxed text-base-content/55">
      {project.summary}
    </p>
    <div class="flex flex-wrap items-center gap-3 border-t border-base-300 pt-2.5 text-xs font-medium text-base-content/45">
      <span class="inline-flex items-center gap-1">
        <IconStar class="h-3.5 w-3.5 text-warning" />
        {project.stars.toLocaleString()}
      </span>
      <span>{project.language}</span>
      <span>
        {openIssues} open {openIssues === 1 ? "issue" : "issues"}
      </span>
      <span>
        {openPrs} open {openPrs === 1 ? "PR" : "PRs"}
      </span>
    </div>
  </a>
);
