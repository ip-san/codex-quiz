import { quizzes } from "../src/data.ts";

// Heuristics for editorial review. Short command names can be valid answers.
const candidates = [];
for (const quiz of quizzes) {
  const correct = quiz.choices[quiz.answer];
  const wrong = quiz.choices.filter((_, index) => index !== quiz.answer);
  const averageWrongLength = wrong.reduce((sum, choice) => sum + choice.length, 0) / wrong.length;
  if (correct.length > 30 && correct.length > averageWrongLength * 2) {
    candidates.push({
      id: quiz.id,
      kind: "正解だけ長い",
      detail: `${correct.length}文字 / 誤答平均${Math.round(averageWrongLength)}文字`,
      score: correct.length / averageWrongLength,
    });
  }
  if (/`[^`]+`/.test(correct) && wrong.every((choice) => !/`[^`]+`/.test(choice))) {
    candidates.push({
      id: quiz.id,
      kind: "正解だけコード表記",
      detail: correct,
      score: 2,
    });
  }
}

candidates.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
const limit = 20;
console.log(`Distractor review candidates: ${candidates.length}; showing up to ${limit}.`);
for (const candidate of candidates.slice(0, limit)) {
  console.log(`- ${candidate.id} [${candidate.kind}] ${candidate.detail}`);
}
