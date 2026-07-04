import type { IssueLink, PullRequest } from "@/db/types";
import { PrStateChip, PriorityIcon } from "@/web/components/chip";
import { IconPullRequest } from "@/web/components/icons";
import { timeAgo } from "@/web/format";
import type { FC } from "hono/jsx";

export const PrRowItem: FC<{
  pr: PullRequest;
  linkedIssueCount: number;
}> = ({ pr, linkedIssueCount }) => (
  <a
    href={`#pr-${pr.id}`}
    class="flex items-center gap-3 border-b border-base-300 px-4 py-3 transition hover:bg-base-200/50"
  >
    <PrStateChip state={pr.state} />

    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2">
        <span class="font-mono text-xs text-base-content/40">#{pr.number}</span>
        <span class="truncate text-sm font-medium text-base-content">
          {pr.title}
        </span>
      </div>
      <div class="mt-0.5 flex items-center gap-2 text-xs text-base-content/40">
        <span>{pr.author}</span>
        <span>•</span>
        <span>{timeAgo(pr.createdAt)}</span>
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs">
      {linkedIssueCount > 0 ? (
        <span class="inline-flex items-center gap-0.5 rounded-md bg-base-200 px-2 py-1">
          <IconPullRequest class="h-3 w-3" />
          {linkedIssueCount}
        </span>
      ) : null}
    </div>
  </a>
);

export const PrList: FC<{
  prs: PullRequest[];
  linkedIssueCounts: Map<string, number>;
}> = ({ prs, linkedIssueCounts }) => (
  <div class="rounded-3xl border border-base-300 bg-base-100 shadow-sm">
    {prs.length === 0 ? (
      <div class="px-4 py-8 text-center text-sm text-base-content/40">
        No pull requests found
      </div>
    ) : (
      prs.map((pr) => (
        <PrRowItem
          key={pr.id}
          pr={pr}
          linkedIssueCount={linkedIssueCounts.get(pr.id) ?? 0}
        />
      ))
    )}
  </div>
);
