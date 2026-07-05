import type { WorkerEnv } from "@/platform/env";

export interface GitHubRepo {
  owner: string;
  repo: string;
  name: string;
  language: string;
  stargazers_count: number;
  description: string;
}

export interface GitHubIssue {
  number: number;
  title: string;
  state: "open" | "closed";
  user: { login: string };
  created_at: string;
  updated_at: string;
}

export interface GitHubPullRequest {
  number: number;
  title: string;
  state: "open" | "closed" | "merged";
  user: { login: string };
  created_at: string;
  merged_at: string | null;
}

async function githubFetch(
  path: string,
  token?: string,
): Promise<Record<string, unknown> | null> {
  const headers: Record<string, string> = {
    accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers.authorization = `token ${token}`;
  }

  try {
    const response = await fetch(`https://api.github.com${path}`, { headers });
    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("GitHub fetch failed:", error);
    return null;
  }
}

export async function fetchGitHubRepo(
  repoSlug: string,
  token?: string,
): Promise<GitHubRepo | null> {
  const data = (await githubFetch(`/repos/${repoSlug}`, token)) as Record<
    string,
    unknown
  >;
  if (!data || typeof data !== "object" || !("owner" in data)) return null;

  const owner = (data.owner as Record<string, unknown>)?.login;
  const [ownerName, repoName] = repoSlug.split("/");
  return {
    owner: ownerName || (owner as string),
    repo: repoName,
    name: (data.name as string) || repoName,
    language: (data.language as string) || "unknown",
    stargazers_count: (data.stargazers_count as number) || 0,
    description: (data.description as string) || "",
  };
}

export async function fetchGitHubIssues(
  repoSlug: string,
  token?: string,
): Promise<GitHubIssue[]> {
  const data = (await githubFetch(
    `/repos/${repoSlug}/issues?state=all&per_page=100`,
    token,
  )) as Record<string, unknown>[];
  if (!Array.isArray(data)) return [];

  return data.map((issue) => ({
    number: (issue.number as number) || 0,
    title: (issue.title as string) || "",
    state: ((issue.state as string) || "open") as "open" | "closed",
    user: { login: ((issue.user as Record<string, unknown>)?.login as string) || "unknown" },
    created_at: (issue.created_at as string) || new Date().toISOString(),
    updated_at: (issue.updated_at as string) || new Date().toISOString(),
  }));
}

export async function fetchGitHubPullRequests(
  repoSlug: string,
  token?: string,
): Promise<GitHubPullRequest[]> {
  const data = (await githubFetch(
    `/repos/${repoSlug}/pulls?state=all&per_page=100`,
    token,
  )) as Record<string, unknown>[];
  if (!Array.isArray(data)) return [];

  return data.map((pr) => ({
    number: (pr.number as number) || 0,
    title: (pr.title as string) || "",
    state: ((pr.state as string) || "open") as "open" | "closed" | "merged",
    user: { login: ((pr.user as Record<string, unknown>)?.login as string) || "unknown" },
    created_at: (pr.created_at as string) || new Date().toISOString(),
    merged_at: (pr.merged_at as string | null) || null,
  }));
}

export async function syncProjectFromGitHub(
  env: WorkerEnv,
  repoSlug: string,
): Promise<string | null> {
  const token = env.GITHUB_TOKEN;
  const repo = await fetchGitHubRepo(repoSlug, token);
  if (!repo) return null;

  const issues = await fetchGitHubIssues(repoSlug, token);
  const prs = await fetchGitHubPullRequests(repoSlug, token);

  const projectId = `${repo.owner}-${repo.repo}`;
  const slug = projectId.toLowerCase();

  const createProjectSQL = `
    insert or replace into projects
    (id, name, slug, repo, stars, language, status, summary, createdAt)
    values (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  await env.DB.prepare(createProjectSQL)
    .bind(
      projectId,
      repo.name,
      slug,
      `${repo.owner}/${repo.repo}`,
      repo.stargazers_count,
      repo.language,
      "active",
      repo.description,
      new Date().toISOString(),
    )
    .run();

  for (const issue of issues) {
    const issueId = `${projectId}-issue-${issue.number}`;
    const insertIssueSql = `
      insert or replace into issues
      (id, projectId, title, status, priority, type, assignee, labels, createdAt, updatedAt)
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await env.DB.prepare(insertIssueSql)
      .bind(
        issueId,
        projectId,
        issue.title,
        issue.state === "closed" ? "done" : "todo",
        "medium",
        "task",
        issue.user.login,
        "",
        issue.created_at,
        issue.updated_at,
      )
      .run();
  }

  for (const pr of prs) {
    const prId = `${projectId}-pr-${pr.number}`;
    const insertPrSql = `
      insert or replace into pull_requests
      (id, projectId, number, title, state, author, createdAt, mergedAt)
      values (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await env.DB.prepare(insertPrSql)
      .bind(
        prId,
        projectId,
        pr.number,
        pr.title,
        pr.state === "merged" ? "merged" : pr.state,
        pr.user.login,
        pr.created_at,
        pr.merged_at,
      )
      .run();
  }

  return projectId;
}
