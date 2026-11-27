import test from "node:test";
import assert from "node:assert/strict";
import { fetchGitHubContributions } from "../lib/github.ts";

const SAMPLE_GITHUB_HTML = `
<table>
  <tbody>
    <tr>
      <td tabindex="-1" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-2" id="contribution-day-component-0-1" data-date="2026-01-04" data-level="2" role="gridcell" class="ContributionCalendar-day"></td>
      <td tabindex="-1" data-ix="1" aria-selected="false" aria-describedby="contribution-graph-legend-level-0" id="contribution-day-component-0-0" data-date="2026-01-01" data-level="0" role="gridcell" class="ContributionCalendar-day"></td>
    </tr>
    <tr>
      <td tabindex="-1" data-ix="0" aria-selected="false" aria-describedby="contribution-graph-legend-level-1" id="contribution-day-component-1-0" data-date="2026-01-02" data-level="1" role="gridcell" class="ContributionCalendar-day"></td>
    </tr>
  </tbody>
</table>
<tool-tip id="tooltip-1" for="contribution-day-component-0-1" popover="manual" class="sr-only">12 contributions on January 4th.</tool-tip>
<tool-tip id="tooltip-2" for="contribution-day-component-0-0" popover="manual" class="sr-only">No contributions on January 1st.</tool-tip>
<tool-tip id="tooltip-3" for="contribution-day-component-1-0" popover="manual" class="sr-only">1 contribution on January 2nd.</tool-tip>
`;

test("parses GitHub td + tool-tip contributions sorted chronologically", async () => {
  let receivedSignal;
  const result = await fetchGitHubContributions("MrAlaminH", async (_url, init) => {
    receivedSignal = init?.signal;
    return new Response(SAMPLE_GITHUB_HTML, { status: 200 });
  });

  assert.ok(receivedSignal instanceof AbortSignal);
  assert.deepEqual(result, [
    { date: "2026-01-01", count: 0, level: 0 },
    { date: "2026-01-02", count: 1, level: 1 },
    { date: "2026-01-04", count: 12, level: 2 },
  ]);
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
