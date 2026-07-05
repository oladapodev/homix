import type {
  ActivityEvent,
  ActivityVerb,
  Issue,
  IssueLink,
  IssueStatus,
  Project,
  PullRequest,
} from "@/db/types";
import { createIssueSchema, issueStatusSchema } from "@/db/types";
import {
  PriorityIcon,
  TypeDot,
  softBgToneClass,
  textToneClass,
} from "@/web/components/chip";
import {
  IconActivity,
  IconPlus,
  IconPullRequest,
} from "@/web/components/icons";
import { initials, parseTitleCategory, timeAgo } from "@/web/format";
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

function buildIssueLinkMap(links: IssueLink[], pullRequests: PullRequest[]) {
  const prById = new Map(pullRequests.map((pr) => [pr.id, pr]));
  const map = new Map<string, Array<{ link: IssueLink; pr: PullRequest }>>();
  for (const link of links) {
    const pr = prById.get(link.pullRequestId);
    if (!pr) continue;
    const existing = map.get(link.issueId) ?? [];
    existing.push({ link, pr });
    map.set(link.issueId, existing);
  }
  return map;
}

export const IssueForm: FC<{
  project: Project;
  error?: string | undefined;
}> = ({ project, error }) => (
  <form
    class="flex flex-col gap-4"
    method="post"
    action="/issues"
    hx-post="/issues"
    hx-target="#issue-intake"
    hx-swap="outerHTML"
  >
    <input type="hidden" name="projectId" value={project.id} />
    {error ? (
      <div class="alert alert-error rounded-md text-sm">{error}</div>
    ) : null}
    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-bold uppercase tracking-wide text-base-content/50">
        Issue title
      </span>
      <input
        class="input input-bordered w-full rounded-md"
        name="title"
        required
        minlength={3}
        placeholder="[Board]: Improve contributor onboarding"
      />
    </label>
    <div class="grid grid-cols-2 gap-3">
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-bold uppercase tracking-wide text-base-content/50">
          Status
        </span>
        <select class="select select-bordered w-full rounded-md" name="status">
          {columns.map((column) => (
            <option key={column.status} value={column.status}>
              {column.label}
            </option>
          ))}
        </select>
      </label>
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-bold uppercase tracking-wide text-base-content/50">
          Priority
        </span>
        <select
          class="select select-bordered w-full rounded-md"
          name="priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-bold uppercase tracking-wide text-base-content/50">
          Type
        </span>
        <select class="select select-bordered w-full rounded-md" name="type">
          <option value="task">Task</option>
          <option value="bug">Bug</option>
          <option value="feature">Feature</option>
          <option value="docs">Docs</option>
        </select>
      </label>
      <label class="flex flex-col gap-1.5">
        <span class="text-xs font-bold uppercase tracking-wide text-base-content/50">
          Assignee
        </span>
        <input
          class="input input-bordered w-full rounded-md"
          name="assignee"
          required
          placeholder="Ada"
        />
      </label>
    </div>
    <label class="flex flex-col gap-1.5">
      <span class="text-xs font-bold uppercase tracking-wide text-base-content/50">
        Labels
      </span>
      <input
        class="input input-bordered w-full rounded-md"
        name="labels"
        placeholder="docs,good first issue"
      />
    </label>
    <button class="btn btn-primary w-full gap-2 rounded-md" type="submit">
      <IconPlus class="h-4.5 w-4.5" />
      Add issue
    </button>
  </form>
);

export const IssueIntakePanel: FC<{
  project: Project;
  error?: string | undefined;
}> = ({ project, error }) => (
  <div
    id="issue-intake"
    data-reveal
    class="h-fit rounded-lg border border-base-300 bg-base-100 p-4"
  >
    <div class="mb-4">
      <span class="text-xs font-bold uppercase tracking-wide text-primary">
        Issue intake
      </span>
      <h2 class="text-lg font-extrabold text-base-content">Track new issue</h2>
    </div>
    <IssueForm project={project} error={error} />
  </div>
);

