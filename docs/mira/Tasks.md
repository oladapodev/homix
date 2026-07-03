# Mira Demo Tasks

Mira is the demo application for the `demo` branch. It is a compact open-source project tracker: a Jira-like board for repositories, issues, contributors, files, background activity, and API consumers.

## Product Goal

- [x] Replace the generic project-board demo with Mira.
- [x] Show a realistic open-source project management workflow without becoming a full Jira clone.
- [x] Demonstrate Hono, HTMX, Alpine, daisyUI, D1, R2, Queues, Cron, Durable Objects, OpenAPI, and Scalar in one cohesive example.

## Core Demo Model

- [x] Add repository/project records with name, slug, GitHub-style repo path, star count, language, status, summary, and created date.
- [x] Add issue/task records with title, status, priority, type, assignee, labels, project id, created date, and updated date.
- [x] Seed Mira with recognizable open-source-style project data.
- [x] Keep auth tables ready but not central to the demo.

## Kanban And HTMX

- [x] Render a Mira dashboard with repository stats and issue counts.
- [x] Render a kanban board with `backlog`, `todo`, `in_progress`, `review`, and `done`.
- [x] Add an HTMX issue creation form.
- [x] Add HTMX status move actions on issue cards.
- [x] Use out-of-band swaps for live issue counts.
- [x] Redirect non-HTMX form submissions back to the dashboard anchor.

## Alpine And UI

- [x] Add a small Alpine island for local board filtering or view mode.
- [x] Keep daisyUI badges, buttons, tabs, stats, alerts, and cards visible in the page.
- [x] Keep the theme island but make it secondary to Mira.

## Files, Jobs, Cron, Durable Objects

- [x] Keep R2 uploads as issue/project attachments.
- [x] Keep queue-backed activity jobs for issue creation and movement.
- [x] Keep cron-backed maintenance or summary job records.
- [x] Keep Durable Object counter demo as a live board/state example.

## API And Docs

- [x] Add OpenAPI entries for listing projects and issues.
- [x] Keep `/doc` and `/reference` working.
- [x] Keep `/api/health` working.

## Tests And Verification

- [x] Add tests for issue creation and status movement.
- [x] Update dashboard tests for Mira copy and board output.
- [x] Run `bun run build:assets`.
- [x] Run `bun run build:css`.
- [x] Run `bun run lint`.
- [x] Run `bun run typecheck`.
- [x] Run `bun run test`.
