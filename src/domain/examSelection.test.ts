import { describe, expect, it } from "vitest";
import { quizzes } from "../data";
import { selectBalancedExam } from "./examSelection";

const seededRandom = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

describe("balanced exam selection", () => {
  it("selects 100 unique questions with category counts differing by at most one", () => {
    const exam = selectBalancedExam(quizzes, 100, seededRandom(42));
    const counts = Object.values(
      exam.reduce<Record<string, number>>((result, quiz) => {
        result[quiz.category] = (result[quiz.category] ?? 0) + 1;
        return result;
      }, {}),
    );

    expect(exam).toHaveLength(100);
    expect(new Set(exam.map((quiz) => quiz.id)).size).toBe(100);
    expect(counts).toHaveLength(9);
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(1);
  });

  it("changes the sampled questions when the random sequence changes", () => {
    const first = selectBalancedExam(quizzes, 100, seededRandom(1)).map((quiz) => quiz.id);
    const second = selectBalancedExam(quizzes, 100, seededRandom(2)).map((quiz) => quiz.id);
    expect(first).not.toEqual(second);
  });
});
