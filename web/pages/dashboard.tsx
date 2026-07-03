import type { FileRecord, JobRecord, Project } from "@/db/types";
import { Layout, PageTitle, Stat } from "@/web/components/layout";
import { FileList, FileUploadForm } from "@/web/fragments/files";
import { JobPanel } from "@/web/fragments/jobs";
import { ProjectForm, ProjectList } from "@/web/fragments/projects";
import { showroomComponents } from "@/web/showroom/components";

interface DashboardProps {
  projects: Project[];
  files: FileRecord[];
  jobs: JobRecord[];
}

export function DashboardPage({ projects, files, jobs }: DashboardProps) {
  return (
    <Layout title="Dashboard">
      <PageTitle eyebrow="Template">Full-stack Cloudflare app shell</PageTitle>
      <section class="dashboard-grid" aria-label="Template status">
        <Stat label="Projects" value={projects.length} detail="D1 + Drizzle" />
        <Stat label="Files" value={files.length} detail="R2 metadata demo" />
        <Stat label="Jobs" value={jobs.length} detail="Queues and cron" />
      </section>
      <div class="demo-grid">
        <section id="projects" class="demo-panel">
          <div>
            <span class="demo-kicker">Hono + JSX + HTMX</span>
            <h2>Project board</h2>
          </div>
          <ProjectForm />
          <ProjectList projects={projects} />
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
            <h2>File metadata flow</h2>
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
