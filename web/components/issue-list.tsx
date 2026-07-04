import type { Issue, PullRequest } from "@/db/types";
import {
  CategoryChip,
  PriorityChip,
  StatusChip,
  TypeDot,
} from "@/web/components/chip";
import { IconPullRequest } from "@/web/components/icons";
import { initials, timeAgo } from "@/web/format";
import type { FC } from "hono/jsx";

export const IssueRow: FC<{
  issue: Issue;
  projectSlug: string;
  linkedPrCount: number;
}> = ({ issue, projectSlug, linkedPrCount }) => (
  <a
    href={`/projects/${projectSlug}/issues/${issue.id}`}
    class="flex items-center gap-3 border-b border-base-300 px-4 py-3 transition hover:bg-base-200/50"
  >
    <div class="flex items-center gap-1.5">
      <TypeDot type={issue.type} class="h-2 w-2" />
      <StatusChip status={issue.status} />
    </div>

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="font-mono text-xs text-base-content/40">
          #{issue.id.slice(0, 4)}
        </span>
        <span class="truncate text-sm font-medium text-base-content">
          {issue.title}
        </span>
      </div>
      <div class="mt-0.5 flex items-center gap-2 text-xs text-base-content/40">
        <span>{issue.assignee}</span>
        <span>•</span>
        <span>{timeAgo(issue.updatedAt)}</span>
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs">
      <PriorityChip priority={issue.priority} />
      {linkedPrCount > 0 ? (
        <span class="inline-flex items-center gap-0.5 rounded-md bg-base-200 px-2 py-1">
          <IconPullRequest class="h-3 w-3" />
          {linkedPrCount}
        </span>
      ) : null}
    </div>
  </a>
);

export const IssueList: FC<{
  issues: Issue[];
  projectSlug: string;
  linkedPrCounts: Map<string, number>;
}> = ({ issues, projectSlug, linkedPrCounts }) => (
  <div class="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
    {issues.length === 0 ? (
      <div class="px-4 py-8 text-center text-sm text-base-content/40">
        No issues found
      </div>
    ) : (
      issues.map((issue) => (
        <IssueRow
          key={issue.id}
          issue={issue}
          projectSlug={projectSlug}
          linkedPrCount={linkedPrCounts.get(issue.id) ?? 0}
        />
      ))
    )}
  </div>
);
