import type { Issue, IssueStatus, Project } from "@/db/types";
import { createIssueSchema, issueStatusSchema } from "@/db/types";
import type { FC } from "hono/jsx";

const columns: Array<{ status: IssueStatus; label: string }> = [
  { status: "backlog", label: "Backlog" },
  { status: "todo", label: "Todo" },
  { status: "in_progress", label: "In Progress" },
  { status: "review", label: "Review" },
  { status: "done", label: "Done" },
];

export function parseIssueForm(form: FormData) {
  return createIssueSchema.safeParse({
    projectId: String(form.get("projectId") ?? ""),
    title: String(form.get("title") ?? ""),
    status: String(form.get("status") ?? "todo"),
    priority: String(form.get("priority") ?? "medium"),
    type: String(form.get("type") ?? "task"),
    assignee: String(form.get("assignee") ?? ""),
    labels: String(form.get("labels") ?? ""),
  });
}

export function parseIssueStatus(form: FormData) {
  return issueStatusSchema.safeParse(String(form.get("status") ?? ""));
}

export const IssueForm: FC<{ projects: Project[]; error?: string }> = ({
  projects,
  error,
}) => (
  <form
    class="form-panel"
    method="post"
    action="/issues"
    hx-post="/issues"
    hx-target="#kanban-board"
    hx-swap="outerHTML"
  >
    {error ? <div class="alert alert-error">{error}</div> : null}
    <label class="fieldset">
      <span class="fieldset-legend">Issue title</span>
      <input
        class="input"
        name="title"
        required
        minlength={3}
        placeholder="Improve contributor onboarding"
      />
    </label>
    <div class="form-grid">
      <label class="fieldset">
        <span class="fieldset-legend">Project</span>
        <select class="select" name="projectId">
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label class="fieldset">
        <span class="fieldset-legend">Status</span>
        <select class="select" name="status">
          {columns.map((column) => (
            <option key={column.status} value={column.status}>
              {column.label}
            </option>
          ))}
        </select>
      </label>
    </div>
    <div class="form-grid">
      <label class="fieldset">
        <span class="fieldset-legend">Priority</span>
        <select class="select" name="priority">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
      <label class="fieldset">
        <span class="fieldset-legend">Type</span>
        <select class="select" name="type">
          <option value="task">Task</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="docs">Docs</option>
        </select>
      </label>
    </div>
    <div class="form-grid">
      <label class="fieldset">
        <span class="fieldset-legend">Assignee</span>
        <input class="input" name="assignee" required placeholder="Ada" />
      </label>
      <label class="fieldset">
        <span class="fieldset-legend">Labels</span>
        <input
          class="input"
          name="labels"
          placeholder="docs,good first issue"
        />
      </label>
    </div>
    <button class="btn btn-primary" type="submit">
      Add issue
    </button>
  </form>
);

export const RepositoryList: FC<{ projects: Project[] }> = ({ projects }) => (
  <div class="item-list">
    {projects.map((project) => (
      <article key={project.id} class="list-card">
        <div class="list-card-row">
          <div>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
            <p class="muted">
              {project.repo} · {project.language}
            </p>
          </div>
          <div class="badge-stack">
            <span class="badge badge-primary">
              {project.stars.toLocaleString()} stars
            </span>
            <span class="badge badge-outline">{project.status}</span>
          </div>
        </div>
      </article>
    ))}
  </div>
);

export const KanbanBoard: FC<{ issues: Issue[]; projects: Project[] }> = ({
  issues,
  projects,
}) => {
  const projectNames = new Map(
    projects.map((project) => [project.id, project.name]),
  );

  return (
    <div id="kanban-board" class="kanban-board">
      <div id="issue-count" hx-swap-oob="true" class="badge badge-primary">
        {issues.length} issues
      </div>
      {columns.map((column) => {
        const columnIssues = issues.filter(
          (issue) => issue.status === column.status,
        );
        return (
          <section
            key={column.status}
            class="kanban-column"
            data-status={column.status}
          >
            <header>
              <h3>{column.label}</h3>
              <span class="badge">{columnIssues.length}</span>
            </header>
            <div class="kanban-cards">
              {columnIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  projectName={projectNames.get(issue.projectId) ?? "Mira"}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const IssueCard: FC<{ issue: Issue; projectName: string }> = ({
  issue,
  projectName,
}) => (
  <article
    class="issue-card"
    data-priority={issue.priority}
    data-type={issue.type}
  >
    <div class="list-card-row">
      <div>
        <h2>{issue.title}</h2>
        <p class="muted">{projectName}</p>
      </div>
      <span class="badge badge-outline">{issue.priority}</span>
    </div>
    <div class="issue-meta">
      <span>{issue.type}</span>
      <span>{issue.assignee}</span>
      <span>{issue.labels}</span>
    </div>
    <form
      method="post"
      action={`/issues/${issue.id}/status`}
      hx-post={`/issues/${issue.id}/status`}
      hx-target="#kanban-board"
      hx-swap="outerHTML"
    >
      <select class="select select-sm" name="status">
        {columns.map((column) => (
          <option
            key={column.status}
            selected={issue.status === column.status}
            value={column.status}
          >
            {column.label}
          </option>
        ))}
      </select>
      <button class="btn btn-sm" type="submit">
        Move
      </button>
    </form>
  </article>
);
