import { quizzes } from "../src/data.ts";

// Inventory only: counts and URLs do not establish factual or semantic coverage.
const priorityOnly = process.argv.includes("--priority");
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
if (priorityOnly) {
  console.log("## 最終確認日が古い実務問題（上位20件）\n");
  console.log("検証日による再確認候補です。誤りの判定ではありません。\n");
  const queue = quizzes
    .filter((quiz) => quiz.value === "practical")
    .sort((a, b) => a.verifiedAt.localeCompare(b.verifiedAt) || a.id.localeCompare(b.id))
    .slice(0, 20);
  for (const quiz of queue) {
    console.log(`- ${quiz.verifiedAt} | ${quiz.id} | ${quiz.category} | ${quiz.question} | ${quiz.referenceUrl}`);
  }
  process.exit(0);
}
for (const [source, entries] of [...bySource].sort(([a], [b]) => a.localeCompare(b))) {
  console.log(`\n## ${source}\n`);
  for (const q of entries) {
    console.log(`- ${q.id} | ${q.topic} | ${q.verifiedAt} | ${q.question}`);
  }
}
