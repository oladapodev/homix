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

export const fileRecordSchema = z.object({
  id: z.string(),
  key: z.string(),
  filename: z.string(),
  contentType: z.string(),
  size: z.number().int().nonnegative(),
  createdAt: z.string(),
});

export const jobSchema = z.object({
  id: z.string(),
  kind: z.enum(["queue", "cron"]),
  status: z.enum(["queued", "processed", "failed"]),
  payload: z.string(),
  createdAt: z.string(),
});

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type Issue = z.infer<typeof issueSchema>;
export type CreateIssue = z.infer<typeof createIssueSchema>;
export type IssueStatus = z.infer<typeof issueStatusSchema>;
export type FileRecord = z.infer<typeof fileRecordSchema>;
export type JobRecord = z.infer<typeof jobSchema>;

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
