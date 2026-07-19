import { describe, expect, it } from "vitest";
import { quizzes, type Quiz } from "./data";
import { assertValidQuizzes, validateQuizzes } from "./quizValidation";

const validQuiz: Quiz = {
  id: "test-01",
  category: "basics",
  question: "Codexの基本的な役割として適切なものは？",
  choices: ["コード作業の支援", "天気の制御", "物理配送", "電源の供給"],
  answer: 0,
  explanation: "Codexはコードの作成、理解、レビュー、デバッグなどのソフトウェア開発作業を支援します。",
  source: "Codex overview",
};

describe("Codex quiz quality gate", () => {
  it("ships only structurally valid quiz data", () => {
    expect(validateQuizzes(quizzes)).toEqual([]);
    expect(quizzes).toHaveLength(210);
    const categoryCounts = quizzes.reduce<Record<string, number>>((counts, quiz) => {
      counts[quiz.category] = (counts[quiz.category] ?? 0) + 1;
      return counts;
    }, {});
    expect(Object.keys(categoryCounts)).toHaveLength(9);
    expect(categoryCounts).toEqual({
      basics: 18,
      prompting: 17,
      agents: 14,
      security: 23,
      config: 15,
      extend: 40,
      session: 20,
      workflow: 24,
      surfaces: 39,
    });
  });

  it("accepts a complete four-choice quiz", () => {
    expect(() => assertValidQuizzes([validQuiz])).not.toThrow();
  });

  it("requires traceable metadata for value-classified questions", () => {
    const issues = validateQuizzes([{ ...validQuiz, value: "practical" }]);
    expect(issues.map((issue) => issue.field)).toEqual(
      expect.arrayContaining(["difficulty", "topic", "referenceUrl", "verifiedAt"]),
    );
  });

  it("requires useful feedback for every wrong choice when feedback is provided", () => {
    const issues = validateQuizzes([{ ...validQuiz, wrongFeedback: { 1: "短い" } }]);
    expect(issues.filter((issue) => issue.field === "wrongFeedback")).toHaveLength(3);
    expect(quizzes.filter((quiz) => quiz.wrongFeedback)).toHaveLength(45);
  });

  it("detects duplicate IDs and questions", () => {
    const issues = validateQuizzes([validQuiz, { ...validQuiz }]);
    expect(issues.map((issue) => issue.message)).toContain("IDが重複しています");
    expect(issues.map((issue) => issue.message)).toContain("問題文が重複しています");
  });

  it("rejects malformed options, answers, explanations, and sources", () => {
    const malformed: Quiz = {
      ...validQuiz,
      id: "bad",
      question: "疑問符がない問題",
      choices: ["同じ", "同じ", "3つだけ"],
      answer: 9,
      explanation: "短い",
      source: "",
    };
    const fields = validateQuizzes([malformed]).map((issue) => issue.field);
    expect(fields).toEqual(expect.arrayContaining(["id", "question", "choices", "answer", "explanation", "source"]));
  });
});
