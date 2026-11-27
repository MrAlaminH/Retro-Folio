import test from "node:test";
import assert from "node:assert/strict";
import OpenAI from "openai";
import { createChatHandler, createRateLimiter } from "../lib/chat.ts";

function makeRequest(body, headers = {}) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

test("returns 400 on malformed JSON without calling OpenAI", async () => {
  let called = false;
  const handler = createChatHandler({
    isConfigured: () => true,
    complete: async () => {
      called = true;
      return "ok";
    },
  });

  const res = await handler(makeRequest("{bad json"));
  const data = await res.json();

  assert.equal(res.status, 400);
  assert.equal(data.error, "Invalid JSON body");
  assert.equal(called, false);
});

test("returns 400 when message is missing, non-string, blank, or too long", async () => {
  const handler = createChatHandler({
    isConfigured: () => true,
    complete: async () => "ok",
  });

  for (const payload of [
    {},
    { message: 123 },
    { message: "   " },
    { message: "a".repeat(1001) },
  ]) {
    const res = await handler(makeRequest(payload));
    assert.equal(res.status, 400);
  }
});

test("maps OpenAI APIError and APIConnectionTimeoutError to explicit statuses", async () => {
  const timeoutHandler = createChatHandler({
    isConfigured: () => true,
    complete: async () => {
      throw new OpenAI.APIConnectionTimeoutError();
    },
  });
  const timeoutRes = await timeoutHandler(makeRequest({ message: "hi" }));
  assert.equal(timeoutRes.status, 504);

  const rateLimitHandler = createChatHandler({
    isConfigured: () => true,
    complete: async () => {
      throw new OpenAI.APIError(
        429,
        { message: "secret-org rate limit" },
        "rate limit",
        new Headers()
      );
    },
  });
  const rateLimitRes = await rateLimitHandler(makeRequest({ message: "hi" }));
  const rateLimitJson = await rateLimitRes.json();
  assert.equal(rateLimitRes.status, 429);
  assert.equal(rateLimitJson.error.includes("secret-org"), false);
});

test("enforces per-IP rate limit and returns 429 with Retry-After", async () => {
  let now = 1_000;
  const checkRateLimit = createRateLimiter({
    maxRequests: 2,
    windowMs: 60_000,
    now: () => now,
  });

  const handler = createChatHandler({
    isConfigured: () => true,
    checkRateLimit,
    complete: async (msg) => `reply:${msg}`,
  });

  const r1 = await handler(
    makeRequest({ message: "one" }, { "x-forwarded-for": "1.2.3.4" })
  );
  const r2 = await handler(
    makeRequest({ message: "two" }, { "x-forwarded-for": "1.2.3.4" })
  );
  const r3 = await handler(
    makeRequest({ message: "three" }, { "x-forwarded-for": "1.2.3.4" })
  );
  const otherIp = await handler(
    makeRequest({ message: "four" }, { "x-forwarded-for": "5.6.7.8" })
  );

  assert.equal(r1.status, 200);
  assert.deepEqual(await r1.json(), { result: "reply:one" });
  assert.equal(r2.status, 200);
  assert.equal(r3.status, 429);
  assert.equal(r3.headers.get("Retry-After"), "60");
  assert.equal(otherIp.status, 200);

  now += 60_001;
  const r4 = await handler(
    makeRequest({ message: "after-window" }, { "x-forwarded-for": "1.2.3.4" })
  );
  assert.equal(r4.status, 200);
});
