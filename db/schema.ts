import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  repo: text("repo").notNull(),
  stars: integer("stars").notNull(),
  language: text("language").notNull(),
  status: text("status", {
    enum: ["active", "maintenance", "archived"],
  }).notNull(),
  summary: text("summary").notNull(),
  createdAt: text("created_at").notNull(),
});

export const issues = sqliteTable("issues", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  status: text("status", {
    enum: ["backlog", "todo", "in_progress", "review", "done"],
  }).notNull(),
  priority: text("priority", {
    enum: ["low", "medium", "high", "urgent"],
  }).notNull(),
  type: text("type", { enum: ["task", "bug", "feature", "docs"] }).notNull(),
  assignee: text("assignee").notNull(),
  labels: text("labels").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const pullRequests = sqliteTable("pull_requests", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  state: text("state", {
    enum: ["open", "merged", "closed"],
  }).notNull(),
  author: text("author").notNull(),
  createdAt: text("created_at").notNull(),
  mergedAt: text("merged_at"),
});

export const issueLinks = sqliteTable("issue_links", {
  id: text("id").primaryKey(),
  issueId: text("issue_id").notNull(),
  pullRequestId: text("pull_request_id").notNull(),
  linkType: text("link_type", {
    enum: ["closes", "fixes", "references"],
  }).notNull(),
  createdAt: text("created_at").notNull(),
});

export const commits = sqliteTable("commits", {
  id: text("id").primaryKey(),
  pullRequestId: text("pull_request_id").notNull(),
  projectId: text("project_id").notNull(),
  sha: text("sha").notNull(),
  message: text("message").notNull(),
  author: text("author").notNull(),
  createdAt: text("created_at").notNull(),
});

export const activityEvents = sqliteTable("activity_events", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  entityType: text("entity_type", {
    enum: ["issue", "pull_request", "project"],
  }).notNull(),
  entityId: text("entity_id").notNull(),
  verb: text("verb", {
    enum: [
      "opened",
      "closed",
      "merged",
      "commented",
      "status_changed",
      "linked",
      "created",
    ],
  }).notNull(),
  actor: text("actor").notNull(),
  summary: text("summary").notNull(),
  createdAt: text("created_at").notNull(),
});