export const KanbanBoard: FC<{
  issues: Issue[];
  projects: Project[];
  pullRequests: PullRequest[];
  issueLinks: IssueLink[];
}> = ({ issues, projects, pullRequests, issueLinks }) => {
  const projectSlugs = new Map(
    projects.map((project) => [project.id, project.slug]),
  );
  const linkMap = buildIssueLinkMap(issueLinks, pullRequests);

  return (
    <div
      id="kanban-board"
      class="kanban-scroll flex gap-3 overflow-x-auto pb-2"
    >
      <div id="issue-count" hx-swap-oob="true" class="hidden">
        {issues.length} issues
      </div>
      {columns.map((column) => {
        const columnIssues = issues.filter(
          (issue) => issue.status === column.status,
        );
        return (
          <section
            key={column.status}
            data-status={column.status}
            class="flex w-72 shrink-0 flex-col rounded-lg border border-base-300 bg-base-100"
          >
            <header class="flex items-center justify-between border-b border-base-300 px-3 py-2">
              <h3 class="text-xs font-semibold text-base-content/60">
                {column.label}
              </h3>
              <span class="text-xs font-medium text-base-content/35">
                {columnIssues.length}
              </span>
            </header>
            <div class="flex flex-col divide-y divide-base-300/60">
              {columnIssues.length === 0 ? (
                <p class="px-3 py-4 text-xs text-base-content/30">Empty</p>
              ) : null}
              {columnIssues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  projectSlug={projectSlugs.get(issue.projectId) ?? ""}
                  linkCount={(linkMap.get(issue.id) ?? []).length}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

const IssueRow: FC<{
  issue: Issue;
  projectSlug: string;
  linkCount: number;
}> = ({ issue, projectSlug, linkCount }) => {
  const { rest } = parseTitleCategory(issue.title);
  return (
    <a
      href={`/app/p/${projectSlug}/issues/${issue.id}`}
      data-reveal
      data-priority={issue.priority}
      data-type={issue.type}
      class="flex items-center gap-2 px-3 py-2 transition hover:bg-base-200/60"
    >
      <PriorityIcon priority={issue.priority} class="h-3 w-3 shrink-0" />
      <TypeDot type={issue.type} class="h-1.5 w-1.5 shrink-0" />
      <span class="min-w-0 flex-1 truncate text-sm text-base-content">
        {rest}
      </span>
      {linkCount > 0 ? (
        <span class="flex shrink-0 items-center gap-0.5 text-xs text-base-content/35">
          <IconPullRequest class="h-3 w-3" />
          {linkCount}
        </span>
      ) : null}
      <span
        title={issue.assignee}
        class="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[0.55rem] font-bold text-primary"
      >
        {initials(issue.assignee)}
      </span>
    </a>
  );
};

const verbIcon: Record<ActivityVerb, typeof IconActivity> = {
  opened: IconPullRequest,
  closed: IconPullRequest,
  merged: IconPullRequest,
  commented: IconActivity,
  status_changed: IconActivity,
  linked: IconPullRequest,
  created: IconActivity,
};

const verbTone: Record<ActivityVerb, keyof typeof textToneClass> = {
  opened: "info",
  closed: "neutral",
  merged: "secondary",
  commented: "accent",
  status_changed: "warning",
  linked: "primary",
  created: "success",
};

export const ActivityTimeline: FC<{
  events: ActivityEvent[];
  projectNames?: Map<string, string>;
}> = ({ events, projectNames }) => (
  <ul class="timeline-fade flex max-h-[32rem] flex-col gap-3 overflow-y-auto">
    {events.length === 0 ? (
      <li class="text-sm text-base-content/35">Nothing yet.</li>
    ) : null}
    {events.map((event) => {
      const Icon = verbIcon[event.verb];
      const tone = verbTone[event.verb];
      return (
        <li key={event.id} data-reveal class="flex items-start gap-2.5">
          <span
            class={`grid h-6 w-6 shrink-0 place-items-center rounded-full ${softBgToneClass[tone]} ${textToneClass[tone]}`}
          >
            <Icon class="h-3.5 w-3.5" />
          </span>
          <div class="flex min-w-0 flex-col">
            <p class="text-sm leading-snug text-base-content/75">
              <span class="font-semibold text-base-content">{event.actor}</span>{" "}
              {event.summary}
            </p>
            <p class="text-xs font-medium text-base-content/35">
              {projectNames
                ? `${projectNames.get(event.projectId) ?? event.projectId} · `
                : ""}
              {timeAgo(event.createdAt)}
            </p>
          </div>
        </li>
      );
    })}
  </ul>
);
