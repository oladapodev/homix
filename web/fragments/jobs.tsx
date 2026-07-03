import type { JobRecord } from "@/db/types";
import type { FC } from "hono/jsx";

export const JobPanel: FC<{ jobs: JobRecord[] }> = ({ jobs }) => (
  <div id="job-panel" class="item-list">
    <form
      method="post"
      action="/jobs"
      hx-post="/jobs"
      hx-target="#job-panel"
      hx-swap="outerHTML"
    >
      <button class="btn btn-primary" type="submit">
        Enqueue demo job
      </button>
    </form>
    <div class="table-panel">
      <table class="table">
        <thead>
          <tr>
            <th>Kind</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.kind}</td>
              <td>{job.status}</td>
              <td>{job.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
