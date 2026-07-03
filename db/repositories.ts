import type { CreateProject, FileRecord, JobRecord, Project } from "@/db/types";
import { nowIso, slugify } from "@/db/types";

type Row = Record<string, unknown>;

async function all<T>(db: D1Database, sql: string, ...bindings: unknown[]) {
  const result = await db
    .prepare(sql)
    .bind(...bindings)
    .all<T>();
  return result.results ?? [];
}

export async function listProjects(db: D1Database): Promise<Project[]> {
  return all<Project>(
    db,
    "select id, name, slug, status, summary, created_at as createdAt from projects order by created_at desc",
  );
}

export async function createProject(
  db: D1Database,
  input: CreateProject,
): Promise<Project> {
  const createdAt = nowIso();
  const project = {
    id: crypto.randomUUID(),
    name: input.name,
    slug: await uniqueProjectSlug(db, slugify(input.name)),
    status: input.status,
    summary: input.summary,
    createdAt,
  };

  await db
    .prepare(
      "insert into projects (id, name, slug, status, summary, created_at) values (?, ?, ?, ?, ?, ?)",
    )
    .bind(
      project.id,
      project.name,
      project.slug,
      project.status,
      project.summary,
      project.createdAt,
    )
    .run();

  return project;
}

async function uniqueProjectSlug(db: D1Database, baseSlug: string) {
  const rootSlug = baseSlug || "project";
  let slug = rootSlug;
  let suffix = 2;

  while (true) {
    const existing = await all<Row>(
      db,
      "select id from projects where slug = ? limit 1",
      slug,
    );
    if (existing.length === 0) {
      return slug;
    }
    slug = `${rootSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function seedProjects(db: D1Database) {
  const existing = await all<Row>(db, "select id from projects limit 1");
  if (existing.length > 0) {
    return;
  }

  await createProject(db, {
    name: "Worker launch",
    status: "active",
    summary: "Ship the Hono Worker shell, routes, and CI.",
  });
  await createProject(db, {
    name: "Design system",
    status: "planning",
    summary: "Audit daisyUI components in the local showroom.",
  });
}

export async function listFiles(db: D1Database): Promise<FileRecord[]> {
  return all<FileRecord>(
    db,
    "select id, key, filename, content_type as contentType, size, created_at as createdAt from files order by created_at desc",
  );
}

export async function recordFile(
  db: D1Database,
  file: Omit<FileRecord, "id" | "createdAt">,
): Promise<FileRecord> {
  const record = { ...file, id: crypto.randomUUID(), createdAt: nowIso() };
  await db
    .prepare(
      "insert into files (id, key, filename, content_type, size, created_at) values (?, ?, ?, ?, ?, ?)",
    )
    .bind(
      record.id,
      record.key,
      record.filename,
      record.contentType,
      record.size,
      record.createdAt,
    )
    .run();
  return record;
}

export async function listJobs(db: D1Database): Promise<JobRecord[]> {
  return all<JobRecord>(
    db,
    "select id, kind, status, payload, created_at as createdAt from jobs order by created_at desc limit 50",
  );
}

export async function recordJob(
  db: D1Database,
  job: Omit<JobRecord, "id" | "createdAt">,
): Promise<JobRecord> {
  const record = { ...job, id: crypto.randomUUID(), createdAt: nowIso() };
  await db
    .prepare(
      "insert into jobs (id, kind, status, payload, created_at) values (?, ?, ?, ?, ?)",
    )
    .bind(
      record.id,
      record.kind,
      record.status,
      record.payload,
      record.createdAt,
    )
    .run();
  return record;
}
