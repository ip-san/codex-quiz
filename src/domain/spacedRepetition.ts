export type QuestionProgress = {
  attempts: number;
  correct: number;
  lastCorrect: boolean;
  reviewStreak?: number;
  intervalDays?: number;
  nextReviewAt?: string;
};

const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60] as const;

export function scheduleReview(
  previous: QuestionProgress | undefined,
  isCorrect: boolean,
  now = new Date(),
): QuestionProgress {
  const previousStreak = previous?.reviewStreak ?? 0;
  const reviewStreak = isCorrect ? previousStreak + 1 : 0;
  const intervalDays = isCorrect ? REVIEW_INTERVALS[Math.min(reviewStreak - 1, REVIEW_INTERVALS.length - 1)] : 1;
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + intervalDays);

  return {
    attempts: (previous?.attempts ?? 0) + 1,
    correct: (previous?.correct ?? 0) + (isCorrect ? 1 : 0),
    lastCorrect: isCorrect,
    reviewStreak,
    intervalDays,
    nextReviewAt: nextReview.toISOString(),
  };
}

export function isReviewDue(progress: QuestionProgress | undefined, now = new Date()): boolean {
  if (!progress) return false;
  if (!progress.nextReviewAt) return !progress.lastCorrect;
  const dueAt = new Date(progress.nextReviewAt);
  return !Number.isNaN(dueAt.getTime()) && dueAt.getTime() <= now.getTime();
}

export function getReviewLabel(progress: QuestionProgress | undefined): string {
  if (!progress?.nextReviewAt) return "未学習";
  if (isReviewDue(progress)) return "復習期限です";
  const days = Math.max(1, Math.ceil((new Date(progress.nextReviewAt).getTime() - Date.now()) / 86_400_000));
  return `${days}日後に復習`;
}
