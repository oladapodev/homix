import type {
  ActivityEvent,
  Commit,
  Issue,
  IssueLink,
  Project,
  PullRequest,
} from "@/db/types";
import {
  CategoryChip,
  PriorityChip,
  StatusChip,
  TypeChip,
} from "@/web/components/chip";
import { IconArrowRight } from "@/web/components/icons";
import { AppShell } from "@/web/components/layout";
import { PrRow } from "@/web/components/pr";
import { initials, parseTitleCategory, timeAgo } from "@/web/format";
import { ActivityTimeline } from "@/web/fragments/mira";

interface IssueDetailProps {
  project: Project;
  issue: Issue;
  links: IssueLink[];
  pullRequests: PullRequest[];
  commits: Commit[];
  timeline: ActivityEvent[];
}

export function IssueDetailPage({
  project,
  issue,
  links,
  pullRequests,
  commits,
  timeline,
}: IssueDetailProps) {
  const { rest } = parseTitleCategory(issue.title);
  const prById = new Map(pullRequests.map((pr) => [pr.id, pr]));
  const linkedPrs = links
    .map((link) => ({ link, pr: prById.get(link.pullRequestId) }))
    .filter((entry): entry is { link: IssueLink; pr: PullRequest } =>
      Boolean(entry.pr),
    );

  return (
    <AppShell title={rest}>
      <a
        href={`/app/p/${project.slug}/board`}
        class="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/40 hover:text-base-content"
      >
        <IconArrowRight class="h-3.5 w-3.5 rotate-180" />
        {project.name} · Mira Board
      </a>

      <div class="rounded-lg border border-base-300 bg-base-100 p-4">
        <div class="flex flex-wrap items-center gap-1.5">
          <CategoryChip title={issue.title} />
          <StatusChip status={issue.status} />
          <PriorityChip priority={issue.priority} />
          <TypeChip type={issue.type} />
        </div>
        <h1 class="mt-2.5 text-xl font-bold tracking-tight text-base-content">
          {rest}
        </h1>
        <div class="mt-3 flex flex-wrap items-center gap-3 text-xs text-base-content/45">
          <span class="inline-flex items-center gap-1.5">
            <span class="grid h-5 w-5 place-items-center rounded-full bg-primary/15 text-[0.55rem] font-bold text-primary">
              {initials(issue.assignee)}
            </span>
            {issue.assignee}
          </span>
          <span>Opened {timeAgo(issue.createdAt)}</span>
          <span>Updated {timeAgo(issue.updatedAt)}</span>
        </div>
        {issue.labels ? (
          <div class="mt-3 flex flex-wrap gap-1.5">
            {issue.labels
              .split(",")
              .map((label) => label.trim())
              .filter(Boolean)
              .map((label) => (
                <span
                  key={label}
                  class="rounded-md bg-base-200 px-2 py-0.5 text-xs font-medium text-base-content/50"
                >
                  {label}
                </span>
              ))}
          </div>
        ) : null}
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <div class="rounded-lg border border-base-300 bg-base-100 p-4">
          <h2 class="mb-3 text-sm font-bold text-base-content">
            Linked pull requests
          </h2>
          {linkedPrs.length === 0 ? (
            <p class="text-sm text-base-content/40">
              No pull request references this issue yet.
            </p>
          ) : (
            <div class="flex flex-col gap-3">
              {linkedPrs.map(({ link, pr }) => (
                <div key={pr.id}>
                  <p class="mb-1.5 text-xs font-semibold uppercase tracking-wide text-base-content/35">
                    {link.linkType}
                  </p>
                  <PrRow
                    pr={pr}
                    commits={commits.filter((c) => c.pullRequestId === pr.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div class="h-fit rounded-lg border border-base-300 bg-base-100 p-4">
          <h2 class="mb-3 text-sm font-bold text-base-content">Lifecycle</h2>
          <ActivityTimeline events={timeline} />
        </div>
      </div>
    </AppShell>
  );
}
