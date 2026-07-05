import type { Issue, IssueLink, Project, PullRequest } from "@/db/types";
import { AppShell } from "@/web/components/layout";
import { ProjectShell } from "@/web/components/project-shell";
import { KanbanBoard } from "@/web/fragments/mira";

interface ProjectBoardProps {
  project: Project;
  issues: Issue[];
  pullRequests: PullRequest[];
  issueLinks: IssueLink[];
}

export function ProjectBoardPage({
  project,
  issues,
  pullRequests,
  issueLinks,
}: ProjectBoardProps) {
  return (
    <AppShell title={`${project.name} · Mira Board`}>
      <ProjectShell project={project} active="board">
        <div class="mb-3 flex items-center gap-2 text-xs text-base-content/40">
          <span class="inline-flex items-center gap-1 font-semibold text-success">
            <span class="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
            Live
          </span>
          Mira Board mirrors real issue status from the repository — it isn't
          manually editable here.
        </div>
        <KanbanBoard
          issues={issues}
          projects={[project]}
          pullRequests={pullRequests}
          issueLinks={issueLinks}
        />
      </ProjectShell>
    </AppShell>
  );
}
