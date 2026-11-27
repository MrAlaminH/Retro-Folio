export interface GitHubPullRequest {
  id: number;
  title: string;
  url: string;
  repo: string;
  createdAt: string;
}

export interface GitHubContribution {
  date: string;
  count: number;
  level: number;
}

interface GitHubSearchIssueItem {
  id: number;
  title: string;
  html_url: string;
  repository_url: string;
  pull_request?: unknown;
  created_at: string;
}

interface GitHubSearchIssuesResponse {
  items: GitHubSearchIssueItem[];
}

const GITHUB_API_BASE = "https://api.github.com";
const GITHUB_FETCH_TIMEOUT_MS = 8_000;
const GITHUB_USERNAME_RE = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function assertValidUsername(username: string): void {
  if (!GITHUB_USERNAME_RE.test(username)) {
    throw new Error(`Invalid GitHub username: ${username}`);
  }
}

export async function fetchUserPullRequests(
  username: string,
  limit: number
): Promise<GitHubPullRequest[]> {
  assertValidUsername(username);
  const safeLimit = Math.max(1, Math.min(limit, 50));

  const searchParams = new URLSearchParams({
    q: `is:pr author:${username} is:public`,
    sort: "created",
    order: "desc",
    per_page: String(safeLimit),
  });

  const url = `${GITHUB_API_BASE}/search/issues?${searchParams.toString()}`;

  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      // 1h data cache (plan 005); the route layer's unstable_cache owns the
      // response cache on top of this.
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(GITHUB_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<no-body>");
      console.error("GitHub API response not ok", {
        status: response.status,
        statusText: response.statusText,
        body: text,
      });
      throw new Error(
        `GitHub API request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as GitHubSearchIssuesResponse;

    if (!Array.isArray(data.items)) {
      console.error("GitHub API response malformed", data);
      throw new Error("Unexpected GitHub API response shape");
    }

    const pullRequests: GitHubPullRequest[] = data.items
      .filter((item) => "pull_request" in item)
      .map((item) => {
        const repoName = item.repository_url.split("/").slice(-2).join("/");

        return {
          id: item.id,
          title: item.title,
          url: item.html_url,
          repo: repoName,
          createdAt: item.created_at,
        } satisfies GitHubPullRequest;
      });

    return pullRequests;
  } catch (error) {
    console.error("Error fetching GitHub pull requests", {
      username,
      limit: safeLimit,
      error,
    });
    throw error instanceof Error
      ? error
      : new Error("Unknown error while fetching GitHub pull requests");
  }
}

interface JogruberContributionsResponse {
  contributions: GitHubContribution[];
}

export async function fetchGitHubContributions(
  username: string,
  fetchImpl: typeof fetch = fetch
): Promise<GitHubContribution[]> {
  assertValidUsername(username);
  // GitHub blocks datacenter IPs (e.g. Vercel) on the HTML contributions page,
  // and its markup no longer exposes reliable per-day counts. The unofficial
  // JSON API react-github-calendar uses serves real counts and allows
  // programmatic access; it returns whole calendar years, newest year first.
  const url = `https://github-contributions-api.jogruber.de/v4/${username}`;

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(GITHUB_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<no-body>");
      console.error("GitHub contributions API response not ok", {
        status: response.status,
        statusText: response.statusText,
        body: text.substring(0, 200),
      });
      throw new Error(
        `GitHub contributions request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const data = (await response.json()) as JogruberContributionsResponse;

    if (!Array.isArray(data.contributions)) {
      console.error("GitHub contributions API response malformed", data);
      throw new Error("Unexpected GitHub contributions API response shape");
    }

    // ActivityCalendar needs chronological order; the API lists newest year
    // first. Mirror GitHub's profile graph: trailing 365 days up to today,
    // without future zero-count days.
    const today = new Date().toISOString().slice(0, 10);
    return data.contributions
      .filter((c) => c.date <= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-365);
  } catch (error) {
    console.error("Error fetching GitHub contributions", {
      username,
      error,
    });
    throw error instanceof Error
      ? error
      : new Error("Unknown error while fetching GitHub contributions");
  }
}
