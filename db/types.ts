import { z } from "zod";

export const projectStatusSchema = z.enum([
  "planning",
  "active",
  "paused",
  "done",
]);

export const projectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2).max(80),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: projectStatusSchema,
  summary: z.string().max(280),
  createdAt: z.string(),
});

export const createProjectSchema = projectSchema.pick({
  name: true,
  status: true,
  summary: true,
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
