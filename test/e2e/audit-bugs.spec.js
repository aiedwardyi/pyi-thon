import { test, expect } from "@playwright/test";

const RUN_TIMEOUT = 60_000;
const HELLO = 'print("Hello, World!")';

async function openRep(page, level = 1, rep = 1) {
  await page.goto(`/?qa=1&qaLevel=${level}&qaRep=${rep}`);
  if (rep === 1) await page.getByRole("button", { name: "Start", exact: true }).click();
}

async function setCode(page, code) {
  await page.locator(".cm-content").click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(code);
}

async function savedProgress(page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem("pyithon-progress")));
}

test("B1 selecting the current topic preserves the attempt and answer penalty", async ({ page }) => {
  await openRep(page);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toBeVisible({ timeout: RUN_TIMEOUT });
  for (let i = 0; i < 3; i += 1) await page.getByTestId("hint-button").click();
  await setCode(page, HELLO);
  await page.getByTestId("open-level-select").click();
  await page.getByTestId("topic-1").click();
  if (await page.getByTestId("see-card").isVisible()) await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.locator(".cm-content")).toHaveText(HELLO);
  await expect(page.getByTestId("hint-button")).toBeDisabled();
  expect((await savedProgress(page)).topics[1].attempt).toMatchObject({ code: HELLO, misses: 1, hintStep: 3 });
  await page.evaluate(() => history.replaceState(null, "", "/"));
  await page.reload();
  await expect(page.locator(".cm-content")).toHaveText(HELLO);
  await expect(page.getByTestId("hint-button")).toBeDisabled();
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("DONE", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-xp")).toHaveText("+5");
});

test("B2 reloading a passed rep cannot credit it twice", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Start Learning/ }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await setCode(page, HELLO);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-xp")).toHaveText("+30", { timeout: RUN_TIMEOUT });
  const before = await savedProgress(page);
  await page.reload();
  await expect(page.getByTestId("rep-goal")).toBeVisible();
  if (await page.getByTestId("run-button").isVisible()) {
    await setCode(page, HELLO);
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("win-xp")).toHaveText("+30", { timeout: RUN_TIMEOUT });
  }
  await page.keyboard.press("ControlOrMeta+Enter");
  const after = await savedProgress(page);
  expect(after.xp).toBe(before.xp);
  expect(after.combo).toBe(before.combo);
  expect(after.days).toEqual(before.days);
  expect(after.topics[1].outcomes).toEqual(before.topics[1].outcomes);
});

test("B3 a complete legacy hint is Answer and earns DONE", async ({ page }) => {
  await openRep(page, 7);
  await page.getByTestId("hint-button").click();
  await expect.soft(page.getByTestId("hint-panel")).toContainText("Answer");
  await setCode(page, "for i in range(5):\n    print(i)");
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("DONE", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-xp")).toHaveText("+5");
});

test("B4 write and change reps check both sides of their boundaries", async ({ page }) => {
  test.setTimeout(180_000);
  for (const [rep, variable, value, wrong, right, yes, no] of [
    [2, "age", 20, [">= 20", ">= 19", "> 18", ">= 17"], ">= 18", "adult", "kid"],
    [3, "battery", 15, ["<= 20", "< 19", "< 21"], "< 20", "charge", "ok"],
  ]) {
    await openRep(page, 5, rep);
    const code = (condition) => `${variable} = ${value}\nif ${variable} ${condition}:\n    print("${yes}")\nelse:\n    print("${no}")`;
    for (const condition of wrong) {
      await setCode(page, code(condition));
      await page.getByTestId("run-button").click();
      await expect(page.getByTestId("run-button")).toBeEnabled({ timeout: RUN_TIMEOUT });
      await expect(page.getByTestId("feedback-message")).toBeVisible({ timeout: RUN_TIMEOUT });
      await expect(page.getByTestId("win-overlay")).toBeHidden();
    }
    await setCode(page, code(right));
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("win-word")).toHaveText("SOLVED", { timeout: RUN_TIMEOUT });
  }
});

