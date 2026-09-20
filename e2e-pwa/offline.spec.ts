import { expect, test } from "@playwright/test";

test("production worker preserves other caches and supports offline study", async ({ page, context }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    await caches.open("other-app-test");
    await caches.open("codex-quiz-obsolete");
    const registration = await navigator.serviceWorker.getRegistration();
    await registration?.unregister();
  });
  await page.reload();
  await page.evaluate(async () => { await navigator.serviceWorker.ready; });
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes("codex-quiz-obsolete"))).toBe(false);
  expect(await page.evaluate(async () => (await caches.keys()).includes("other-app-test"))).toBe(true);
  await page.reload();
  await page.getByRole("button", { name: /ランダム10問を始める/ }).click();
  await page.locator("button.choice").first().click();
  await expect(page.getByRole("button", { name: /次の問題へ/ })).toBeVisible();
  await expect.poll(() => page.evaluate(async () => {
    const cache = await caches.open("codex-quiz-v3");
    return (await cache.keys()).some((request) => request.url.includes("wrongFeedback-"));
  })).toBe(true);
  await context.setOffline(true);
  await page.reload();
  await page.getByRole("button", { name: /再開する/ }).click();
  await expect(page.getByRole("button", { name: /次の問題へ/ })).toBeVisible();
  await page.getByRole("button", { name: /次の問題へ/ }).click();
  await expect(page.locator("button.choice").first()).toBeEnabled();
  await context.setOffline(false);
  await page.reload();
  await page.getByRole("button", { name: /再開する/ }).click();
  await expect(page.getByRole("progressbar", { name: "クイズの進捗" })).toHaveAttribute("aria-valuenow", "2");
});
