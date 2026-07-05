import type { Issue, Project, PullRequest } from "@/db/types";
import { AppShell, PageTitle, Stat } from "@/web/components/layout";
import { ProjectCard } from "@/web/components/project-shell";

interface ProjectsIndexProps {
  projects: Project[];
  issues: Issue[];
  pullRequests: PullRequest[];
}

export function ProjectsIndexPage({
  projects,
  issues,
  pullRequests,
}: ProjectsIndexProps) {
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const activeIssues = issues.filter((issue) => issue.status !== "done").length;
  const openPrs = pullRequests.filter((pr) => pr.state === "open").length;

  return (
    <AppShell title="Overview">
      <PageTitle eyebrow="Mira">Tracked repositories</PageTitle>

      <section data-reveal class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat
          label="Repositories"
          value={projects.length}
          detail={`${totalStars.toLocaleString()} stars tracked`}
        />
        <Stat label="Issues" value={issues.length} detail="Tracked work" />
        <Stat label="Active" value={activeIssues} detail="Not done yet" />
        <Stat label="Open PRs" value={openPrs} detail="Awaiting merge" />
      </section>

      <div class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const projectIssues = issues.filter(
            (issue) =>
              issue.projectId === project.id && issue.status !== "done",
          );
          const projectOpenPrs = pullRequests.filter(
            (pr) => pr.projectId === project.id && pr.state === "open",
          );
          return (
            <ProjectCard
              key={project.id}
              project={project}
              openIssues={projectIssues.length}
              openPrs={projectOpenPrs.length}
            />
          );
        })}
      </div>
    </AppShell>
  );
}
