import { categories, type Quiz } from "./data";

export type ValidationIssue = {
  quizId: string;
  field: string;
  message: string;
};

const MIN_EXPLANATION_LENGTH = 24;

const ID_PREFIX_TO_CATEGORY: Record<string, keyof typeof categories> = {
  basic: "basics",
  prompt: "prompting",
  agents: "agents",
  safe: "security",
  config: "config",
  extend: "extend",
  session: "session",
  workflow: "workflow",
  surfaces: "surfaces",
};

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

    const idPrefix = quiz.id.replace(/-\d+$/, "");
    const expectedCategory = ID_PREFIX_TO_CATEGORY[idPrefix];
    if (expectedCategory && quiz.category !== expectedCategory) {
      add("category", `ID prefix ${idPrefix} はカテゴリ ${expectedCategory} と対応させてください`);
    }

    const normalizedQuestion = quiz.question.replace(/\s+/g, "").toLowerCase();
    if (normalizedQuestions.has(normalizedQuestion)) add("question", "問題文が重複しています");
    normalizedQuestions.add(normalizedQuestion);

    if (!(quiz.category in categories)) add("category", "未定義のカテゴリです");
    if (!quiz.question.trim().endsWith("？")) add("question", "問題文は全角の疑問符で終えてください");
    if (quiz.choices.length !== 4) add("choices", "選択肢は4つ必要です");
    if (quiz.choices.some((choice) => !choice.trim())) add("choices", "空の選択肢は使用できません");
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
      if (quiz.topic && !/^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(quiz.topic)) {
        add("topic", "topicは小文字英数字をピリオドまたはハイフンで区切ってください");
      }
      if (!quiz.referenceUrl) add("referenceUrl", "価値分類した問題には公式URLが必要です");
      if (
        !quiz.verifiedAt ||
        !/^\d{4}-\d{2}-\d{2}$/.test(quiz.verifiedAt) ||
        Number.isNaN(new Date(`${quiz.verifiedAt}T00:00:00Z`).getTime())
      ) {
        add("verifiedAt", "価値分類した問題にはYYYY-MM-DD形式の事実確認日が必要です");
      }
    }
    if (quiz.wrongFeedback) {
      if (quiz.answer in quiz.wrongFeedback) {
        add("wrongFeedback", "正解選択肢に不正解feedbackを設定できません");
      }
      for (const choiceIndex of quiz.choices.keys()) {
        if (choiceIndex === quiz.answer) continue;
        const feedback = quiz.wrongFeedback[choiceIndex]?.trim();
        if (!feedback || feedback.length < 16) {
          add("wrongFeedback", `不正解${choiceIndex + 1}には16文字以上のfeedbackが必要です`);
        }
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
