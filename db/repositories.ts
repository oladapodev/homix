import type {
  ActivityEvent,
  Commit,
  CreateIssue,
  CreateProject,
  Issue,
  IssueLink,
  IssueStatus,
  Project,
  PullRequest,
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

export async function getProjectBySlug(
  db: D1Database,
  slug: string,
): Promise<Project | undefined> {
  const rows = await all<Project>(
    db,
    "select id, name, slug, repo, stars, language, status, summary, created_at as createdAt from projects where slug = ? limit 1",
    slug,
  );
  return rows[0];
}

export async function getProjectById(
  db: D1Database,
  id: string,
): Promise<Project | undefined> {
  const rows = await all<Project>(
    db,
    "select id, name, slug, repo, stars, language, status, summary, created_at as createdAt from projects where id = ? limit 1",
    id,
  );
  return rows[0];
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

  // Single real tracked project; issues and PRs arrive via GitHub sync
  // (POST /api/sync or the cron trigger).
  await createSeedProject(db, {
    id: "oladapodev-homix",
    name: "Homix",
    slug: "oladapodev-homix",
    repo: "oladapodev/homix",
    stars: 0,
    language: "TypeScript",
    status: "active",
    summary: "Hono + htmx worker template powering the Mira project tracker.",
    createdAt: nowIso(),
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

export async function listPullRequests(db: D1Database): Promise<PullRequest[]> {
  return all<PullRequest>(
    db,
    "select id, project_id as projectId, number, title, state, author, created_at as createdAt, merged_at as mergedAt from pull_requests order by created_at desc",
  );
}

export async function createPullRequest(
  db: D1Database,
  pr: PullRequest,
): Promise<PullRequest> {
  await db
    .prepare(
      "insert into pull_requests (id, project_id, number, title, state, author, created_at, merged_at) values (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      pr.id,
      pr.projectId,
      pr.number,
      pr.title,
      pr.state,
      pr.author,
      pr.createdAt,
      pr.mergedAt,
    )
    .run();
  return pr;
}

export async function listIssueLinks(db: D1Database): Promise<IssueLink[]> {
  return all<IssueLink>(
    db,
    "select id, issue_id as issueId, pull_request_id as pullRequestId, link_type as linkType, created_at as createdAt from issue_links order by created_at desc",
  );
}

export async function createIssueLink(
  db: D1Database,
  link: IssueLink,
): Promise<IssueLink> {
  await db
    .prepare(
      "insert into issue_links (id, issue_id, pull_request_id, link_type, created_at) values (?, ?, ?, ?, ?)",
    )
    .bind(
      link.id,
      link.issueId,
      link.pullRequestId,
      link.linkType,
      link.createdAt,
    )
    .run();
  return link;
}

export async function listActivityEvents(
  db: D1Database,
  limit = 50,
): Promise<ActivityEvent[]> {
  return all<ActivityEvent>(
    db,
    "select id, project_id as projectId, entity_type as entityType, entity_id as entityId, verb, actor, summary, created_at as createdAt from activity_events order by created_at desc limit ?",
    limit,
  );
}

export async function createActivityEvent(
  db: D1Database,
  event: ActivityEvent,
): Promise<ActivityEvent> {
  await db
    .prepare(
      "insert into activity_events (id, project_id, entity_type, entity_id, verb, actor, summary, created_at) values (?, ?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      event.id,
      event.projectId,
      event.entityType,
      event.entityId,
      event.verb,
      event.actor,
      event.summary,
      event.createdAt,
    )
    .run();
  return event;
}

export async function listCommits(db: D1Database): Promise<Commit[]> {
  return all<Commit>(
    db,
    "select id, pull_request_id as pullRequestId, project_id as projectId, sha, message, author, created_at as createdAt from commits order by created_at desc",
  );
}

export async function createCommit(
  db: D1Database,
  commit: Commit,
): Promise<Commit> {
  await db
    .prepare(
      "insert into commits (id, pull_request_id, project_id, sha, message, author, created_at) values (?, ?, ?, ?, ?, ?, ?)",
    )
    .bind(
      commit.id,
      commit.pullRequestId,
      commit.projectId,
      commit.sha,
      commit.message,
      commit.author,
      commit.createdAt,
    )
    .run();
  return commit;
}

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

function shortSha() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 7);
}