test("switching topics preserves misses without hints", async ({ page }) => {
  await page.goto("/?qa=1&qaLevel=1&qaCompleted=1");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toBeVisible({ timeout: RUN_TIMEOUT });
  await setCode(page, HELLO);
  await page.getByTestId("open-level-select").click();
  await page.getByTestId("topic-2").click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByTestId("open-level-select").click();
  await page.getByTestId("topic-1").click();
  await expect(page.getByTestId("see-card")).toBeHidden();
  await expect(page.locator(".cm-content")).toHaveText(HELLO);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("SOLVED", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-xp")).toHaveText("+20");
});

test("a legacy nudge keeps SOLVED credit", async ({ page }) => {
  await openRep(page, 6);
  await expect(page.getByTestId("hint-button")).toHaveText("Hint");
  await page.getByTestId("hint-button").click();
  await setCode(page, 'grade = 82\nif grade >= 90:\n    print("A")\nelif grade >= 80:\n    print("B")\nelif grade >= 70:\n    print("C")\nelse:\n    print("F")');
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("SOLVED", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-xp")).toHaveText("+20");
});

test("lesson and win dialogs keep keyboard focus", async ({ page }) => {
  await page.goto("/?qa=1&qaLevel=1");
  const start = page.getByRole("button", { name: "Start", exact: true });
  await expect(start).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(start).toBeFocused();
  await page.keyboard.press("ControlOrMeta+Enter");
  await expect(page.getByTestId("see-card")).toBeVisible();
  expect((await savedProgress(page)).xp).toBe(0);
  await start.click();
  await setCode(page, HELLO);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-next")).toBeFocused({ timeout: RUN_TIMEOUT });
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "See code" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByTestId("win-next")).toBeFocused();
  await page.keyboard.press("ControlOrMeta+Enter");
  await expect(page.getByTestId("rep-count")).toHaveText("1/4");
  expect((await savedProgress(page)).xp).toBe(30);
});

test("B5 valid whitespace in Python calls passes", async ({ page }) => {
  await openRep(page, 2, 2);
  await setCode(page, 'city = "Seoul"\nprint (city)');
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("CLEAN", { timeout: RUN_TIMEOUT });
  await openRep(page, 28);
  await setCode(page, 'language = "Python"\nversion = 3\nprint (rf"{language} version {version} is awesome!")');
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("CLEAN", { timeout: RUN_TIMEOUT });
});

test("B6 Settings owns focus and blocks the covered Run shortcut", async ({ page }) => {
  await openRep(page);
  await setCode(page, HELLO);
  await page.getByTestId("open-settings").click();
  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(page.getByTestId("close-settings")).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  expect(await dialog.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Tab");
  await expect(page.getByTestId("close-settings")).toBeFocused();
  await page.keyboard.press("ControlOrMeta+Enter");
  await expect(page.getByTestId("run-button")).toBeEnabled();
  expect((await savedProgress(page)).xp).toBe(0);
  await expect(page.getByTestId("win-overlay")).toBeHidden();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("open-settings")).toBeFocused();
});

test("B7 language changes update existing feedback and editor metadata", async ({ page }) => {
  await openRep(page);
  await setCode(page, "print(Hello)");
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toHaveText("Line 1: Hello is text, so it needs quotes.", { timeout: RUN_TIMEOUT });
  for (const [lang, message, label] of [
    ["ko", "1번째 줄: 글자 Hello에는 따옴표가 필요해요.", "에디터"],
    ["en", "Line 1: Hello is text, so it needs quotes.", "Editor"],
  ]) {
    await page.getByTestId("open-settings").click();
    await page.getByTestId(`lang-${lang}`).click();
    await page.getByTestId("close-settings").click();
    await expect(page.getByTestId("feedback-message")).toHaveText(message);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator(".cm-content")).toHaveAttribute("lang", lang);
    await expect(page.locator(".cm-content")).toHaveAttribute("aria-label", label);
  }
});

test("a pending run honors answer reveals and Settings focus", async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route("**/pyodide.asm.wasm", async (route) => { await held; await route.continue(); });
  await openRep(page);
  await setCode(page, HELLO);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("run-button")).toBeDisabled();
  for (let i = 0; i < 3; i += 1) await page.getByTestId("hint-button").click();
  await page.getByTestId("open-settings").click();
  const settings = page.getByRole("dialog", { name: "Settings", includeHidden: true });
  release();
  await expect.poll(async () => (await savedProgress(page)).xp, { timeout: RUN_TIMEOUT }).toBeGreaterThan(0);
  expect.soft((await savedProgress(page)).xp).toBe(5);
  expect(await settings.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  await expect(page.getByTestId("win-overlay")).toBeHidden();
  await page.getByTestId("close-settings").click();
  await expect(page.getByTestId("win-word")).toHaveText("DONE");
  await expect(page.getByTestId("win-xp")).toHaveText("+5");
});
