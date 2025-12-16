import { NextRequest, NextResponse } from "next/server";
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

  try {
    const contributions = await fetchUserPullRequests(username, limit);

    return NextResponse.json({
      success: true,
      contributions,
      count: contributions.length,
    });
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
