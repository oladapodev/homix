import type { Issue, Project } from "@/db/types";
import { Layout, PageTitle, Stat } from "@/web/components/layout";
import { IssueForm, KanbanBoard, RepositoryList } from "@/web/fragments/mira";

interface DashboardProps {
  projects: Project[];
  issues: Issue[];
}

export function DashboardPage({ projects, issues }: DashboardProps) {
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);
  const activeIssues = issues.filter((issue) => issue.status !== "done").length;

  return (
    <Layout title="Dashboard">
      <PageTitle eyebrow="Mira">Open-source project tracker</PageTitle>
      <section class="dashboard-grid" aria-label="Mira status">
        <Stat
          label="Repositories"
          value={projects.length}
          detail={`${totalStars.toLocaleString()} stars tracked`}
        />
        <Stat label="Issues" value={issues.length} detail="Tracked work" />
        <Stat label="Active" value={activeIssues} detail="Not done yet" />
      </section>
      <div class="demo-grid">
        <section id="board" class="demo-panel demo-panel-wide">
          <div>
            <span class="demo-kicker">Mira board</span>
            <h2>Kanban board</h2>
          </div>
          <div
            class="board-filter"
            x-data="{ type: 'all' }"
            x-bind:data-type="type"
          >
            <div class="button-row">
              <button type="button" class="btn" x-on:click="type = 'all'">
                All
              </button>
              <button type="button" class="btn" x-on:click="type = 'bug'">
                Bugs
              </button>
              <button type="button" class="btn" x-on:click="type = 'feature'">
                Features
              </button>
              <button type="button" class="btn" x-on:click="type = 'docs'">
                Docs
              </button>
            </div>
            <KanbanBoard issues={issues} projects={projects} />
          </div>
        </section>
        <section id="new-issue" class="demo-panel">
          <div>
            <span class="demo-kicker">Issue intake</span>
            <h2>Create issue</h2>
          </div>
          <IssueForm projects={projects} />
        </section>
      </div>
      <div class="demo-grid">
        <section id="repositories" class="demo-panel">
          <div>
            <span class="demo-kicker">Open-source signals</span>
            <h2>Tracked repositories</h2>
          </div>
          <RepositoryList projects={projects} />
        </section>
        <section id="foundation" class="demo-panel">
          <div>
            <span class="demo-kicker">Built on Homix</span>
            <h2>Hono, HTMX, Alpine, D1, OpenAPI</h2>
          </div>
          <p class="muted">
            Mira is a focused demo for Homix: typed server-rendered UI, HTMX
            updates, Alpine client filtering, D1 persistence, and documented API
            endpoints.
          </p>
        </section>
      </div>
    </Layout>
  );
}
