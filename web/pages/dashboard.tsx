import type { FileRecord, Issue, JobRecord, Project } from "@/db/types";
import { Layout, PageTitle, Stat } from "@/web/components/layout";
import { FileList, FileUploadForm } from "@/web/fragments/files";
import { JobPanel } from "@/web/fragments/jobs";
import { IssueForm, KanbanBoard, RepositoryList } from "@/web/fragments/mira";
import { showroomComponents } from "@/web/showroom/components";

interface DashboardProps {
  projects: Project[];
  issues: Issue[];
  files: FileRecord[];
  jobs: JobRecord[];
}

export function DashboardPage({
  projects,
  issues,
  files,
  jobs,
}: DashboardProps) {
  const totalStars = projects.reduce((sum, project) => sum + project.stars, 0);

  return (
    <Layout title="Dashboard">
      <PageTitle eyebrow="Mira">Open-source project tracker</PageTitle>
      <section class="dashboard-grid" aria-label="Template status">
        <Stat
          label="Repositories"
          value={projects.length}
          detail={`${totalStars.toLocaleString()} stars tracked`}
        />
        <Stat label="Issues" value={issues.length} detail="D1 + HTMX board" />
        <Stat label="Jobs" value={jobs.length} detail="Queues and cron" />
      </section>
      <div class="demo-grid">
        <section id="board" class="demo-panel demo-panel-wide">
          <div>
            <span class="demo-kicker">Hono + JSX + HTMX</span>
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
            <span class="demo-kicker">Typed forms</span>
            <h2>Create issue</h2>
          </div>
          <IssueForm projects={projects} />
        </section>
      </div>
      <div class="demo-grid">
        <section id="repositories" class="demo-panel">
          <div>
            <span class="demo-kicker">Open source signals</span>
            <h2>Tracked repositories</h2>
          </div>
          <RepositoryList projects={projects} />
        </section>
        <section id="theme" class="demo-panel">
          <div>
            <span class="demo-kicker">Alpine + daisyUI</span>
            <h2>Theme island</h2>
          </div>
          <div class="theme-preview" x-data="{ tone: 'primary' }">
            <div class="preview-card" x-bind:data-tone="tone">
              <span class="badge">Live island</span>
              <strong x-text="tone === 'primary' ? 'Primary tone' : 'Accent tone'">
                Primary tone
              </strong>
            </div>
            <div class="button-row">
              <button type="button" class="btn" x-on:click="tone = 'primary'">
                Primary
              </button>
              <button type="button" class="btn" x-on:click="tone = 'accent'">
                Accent
              </button>
            </div>
          </div>
        </section>
      </div>
      <div class="demo-grid">
        <section id="files" class="demo-panel">
          <div>
            <span class="demo-kicker">R2 + D1</span>
            <h2>Issue attachments</h2>
          </div>
          <FileUploadForm />
          <FileList files={files} />
        </section>
        <section id="jobs" class="demo-panel">
          <div>
            <span class="demo-kicker">Queues + Cron</span>
            <h2>Background jobs</h2>
          </div>
          <JobPanel jobs={jobs} />
        </section>
      </div>
      <div class="demo-grid">
        <section id="api" class="demo-panel">
          <div>
            <span class="demo-kicker">OpenAPI + Scalar</span>
            <h2>API contract</h2>
          </div>
          <p class="muted">
            The visible app is one page, but it still exposes typed API
            endpoints for clients and docs.
          </p>
          <div class="button-row">
            <button
              type="button"
              class="btn btn-primary"
              hx-get="/api/health"
              hx-target="#api-result"
              hx-swap="textContent"
            >
              Check API
            </button>
            <a class="btn" href="/reference">
              Open Scalar
            </a>
          </div>
          <pre id="api-result" class="code-panel">
            Click Check API
          </pre>
        </section>
        <section id="components" class="demo-panel">
          <div>
            <span class="demo-kicker">daisyUI</span>
            <h2>Component map</h2>
          </div>
          <p class="muted">
            {showroomComponents.length} daisyUI component examples are modeled
            in the local showroom data.
          </p>
          <div class="component-cloud">
            {showroomComponents.slice(0, 18).map((component) => (
              <span key={component.slug}>{component.name}</span>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
