import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const VISITOR_COUNT_KEY = "visitor_count";

// Create a reusable Redis client (singleton pattern)
let redisClient: ReturnType<typeof createClient> | null = null;

const getRedisClient = async () => {
  if (!process.env.REDIS_URL) {
    return null;
  }

  // Reuse existing client if available and connected
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  // Create new client
  redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  // Connect if not already connected
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }

  return redisClient;
};

export async function GET() {
  try {
    const redis = await getRedisClient();
    if (!redis) {
      // Fallback if Redis is not configured
      return NextResponse.json({ count: 0 });
    }

    // Try to get count from Redis
    const count = await redis.get(VISITOR_COUNT_KEY);
    return NextResponse.json({ count: count ? parseInt(count, 10) : 0 });
  } catch (error) {
    console.error("Error fetching visitor count:", error);
    // Fallback to 0 if Redis is not configured or error occurs
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  try {
    const redis = await getRedisClient();
    if (!redis) {
      // Fallback if Redis is not configured
      return NextResponse.json({ count: 0 });
    }

    // Atomically increment the counter
    const count = await redis.incr(VISITOR_COUNT_KEY);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error incrementing visitor count:", error);
    // Fallback: return 0 if Redis is not configured
    return NextResponse.json({ count: 0 });
  }
}
