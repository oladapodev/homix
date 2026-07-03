import type { Project } from "@/db/types";
import { createProjectSchema } from "@/db/types";
import type { FC } from "hono/jsx";

export function parseProjectForm(form: FormData) {
  return createProjectSchema.safeParse({
    name: String(form.get("name") ?? ""),
    status: String(form.get("status") ?? "planning"),
    summary: String(form.get("summary") ?? ""),
  });
}

export const ProjectForm: FC<{ error?: string }> = ({ error }) => (
  <form
    class="form-panel"
    method="post"
    action="/projects"
    hx-post="/projects"
    hx-target="#project-list"
    hx-swap="outerHTML"
  >
    {error ? <div class="alert alert-error">{error}</div> : null}
    <label class="fieldset">
      <span class="fieldset-legend">Name</span>
      <input
        class="input"
        name="name"
        required
        minlength={2}
        placeholder="Customer portal"
      />
    </label>
    <label class="fieldset">
      <span class="fieldset-legend">Status</span>
      <select class="select" name="status">
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="paused">Paused</option>
        <option value="done">Done</option>
      </select>
    </label>
    <label class="fieldset">
      <span class="fieldset-legend">Summary</span>
      <textarea
        class="textarea"
        name="summary"
        maxlength={280}
        placeholder="What this project is responsible for."
      />
    </label>
    <button class="btn btn-primary" type="submit">
      Add project
    </button>
  </form>
);

export const ProjectList: FC<{ projects: Project[] }> = ({ projects }) => (
  <div id="project-list" class="item-list">
    <div id="project-count" hx-swap-oob="true" class="badge badge-primary">
      {projects.length} projects
    </div>
    {projects.map((project) => (
      <article key={project.id} class="list-card">
        <div class="list-card-row">
          <div>
            <h2>{project.name}</h2>
            <p>{project.summary}</p>
          </div>
          <span class="badge badge-outline">{project.status}</span>
        </div>
      </article>
    ))}
  </div>
);
