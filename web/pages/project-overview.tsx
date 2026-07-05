import type { ActivityEvent, Issue, Project, PullRequest } from "@/db/types";
import { AppShell, Stat } from "@/web/components/layout";
import { PrRow } from "@/web/components/pr";
import { ProjectShell } from "@/web/components/project-shell";
import { ActivityTimeline, IssueIntakePanel } from "@/web/fragments/mira";

interface ProjectOverviewProps {
  project: Project;
  issues: Issue[];
  pullRequests: PullRequest[];
  activity: ActivityEvent[];
  formError?: string;
}

export function ProjectOverviewPage({
  project,
  issues,
  pullRequests,
  activity,
  formError,
}: ProjectOverviewProps) {
  const openIssues = issues.filter((issue) => issue.status !== "done");
  const openPrs = pullRequests.filter((pr) => pr.state === "open");
  const contributors = new Set([
    ...issues.map((issue) => issue.assignee),
    ...pullRequests.map((pr) => pr.author),
  ]);

  return (
    <AppShell title={project.name}>
      <ProjectShell project={project} active="overview">
        <section data-reveal class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat label="Open issues" value={openIssues.length} />
          <Stat label="Open PRs" value={openPrs.length} />
          <Stat label="Total issues" value={issues.length} />
          <Stat label="Contributors" value={contributors.size} />
        </section>

        <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.7fr)]">
          <div class="flex flex-col gap-4">
            <div
              data-reveal
              class="rounded-lg border border-base-300 bg-base-100 p-4"
            >
              <div class="mb-3 flex items-center justify-between">
                <h2 class="text-sm font-bold text-base-content">
                  Recent activity
                </h2>
                <a
                  href={`/app/p/${project.slug}/activity`}
                  class="text-xs font-semibold text-base-content/40 hover:text-base-content"
                >
                  Full history
                </a>
              </div>
              <ActivityTimeline events={activity.slice(0, 6)} />
            </div>

            <div
              data-reveal
              class="rounded-lg border border-base-300 bg-base-100 p-4"
            >
              <h2 class="mb-3 text-sm font-bold text-base-content">
                Open pull requests
              </h2>
              {openPrs.length === 0 ? (
                <p class="text-sm text-base-content/40">
                  Nothing open right now.
                </p>
              ) : (
                <div class="flex flex-col gap-2">
                  {openPrs.map((pr) => (
                    <PrRow key={pr.id} pr={pr} commits={[]} compact />
                  ))}
                </div>
              )}
            </div>
          </div>

          <IssueIntakePanel project={project} error={formError} />
        </div>
      </ProjectShell>
    </AppShell>
  );
}
