import { expect, test } from "@playwright/test";
import { scenarios } from "../src/domain/scenarios";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
});

for (const scenario of scenarios) {
test(`scenario ${scenario.id} keeps its order through resume, completion and retry`, async ({ page }) => {
  await page.reload();
  await page.getByRole("button", { name: `${scenario.title}を始める` }).click();
  const savedIds = [...scenario.ids];
  await page.locator("button.choice").first().click();
  await page.getByRole("button", { name: /次の問題へ/ }).click();
  await page.reload();
  await page.getByRole("button", { name: /再開する/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuenow", "2");
  for (let i = 0; i < 2; i++) {
    await page.locator("button.choice").first().click();
    await page.getByRole("button", { name: /次の問題へ|結果を見る/ }).click();
  }
  await page.getByRole("button", { name: "同じ内容でもう一度" }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-session") ?? "null").ids)).toEqual(savedIds);
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuenow", "1");
});
}

test("malformed progress does not crash and is backed up before new answers", async ({ page }) => {
  const raw = JSON.stringify({ answered: 3, correct: 1, questions: {}, bookmarks: {}, history: "broken" });
  await page.evaluate((value) => localStorage.setItem("codex-quiz-progress", value), raw);
  await page.reload();
  await expect(page.getByRole("heading", { name: /Codexを/ })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem("codex-quiz-progress"))).toBe(raw);
  expect(await page.evaluate(() => localStorage.getItem("codex-quiz-progress-recovery"))).toBe(raw);
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Codex CLI/ }).click();
  expect(await page.evaluate(() => localStorage.getItem("codex-quiz-progress-recovery"))).toBe(raw);
});

for (const mode of ["normal", "study", "exam", "overview"]) {
  test(`unanswered ${mode} session resumes at the saved question`, async ({ page }) => {
    await page.evaluate((savedMode) => localStorage.setItem("codex-quiz-session", JSON.stringify({
      ids: ["basic-01"], index: 0, score: 0, label: "未回答の再開",
      category: null, selected: null, mode: savedMode,
    })), mode);
    await page.reload();
    await page.getByRole("button", { name: /再開する/ }).click();
    if (mode === "study") await page.getByRole("button", { name: /理解したら問題へ/ }).click();
    await expect(page.locator("button.choice")).toHaveCount(4);
    await expect(page.locator("button.choice").first()).toBeEnabled();
    await page.getByRole("button", { name: "ホームへ戻る" }).click();
    await page.getByRole("button", { name: /再開する/ }).click();
    await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuenow", "1");
  });
}

test("invalid saved session is ignored without deleting the original", async ({ page }) => {
  const invalid = { ids: ["basic-01"], index: "0", score: 0, label: "broken", category: null, selected: null };
  await page.evaluate((value) => localStorage.setItem("codex-quiz-session", JSON.stringify(value)), invalid);
  await page.reload();
  await expect(page.getByRole("heading", { name: /Codexを/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /再開する/ })).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-session") ?? "null"))).toEqual(invalid);
});

for (const mode of ["normal", "study", "exam", "overview"]) {
  test(`saved ${mode} answer resumes without adding another attempt`, async ({ page }) => {
    await page.evaluate((savedMode) => {
      localStorage.setItem("codex-quiz-session", JSON.stringify({
        ids: ["basic-01"], index: 0, score: 1, label: "再開テスト",
        category: null, selected: 0, mode: savedMode,
      }));
    }, mode);
    await page.reload();
    await page.getByRole("button", { name: /再開する/ }).click();
    await expect(page.getByRole("button", { name: "結果を見る" })).toBeVisible();
    await expect(page.locator("button.choice").first()).toBeDisabled();
    expect(await page.evaluate(() => localStorage.getItem("codex-quiz-progress"))).toBeNull();
  });
}

test("chapter progress survives reload and starts category practice", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Codex CLI/ }).click();
  await page.goto("/?view=progress");
  await expect(page.getByRole("heading", { name: "チャプターの学習状況" })).toBeVisible();
  await page.reload();
  const chapters = page.getByRole("region", { name: "チャプターの学習状況" });
  await expect(chapters).toContainText("回答済み 1/20問");
  await expect(chapters).toContainText("残り 19問");
  await chapters.getByRole("button", { name: "この章を学ぶ" }).first().click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "20");
});

test("reader links a specific quiz and its official reference", async ({ page }) => {
  await page.goto("/?view=reader");
  const card = page.locator(".reader-card").first();
  const quizLink = card.getByRole("link", { name: "この問題を解く" });
  const destination = await quizLink.getAttribute("href");
  const reference = card.getByRole("link", { name: "公式資料を読む（別タブ）" });
  await expect(reference).toHaveAttribute("href", /^https:\/\/(learn\.chatgpt\.com|developers\.openai\.com)\//);
  await expect(reference).toHaveAttribute("target", "_blank");
  await quizLink.click();
  expect(new URL(page.url()).search).toBe(destination);
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "1");
  await expect(page.locator("button.choice")).toHaveCount(4);
});

test("reader filters weak questions and resets empty filters", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Responses API/ }).click();
  await page.goto("/?view=reader");
  await page.getByRole("combobox", { name: "復習対象で絞り込み" }).selectOption("weak");
  await expect(page.locator(".reader-card")).toHaveCount(1);
  await page.getByRole("textbox", { name: "問題を検索" }).fill("no-matching-question-xyz");
  await expect(page.locator(".reader-card")).toHaveCount(0);
  await page.getByRole("button", { name: "絞り込みをすべて解除" }).click();
  await expect(page.getByRole("combobox", { name: "復習対象で絞り込み" })).toHaveValue("all");
  await expect(page.getByRole("textbox", { name: "問題を検索" })).toHaveValue("");
  expect(await page.locator(".reader-card").count()).toBeGreaterThan(1);
});

