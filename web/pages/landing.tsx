import type { ActivityEvent, Project } from "@/db/types";
import {
  IconActivity,
  IconArrowRight,
  IconBoard,
  IconPullRequest,
  IconSparkle,
} from "@/web/components/icons";
import { Layout, Stat, ThemePicker } from "@/web/components/layout";
import { appConfig } from "@/web/config";
import type { FC } from "hono/jsx";

interface LandingProps {
  projects: Project[];
  projectCount: number;
  issueCount: number;
  linkedPrCount: number;
  recentActivity: ActivityEvent[];
}

const features = [
  {
    icon: IconBoard,
    title: "A board that mirrors GitHub",
    body: "Backlog to done, auto-synced from real issues — no manual re-entry, no drift from what maintainers actually shipped.",
  },
  {
    icon: IconPullRequest,
    title: "Every PR linked to its issue",
    body: "Mira parses closes/fixes references so you see exactly which pull request will resolve which issue, before it merges.",
  },
  {
    icon: IconActivity,
    title: "One live activity timeline",
    body: "Opens, links, merges, and status moves land on a single feed per project — the changelog you wish GitHub gave you.",
  },
] as const;

export function LandingPage({
  projects,
  projectCount,
  issueCount,
  linkedPrCount,
  recentActivity,
}: LandingProps) {
  return (
    <Layout title="Live map for open-source projects">
      <div class="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6">
        <header class="flex items-center justify-between py-6">
          <a class="flex items-center gap-2.5" href="/">
            <span class="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/30">
              <IconSparkle class="h-4.5 w-4.5" />
            </span>
            <span class="text-base font-extrabold tracking-tight">
              {appConfig.name}
            </span>
          </a>
          <nav class="hidden items-center gap-8 text-sm font-semibold text-base-content/60 sm:flex">
            <a class="hover:text-base-content" href="#features">
              Features
            </a>
            <a class="hover:text-base-content" href="#activity">
              Live activity
            </a>
            <a class="hover:text-base-content" href="/reference">
              API
            </a>
          </nav>
          <div class="flex items-center gap-2">
            <ThemePicker class="hidden sm:inline-flex" />
            <a
              href="/app"
              class="btn btn-primary btn-sm rounded-full px-4 shadow-lg shadow-primary/25"
            >
              Open tracker
            </a>
          </div>
        </header>

        <section class="flex flex-1 flex-col items-center py-16 text-center sm:py-24">
          <span
            data-reveal
            class="badge badge-soft badge-primary gap-1.5 rounded-full border-0 px-3 py-3 text-xs font-semibold"
          >
            <IconSparkle class="h-3.5 w-3.5" />
            Open-source, mapped live
          </span>
          <h1
            data-reveal
            class="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-base-content sm:text-6xl"
          >
            See how open-source projects really move.
          </h1>
          <p
            data-reveal
            class="mt-5 max-w-xl text-balance text-base text-base-content/60 sm:text-lg"
          >
            Mira tracks issues and pull requests across repositories, links the
            ones that fix each other, and streams every change to one board — in
            real time.
          </p>
          <div
            data-reveal
            class="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href="/app"
              class="btn btn-primary btn-lg gap-2 rounded-full px-7 shadow-lg shadow-primary/25"
            >
              Open the tracker
              <IconArrowRight class="h-4.5 w-4.5" />
            </a>
            <a href="/reference" class="btn btn-ghost btn-lg rounded-full px-7">
              View the API
            </a>
          </div>

          <div
            data-reveal
            class="mt-14 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
          >
            <Stat label="Repositories" value={projectCount} />
            <Stat label="Issues tracked" value={issueCount} />
            <Stat label="Linked PRs" value={linkedPrCount} />
            <Stat
              label="Languages"
              value={new Set(projects.map((p) => p.language)).size}
            />
          </div>
        </section>

        <section id="features" class="grid gap-4 py-10 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              data-reveal
              class="rounded-3xl border border-base-300/70 bg-base-100 p-6 shadow-sm"
            >
              <span class="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon class="h-5 w-5" />
              </span>
              <h3 class="mt-4 text-base font-bold text-base-content">
                {feature.title}
              </h3>
              <p class="mt-1.5 text-sm leading-relaxed text-base-content/60">
                {feature.body}
              </p>
            </div>
          ))}
        </section>

        <section id="activity" class="py-10">
          <div class="rounded-3xl border border-base-300/70 bg-base-100 p-6 shadow-sm sm:p-8">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Live from Mira
                </p>
                <h2 class="mt-1 text-xl font-extrabold text-base-content">
                  What just happened
                </h2>
              </div>
              <a
                href="/app/activity"
                class="btn btn-ghost btn-sm gap-1.5 rounded-full"
              >
                See full feed
                <IconArrowRight class="h-4 w-4" />
              </a>
            </div>
            <ul class="mt-6 flex flex-col gap-4">
              {recentActivity.slice(0, 4).map((event) => (
                <ActivityRow key={event.id} event={event} />
              ))}
            </ul>
          </div>
        </section>

        <footer class="flex flex-col items-center gap-2 border-t border-base-300/60 py-8 text-center text-xs text-base-content/45 sm:flex-row sm:justify-between">
          <span>Built on Homix — Hono, HTMX, Alpine, D1, and daisyUI.</span>
          <span>{appConfig.name} · demo tracker</span>
        </footer>
      </div>
    </Layout>
  );
}

const ActivityRow: FC<{ event: ActivityEvent }> = ({ event }) => (
  <li class="flex items-start gap-3">
    <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-base-200 text-[0.65rem] font-bold text-base-content/60">
      {event.actor.slice(0, 2).toUpperCase()}
    </span>
    <p class="text-sm leading-relaxed text-base-content/70">
      <span class="font-semibold text-base-content">{event.actor}</span>{" "}
      {event.summary}
    </p>
  </li>
);
