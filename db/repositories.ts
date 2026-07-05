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

  const miraDashboard = await createIssue(db, {
    projectId: "mira",
    title: "Design maintainer dashboard cards",
    status: "todo",
    priority: "high",
    type: "feature",
    assignee: "Ada",
    labels: "ui,maintainers",
  });
  const miraDragFix = await createIssue(db, {
    projectId: "mira",
    title: "Fix drag handle jump on kanban card",
    status: "in_progress",
    priority: "high",
    type: "bug",
    assignee: "Grace",
    labels: "bug,board",
  });
  const miraOnboarding = await createIssue(db, {
    projectId: "mira",
    title: "Add contributor onboarding checklist",
    status: "backlog",
    priority: "medium",
    type: "docs",
    assignee: "Linus",
    labels: "docs,onboarding",
  });
  const miraFilters = await createIssue(db, {
    projectId: "mira",
    title: "Support saved board filters",
    status: "done",
    priority: "medium",
    type: "feature",
    assignee: "Ada",
    labels: "ui",
  });

  const honoRetryDocs = await createIssue(db, {
    projectId: "hono",
    title: "Document edge API retry pattern",
    status: "in_progress",
    priority: "medium",
    type: "docs",
    assignee: "Grace",
    labels: "docs,edge",
  });
  const honoStreaming = await createIssue(db, {
    projectId: "hono",
    title: "Support streaming response helper",
    status: "todo",
    priority: "high",
    type: "feature",
    assignee: "Mei",
    labels: "feature,streaming",
  });
  const honoTypes = await createIssue(db, {
    projectId: "hono",
    title: "Fix middleware type inference",
    status: "done",
    priority: "high",
    type: "bug",
    assignee: "Kenji",
    labels: "bug,types",
  });

  const htmxTriage = await createIssue(db, {
    projectId: "htmx",
    title: "Triage stale extension issue",
    status: "review",
    priority: "low",
    type: "task",
    assignee: "Linus",
    labels: "triage",
  });
  const htmxHistoryDocs = await createIssue(db, {
    projectId: "htmx",
    title: "Improve hx-boost history docs",
    status: "backlog",
    priority: "low",
    type: "docs",
    assignee: "Sam",
    labels: "docs",
  });
  const htmxSse = await createIssue(db, {
    projectId: "htmx",
    title: "Fix sse extension reconnect loop",
    status: "in_progress",
    priority: "urgent",
    type: "bug",
    assignee: "Priya",
    labels: "bug,sse",
  });

  const miraDragPr = await createPullRequest(db, {
    id: "mira-pr-142",
    projectId: "mira",
    number: 142,
    title: "Fix drag handle offset calculation",
    state: "merged",
    author: "Grace",
    createdAt: minutesAgo(180),
    mergedAt: minutesAgo(90),
  });
  const miraFiltersPr = await createPullRequest(db, {
    id: "mira-pr-150",
    projectId: "mira",
    number: 150,
    title: "Add saved filters to board",
    state: "merged",
    author: "Ada",
    createdAt: minutesAgo(150),
    mergedAt: minutesAgo(60),
  });
  const miraOnboardingPr = await createPullRequest(db, {
    id: "mira-pr-151",
    projectId: "mira",
    number: 151,
    title: "Draft onboarding checklist doc",
    state: "open",
    author: "Linus",
    createdAt: minutesAgo(45),
    mergedAt: null,
  });

  const honoRetryPr = await createPullRequest(db, {
    id: "hono-pr-980",
    projectId: "hono",
    number: 980,
    title: "Add retry pattern doc section",
    state: "open",
    author: "Grace",
    createdAt: minutesAgo(120),
    mergedAt: null,
  });
  const honoTypesPr = await createPullRequest(db, {
    id: "hono-pr-991",
    projectId: "hono",
    number: 991,
    title: "Fix generic inference in use()",
    state: "merged",
    author: "Kenji",
    createdAt: minutesAgo(200),
    mergedAt: minutesAgo(20),
  });

  const htmxSsePr = await createPullRequest(db, {
    id: "htmx-pr-2210",
    projectId: "htmx",
    number: 2210,
    title: "Fix sse reconnect backoff",
    state: "open",
    author: "Priya",
    createdAt: minutesAgo(30),
    mergedAt: null,
  });
  const htmxTriagePr = await createPullRequest(db, {
    id: "htmx-pr-2205",
    projectId: "htmx",
    number: 2205,
    title: "Close stale extension issue thread",
    state: "closed",
    author: "Linus",
    createdAt: minutesAgo(300),
    mergedAt: null,
  });

  const commitSeeds: Array<
    [
      pullRequestId: string,
      projectId: string,
      message: string,
      author: string,
      minutes: number,
    ]
  > = [
    [
      "mira-pr-142",
      "mira",
      "fix: correct drag handle offset calculation",
      "Grace",
      179,
    ],
    [
      "mira-pr-142",
      "mira",
      "test: add regression test for drag offset",
      "Grace",
      165,
    ],
    [
      "mira-pr-142",
      "mira",
      "chore: bump board interaction changelog",
      "Grace",
      150,
    ],
    [
      "mira-pr-150",
      "mira",
      "feat: add saved filter presets to board store",
      "Ada",
      149,
    ],
    [
      "mira-pr-150",
      "mira",
      "feat: wire filter presets into board UI",
      "Ada",
      120,
    ],
    [
      "mira-pr-151",
      "mira",
      "docs: draft contributor onboarding checklist",
      "Linus",
      44,
    ],
    [
      "hono-pr-980",
      "hono",
      "docs: add retry pattern section to edge API guide",
      "Grace",
      119,
    ],
    [
      "hono-pr-980",
      "hono",
      "docs: add code sample for exponential backoff",
      "Grace",
      100,
    ],
    [
      "hono-pr-991",
      "hono",
      "fix: correct generic inference in use()",
      "Kenji",
      199,
    ],
    [
      "hono-pr-991",
      "hono",
      "test: cover generic middleware inference",
      "Kenji",
      180,
    ],
    [
      "hono-pr-991",
      "hono",
      "refactor: simplify generic constraint checks",
      "Kenji",
      160,
    ],
    [
      "htmx-pr-2210",
      "htmx",
      "fix: back off sse reconnect attempts exponentially",
      "Priya",
      29,
    ],
    [
      "htmx-pr-2210",
      "htmx",
      "test: simulate flaky sse connection drops",
      "Priya",
      20,
    ],
    [
      "htmx-pr-2205",
      "htmx",
      "chore: close stale extension issue thread",
      "Linus",
      299,
    ],
  ];

  for (const [
    pullRequestId,
    projectId,
    message,
    author,
    minutes,
  ] of commitSeeds) {
    await createCommit(db, {
      id: crypto.randomUUID(),
      pullRequestId,
      projectId,
      sha: shortSha(),
      message,
      author,
      createdAt: minutesAgo(minutes),
    });
  }

  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: miraDragFix.id,
    pullRequestId: miraDragPr.id,
    linkType: "fixes",
    createdAt: miraDragPr.createdAt,
  });
  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: miraFilters.id,
    pullRequestId: miraFiltersPr.id,
    linkType: "closes",
    createdAt: miraFiltersPr.createdAt,
  });
  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: miraOnboarding.id,
    pullRequestId: miraOnboardingPr.id,
    linkType: "references",
    createdAt: miraOnboardingPr.createdAt,
  });
  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: honoRetryDocs.id,
    pullRequestId: honoRetryPr.id,
    linkType: "references",
    createdAt: honoRetryPr.createdAt,
  });
  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: honoTypes.id,
    pullRequestId: honoTypesPr.id,
    linkType: "closes",
    createdAt: honoTypesPr.createdAt,
  });
  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: htmxSse.id,
    pullRequestId: htmxSsePr.id,
    linkType: "fixes",
    createdAt: htmxSsePr.createdAt,
  });
  await createIssueLink(db, {
    id: crypto.randomUUID(),
    issueId: htmxTriage.id,
    pullRequestId: htmxTriagePr.id,
    linkType: "closes",
    createdAt: htmxTriagePr.createdAt,
  });

  const activity: Array<
    [
      string,
      ActivityEvent["entityType"],
      string,
      ActivityEvent["verb"],
      string,
      string,
      number,
    ]
  > = [
    [
      "mira",
      "issue",
      miraDashboard.id,
      "opened",
      "Ada",
      "opened Design maintainer dashboard cards",
      360,
    ],
    [
      "mira",
      "issue",
      miraDragFix.id,
      "opened",
      "Grace",
      "opened Fix drag handle jump on kanban card",
      200,
    ],
    [
      "mira",
      "pull_request",
      miraDragPr.id,
      "opened",
      "Grace",
      "opened PR #142 Fix drag handle offset calculation",
      180,
    ],
    [
      "mira",
      "pull_request",
      miraDragPr.id,
      "linked",
      "Grace",
      "linked PR #142 to Fix drag handle jump on kanban card",
      178,
    ],
    [
      "mira",
      "pull_request",
      miraDragPr.id,
      "merged",
      "Ada",
      "merged PR #142 Fix drag handle offset calculation",
      90,
    ],
    [
      "mira",
      "issue",
      miraFilters.id,
      "opened",
      "Ada",
      "opened Support saved board filters",
      170,
    ],
    [
      "mira",
      "pull_request",
      miraFiltersPr.id,
      "opened",
      "Ada",
      "opened PR #150 Add saved filters to board",
      150,
    ],
    [
      "mira",
      "pull_request",
      miraFiltersPr.id,
      "merged",
      "Grace",
      "merged PR #150 Add saved filters to board",
      60,
    ],
    [
      "mira",
      "issue",
      miraFilters.id,
      "status_changed",
      "Grace",
      "moved Support saved board filters to Done",
      58,
    ],
    [
      "mira",
      "pull_request",
      miraOnboardingPr.id,
      "opened",
      "Linus",
      "opened PR #151 Draft onboarding checklist doc",
      45,
    ],
    [
      "hono",
      "issue",
      honoRetryDocs.id,
      "opened",
      "Grace",
      "opened Document edge API retry pattern",
      220,
    ],
    [
      "hono",
      "pull_request",
      honoTypesPr.id,
      "opened",
      "Kenji",
      "opened PR #991 Fix generic inference in use()",
      200,
    ],
    [
      "hono",
      "pull_request",
      honoTypesPr.id,
      "merged",
      "Mei",
      "merged PR #991 Fix generic inference in use()",
      20,
    ],
    [
      "hono",
      "issue",
      honoTypes.id,
      "status_changed",
      "Mei",
      "moved Fix middleware type inference to Done",
      18,
    ],
    [
      "hono",
      "pull_request",
      honoRetryPr.id,
      "opened",
      "Grace",
      "opened PR #980 Add retry pattern doc section",
      120,
    ],
    [
      "htmx",
      "pull_request",
      htmxTriagePr.id,
      "closed",
      "Linus",
      "closed PR #2205 Close stale extension issue thread",
      300,
    ],
    [
      "htmx",
      "issue",
      htmxTriage.id,
      "status_changed",
      "Linus",
      "moved Triage stale extension issue to Review",
      295,
    ],
    [
      "htmx",
      "issue",
      htmxSse.id,
      "opened",
      "Priya",
      "opened Fix sse extension reconnect loop",
      40,
    ],
    [
      "htmx",
      "pull_request",
      htmxSsePr.id,
      "opened",
      "Priya",
      "opened PR #2210 Fix sse reconnect backoff",
      30,
    ],
    [
      "htmx",
      "pull_request",
      htmxSsePr.id,
      "linked",
      "Priya",
      "linked PR #2210 to Fix sse extension reconnect loop",
      29,
    ],
  ];

  for (const [
    projectId,
    entityType,
    entityId,
    verb,
    actor,
    summary,
    minutes,
  ] of activity) {
    await createActivityEvent(db, {
      id: crypto.randomUUID(),
      projectId,
      entityType,
      entityId,
      verb,
      actor,
      summary,
      createdAt: minutesAgo(minutes),
    });
  }
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
