import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { fetchUserPullRequests } from "@/lib/github";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const username = searchParams.get("username") || "MrAlaminH";
  const rawLimit = searchParams.get("limit");

  const defaultLimit = 20;
  const maxLimit = 50;

  let limit = defaultLimit;

  if (rawLimit) {
    const parsed = Number.parseInt(rawLimit, 10);
    if (!Number.isNaN(parsed) && parsed > 0) {
      limit = Math.min(parsed, maxLimit);
    }
  }

  const getCachedPullRequests = unstable_cache(
    async (user: string, n: number) => {
      try {
        return await fetchUserPullRequests(user, n);
      } catch (error) {
        console.error("Error in cached pull-requests fetch", {
          username: user,
          limit: n,
          error,
        });
        throw error;
      }
    },
    [`github-prs-${username}-${limit}`],
    { revalidate: 3600, tags: [`github-prs-${username}-${limit}`] }
  );

  try {
    const contributions = await getCachedPullRequests(username, limit);

    return NextResponse.json(
      {
        success: true,
        contributions,
        count: contributions.length,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("GitHub contributions API error", {
      username,
      limit,
      error,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch contributions",
        contributions: [],
      },
      { status: 500 }
    );
  }
}
