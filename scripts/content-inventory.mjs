import { quizzes } from "../src/data.ts";

// Inventory only: counts and URLs do not establish factual or semantic coverage.
const bySource = new Map();
for (const quiz of quizzes) {
  if (!quiz.topic || !quiz.referenceUrl || !quiz.verifiedAt) {
    throw new Error(`Missing audit metadata: ${quiz.id}`);
  }
  const url = new URL(quiz.referenceUrl);
  url.hash = "";
  const key = url.href;
  if (!bySource.has(key)) bySource.set(key, []);
  bySource.get(key).push(quiz);
}
console.log(`# Content inventory: ${quizzes.length} questions`);
console.log("\n未監査の棚卸し。出典URLの一致は学習目標の網羅・正確性を保証しません。\n");
for (const [source, entries] of [...bySource].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`\n## ${source}\n`);
  for (const q of entries) {
    console.log(`- ${q.id} | ${q.topic} | ${q.verifiedAt} | ${q.question}`);
  }
}
