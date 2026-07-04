import type { Issue, Project, PullRequest } from "@/db/types";
import { IconMira, IconSearch } from "@/web/components/icons";
import { AppLayout } from "@/web/components/shell";

interface IndexPageProps {
  projects: Project[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

export function IndexPage({ projects, issues, pullRequests }: IndexPageProps) {
  const totalStars = projects.reduce((sum, p) => sum + p.stars, 0);
  const activeIssues = issues.filter((i) => i.status !== "done").length;
  const openPrs = pullRequests.filter((pr) => pr.state === "open").length;

  return (
    <AppLayout title="Mira">
      <div class="py-8">
        <div class="mb-12 text-center">
          <div class="mb-4 flex justify-center">
            <div class="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-content">
              <IconMira class="h-6 w-6" />
            </div>
          </div>
          <h1 class="text-4xl font-bold tracking-tight text-base-content">
            Mira
          </h1>
          <p class="mt-2 text-lg text-base-content/60">
            Track open-source projects in real time
          </p>
        </div>

        <div class="mb-8 flex justify-center">
          <label class="input input-bordered flex w-full max-w-md items-center gap-2">
            <IconSearch class="h-5 w-5 text-base-content/40" />
            <input
              type="text"
              class="grow bg-transparent"
              placeholder="Find a project…"
            />
          </label>
        </div>

        <div class="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="rounded-3xl border border-base-300 bg-base-100 p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-base-content">
              {projects.length}
            </div>
            <div class="text-xs font-medium text-base-content/40">Projects</div>
          </div>
          <div class="rounded-3xl border border-base-300 bg-base-100 p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-base-content">
              {issues.length}
            </div>
            <div class="text-xs font-medium text-base-content/40">Issues</div>
          </div>
          <div class="rounded-3xl border border-base-300 bg-base-100 p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-base-content">
              {activeIssues}
            </div>
            <div class="text-xs font-medium text-base-content/40">Active</div>
          </div>
          <div class="rounded-3xl border border-base-300 bg-base-100 p-4 text-center shadow-sm">
            <div class="text-2xl font-bold text-base-content">{openPrs}</div>
            <div class="text-xs font-medium text-base-content/40">Open PRs</div>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const projIssues = issues.filter((i) => i.projectId === project.id);
            const projPrs = pullRequests.filter(
              (p) => p.projectId === project.id,
            );
            return (
              <a
                key={project.id}
                href={`/projects/${project.slug}`}
                class="flex flex-col gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm transition hover:border-base-content/20"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-bold text-base-content">{project.name}</h3>
                    <p class="text-xs text-base-content/40">{project.repo}</p>
                  </div>
                  <span
                    class={`rounded-md px-2 py-1 text-xs font-semibold ${
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
                <p class="line-clamp-2 text-sm text-base-content/60">
                  {project.summary}
                </p>
                <div class="flex flex-wrap gap-2 text-xs text-base-content/40">
                  <span>{project.language}</span>
                  <span>⭐ {project.stars.toLocaleString()}</span>
                  <span>{projIssues.length} issues</span>
                  <span>
                    {projPrs.filter((p) => p.state === "open").length} PRs
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
