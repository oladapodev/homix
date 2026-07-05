import type { Commit, PullRequest, PullRequestState } from "@/db/types";
import { CommitTagChip, PrStateChip } from "@/web/components/chip";
import {
  IconCheckCircle,
  IconCommit,
  IconGitMerge,
  IconXCircle,
} from "@/web/components/icons";
import {
  initials,
  parseCommitTag,
  parseTitleCategory,
  timeAgo,
} from "@/web/format";
import type { FC } from "hono/jsx";

const stateIcon: Record<PullRequestState, typeof IconCheckCircle> = {
  open: IconCheckCircle,
  merged: IconGitMerge,
  closed: IconXCircle,
};

const stateIconTone: Record<PullRequestState, string> = {
  open: "text-success",
  merged: "text-secondary",
  closed: "text-base-content/30",
};

export const PrRow: FC<{
  pr: PullRequest;
  commits: Commit[];
  compact?: boolean;
}> = ({ pr, commits, compact = false }) => {
  const StateIcon = stateIcon[pr.state];
  const { category, rest } = parseTitleCategory(pr.title);

  return (
    <div class="rounded-lg border border-base-300 bg-base-100 p-3">
      <div class="flex items-start gap-2.5">
        <StateIcon
          class={`mt-0.5 h-4 w-4 shrink-0 ${stateIconTone[pr.state]}`}
        />
        <div class="min-w-0 flex-1">
          <h3 class="truncate text-sm font-semibold text-base-content">
            {category ? (
              <span class="mr-1 text-base-content/35">[{category}]</span>
            ) : null}
            {rest}
          </h3>
          <p class="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-base-content/40">
            <span>#{pr.number}</span>
            <span>{pr.author}</span>
            <span>opened {timeAgo(pr.createdAt)}</span>
            {pr.mergedAt ? <span>merged {timeAgo(pr.mergedAt)}</span> : null}
          </p>
        </div>
        <PrStateChip state={pr.state} />
      </div>
      {!compact && commits.length > 0 ? (
        <div class="mt-2.5 flex flex-col gap-1 border-t border-base-300 pt-2.5">
          {commits.map((commit) => (
            <CommitRow key={commit.id} commit={commit} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

const CommitRow: FC<{ commit: Commit }> = ({ commit }) => {
  const { rest } = parseCommitTag(commit.message);
  return (
    <div class="flex items-center gap-2 text-sm">
      <IconCommit class="h-3.5 w-3.5 shrink-0 text-base-content/25" />
      <code class="shrink-0 font-mono text-[0.68rem] text-base-content/40">
        {commit.sha}
      </code>
      <CommitTagChip message={commit.message} />
      <span class="min-w-0 flex-1 truncate text-base-content/70">{rest}</span>
      <span class="shrink-0 text-[0.6rem] font-bold text-base-content/35">
        {initials(commit.author)}
      </span>
    </div>
  );
};
