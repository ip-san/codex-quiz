import { quizzes } from "../src/data.ts";

// This is an on-demand network check, not part of npm run check: a docs outage
// should not block local edits or the Pages deployment.
const references = new Map();
for (const quiz of quizzes) {
  if (!quiz.referenceUrl) continue;
  const url = new URL(quiz.referenceUrl);
  url.hash = "";
  const key = url.href;
  references.set(key, [...(references.get(key) ?? []), quiz.id]);
}

const entries = [...references.entries()];
const failures = [];
const unreachable = [];
let nextIndex = 0;

async function checkNext() {
  while (nextIndex < entries.length) {
    const [url, ids] = entries[nextIndex++];
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "CodexQuizContentLinkCheck/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      await response.body?.cancel();
      if (response.status === 404 || response.status === 410) {
        failures.push(`${response.status} ${url} (${ids.join(", ")})`);
      } else if (!response.ok) {
        unreachable.push(`${response.status} ${url} (${ids.join(", ")})`);
      }
    } catch (error) {
      unreachable.push(`${error instanceof Error ? error.message : String(error)} ${url} (${ids.join(", ")})`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(4, entries.length) }, () => checkNext()));

console.log(`Checked ${entries.length} unique official reference URLs.`);
if (failures.length > 0) console.error(`Missing pages:\n${failures.join("\n")}`);
if (unreachable.length > 0) console.warn(`Could not verify now:\n${unreachable.join("\n")}`);
if (failures.length > 0) process.exitCode = 1;
else if (unreachable.length > 0) process.exitCode = 2;
