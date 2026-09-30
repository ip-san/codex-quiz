import { describe, expect, it } from "vitest";
import { categories, type Category } from "../data";
import { selectStudyPathQuestions } from "./studyPath";

describe("study path", () => {
  it("offers five distinct practical questions for every chapter", () => {
    for (const category of Object.keys(categories) as Category[]) {
      const selected = selectStudyPathQuestions(category);
      expect(selected).toHaveLength(5);
      expect(new Set(selected.map((quiz) => quiz.id)).size).toBe(5);
      expect(selected.every((quiz) => quiz.category === category && quiz.value !== "trivia")).toBe(true);
    }
  });
});
