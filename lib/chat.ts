import OpenAI from "openai";

export const MAX_MESSAGE_LENGTH = 1000;
export const CHAT_TIMEOUT_MS = 20_000;
export const CHAT_MAX_TOKENS = 400;

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

/**
 * Creates a bounded in-memory fixed-window rate limiter keyed by client IP.
 */
export function createRateLimiter({
  maxRequests = 20,
  windowMs = 60_000,
  maxEntries = 1000,
  now = () => Date.now(),
}: {
  maxRequests?: number;
  windowMs?: number;
  maxEntries?: number;
  now?: () => number;
} = {}) {
  const buckets = new Map<string, RateLimitEntry>();

  return (key: string): RateLimitResult => {
    const current = now();
    const existing = buckets.get(key);

    if (!existing || current >= existing.resetAt) {
      if (buckets.size >= maxEntries) {
        buckets.forEach((v, k) => {
          if (current >= v.resetAt) buckets.delete(k);
        });
        if (buckets.size >= maxEntries) {
          const oldestKey = buckets.keys().next().value;
          if (oldestKey !== undefined) buckets.delete(oldestKey);
        }
      }
      buckets.set(key, { count: 1, resetAt: current + windowMs });
      return { allowed: true, retryAfterSec: Math.ceil(windowMs / 1000) };
    }

    if (existing.count >= maxRequests) {
      return {
        allowed: false,
        retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - current) / 1000)),
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - current) / 1000)),
    };
  };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function mapOpenAIError(error: unknown): { status: number; message: string } {
  if (error instanceof OpenAI.APIConnectionTimeoutError) {
    return { status: 504, message: "AI service timed out" };
  }
  if (error instanceof OpenAI.APIError) {
    const status = typeof error.status === "number" ? error.status : 502;
    if (status === 429) {
      return {
        status: 429,
        message: "AI service rate limited — please try again later",
      };
    }
    if (status === 401 || status === 403) {
      return { status: 502, message: "AI service authentication failed" };
    }
    return { status, message: "AI service request failed" };
  }
  return { status: 500, message: "Unexpected error occurred" };
}

export interface ChatHandlerDeps {
  complete: (message: string) => Promise<string | null | undefined>;
  checkRateLimit?: (ip: string) => RateLimitResult;
  isConfigured?: () => boolean;
}

/**
 * Builds the POST /api/chat handler with input validation, rate limiting, and
 * OpenAI v4 error mapping.
 */
export function createChatHandler({
  complete,
  checkRateLimit,
  isConfigured = () => Boolean(process.env.OPENAI_API_KEY),
}: ChatHandlerDeps) {
  return async function handleChatPost(req: Request): Promise<Response> {
    if (checkRateLimit) {
      const rate = checkRateLimit(getClientIp(req));
      if (!rate.allowed) {
        return Response.json(
          { error: "Too many requests. Please try again later." },
          {
            status: 429,
            headers: { "Retry-After": String(rate.retryAfterSec) },
          }
        );
      }
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const rawMessage =
      body && typeof body === "object" && "message" in body
        ? (body as { message: unknown }).message
        : undefined;

    if (typeof rawMessage !== "string" || !rawMessage.trim()) {
      return Response.json(
        { error: "Message content is required" },
        { status: 400 }
      );
    }

    const message = rawMessage.trim();
    if (message.length > MAX_MESSAGE_LENGTH) {
      return Response.json(
        { error: `Message exceeds ${MAX_MESSAGE_LENGTH} character limit` },
        { status: 400 }
      );
    }

    if (!isConfigured()) {
      return Response.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    try {
      const result = await complete(message);
      if (result) {
        return Response.json({ result }, { status: 200 });
      }
      return Response.json(
        { error: "No response from OpenAI" },
        { status: 502 }
      );
    } catch (error) {
      const mapped = mapOpenAIError(error);
      console.error("Chat API error:", {
        status: mapped.status,
        message: error instanceof Error ? error.message : String(error),
      });
      return Response.json({ error: mapped.message }, { status: mapped.status });
    }
  };
}
