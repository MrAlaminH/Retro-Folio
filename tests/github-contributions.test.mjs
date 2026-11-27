import test from "node:test";
import assert from "node:assert/strict";
import { fetchGitHubContributions } from "../lib/github.ts";

// Shape mirrors the jogruber v4 API: whole calendar years, newest year first,
// including future zero-count days within the current year.
const SAMPLE_API_JSON = {
  total: { last365Days: 400 },
  contributions: [
    { date: "2026-12-31", count: 0, level: 0 },
    { date: "2026-12-01", count: 3, level: 1 },
    { date: "2026-01-01", count: 0, level: 0 },
    { date: "2025-01-01", count: 7, level: 2 },
    { date: "2024-06-15", count: 42, level: 4 },
  ],
};

const today = new Date().toISOString().slice(0, 10);

test("sorts, drops future days, keeps trailing 365 days", async () => {
  let receivedUrl;
  let receivedSignal;
  const result = await fetchGitHubContributions("MrAlaminH", async (url, init) => {
    receivedUrl = url;
    receivedSignal = init?.signal;
    return new Response(JSON.stringify(SAMPLE_API_JSON), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });

  assert.match(receivedUrl, /github-contributions-api\.jogruber\.de\/v4\/MrAlaminH/);
  assert.ok(receivedSignal instanceof AbortSignal);

  const dates = result.map((c) => c.date);
  const pastDates = dates.filter((d) => d <= today);

  // chronological, no future days
  assert.deepEqual(
    dates,
    [...dates].sort((a, b) => a.localeCompare(b))
  );
  assert.deepEqual(dates, pastDates);

  // counts/levels survive untouched
  const byDate = Object.fromEntries(result.map((c) => [c.date, c]));
  assert.equal(byDate["2025-01-01"].count, 7);
  assert.equal(byDate["2025-01-01"].level, 2);
});

test("caps the series at 365 entries", async () => {
  const year = (y) =>
    Array.from({ length: 366 }, (_, i) => {
      const d = new Date(Date.UTC(y, 0, 1 + i));
      return { date: d.toISOString().slice(0, 10), count: i, level: 0 };
    });
  const payload = { total: {}, contributions: [...year(2025), ...year(2024)] };

  const result = await fetchGitHubContributions("MrAlaminH", async () =>
    new Response(JSON.stringify(payload), { status: 200 })
  );

  assert.ok(result.length <= 365, `expected <= 365, got ${result.length}`);
});

test("rejects invalid GitHub usernames before fetching", async () => {
  let called = false;
  await assert.rejects(
    () =>
      fetchGitHubContributions("../admin", async () => {
        called = true;
        return new Response("", { status: 200 });
      }),
    /Invalid GitHub username/
  );
  assert.equal(called, false);
});

test("rejects malformed API payloads", async () => {
  await assert.rejects(
    () =>
      fetchGitHubContributions("MrAlaminH", async () =>
        new Response(JSON.stringify({ nope: true }), { status: 200 })
      ),
    /Unexpected GitHub contributions API response shape/
  );
});

test("rejects non-ok API responses", async () => {
  await assert.rejects(
    () =>
      fetchGitHubContributions("MrAlaminH", async () =>
        new Response("<html>blocked</html>", { status: 429 })
      ),
    /status 429/
  );
});
