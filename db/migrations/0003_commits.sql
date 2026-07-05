create table if not exists commits (
  id text primary key,
  pull_request_id text not null,
  project_id text not null,
  sha text not null,
  message text not null,
  author text not null,
  created_at text not null
);
