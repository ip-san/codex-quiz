import { expect, it } from "vitest";
import { quizzes } from "../data";
import { scenarios } from "./scenarios";

it("provides seven ordered courses backed by existing questions", () => {
  expect(scenarios).toHaveLength(7);
  expect(new Set(scenarios.map((course) => course.id)).size).toBe(scenarios.length);
  for (const course of scenarios) {
    expect(course.ids).toHaveLength(3);
    expect(course.steps).toHaveLength(course.ids.length);
    expect(new Set(course.ids).size).toBe(course.ids.length);
    expect(course.ids.every((id) => quizzes.some((quiz) => quiz.id === id))).toBe(true);
  }
});
