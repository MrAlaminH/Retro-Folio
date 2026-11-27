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
      // Let Next.js handle caching; this is runtime data.
      // ponytail: route layer (unstable_cache, 1h) owns caching; keep upstream fresh.
      cache: "no-store",
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

function parseCountFromLabel(label: string | undefined): number | null {
  if (!label) return null;
  const countMatch = label.match(/(\d+)\s+contributions?/i);
  if (countMatch) {
    return Number.parseInt(countMatch[1], 10);
  }
  if (label.toLowerCase().includes("no contributions")) {
    return 0;
  }
  return null;
}

function parseContributionsHtml(html: string): GitHubContribution[] {
  const tooltips = new Map<string, string>();
  const tooltipRegex =
    /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/gi;
  let tipMatch: RegExpExecArray | null;
  while ((tipMatch = tooltipRegex.exec(html)) !== null) {
    tooltips.set(tipMatch[1], tipMatch[2].trim());
  }

  const levelFallbackCount: Record<number, number> = {
    1: 5,
    2: 15,
    3: 25,
    4: 35,
  };

  const contributionData: GitHubContribution[] = [];
  const cellRegex = /<(?:td|rect)\b[^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = cellRegex.exec(html)) !== null) {
    const tag = match[0];

    const dateMatch = tag.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/);
    if (!dateMatch) continue;
    const date = dateMatch[1];

    const levelMatch = tag.match(/\bdata-level="(\d+)"/);
    if (!levelMatch) continue;
    const level = Number.parseInt(levelMatch[1], 10);
    if (Number.isNaN(level) || level < 0 || level > 4) continue;

    const idMatch = tag.match(/\bid="([^"]+)"/);
    const titleMatch = tag.match(/\b(?:title|aria-label)="([^"]+)"/);
    const label =
      (idMatch ? tooltips.get(idMatch[1]) : undefined) ?? titleMatch?.[1];

    const parsedCount = parseCountFromLabel(label);
    const count =
      parsedCount !== null
        ? parsedCount
        : level > 0
        ? levelFallbackCount[level] ?? 0
        : 0;

    contributionData.push({ date, count, level });
  }

  // GitHub's table renders row-by-row (by weekday), whereas ActivityCalendar
  // requires entries in chronological date order.
  contributionData.sort((a, b) => a.date.localeCompare(b.date));
  return contributionData;
}

export async function fetchGitHubContributions(
  username: string,
  fetchImpl: typeof fetch = fetch
): Promise<GitHubContribution[]> {
  assertValidUsername(username);
  // GitHub doesn't have an official JSON API for contribution data; we parse
  // the public contributions table (<td> cells + <tool-tip> labels).
  const url = `https://github.com/users/${username}/contributions`;

  const headers: HeadersInit = {
    Accept: "text/html",
    "User-Agent": "Mozilla/5.0",
  };

  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers,
      // Use revalidate for caching at fetch level
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(GITHUB_FETCH_TIMEOUT_MS),
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "<no-body>");
      console.error("GitHub contributions page response not ok", {
        status: response.status,
        statusText: response.statusText,
        body: text.substring(0, 200),
      });
      throw new Error(
        `GitHub contributions request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const html = await response.text();
    const contributionData = parseContributionsHtml(html);

    if (contributionData.length === 0) {
      console.warn("No contribution data found in GitHub response");
      // Return empty array instead of throwing to allow graceful degradation
      return [];
    }

    return contributionData;
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
