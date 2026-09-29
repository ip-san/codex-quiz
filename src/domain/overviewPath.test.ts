import { describe, expect, it } from "vitest";
import { categories, categoryLearning, quizzes } from "../data";
import { overviewCategoryOrder, overviewQuestionIds, selectOverviewQuestions } from "./overviewPath";

describe("short overview path", () => {
  it("covers every chapter with two unique practical questions in order", () => {
    const selected = selectOverviewQuestions();
    expect(selected).toHaveLength(overviewQuestionIds.length);
    expect(selected).toHaveLength(Object.keys(categories).length * 2);
    expect(new Set(selected.map((quiz) => quiz.id)).size).toBe(selected.length);
    expect(selected.every((quiz) => quizzes.includes(quiz) && quiz.value === "practical")).toBe(true);
    expect(selected.map((quiz) => quiz.category)).toEqual(
      overviewCategoryOrder.flatMap((category) => [category, category]),
    );
    expect(overviewCategoryOrder.map((category) => categoryLearning[category].chapter)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
  });
});
