import type { Issue, Project, PullRequest } from "@/db/types";
import { IconMira, IconStar } from "@/web/components/icons";
import { AppLayout } from "@/web/components/shell";

interface IndexPageProps {
  projects: Project[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

const StatTile = ({ value, label }: { value: number; label: string }) => (
  <div
    class="rounded-3xl border border-base-300 bg-base-100 px-6 py-5 text-center shadow-sm"
    data-reveal
  >
    <div
      class="text-3xl font-bold tracking-tight text-base-content"
      data-counter={value}
    >
      {value}
    </div>
    <div class="mt-1 text-xs font-medium uppercase tracking-wide text-base-content/40">
      {label}
    </div>
  </div>
);

export function IndexPage({ projects, issues, pullRequests }: IndexPageProps) {
  const activeIssues = issues.filter((i) => i.status !== "done").length;
  const openPrs = pullRequests.filter((pr) => pr.state === "open").length;

  return (
    <AppLayout title="Mira">
      <div class="py-16">
        <div class="mb-14 text-center" data-reveal>
          <div class="mb-6 flex justify-center">
            <div class="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-content shadow-sm">
              <IconMira class="h-7 w-7" />
            </div>
          </div>
          <h1 class="text-5xl font-bold tracking-tight text-base-content">
            Mira
          </h1>
          <p class="mt-3 text-lg text-base-content/55">
            Track open-source projects in real time
          </p>
        </div>

        <div class="mb-16 flex justify-center" data-reveal>
          <form
            hx-post="/api/projects/add"
            hx-target="#add-project-result"
            hx-swap="innerHTML"
            class="w-full max-w-lg"
          >
            <div class="flex gap-2 rounded-full border border-base-300 bg-base-100 p-1.5 shadow-sm">
              <input
                type="text"
                name="repo"
                placeholder="Track a repo — owner/name, e.g. facebook/react"
                class="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                required
              />
              <button
                type="submit"
                class="btn btn-primary btn-sm rounded-full px-5"
              >
                Track
              </button>
            </div>
            <div id="add-project-result" class="mt-3 text-center text-sm" />
          </form>
        </div>

        <div class="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatTile value={projects.length} label="Projects" />
          <StatTile value={issues.length} label="Issues" />
          <StatTile value={activeIssues} label="Active" />
          <StatTile value={openPrs} label="Open PRs" />
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projIssues = issues.filter((i) => i.projectId === project.id);
            const projPrs = pullRequests.filter(
              (p) => p.projectId === project.id,
            );
            return (
              <a
                key={project.id}
                href={`/projects/${project.slug}`}
                data-reveal
                class="group flex flex-col gap-4 rounded-3xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <h3 class="truncate text-lg font-bold text-base-content transition-colors group-hover:text-primary">
                      {project.name}
                    </h3>
                    <p class="truncate text-xs text-base-content/40">
                      {project.repo}
                    </p>
                  </div>
                  <span
                    class={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      project.status === "active"
                        ? "bg-success/10 text-success"
                        : project.status === "maintenance"
                          ? "bg-warning/10 text-warning"
                          : "bg-base-200 text-base-content/50"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p class="line-clamp-2 min-h-10 text-sm leading-relaxed text-base-content/60">
                  {project.summary}
                </p>
                <div class="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-base-200 pt-4 text-xs text-base-content/45">
                  <span class="font-medium">{project.language}</span>
                  <span class="inline-flex items-center gap-1">
                    <IconStar class="h-3 w-3 text-warning" />
                    {project.stars.toLocaleString()}
                  </span>
                  <span>{projIssues.length} issues</span>
                  <span>
                    {projPrs.filter((p) => p.state === "open").length} open PRs
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
