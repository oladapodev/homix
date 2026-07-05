import type {
  IssueLinkType,
  IssuePriority,
  IssueStatus,
  IssueType,
  Project,
  PullRequestState,
} from "@/db/types";
import { parseCommitTag, parseTitleCategory } from "@/web/format";
import type { FC, PropsWithChildren } from "hono/jsx";

export type ChipTone =
  | "neutral"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

const badgeToneClass: Record<ChipTone, string> = {
  neutral: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  info: "badge-info",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
};

export const dotToneClass: Record<ChipTone, string> = {
  neutral: "bg-neutral",
  primary: "bg-primary",
  secondary: "bg-secondary",
  accent: "bg-accent",
  info: "bg-info",
  success: "bg-success",
  warning: "bg-warning",
  error: "bg-error",
};

export const textToneClass: Record<ChipTone, string> = {
  neutral: "text-neutral",
  primary: "text-primary",
  secondary: "text-secondary",
  accent: "text-accent",
  info: "text-info",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

export const softBgToneClass: Record<ChipTone, string> = {
  neutral: "bg-neutral/10",
  primary: "bg-primary/10",
  secondary: "bg-secondary/10",
  accent: "bg-accent/10",
  info: "bg-info/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  error: "bg-error/10",
};

export const Chip: FC<
  PropsWithChildren<{ tone: ChipTone; dot?: boolean; class?: string }>
> = ({ tone, dot = true, class: className, children }) => (
  <span
    class={`badge badge-soft ${badgeToneClass[tone]} gap-1.5 rounded-full border-0 px-2.5 py-2.5 text-[0.7rem] font-semibold tracking-wide ${className ?? ""}`}
  >
    {dot ? (
      <span
        class={`inline-block h-1.5 w-1.5 rounded-full ${dotToneClass[tone]}`}
      />
    ) : null}
    {children}
  </span>
);

const statusTone: Record<IssueStatus, ChipTone> = {
  backlog: "neutral",
  todo: "info",
  in_progress: "warning",
  review: "secondary",
  done: "success",
};

const statusLabel: Record<IssueStatus, string> = {
  backlog: "Backlog",
  todo: "Todo",
  in_progress: "In progress",
  review: "In review",
  done: "Done",
};

export const StatusChip: FC<{ status: IssueStatus }> = ({ status }) => (
  <Chip tone={statusTone[status]}>{statusLabel[status]}</Chip>
);

const priorityTone: Record<IssuePriority, ChipTone> = {
  low: "neutral",
  medium: "info",
  high: "warning",
  urgent: "error",
};

export const PriorityChip: FC<{ priority: IssuePriority }> = ({ priority }) => (
  <Chip tone={priorityTone[priority]}>{priority}</Chip>
);

const priorityBars: Record<IssuePriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  urgent: 3,
};

const barHeights = [5, 8, 11];

export const PriorityIcon: FC<{ priority: IssuePriority; class?: string }> = ({
  priority,
  class: className,
}) => {
  const filled = priorityBars[priority];
  const tone = priorityTone[priority];
  return (
    <svg
      viewBox="0 0 14 12"
      class={`${textToneClass[tone]} ${className ?? ""}`}
      aria-hidden="true"
    >
      <title>{priority} priority</title>
      {barHeights.map((height, index) => (
        <rect
          key={height}
          x={index * 5}
          y={12 - height}
          width={3}
          height={height}
          rx={0.75}
          fill="currentColor"
          opacity={index < filled ? 1 : 0.22}
        />
      ))}
    </svg>
  );
};

const typeTone: Record<IssueType, ChipTone> = {
  task: "neutral",
  bug: "error",
  feature: "primary",
  docs: "accent",
};

export const TypeChip: FC<{ type: IssueType }> = ({ type }) => (
  <Chip tone={typeTone[type]}>{type}</Chip>
);

export const TypeDot: FC<{ type: IssueType; class?: string }> = ({
  type,
  class: className,
}) => (
  <span
    title={type}
    class={`inline-block shrink-0 rounded-full ${dotToneClass[typeTone[type]]} ${className ?? ""}`}
  />
);

const prStateTone: Record<PullRequestState, ChipTone> = {
  open: "success",
  merged: "secondary",
  closed: "neutral",
};

const prStateLabel: Record<PullRequestState, string> = {
  open: "Open",
  merged: "Merged",
  closed: "Closed",
};

export const PrStateChip: FC<{ state: PullRequestState }> = ({ state }) => (
  <Chip tone={prStateTone[state]}>{prStateLabel[state]}</Chip>
);

const linkLabel: Record<IssueLinkType, string> = {
  closes: "Closes",
  fixes: "Fixes",
  references: "References",
};

export const LinkTypeLabel = (type: IssueLinkType) => linkLabel[type];

const projectStatusTone: Record<Project["status"], ChipTone> = {
  active: "success",
  maintenance: "warning",
  archived: "neutral",
};

export const ProjectStatusChip: FC<{ status: Project["status"] }> = ({
  status,
}) => (
  <Chip tone={projectStatusTone[status]} dot={false}>
    {status}
  </Chip>
);

export const CategoryChip: FC<{ title: string; class?: string }> = ({
  title,
  class: className,
}) => {
  const { category } = parseTitleCategory(title);
  return (
    <Chip
      tone={category ? "accent" : "neutral"}
      dot={false}
      class={`uppercase ${className ?? ""}`}
    >
      {category ?? "Unorganized"}
    </Chip>
  );
};

const commitTagTone: Record<string, ChipTone> = {
  feat: "primary",
  feature: "primary",
  fix: "error",
  docs: "accent",
  chore: "neutral",
  refactor: "info",
  test: "secondary",
  style: "neutral",
  perf: "warning",
  build: "neutral",
  ci: "neutral",
  merge: "success",
};

export const CommitTagChip: FC<{ message: string }> = ({ message }) => {
  const { tag } = parseCommitTag(message);
  if (!tag) return null;
  return (
    <Chip tone={commitTagTone[tag] ?? "neutral"} dot={false} class="uppercase">
      {tag}
    </Chip>
  );
};
