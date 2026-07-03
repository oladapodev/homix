create table if not exists user (
  id text primary key,
  name text not null,
  email text not null unique,
  email_verified integer not null default 0,
  image text,
  created_at text not null,
  updated_at text not null
);

create table if not exists session (
  id text primary key,
  expires_at text not null,
  token text not null unique,
  created_at text not null,
  updated_at text not null,
  ip_address text,
  user_agent text,
  user_id text not null
);

create table if not exists account (
  id text primary key,
  account_id text not null,
  provider_id text not null,
  user_id text not null,
  access_token text,
  refresh_token text,
  id_token text,
  access_token_expires_at text,
  refresh_token_expires_at text,
  scope text,
  password text,
  created_at text not null,
  updated_at text not null
);

create table if not exists verification (
  id text primary key,
  identifier text not null,
  value text not null,
  expires_at text not null,
  created_at text,
  updated_at text
);

create table if not exists projects (
  id text primary key,
  name text not null,
  slug text not null unique,
  status text not null check (status in ('planning', 'active', 'paused', 'done')),
  summary text not null,
  created_at text not null
);

create table if not exists files (
  id text primary key,
  key text not null unique,
  filename text not null,
  content_type text not null,
  size integer not null,
  created_at text not null
);

create table if not exists jobs (
  id text primary key,
  kind text not null check (kind in ('queue', 'cron')),
  status text not null check (status in ('queued', 'processed', 'failed')),
  payload text not null,
  created_at text not null
);
