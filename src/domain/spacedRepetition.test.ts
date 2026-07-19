import { describe, expect, it } from "vitest";
import { isReviewDue, scheduleReview } from "./spacedRepetition";

const NOW = new Date("2026-07-19T00:00:00.000Z");

describe("spaced repetition", () => {
  it("expands intervals after consecutive correct answers", () => {
    const first = scheduleReview(undefined, true, NOW);
    const second = scheduleReview(first, true, NOW);
    const third = scheduleReview(second, true, NOW);
    expect([first.intervalDays, second.intervalDays, third.intervalDays]).toEqual([1, 3, 7]);
    expect(third.reviewStreak).toBe(3);
  });

  it("resets the streak after an incorrect answer", () => {
    const learned = scheduleReview(scheduleReview(undefined, true, NOW), true, NOW);
    const incorrect = scheduleReview(learned, false, NOW);
    expect(incorrect.reviewStreak).toBe(0);
    expect(incorrect.intervalDays).toBe(1);
    expect(incorrect.correct).toBe(2);
    expect(incorrect.attempts).toBe(3);
  });

  it("marks a review due at or after its scheduled time", () => {
    const scheduled = scheduleReview(undefined, true, NOW);
    expect(isReviewDue(scheduled, new Date("2026-07-19T23:59:59.000Z"))).toBe(false);
    expect(isReviewDue(scheduled, new Date("2026-07-20T00:00:00.000Z"))).toBe(true);
  });

  it("treats legacy incorrect records without a date as due", () => {
    expect(isReviewDue({ attempts: 1, correct: 0, lastCorrect: false }, NOW)).toBe(true);
    expect(isReviewDue({ attempts: 1, correct: 1, lastCorrect: true }, NOW)).toBe(false);
  });
});
