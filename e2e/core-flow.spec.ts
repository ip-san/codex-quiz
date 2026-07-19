import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("home exposes navigation and starts a quiz", async ({ page }) => {
  await page.reload();
  await expect(page.getByRole("navigation", { name: "メインナビゲーション" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Codexを/ })).toBeVisible();

  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "10");
  await expect(page.locator("fieldset.choices")).toBeVisible();
});

test("answering announces feedback and moves focus", async ({ page }) => {
  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await page.locator("button.choice").first().click();

  const feedback = page.getByRole("status").filter({ has: page.getByRole("button", { name: /次の問題へ|結果を見る/ }) });
  await expect(feedback).toBeVisible();
  await expect(feedback).toBeFocused();
});

test("a wrong answer loads its choice-specific feedback", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Responses API/ }).click();

  const feedback = page.getByRole("status");
  await expect(feedback).toContainText("terminal");
  await expect(feedback).toContainText("Codex CLI");
});

test("question share URL opens a one-question session", async ({ page }) => {
  await page.goto("/?q=basic-01");
  const progress = page.getByRole("progressbar", { name: "クイズの進捗" });
  await expect(progress).toHaveAttribute("aria-valuemax", "1");
  await expect(page.getByRole("heading", { name: /ローカルのrepository/ })).toBeVisible();
  await expect(page).toHaveURL(/\?q=basic-01$/);
});

test("reader and progress deep links open the requested screen", async ({ page }) => {
  await page.goto("/?view=reader");
  await expect(page.getByRole("textbox", { name: "問題を検索" })).toBeVisible();
  await expect(page).toHaveURL(/\?view=reader$/);

  await page.goto("/?view=progress");
  await expect(page.getByRole("heading", { name: "学習の現在地" })).toBeVisible();
  await expect(page).toHaveURL(/\?view=progress$/);
});
