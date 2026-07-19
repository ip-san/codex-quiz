import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const scan = async (page: Page) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const violations = results.violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target }) => target.join(" ")),
  }));
  expect(violations).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

test("home has no WCAG A or AA violations", async ({ page }) => {
  await page.reload();
  await scan(page);
});

test("quiz has no WCAG A or AA violations", async ({ page }) => {
  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toBeVisible();
  await scan(page);
});

test("reader has no WCAG A or AA violations", async ({ page }) => {
  await page.goto("/?view=reader");
  await expect(page.getByRole("textbox", { name: "問題を検索" })).toBeVisible();
  await scan(page);
});

test("progress has no WCAG A or AA violations", async ({ page }) => {
  await page.goto("/?view=progress");
  await expect(page.getByRole("heading", { name: "学習の現在地" })).toBeVisible();
  await scan(page);
});
