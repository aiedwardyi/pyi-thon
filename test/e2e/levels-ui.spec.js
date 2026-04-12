import { test, expect } from "@playwright/test";

const TOTAL_LEVELS = 30;
const completed = Array.from({ length: TOTAL_LEVELS }, (_, index) => index + 1).join(",");

function levelUrl(levelId, lang = "en") {
  return `/?qa=1&qaSkipWelcome=1&qaCompleted=${completed}&qaLevel=${levelId}&qaLang=${lang}`;
}

async function openHint(page, lang) {
  await page.getByRole("button", { name: lang === "ko" ? "힌트" : "Hint", exact: true }).click();
}

async function closeHint(page, lang) {
  await page.getByRole("button", { name: lang === "ko" ? "힌트 숨기기" : "Hide Hint", exact: true }).click();
}

async function expectHintFormatting(page) {
  const text = await page.getByTestId("hint-panel").innerText();
  expect(text.includes("\\n")).toBeFalsy();
}

test("desktop QA sweep across all 30 levels", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only sweep");

  for (let levelId = 1; levelId <= TOTAL_LEVELS; levelId += 1) {
    await page.goto(levelUrl(levelId, "en"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await openHint(page, "en");
    await expect(page.getByTestId("hint-panel")).toBeVisible();
    await expectHintFormatting(page);
    await closeHint(page, "en");

    await page.getByTestId("open-settings").click();
    await expect(page.getByText(/^Language$/)).toBeVisible();
    await page.getByTestId("lang-ko").click();
    await page.getByTestId("close-settings").click();

    await expect(page.getByRole("button", { name: "힌트", exact: true })).toBeVisible();
    await openHint(page, "ko");
    await expect(page.getByTestId("hint-panel")).toBeVisible();
    await expectHintFormatting(page);
    await closeHint(page, "ko");

    await page.getByTestId("open-settings").click();
    await expect(page.getByText(/^언어$/)).toBeVisible();
    await page.getByTestId("lang-en").click();
    await page.getByTestId("close-settings").click();
    await expect(page.getByRole("button", { name: "Hint", exact: true })).toBeVisible();
  }
});

test("initial QA load stays free of console and page errors", async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push(error.message);
  });

  await page.goto(levelUrl(1, "en"));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("settings dialog supports keyboard close", async ({ page }) => {
  await page.goto(levelUrl(1, "en"));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const settingsButton = page.getByTestId("open-settings");
  await settingsButton.focus();
  await settingsButton.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId("close-settings")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("mobile QA sweep across all 30 levels", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only sweep");

  for (let levelId = 1; levelId <= TOTAL_LEVELS; levelId += 1) {
    await page.goto(levelUrl(levelId, "en"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hint", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Run Code/ })).toBeVisible();

    await openHint(page, "en");
    await expect(page.getByTestId("hint-panel")).toBeVisible();
    await expectHintFormatting(page);
    await closeHint(page, "en");

    await page.getByTestId("open-settings").click();
    await page.getByTestId("lang-ko").click();
    await page.getByTestId("close-settings").click();
    await expect(page.getByRole("button", { name: "힌트", exact: true })).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  }
});
