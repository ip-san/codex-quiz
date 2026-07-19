import { describe, expect, it } from "vitest";
import { emptyProgress, parseProgressExport, serializeProgress, type SavedProgress } from "./progressData";

describe("progress data portability", () => {
  it("round-trips all learning data", () => {
    const progress: SavedProgress = {
      answered: 2,
      correct: 1,
      bookmarks: ["basic-01"],
      questions: { "basic-01": { attempts: 2, correct: 1, lastCorrect: true, intervalDays: 1 } },
      history: [{ id: "session-1", completedAt: "2026-07-19T00:00:00.000Z", score: 1, total: 2, label: "テスト" }],
    };
    expect(parseProgressExport(serializeProgress(progress))).toEqual(progress);
  });

  it("rejects invalid JSON and unknown formats", () => {
    expect(() => parseProgressExport("not-json")).toThrow("JSONファイルを読み取れませんでした");
    expect(() => parseProgressExport(JSON.stringify({ format: "other", version: 1 }))).toThrow(
      "対応していない学習データ形式です",
    );
  });

  it("rejects impossible counters and unknown quiz IDs", () => {
    const invalidCounter = JSON.parse(serializeProgress(emptyProgress));
    invalidCounter.data = { ...emptyProgress, answered: 1, correct: 2 };
    expect(() => parseProgressExport(JSON.stringify(invalidCounter))).toThrow("回答数または正解数が正しくありません");

    const unknownQuestion = JSON.parse(serializeProgress(emptyProgress));
    unknownQuestion.data.questions = { "unknown-01": { attempts: 1, correct: 1, lastCorrect: true } };
    expect(() => parseProgressExport(JSON.stringify(unknownQuestion))).toThrow(
      "問題履歴 unknown-01 が正しくありません",
    );
  });
});
