import { z } from "zod";

export const projectStatusSchema = z.enum([
  "active",
  "maintenance",
  "archived",
]);

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  repo: z.string().regex(/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/),
  stars: z.number().int().nonnegative(),
  language: z.string().min(1).max(40),
  status: projectStatusSchema,
  summary: z.string().max(280),
  createdAt: z.string(),
});

export const createProjectSchema = projectSchema.pick({
  name: true,
  repo: true,
  stars: true,
  language: true,
  status: true,
  summary: true,
});

export const issueStatusSchema = z.enum([
  "backlog",
  "todo",
  "in_progress",
  "review",
  "done",
]);

export const issuePrioritySchema = z.enum(["low", "medium", "high", "urgent"]);
export const issueTypeSchema = z.enum(["task", "bug", "feature", "docs"]);

export const issueSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  title: z.string().min(3).max(100),
  status: issueStatusSchema,
  priority: issuePrioritySchema,
  type: issueTypeSchema,
  assignee: z.string().min(1).max(60),
  labels: z.string().max(120),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const createIssueSchema = issueSchema.pick({
  projectId: true,
  title: true,
  status: true,
  priority: true,
  type: true,
  assignee: true,
  labels: true,
});

export const pullRequestStateSchema = z.enum(["open", "merged", "closed"]);

export const pullRequestSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(3).max(140),
  state: pullRequestStateSchema,
  author: z.string().min(1).max(60),
  createdAt: z.string(),
  mergedAt: z.string().nullable(),
});

export const issueLinkTypeSchema = z.enum(["closes", "fixes", "references"]);

export const issueLinkSchema = z.object({
  id: z.string().min(1),
  issueId: z.string().min(1),
  pullRequestId: z.string().min(1),
  linkType: issueLinkTypeSchema,
  createdAt: z.string(),
});

export const commitSchema = z.object({
  id: z.string().min(1),
  pullRequestId: z.string().min(1),
  projectId: z.string().min(1),
  sha: z.string().min(4).max(40),
  message: z.string().min(1).max(200),
  author: z.string().min(1).max(60),
  createdAt: z.string(),
});

export const activityEntityTypeSchema = z.enum([
  "issue",
  "pull_request",
  "project",
]);

export const activityVerbSchema = z.enum([
  "opened",
  "closed",
  "merged",
  "commented",
  "status_changed",
  "linked",
  "created",
]);

export const activityEventSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  entityType: activityEntityTypeSchema,
  entityId: z.string().min(1),
  verb: activityVerbSchema,
  actor: z.string().min(1).max(60),
  summary: z.string().min(1).max(200),
  createdAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type Issue = z.infer<typeof issueSchema>;
export type CreateIssue = z.infer<typeof createIssueSchema>;
export type IssueStatus = z.infer<typeof issueStatusSchema>;
export type IssuePriority = z.infer<typeof issuePrioritySchema>;
export type IssueType = z.infer<typeof issueTypeSchema>;
export type PullRequest = z.infer<typeof pullRequestSchema>;
export type PullRequestState = z.infer<typeof pullRequestStateSchema>;
export type IssueLink = z.infer<typeof issueLinkSchema>;
export type IssueLinkType = z.infer<typeof issueLinkTypeSchema>;
export type Commit = z.infer<typeof commitSchema>;
export type ActivityEvent = z.infer<typeof activityEventSchema>;
export type ActivityEntityType = z.infer<typeof activityEntityTypeSchema>;
export type ActivityVerb = z.infer<typeof activityVerbSchema>;

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function nowIso() {
  return new Date().toISOString();
}
