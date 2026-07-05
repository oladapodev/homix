create table if not exists pull_requests (
  id text primary key,
  project_id text not null,
  number integer not null,
  title text not null,
  state text not null check (state in ('open', 'merged', 'closed')),
  author text not null,
  created_at text not null,
  merged_at text
);

create table if not exists issue_links (
  id text primary key,
  issue_id text not null,
  pull_request_id text not null,
  link_type text not null check (link_type in ('closes', 'fixes', 'references')),
  created_at text not null
);

create table if not exists activity_events (
  id text primary key,
  project_id text not null,
  entity_type text not null check (entity_type in ('issue', 'pull_request', 'project')),
  entity_id text not null,
  verb text not null check (verb in ('opened', 'closed', 'merged', 'commented', 'status_changed', 'linked', 'created')),
  actor text not null,
  summary text not null,
  created_at text not null
);
