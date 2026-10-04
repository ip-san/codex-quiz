import { describe, expect, it } from "vitest";
import { quizzes, type Quiz } from "./data";
import { quizDiagrams } from "./diagrams";
import { assertValidQuizzes, validateQuizzes } from "./quizValidation";
import wrongFeedback from "./wrongFeedback.json";
import wrongFeedbackSource from "./wrongFeedback.json?raw";

const quizzesWithFeedback = quizzes.map((quiz) => ({
  ...quiz,
  wrongFeedback: (wrongFeedback as Record<string, Record<number, string>>)[quiz.id],
}));

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
    expect(validateQuizzes(quizzesWithFeedback)).toEqual([]);
    expect(quizzes).toHaveLength(264);
    const categoryCounts = quizzes.reduce<Record<string, number>>((counts, quiz) => {
      counts[quiz.category] = (counts[quiz.category] ?? 0) + 1;
      return counts;
    }, {});
    expect(Object.keys(categoryCounts)).toHaveLength(9);
    expect(categoryCounts).toEqual({
      basics: 20,
      prompting: 22,
      agents: 19,
      security: 43,
      config: 22,
      extend: 47,
      session: 25,
      workflow: 27,
      surfaces: 39,
    });
    expect(new Set(quizzes.map((quiz) => quiz.topic)).size).toBe(quizzes.length);
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

  it("keeps ID prefixes aligned with categories and metadata normalized", () => {
    const issues = validateQuizzes([
      {
        ...validQuiz,
        id: "safe-99",
        value: "practical",
        difficulty: "beginner",
        topic: "Invalid Topic",
        referenceUrl: "https://learn.chatgpt.com/docs/quickstart",
        verifiedAt: "2026/07/19",
      },
    ]);
    expect(issues.map((issue) => issue.field)).toEqual(expect.arrayContaining(["category", "topic", "verifiedAt"]));
  });

  it("requires useful feedback for every wrong choice when feedback is provided", () => {
    const issues = validateQuizzes([{ ...validQuiz, wrongFeedback: { 1: "短い" } }]);
    expect(issues.filter((issue) => issue.field === "wrongFeedback")).toHaveLength(3);
    expect(Object.keys(wrongFeedback)).toHaveLength(264);
    expect(Object.keys(wrongFeedback).filter((id) => !quizzes.some((quiz) => quiz.id === id))).toEqual([]);
    const declaredFeedbackIds = [...wrongFeedbackSource.matchAll(/^ {2}"([^"]+)": \{$/gm)].map(([, id]) => id);
    expect(new Set(declaredFeedbackIds).size).toBe(declaredFeedbackIds.length);
  });

  it("rejects feedback attached to the correct answer", () => {
    const issues = validateQuizzes([
      {
        ...validQuiz,
        wrongFeedback: {
          0: "正解には不正解feedbackを設定しません。",
          1: "十分な長さのfeedbackです。",
          2: "十分な長さのfeedbackです。",
          3: "十分な長さのfeedbackです。",
        },
      },
    ]);
    expect(issues.map((issue) => issue.message)).toContain("正解選択肢に不正解feedbackを設定できません");
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

  it("rejects blank choices even when four slots exist", () => {
    const issues = validateQuizzes([{ ...validQuiz, choices: ["正解", "誤答", " ", "別の誤答"] }]);
    expect(issues.map((issue) => issue.message)).toContain("空の選択肢は使用できません");
  });

  it("keeps diagrams attached to real questions and preserves terminal examples", () => {
    expect(Object.keys(quizDiagrams).filter((id) => !quizzes.some((quiz) => quiz.id === id))).toEqual([]);
    const terminalDiagrams = Object.values(quizDiagrams)
      .flat()
      .filter((diagram) => diagram.type === "terminal");
    expect(terminalDiagrams).toHaveLength(33);
    expect(terminalDiagrams.every((diagram) => diagram.lines.some((line) => line.kind === "command"))).toBe(true);
  });

  it("keeps diagram labels and learning steps complete", () => {
    const issues: string[] = [];
    const requiredText = (id: string, path: string, value: string) => {
      if (!value.trim()) issues.push(`${id} ${path}: empty text`);
      if (/…|\.\.\./.test(value)) issues.push(`${id} ${path}: possible truncated text`);
    };

    for (const [id, diagrams] of Object.entries(quizDiagrams)) {
      if (diagrams.length === 0) issues.push(`${id}: empty diagram list`);
      for (const [diagramIndex, diagram] of diagrams.entries()) {
        const path = `diagram[${diagramIndex}]`;
        requiredText(id, `${path}.label`, diagram.label);
        switch (diagram.type) {
          case "flow":
            if (diagram.steps.length < 2) issues.push(`${id} ${path}: flow needs at least two steps`);
            diagram.steps.forEach((step, index) => {
              requiredText(id, `${path}.steps[${index}].text`, step.text);
              if (step.sub !== undefined) requiredText(id, `${path}.steps[${index}].sub`, step.sub);
            });
            break;
          case "hierarchy":
            if (diagram.items.length < 2) issues.push(`${id} ${path}: hierarchy needs at least two items`);
            diagram.items.forEach((item, index) => {
              requiredText(id, `${path}.items[${index}].text`, item.text);
              requiredText(id, `${path}.items[${index}].sub`, item.sub);
            });
            break;
          case "comparison":
            if (diagram.columns.length < 2) issues.push(`${id} ${path}: comparison needs at least two columns`);
            diagram.columns.forEach((column, index) => {
              requiredText(id, `${path}.columns[${index}].heading`, column.heading);
              if (column.items.length === 0) issues.push(`${id} ${path}.columns[${index}]: empty items`);
              column.items.forEach((item, itemIndex) => {
                requiredText(id, `${path}.columns[${index}].items[${itemIndex}]`, item);
              });
            });
            break;
          case "terminal":
            if (diagram.lines.length === 0) issues.push(`${id} ${path}: empty terminal`);
            diagram.lines.forEach((line, index) => {
              if (!line.text.trim()) issues.push(`${id} ${path}.lines[${index}]: empty terminal line`);
            });
            break;
          case "config":
            requiredText(id, `${path}.filepath`, diagram.filepath);
            if (diagram.lines.length === 0) issues.push(`${id} ${path}: empty config`);
            // Empty config lines may intentionally represent blank lines in an example.
            break;
        }
      }
    }

    expect(issues).toEqual([]);
  });
});
