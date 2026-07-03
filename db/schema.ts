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
