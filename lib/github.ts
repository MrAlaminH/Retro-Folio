export interface GitHubPullRequest {
  id: number;
  title: string;
  url: string;
  repo: string;
  createdAt: string;
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

export async function fetchUserPullRequests(
  username: string,
  limit: number
): Promise<GitHubPullRequest[]> {
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
      cache: "no-store",
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
