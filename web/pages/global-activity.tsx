import type { ActivityEvent, Project } from "@/db/types";
import { AppShell, PageTitle } from "@/web/components/layout";
import { ActivityTimeline } from "@/web/fragments/mira";

interface GlobalActivityProps {
  projects: Project[];
  activity: ActivityEvent[];
}

export function GlobalActivityPage({
  projects,
  activity,
}: GlobalActivityProps) {
  const projectNames = new Map(projects.map((p) => [p.id, p.name]));

  return (
    <AppShell title="Activity" active="activity">
      <PageTitle eyebrow="Mira">Activity across every project</PageTitle>
      <div
        data-reveal
        class="rounded-lg border border-base-300 bg-base-100 p-4"
      >
        <div
          hx-get="/app/activity/fragment"
          hx-trigger="every 8s"
          hx-swap="innerHTML"
        >
          <ActivityTimeline events={activity} projectNames={projectNames} />
        </div>
      </div>
    </AppShell>
  );
}