test("beginner guide starts study mode and remains available after learning", async ({ page }) => {
  await page.reload();
  const guide = page.locator("details.learning-guide");
  await expect(guide).toHaveAttribute("open", "");
  await page.getByRole("button", { name: "解説を読んで10問に挑戦" }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-session") ?? "null"));
  expect(saved.mode).toBe("study");
  expect(saved.ids).toHaveLength(10);
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Codex CLI/ }).click();
  await page.goto("/");
  await expect(guide).not.toHaveAttribute("open");
  await guide.locator("summary").click();
  await expect(page.getByRole("button", { name: "解説を読んで10問に挑戦" })).toBeVisible();
});

test("result recommends weak review after a wrong answer", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Responses API/ }).click();
  await page.getByRole("button", { name: "結果を見る" }).click();
  await expect(page.getByRole("heading", { name: "次のおすすめ" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole("button", { name: "苦手問題を復習する" }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "1");
});

test("result allows a learner with no pending review to finish", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Codex CLI/ }).click();
  await page.getByRole("button", { name: "結果を見る" }).click();
  await page.getByRole("button", { name: "学習の成果を見る" }).click();
  await expect(page.getByRole("heading", { name: "学習の現在地" })).toBeVisible();
});

test("home exposes navigation and starts a quiz", async ({ page }) => {
  await page.reload();
  await expect(page.getByRole("navigation", { name: "メインナビゲーション" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Codexを/ })).toBeVisible();

  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "10");
  await expect(page.locator("fieldset.choices")).toBeVisible();
});

test("exam starts a balanced 100-question session", async ({ page }) => {
  await page.getByRole("button", { name: /実力テスト/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "100");
  const savedIds = await page.evaluate(() => JSON.parse(localStorage.getItem("codex-quiz-session") ?? "null").ids);
  expect(savedIds).toHaveLength(100);
  expect(new Set(savedIds).size).toBe(100);
});

test("answering announces feedback and moves focus", async ({ page }) => {
  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await page.locator("button.choice").first().click();

  const feedback = page.getByRole("status").filter({ has: page.getByRole("button", { name: /次の問題へ|結果を見る/ }) });
  await expect(feedback).toBeVisible();
  await expect(feedback).toBeFocused();
});

test("correct-answer action stays inside feedback on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Codex CLI/ }).click();

  const feedback = page.getByRole("status");
  const nextButton = feedback.getByRole("button", { name: /結果を見る/ });
  const feedbackBox = await feedback.boundingBox();
  const buttonBox = await nextButton.boundingBox();

  expect(feedbackBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(buttonBox!.x).toBeGreaterThanOrEqual(feedbackBox!.x);
  expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(feedbackBox!.x + feedbackBox!.width);
  expect(buttonBox!.y + buttonBox!.height).toBeLessThanOrEqual(feedbackBox!.y + feedbackBox!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test("a wrong answer loads its choice-specific feedback", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.getByRole("button", { name: /Responses API/ }).click();

  const feedback = page.getByRole("status");
  await expect(feedback).toContainText("terminal");
  await expect(feedback).toContainText("Codex CLI");
});

test("terminal operation examples can be replayed and copied", async ({ page }) => {
  await page.goto("/?q=basic-11");
  await page.getByRole("button", { name: /--ephemeral/ }).click();

  await expect(page.getByRole("button", { name: "操作例を再生" })).toBeVisible();
  await expect(page.getByRole("button", { name: "コマンドをコピー" })).toBeVisible();
  await page.getByRole("button", { name: "操作例を再生" }).click();
  await expect(page.locator(".diagram-terminal p.command")).toContainText("codex exec --ephemeral");
});

test("question share URL opens a one-question session", async ({ page }) => {
  await page.goto("/?q=basic-01");
  const progress = page.getByRole("progressbar", { name: "クイズの進捗" });
  await expect(progress).toHaveAttribute("aria-valuemax", "1");
  await expect(page.getByRole("heading", { name: /ローカルのrepository/ })).toBeVisible();
  await expect(page).toHaveURL(/\?q=basic-01$/);
});

test("result retry preserves the completed session scope", async ({ page }) => {
  await page.goto("/?q=basic-01");
  await page.locator("button.choice").first().click();
  await page.getByRole("button", { name: "結果を見る" }).click();
  await expect(page.getByRole("heading", { name: /すばらしい|いい調子|ここから伸びます/ })).toBeVisible();

  await page.getByRole("button", { name: "同じ内容でもう一度" }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuemax", "1");
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

test("primary screens do not overflow horizontally at the minimum mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });

  for (const path of ["/", "/?view=reader", "/?view=progress"]) {
    await page.goto(path);
    const width = await page.evaluate(() => document.documentElement.scrollWidth);
    const overflow = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("body *")]
        .filter((element) => element.getBoundingClientRect().right > window.innerWidth + 1)
        .slice(0, 5)
        .map((element) => `${element.tagName.toLowerCase()}.${element.className}`),
    );
    expect(width, `${path} should not overflow horizontally: ${overflow.join(", ")}`).toBeLessThanOrEqual(320);
  }
});
