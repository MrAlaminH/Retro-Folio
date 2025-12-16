import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubContributions } from "@/lib/github";
import { unstable_cache } from "next/cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "MrAlaminH";

  // Create a cached version of the fetch function with 1-hour TTL
  const getCachedContributions = unstable_cache(
    async (user: string) => {
      try {
        return await fetchGitHubContributions(user);
      } catch (error) {
        console.error("Error in cached contributions fetch", {
          username: user,
          error,
        });
        throw error;
      }
    },
    [`github-contributions-${username}`],
    {
      revalidate: 3600, // 1 hour in seconds
      tags: [`github-contributions-${username}`],
    }
  );

  try {
    const contributions = await getCachedContributions(username);

    return NextResponse.json(
      {
        success: true,
        contributions,
        count: contributions.length,
        cached: true,
      },
      {
        // Set cache headers for client-side caching
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch (error) {
    console.error("GitHub calendar API error", {
      username,
      error,
    });

    // Return error response but don't throw - allow component to handle gracefully
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch GitHub contributions due to API limit exceeded",
        contributions: [],
        count: 0,
        cached: false,
      },
      { status: 500 }
    );
  }
}

