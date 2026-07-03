create table if not exists projects (
  id text primary key,
  name text not null,
  slug text not null unique,
  repo text not null,
  stars integer not null,
  language text not null,
  status text not null check (status in ('active', 'maintenance', 'archived')),
  summary text not null,
  created_at text not null
);

create table if not exists issues (
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
);
