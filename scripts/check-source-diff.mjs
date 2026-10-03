import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { quizzes } from "../src/data.ts";
import { canonicalPageUrl, classifySources, contentHash, groupQuestionsBySource, markdownUrl, prioritizeQuestions } from "./source-audit-core.mjs";

const baselinePath = fileURLToPath(new URL("../docs/OFFICIAL_SOURCE_BASELINE.json", import.meta.url));
const args = process.argv.slice(2);
const init = args.includes("--init");
const acceptIndex = args.indexOf("--accept");
if (args.length !== (init ? 1 : acceptIndex >= 0 ? 2 : 0)) {
  throw new Error("Usage: npm run content:sources [-- --init | -- --accept <official-page-url>]");
}

const bySource = groupQuestionsBySource(quizzes);
let baseline;
try {
  baseline = JSON.parse(await readFile(baselinePath, "utf8"));
} catch (error) {
  if (!init || error?.code !== "ENOENT") throw error;
}
if (init && baseline) throw new Error("Baseline already exists. Review changes and accept one source at a time.");
if (baseline && (baseline.schemaVersion !== 1 || !Array.isArray(baseline.sources))) {
  throw new Error("Unsupported official source baseline format.");
}

const acceptedUrl = acceptIndex >= 0 ? canonicalPageUrl(args[acceptIndex + 1]) : undefined;
if (acceptedUrl && !bySource.has(acceptedUrl)) throw new Error(`No question uses this source: ${acceptedUrl}`);
const known = new Map((baseline?.sources ?? []).map(({ url, sha256 }) => [url, sha256]));
const targets = acceptedUrl ? [[acceptedUrl, bySource.get(acceptedUrl)]] : [...bySource];
const current = new Map();
const unavailable = [];
let nextIndex = 0;

async function fetchNext() {
  while (nextIndex < targets.length) {
    const [url] = targets[nextIndex++];
    try {
      const response = await fetch(markdownUrl(url), {
        headers: { "User-Agent": "CodexQuizSourceAudit/1.0", Accept: "text/markdown" },
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok || !response.headers.get("content-type")?.includes("text/markdown")) {
        throw new Error(`HTTP ${response.status} (${response.headers.get("content-type") ?? "no content type"})`);
      }
      current.set(url, contentHash(await response.text()));
    } catch (error) {
      unavailable.push(`${url}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(4, targets.length) }, () => fetchNext()));
if (unavailable.length) {
  console.error(`Could not verify ${unavailable.length} source(s):\n${unavailable.join("\n")}`);
  process.exitCode = 2;
} else if (init || acceptedUrl) {
  const updated = new Map(known);
  for (const [url, hash] of current) updated.set(url, hash);
  const result = {
    schemaVersion: 1,
    capturedAt: new Date().toISOString(),
    sources: [...updated].sort(([a], [b]) => a.localeCompare(b)).map(([url, sha256]) => ({ url, sha256 })),
  };
  await writeFile(baselinePath, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`${init ? "Initialized" : "Accepted"} ${current.size} official source(s). This records text, not factual correctness.`);
} else {
  const { changed, newSources, removed } = classifySources(bySource, known, current);
  const affected = prioritizeQuestions([...changed, ...newSources].flatMap(([, questions]) => questions));
  console.log(`Official source review: ${targets.length} pages; ${changed.length} changed, ${newSources.length} new, ${removed.length} unused.`);
  console.log("A changed page is a review signal, not proof that a quiz answer is wrong.");
  for (const [url, questions] of [...changed, ...newSources]) {
    console.log(`\n${known.has(url) ? "CHANGED" : "NEW"} ${url} (${questions.length} questions)`);
  }
  if (removed.length) console.log(`\nUnused baseline entries:\n${removed.join("\n")}`);
  if (affected.length) {
    console.log("\nPriority review queue (practical first, then oldest verifiedAt):");
    for (const q of affected) console.log(`- ${q.id} | ${q.verifiedAt} | ${q.value} | ${q.question}`);
  }
}
