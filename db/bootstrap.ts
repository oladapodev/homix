const schemaStatements = [
  `create table if not exists projects (
    id text primary key,
    name text not null,
    slug text not null unique,
    repo text not null,
    stars integer not null,
    language text not null,
    status text not null check (status in ('active', 'maintenance', 'archived')),
    summary text not null,
    created_at text not null
  )`,
  `create table if not exists issues (
    id text primary key,
    project_id text not null,
    title text not null,
    status text not null check (status in ('backlog', 'todo', 'in_progress', 'review', 'done')),
    priority text not null check (priority in ('low', 'medium', 'high', 'urgent')),
    type text not null check (type in ('task', 'bug', 'feature', 'docs')),
    assignee text not null,
    labels text not null,
    created_at text not null,
    updated_at text not null
  )`,
  `create table if not exists pull_requests (
    id text primary key,
    project_id text not null,
    number integer not null,
    title text not null,
    state text not null check (state in ('open', 'merged', 'closed')),
    author text not null,
    created_at text not null,
    merged_at text
  )`,
  `create table if not exists issue_links (
    id text primary key,
    issue_id text not null,
    pull_request_id text not null,
    link_type text not null check (link_type in ('closes', 'fixes', 'references')),
    created_at text not null
  )`,
  `create table if not exists commits (
    id text primary key,
    pull_request_id text not null,
    project_id text not null,
    sha text not null,
    message text not null,
    author text not null,
    created_at text not null
  )`,
  `create table if not exists activity_events (
    id text primary key,
    project_id text not null,
    entity_type text not null check (entity_type in ('issue', 'pull_request', 'project')),
    entity_id text not null,
    verb text not null check (verb in ('opened', 'closed', 'merged', 'commented', 'status_changed', 'linked', 'created')),
    actor text not null,
    summary text not null,
    created_at text not null
  )`,
];

let schemaReady: Promise<unknown> | undefined;

export function ensureSchema(db: D1Database) {
  schemaReady ??= Promise.all(
    schemaStatements.map((statement) => db.prepare(statement).run()),
  );
  return schemaReady;
}
