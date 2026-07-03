import type {
  CreateIssue,
  CreateProject,
  FileRecord,
  Issue,
  IssueStatus,
  JobRecord,
  Project,
} from "@/db/types";
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
    "select id, name, slug, repo, stars, language, status, summary, created_at as createdAt from projects order by stars desc",
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
    repo: input.repo,
    stars: input.stars,
    language: input.language,
    status: input.status,
    summary: input.summary,
    createdAt,
  };

  await db
    .prepare(
      "insert into projects (id, name, slug, repo, stars, language, status, summary, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      project.id,
      project.name,
      project.slug,
      project.repo,
      project.stars,
      project.language,
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

  await createSeedProject(db, {
    id: "mira",
    name: "Mira Core",
    slug: "mira-core",
    repo: "open-mira/mira",
    stars: 18420,
    language: "TypeScript",
    status: "active",
    summary: "Open-source issue planning for maintainers and contributors.",
    createdAt: nowIso(),
  });
  await createSeedProject(db, {
    id: "hono",
    name: "Hono Tracker",
    slug: "hono-tracker",
    repo: "honojs/hono",
    stars: 25980,
    language: "TypeScript",
    status: "active",
    summary: "Community backlog for fast edge APIs and middleware ideas.",
    createdAt: nowIso(),
  });
  await createSeedProject(db, {
    id: "htmx",
    name: "HTMX Ideas",
    slug: "htmx-ideas",
    repo: "bigskysoftware/htmx",
    stars: 46800,
    language: "JavaScript",
    status: "maintenance",
    summary: "Issue triage and docs tasks for hypermedia-driven interfaces.",
    createdAt: nowIso(),
  });

  await createIssue(db, {
    projectId: "mira",
    title: "Design maintainer dashboard cards",
    status: "todo",
    priority: "high",
    type: "feature",
    assignee: "Ada",
    labels: "ui,maintainers",
  });
  await createIssue(db, {
    projectId: "hono",
    title: "Document Cloudflare queue retry pattern",
    status: "in_progress",
    priority: "medium",
    type: "docs",
    assignee: "Grace",
    labels: "docs,workers",
  });
  await createIssue(db, {
    projectId: "htmx",
    title: "Triage stale extension issue",
    status: "review",
    priority: "low",
    type: "task",
    assignee: "Linus",
    labels: "triage",
  });
}

async function createSeedProject(
  db: D1Database,
  project: Project,
): Promise<Project> {
  await db
    .prepare(
      "insert into projects (id, name, slug, repo, stars, language, status, summary, created_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      project.id,
      project.name,
      project.slug,
      project.repo,
      project.stars,
      project.language,
      project.status,
      project.summary,
      project.createdAt,
    )
    .run();
  return project;
}

export async function listIssues(db: D1Database): Promise<Issue[]> {
  return all<Issue>(
    db,
    "select id, project_id as projectId, title, status, priority, type, assignee, labels, created_at as createdAt, updated_at as updatedAt from issues order by updated_at desc",
  );
}

export async function createIssue(
  db: D1Database,
  input: CreateIssue,
): Promise<Issue> {
  const timestamp = nowIso();
  const issue = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  await db
    .prepare(
      "insert into issues (id, project_id, title, status, priority, type, assignee, labels, created_at, updated_at) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      issue.id,
      issue.projectId,
      issue.title,
      issue.status,
      issue.priority,
      issue.type,
      issue.assignee,
      issue.labels,
      issue.createdAt,
      issue.updatedAt,
    )
    .run();

  return issue;
}

export async function updateIssueStatus(
  db: D1Database,
  id: string,
  status: IssueStatus,
) {
  const updatedAt = nowIso();
  await db
    .prepare("update issues set status = ?, updated_at = ? where id = ?")
    .bind(status, updatedAt, id)
    .run();
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
