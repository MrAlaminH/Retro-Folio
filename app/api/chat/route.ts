import type { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  CHAT_MAX_TOKENS,
  CHAT_TIMEOUT_MS,
  createChatHandler,
  createRateLimiter,
} from "@/lib/chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
  baseURL: process.env.OPENAI_API_BASE,
  // No retries: client aborts at 25s, so server worst-case stays <= 20s.
  timeout: CHAT_TIMEOUT_MS,
  maxRetries: 0,
});

const checkRateLimit = createRateLimiter({
  maxRequests: 20,
  windowMs: 60_000,
});

const handleChatPost = createChatHandler({
  checkRateLimit,
  complete: async (message) => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18",
      messages: [{ role: "user", content: message }],
      max_tokens: CHAT_MAX_TOKENS,
    });
    return completion.choices[0]?.message?.content;
  },
});

export async function POST(req: NextRequest) {
  return handleChatPost(req);
}
