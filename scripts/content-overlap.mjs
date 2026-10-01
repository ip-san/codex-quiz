import { quizzes } from "../src/data.ts";

// A review queue, not a duplicate verdict. Similar wording can test different decisions.
function normalize(text) {
  return text.normalize("NFKC").toLowerCase().replace(/[\s`「」『』、。,.!?！？:：;；()（）\[\]{}\-_/]/g, "");
}

function ngrams(text) {
  const normalized = normalize(text);
  if (normalized.length < 3) return new Set([normalized]);
  return new Set(Array.from({ length: normalized.length - 2 }, (_, index) => normalized.slice(index, index + 3)));
}

function similarity(left, right) {
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

const prepared = quizzes.map((quiz) => ({
  quiz,
  question: ngrams(quiz.question),
  answer: ngrams(quiz.choices[quiz.answer] ?? ""),
}));

const candidates = [];
for (let leftIndex = 0; leftIndex < prepared.length; leftIndex += 1) {
  const left = prepared[leftIndex];
  for (let rightIndex = leftIndex + 1; rightIndex < prepared.length; rightIndex += 1) {
    const right = prepared[rightIndex];
    if (left.quiz.category !== right.quiz.category) continue;
    const questionSimilarity = similarity(left.question, right.question);
    const answerSimilarity = similarity(left.answer, right.answer);
    if (questionSimilarity < 0.2 || answerSimilarity < 0.1) continue;
    candidates.push({
      left: left.quiz,
      right: right.quiz,
      questionSimilarity,
      answerSimilarity,
      score: questionSimilarity * 0.6 + answerSimilarity * 0.4,
    });
  }
}

const limit = 20;
candidates.sort((a, b) => b.score - a.score || a.left.id.localeCompare(b.left.id));
console.log(`Potential overlap: ${candidates.length} pairs; showing up to ${limit}.`);
for (const candidate of candidates.slice(0, limit)) {
  const { left, right, questionSimilarity, answerSimilarity } = candidate;
  console.log(`\n${left.id} / ${right.id} — question ${questionSimilarity.toFixed(2)}, answer ${answerSimilarity.toFixed(2)}`);
  console.log(`  ${left.question}`);
  console.log(`  ${right.question}`);
  console.log(`  ${left.choices[left.answer]} / ${right.choices[right.answer]}`);
}
