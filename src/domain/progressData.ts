import { quizzes } from "../data";
import type { QuestionProgress } from "./spacedRepetition";

export type SessionRecord = {
  id: string;
  completedAt: string;
  score: number;
  total: number;
  label: string;
};

export type SavedProgress = {
  answered: number;
  correct: number;
  questions: Record<string, QuestionProgress>;
  bookmarks: string[];
  history: SessionRecord[];
};

type ExportEnvelope = {
  format: "codex-quiz-progress";
  version: 1;
  exportedAt: string;
  data: SavedProgress;
};

export const emptyProgress: SavedProgress = { answered: 0, correct: 0, questions: {}, bookmarks: [], history: [] };

const knownQuizIds = new Set(quizzes.map((quiz) => quiz.id));
const isNonNegativeInteger = (value: unknown): value is number => Number.isInteger(value) && Number(value) >= 0;
const isDateString = (value: unknown): value is string =>
  typeof value === "string" && !Number.isNaN(new Date(value).getTime());

function parseQuestionProgress(value: unknown): QuestionProgress | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (!isNonNegativeInteger(item.attempts) || !isNonNegativeInteger(item.correct)) return null;
  if (item.correct > item.attempts || typeof item.lastCorrect !== "boolean") return null;
  if (item.nextReviewAt !== undefined && !isDateString(item.nextReviewAt)) return null;
  if (item.reviewStreak !== undefined && !isNonNegativeInteger(item.reviewStreak)) return null;
  if (item.intervalDays !== undefined && !isNonNegativeInteger(item.intervalDays)) return null;
  return {
    attempts: item.attempts,
    correct: item.correct,
    lastCorrect: item.lastCorrect,
    ...(item.reviewStreak === undefined ? {} : { reviewStreak: item.reviewStreak }),
    ...(item.intervalDays === undefined ? {} : { intervalDays: item.intervalDays }),
    ...(item.nextReviewAt === undefined ? {} : { nextReviewAt: item.nextReviewAt }),
  };
}

function parseSession(value: unknown): SessionRecord | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== "string" || typeof item.label !== "string" || !isDateString(item.completedAt)) return null;
  if (
    !isNonNegativeInteger(item.score) ||
    !isNonNegativeInteger(item.total) ||
    item.total === 0 ||
    item.score > item.total
  ) {
    return null;
  }
  return { id: item.id, label: item.label, completedAt: item.completedAt, score: item.score, total: item.total };
}

export function serializeProgress(data: SavedProgress, now = new Date()): string {
  const envelope: ExportEnvelope = {
    format: "codex-quiz-progress",
    version: 1,
    exportedAt: now.toISOString(),
    data,
  };
  return JSON.stringify(envelope, null, 2);
}

export function parseProgressExport(raw: string): SavedProgress {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("JSONファイルを読み取れませんでした");
  }
  if (!parsed || typeof parsed !== "object") throw new Error("学習データの形式が正しくありません");
  const envelope = parsed as Record<string, unknown>;
  if (envelope.format !== "codex-quiz-progress" || envelope.version !== 1) {
    throw new Error("対応していない学習データ形式です");
  }
  if (!envelope.data || typeof envelope.data !== "object") throw new Error("学習データがありません");
  const data = envelope.data as Record<string, unknown>;
  if (!isNonNegativeInteger(data.answered) || !isNonNegativeInteger(data.correct) || data.correct > data.answered) {
    throw new Error("回答数または正解数が正しくありません");
  }

  const questions: Record<string, QuestionProgress> = {};
  if (!data.questions || typeof data.questions !== "object" || Array.isArray(data.questions)) {
    throw new Error("問題履歴が正しくありません");
  }
  for (const [id, value] of Object.entries(data.questions)) {
    const progress = parseQuestionProgress(value);
    if (!knownQuizIds.has(id) || !progress) throw new Error(`問題履歴 ${id} が正しくありません`);
    questions[id] = progress;
  }

  if (!Array.isArray(data.bookmarks) || data.bookmarks.some((id) => typeof id !== "string" || !knownQuizIds.has(id))) {
    throw new Error("ブックマークが正しくありません");
  }
  if (!Array.isArray(data.history)) throw new Error("セッション履歴が正しくありません");
  const history = data.history.map(parseSession);
  if (history.some((record) => record === null)) throw new Error("セッション履歴に不正な値があります");

  return {
    answered: data.answered,
    correct: data.correct,
    questions,
    bookmarks: [...new Set(data.bookmarks as string[])],
    history: (history as SessionRecord[]).slice(0, 50),
  };
}
