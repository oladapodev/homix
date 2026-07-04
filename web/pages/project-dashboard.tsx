import type {
  ActivityEvent,
  Issue,
  IssueLink,
  Project,
  PullRequest,
} from "@/db/types";
import { IssueList } from "@/web/components/issue-list";
import { PrList } from "@/web/components/pr-list";
import { AppLayout } from "@/web/components/shell";
import { FilterBar, ProjectHeader, TabNav } from "@/web/components/shell";
import { KanbanBoard } from "@/web/fragments/mira";
import { ActivityTimeline } from "@/web/fragments/mira";

interface ProjectDashboardProps {
  project: Project;
  issues: Issue[];
  pullRequests: PullRequest[];
  issueLinks: IssueLink[];
  activity: ActivityEvent[];
  activeTab: string;
}

export function ProjectDashboardPage({
  project,
  issues,
  pullRequests,
  issueLinks,
  activity,
  activeTab = "issues",
}: ProjectDashboardProps) {
  const stats = {
    issues: issues.length,
    prs: pullRequests.filter((pr) => pr.state === "open").length,
    active: issues.filter((i) => i.status !== "done").length,
    contributors: new Set([
      ...issues.map((i) => i.assignee),
      ...pullRequests.map((pr) => pr.author),
    ]).size,
  };

  const prByIssue = new Map<string, number>();
  const issueByPr = new Map<string, number>();

  for (const link of issueLinks) {
    prByIssue.set(link.issueId, (prByIssue.get(link.issueId) ?? 0) + 1);
    issueByPr.set(
      link.pullRequestId,
      (issueByPr.get(link.pullRequestId) ?? 0) + 1,
    );
  }

  const tabs = [
    { key: "issues", label: "Issues" },
    { key: "prs", label: "Pull Requests" },
    { key: "board", label: "Board" },
    { key: "activity", label: "Activity" },
  ];

  return (
    <AppLayout title={project.name}>
      <ProjectHeader
        name={project.name}
        language={project.language}
        stars={project.stars}
        stats={stats}
        updated="45min ago"
      />

      <TabNav
        tabs={tabs}
        active={activeTab}
        baseUrl={`/projects/${project.slug}`}
      />

      {activeTab === "issues" && (
        <>
          <FilterBar
            filters={[
              {
                key: "status",
                label: "Status",
                options: ["Todo", "In Progress", "Review", "Done"],
              },
              {
                key: "priority",
                label: "Priority",
                options: ["Low", "Medium", "High", "Urgent"],
              },
              {
                key: "linked",
                label: "Linked",
                options: ["Has PR", "No PR"],
              },
            ]}
          />
          <IssueList
            issues={issues}
            projectSlug={project.slug}
            linkedPrCounts={prByIssue}
          />
        </>
      )}

      {activeTab === "prs" && (
        <>
          <FilterBar
            filters={[
              {
                key: "state",
                label: "State",
                options: ["Open", "Merged", "Closed"],
              },
              {
                key: "linked",
                label: "Linked",
                options: ["Has Issues", "No Issues"],
              },
            ]}
          />
          <PrList prs={pullRequests} linkedIssueCounts={issueByPr} />
        </>
      )}

      {activeTab === "board" && (
        <KanbanBoard
          issues={issues}
          projects={[project]}
          pullRequests={pullRequests}
          issueLinks={issueLinks}
        />
      )}

      {activeTab === "activity" && (
        <div class="rounded-3xl border border-base-300 bg-base-100 p-4 shadow-sm">
          <ActivityTimeline events={activity} />
        </div>
      )}
    </AppLayout>
  );
}
