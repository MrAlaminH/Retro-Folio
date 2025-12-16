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

export async function fetchGitHubContributions(
  username: string
): Promise<GitHubContribution[]> {
  // GitHub doesn't have an official JSON API for contribution data
  // We fetch from the same endpoint that react-github-calendar uses
  // This endpoint returns HTML with SVG that contains the contribution data
  const url = `https://github.com/users/${username}/contributions`;

  const headers: HeadersInit = {
    Accept: "text/html",
    "User-Agent": "Mozilla/5.0",
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      // Use revalidate for caching at fetch level
      next: { revalidate: 3600 },
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

    // Parse the HTML to extract contribution data
    // The contribution data is in SVG rect elements with data-date, data-level, and title attributes
    // The title attribute contains the count: "X contributions on Y date"
    const contributionData: GitHubContribution[] = [];
    
    // More flexible regex to match rect elements with attributes in any order
    // Pattern: <rect ... data-date="YYYY-MM-DD" ... data-level="0-4" ... title="...">
    const rectRegex = /<rect[^>]*>/g;
    let match;

    while ((match = rectRegex.exec(html)) !== null) {
      const rectTag = match[0];
      
      // Extract data-date
      const dateMatch = rectTag.match(/data-date="([^"]+)"/);
      if (!dateMatch) continue;
      const date = dateMatch[1];
      
      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      
      // Extract data-level
      const levelMatch = rectTag.match(/data-level="(\d+)"/);
      if (!levelMatch) continue;
      const level = Number.parseInt(levelMatch[1], 10);
      if (isNaN(level) || level < 0 || level > 4) continue;
      
      // Extract title for count
      const titleMatch = rectTag.match(/title="([^"]+)"/);
      let count = 0;
      
      if (titleMatch) {
        const title = titleMatch[1];
        // Extract count from title: "X contributions on Y date" or "No contributions on Y date"
        const countMatch = title.match(/(\d+)\s+contributions?/i);
        if (countMatch) {
          count = Number.parseInt(countMatch[1], 10);
        } else if (title.toLowerCase().includes("no contributions")) {
          count = 0;
        }
      }
      
      // Fallback to level-based estimate if count not found in title
      if (count === 0 && level > 0) {
        const countMap: Record<number, number> = {
          1: 5,
          2: 15,
          3: 25,
          4: 35,
        };
        count = countMap[level] ?? 0;
      }
      
      contributionData.push({
        date,
        count,
        level,
      });
    }

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
