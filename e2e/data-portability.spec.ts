import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

const progress = {
  answered: 2, correct: 1,
  questions: { "basic-01": { attempts: 2, correct: 1, lastCorrect: true, nextReviewAt: "2030-01-01T00:00:00.000Z", reviewStreak: 1, intervalDays: 1 } },
  bookmarks: ["basic-01"],
  history: [{ id: "example", completedAt: "2026-09-19T00:00:00.000Z", score: 1, total: 2, label: "保存テスト" }],
};
const file = (data: unknown) => ({
  name: "progress.json", mimeType: "application/json",
  buffer: Buffer.from(JSON.stringify({ format: "codex-quiz-progress", version: 1, data })),
});

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate((data) => {
    localStorage.clear();
    localStorage.setItem("codex-quiz-progress", JSON.stringify(data));
  }, progress);
  await page.goto("/?view=progress");
});

test("downloaded backup restores all learning data after reload", async ({ page }) => {
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /エクスポート/ }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).not.toBeNull();
  const raw = await readFile(path!, "utf8");
  expect(JSON.parse(raw).data).toEqual(progress);
  await page.evaluate(() => localStorage.removeItem("codex-quiz-progress"));
  await page.reload();
  page.once("dialog", (dialog) => dialog.accept());
  await page.locator('input[type="file"]').setInputFiles({ name: "backup.json", mimeType: "application/json", buffer: Buffer.from(raw) });
  await expect(page.getByRole("status")).toHaveText("学習データを読み込みました");
  await page.reload();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-progress")!))).toEqual(progress);
});

test("invalid and cancelled imports preserve existing data", async ({ page }) => {
  await page.locator('input[type="file"]').setInputFiles(file({ ...progress, correct: 99 }));
  await expect(page.getByRole("status")).toContainText("回答数または正解数");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-progress")!))).toEqual(progress);
  page.once("dialog", (dialog) => dialog.dismiss());
  await page.locator('input[type="file"]').setInputFiles(file({ ...progress, bookmarks: [] }));
  await expect(page.locator('input[type="file"]')).toHaveValue("");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-progress")!))).toEqual(progress);
});
