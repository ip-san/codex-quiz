import { categories, type Quiz } from "./data";

export type ValidationIssue = {
  quizId: string;
  field: string;
  message: string;
};

const MIN_EXPLANATION_LENGTH = 24;

export function validateQuizzes(quizzes: Quiz[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const ids = new Set<string>();
  const normalizedQuestions = new Set<string>();

  for (const [index, quiz] of quizzes.entries()) {
    const quizId = quiz.id || `index:${index}`;
    const add = (field: string, message: string) => issues.push({ quizId, field, message });

    if (!/^[a-z]+-\d{2,}$/.test(quiz.id)) add("id", "IDは category-01 形式で指定してください");
    if (ids.has(quiz.id)) add("id", "IDが重複しています");
    ids.add(quiz.id);

    const normalizedQuestion = quiz.question.replace(/\s+/g, "").toLowerCase();
    if (normalizedQuestions.has(normalizedQuestion)) add("question", "問題文が重複しています");
    normalizedQuestions.add(normalizedQuestion);

    if (!(quiz.category in categories)) add("category", "未定義のカテゴリです");
    if (!quiz.question.trim().endsWith("？")) add("question", "問題文は全角の疑問符で終えてください");
    if (quiz.choices.length !== 4) add("choices", "選択肢は4つ必要です");
    if (new Set(quiz.choices.map((choice) => choice.trim().toLowerCase())).size !== quiz.choices.length) {
      add("choices", "同じ選択肢を重複して使用できません");
    }
    if (!Number.isInteger(quiz.answer) || quiz.answer < 0 || quiz.answer >= quiz.choices.length) {
      add("answer", "正解インデックスが選択肢の範囲外です");
    }
    if (quiz.explanation.trim().length < MIN_EXPLANATION_LENGTH) {
      add("explanation", `解説は${MIN_EXPLANATION_LENGTH}文字以上必要です`);
    }
    if (!quiz.source.trim()) add("source", "OpenAI公式資料の出典が必要です");
    if (quiz.referenceUrl && !/^https:\/\/(learn\.chatgpt\.com|developers\.openai\.com)\//.test(quiz.referenceUrl)) {
      add("referenceUrl", "OpenAI公式ドメインのURLが必要です");
    }
    if (quiz.value) {
      if (!quiz.difficulty) add("difficulty", "価値分類した問題には難易度が必要です");
      if (!quiz.topic) add("topic", "価値分類した問題には公式カバレッジ用topicが必要です");
      if (!quiz.referenceUrl) add("referenceUrl", "価値分類した問題には公式URLが必要です");
      if (!quiz.verifiedAt || Number.isNaN(new Date(quiz.verifiedAt).getTime())) {
        add("verifiedAt", "価値分類した問題には有効な事実確認日が必要です");
      }
    }
  }

  return issues;
}

export function assertValidQuizzes(quizzes: Quiz[]): void {
  const issues = validateQuizzes(quizzes);
  if (issues.length === 0) return;
  const report = issues.map((issue) => `${issue.quizId} [${issue.field}] ${issue.message}`).join("\n");
  throw new Error(`クイズデータに${issues.length}件の問題があります:\n${report}`);
}
