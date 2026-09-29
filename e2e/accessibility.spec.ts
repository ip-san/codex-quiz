import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const scan = async (page: Page) => {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  const violations = results.violations.map(({ id, nodes }) => ({
    id,
    targets: nodes.map(({ target }) => target.join(" ")),
  }));
  expect(violations).toEqual([]);
};

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem("codex-quiz-intro-seen", "1");
  });
  await page.reload();
});

test("first visit guide has no WCAG A or AA violations", async ({ page }) => {
  await page.evaluate(() => localStorage.removeItem("codex-quiz-intro-seen"));
  await page.reload();
  await scan(page);
  await page.getByRole("button", { name: "学び方を見る" }).click();
  await scan(page);
});

test("home has no WCAG A or AA violations", async ({ page }) => {
  await page.reload();
  await scan(page);
});

test("open mobile menu has no WCAG A or AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.reload();
  await page.locator(".mobile-nav summary").click();
  await expect(page.getByRole("button", { name: "進捗を見る" })).toBeVisible();
  await scan(page);
});

test("quiz has no WCAG A or AA violations", async ({ page }) => {
  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toBeVisible();
  await scan(page);
});

test("chapter introduction has no WCAG A or AA violations", async ({ page }) => {
  await page.getByRole("button", { name: /全体像モード/ }).click();
  await expect(page.getByRole("button", { name: /チャプターを始める/ })).toBeVisible();
  await scan(page);
});

test("result has no WCAG A or AA violations", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.locator("button.choice").first().click();
  await page.getByRole("button", { name: "結果を見る" }).click();
  await expect(page.getByRole("button", { name: "同じ内容でもう一度" })).toBeVisible();
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

test("correct feedback and replaying a flow have no WCAG A or AA violations", async ({ page }) => {
  await page.goto("/?q=safe-03");
  await page.getByRole("button", { name: /必要なworkspace範囲から始め/ }).click();
  await expect(page.getByRole("status")).toContainText("正解です");
  await scan(page);

  await page.getByRole("button", { name: "次の手順を表示" }).click();
  await expect(page.getByText("1 / 3")).toBeVisible();
  await scan(page);
});

test("wrong feedback and terminal diagram have no WCAG A or AA violations", async ({ page }) => {
  await page.goto("/?q=basic-11");
  const wrongChoice = page.locator("button.choice").filter({ hasText: /--resume/ });
  await wrongChoice.click();
  await expect(page.getByRole("status")).toContainText("この選択肢が違う理由");
  await expect(page.getByRole("button", { name: "操作例を再生" })).toBeVisible();
  await scan(page);
});

test("mobile quiz feedback has no WCAG A or AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/?q=safe-03");
  await page.getByRole("button", { name: /必要なworkspace範囲から始め/ }).click();
  await expect(page.getByRole("button", { name: "次の手順を表示" })).toBeVisible();
  await scan(page);
});

test("keyboard activation of a diagram control does not advance the quiz", async ({ page }) => {
  await page.goto("/?q=safe-03");
  await page.getByRole("button", { name: /必要なworkspace範囲から始め/ }).click();
  const replay = page.getByRole("button", { name: "次の手順を表示" });
  await replay.focus();
  await page.keyboard.press("Enter");

  await expect(replay).toBeVisible();
  await expect(page.getByText("1 / 3")).toBeVisible();
  await expect(page.getByRole("button", { name: "結果を見る" })).toBeVisible();
});

test("reduced motion advances a flow only on request", async ({ page }) => {
  await page.goto("/?q=safe-03");
  await page.getByRole("button", { name: /必要なworkspace範囲から始め/ }).click();
  const nextStep = page.getByRole("button", { name: "次の手順を表示" });
  await nextStep.click();
  await expect(page.getByText("1 / 3")).toBeVisible();
  await page.waitForTimeout(1400);
  await expect(page.getByText("1 / 3")).toBeVisible();
  await nextStep.click();
  await expect(page.getByText("2 / 3")).toBeVisible();
});

test("instruction hierarchy is readable and has no WCAG A or AA violations", async ({ page }) => {
  await page.goto("/?q=agents-01");
  await page.getByRole("button", { name: /AGENTS\.md/ }).click();
  const hierarchy = page.locator(".diagram-hierarchy");
  await expect(hierarchy.locator("li")).toHaveCount(3);
  await expect(hierarchy.locator(".emphasis")).toContainText("repository root");
  await scan(page);
});
