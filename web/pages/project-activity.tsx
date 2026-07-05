import type { ActivityEvent, Project } from "@/db/types";
import { AppShell } from "@/web/components/layout";
import { ProjectShell } from "@/web/components/project-shell";
import { ActivityTimeline } from "@/web/fragments/mira";

interface ProjectActivityProps {
  project: Project;
  activity: ActivityEvent[];
}

export function ProjectActivityPage({
  project,
  activity,
}: ProjectActivityProps) {
  return (
    <AppShell title={`${project.name} · Activity`}>
      <ProjectShell project={project} active="activity">
        <div
          data-reveal
          class="rounded-lg border border-base-300 bg-base-100 p-4"
        >
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-sm font-bold text-base-content">
              Everything that happened
            </h2>
            <span class="inline-flex items-center gap-1 text-xs font-semibold text-success">
              <span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              Live
            </span>
          </div>
          <div
            hx-get={`/app/p/${project.slug}/activity/fragment`}
            hx-trigger="every 8s"
            hx-swap="innerHTML"
          >
            <ActivityTimeline events={activity} />
          </div>
        </div>
      </ProjectShell>
    </AppShell>
  );
}
