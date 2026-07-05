---
layout: home

hero:
  name: Homix
  text: Hono + HTMX on Cloudflare Workers
  tagline: A flat Bun workspace for server-rendered full-stack applications with D1, R2, Queues, Durable Objects, OpenAPI, and focused tests.
  actions:
    - theme: brand
      text: Get Started
      link: /setup
    - theme: alt
      text: Architecture
      link: /architecture

features:
  - title: Server-rendered by default
    details: Hono JSX renders full pages and HTMX fragments from the same Worker runtime.
  - title: Cloudflare-native boundaries
    details: D1, R2, Queues, Cron, and Durable Objects are isolated behind platform and service modules.
  - title: Typed contracts
    details: Zod schemas, Hono OpenAPI, generated Worker binding types, and repository tests keep changes explicit.
---

## What This Repository Is

Homix is a template, not a product demo. The Worker includes a small sample dashboard to exercise the stack locally, but the primary project experience on `main` is this documentation site.

Use the docs to understand where code belongs, how data moves through the app, and which commands verify the template before deployment.

