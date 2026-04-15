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
  test.setTimeout(120_000);

  for (let levelId = 1; levelId <= TOTAL_LEVELS; levelId += 1) {
    await page.goto(levelUrl(levelId, "en"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await openHint(page, "en");
    await expect(page.getByTestId("hint-panel")).toBeVisible();
    await expectHintFormatting(page);
    await closeHint(page, "en");

    await page.getByTestId("open-settings").click();
    await expect(page.getByText(/^Language$/)).toBeVisible();
    await page.getByTestId("lang-ko").click({ force: true });
    await page.getByTestId("close-settings").click();

    await expect(page.getByRole("button", { name: "힌트", exact: true })).toBeVisible();
    await openHint(page, "ko");
    await expect(page.getByTestId("hint-panel")).toBeVisible();
    await expectHintFormatting(page);
    await closeHint(page, "ko");

    await page.getByTestId("open-settings").click();
    await expect(page.getByText(/^언어$/)).toBeVisible();
    await page.getByTestId("lang-en").click({ force: true });
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

test("Korean mode localizes accessible labels", async ({ page }) => {
  await page.goto(levelUrl(1, "ko"));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  await expect(page.getByRole("button", { name: "설정 열기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "사운드 켜기" })).toBeVisible();
  await expect(page.locator("textarea")).toHaveAttribute("placeholder", "# 여기에 Python 코드를 작성하세요...");
  await expect(page.locator("textarea")).toHaveAttribute("autocapitalize", "off");
  await expect(page.locator("textarea")).toHaveAttribute("autocorrect", "off");
  await expect(page.locator("textarea")).toHaveAttribute("autocomplete", "off");

  await page.getByTestId("open-settings").click();
  await expect(page.getByRole("dialog", { name: "설정" })).toBeVisible();
  await expect(page.getByRole("button", { name: "설정 닫기" })).toBeVisible();
  await page.getByTestId("close-settings").click();

  await page.getByTestId("open-level-select").click();
  await expect(page.getByRole("button", { name: "현재 레벨로 돌아가기" })).toBeVisible();
});

test("mobile QA sweep across all 30 levels", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only sweep");

  for (let levelId = 1; levelId <= TOTAL_LEVELS; levelId += 1) {
    await page.goto(levelUrl(levelId, "en"));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("button", { name: "Hint", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Task", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Run Code/ })).toBeVisible();

    await openHint(page, "en");
    await expect(page.getByTestId("hint-panel")).toBeVisible();
    await expectHintFormatting(page);
    await closeHint(page, "en");

    await page.getByTestId("open-settings").click();
    await page.getByTestId("lang-ko").click({ force: true });
    await page.getByTestId("close-settings").click();
    await expect(page.getByRole("button", { name: "힌트", exact: true })).toBeVisible();

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  }
});

test("narrow phone widths keep the header in compact layout", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only viewport check");

  await page.setViewportSize({ width: 440, height: 900 });
  await page.goto(levelUrl(1, "en"));
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const buttonLabelDisplay = await page.getByTestId("open-level-select").locator("span").evaluate((node) => window.getComputedStyle(node).display);
  expect(buttonLabelDisplay).toBe("none");
  await expect(page.getByText("Pyi-thon", { exact: true })).toBeVisible();

  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});

test("local feedback notice appears once per session", async ({ page }) => {
  await page.goto(levelUrl(1, "en"));
  await expect(page.getByTestId("offline-badge")).toBeVisible();

  await page.locator("textarea").fill('print("Hello, World!")');
  await page.getByRole("button", { name: /Run Code/ }).click();

  const toast = page.getByTestId("status-toast");
  await expect(toast).toBeVisible();
  await expect(toast).toHaveText("Running with local feedback - add an API key in Settings for expanded feedback");
  await expect(toast).toBeHidden({ timeout: 5000 });

  await page.getByRole("button", { name: /Run Code/ }).click();
  await expect(toast).toBeHidden({ timeout: 1000 });
});

test("invalid online API keys fall back to local feedback without blocking a correct answer", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("pyithon-offline", "false");
    window.localStorage.setItem("pyithon-provider", "openai");
    window.localStorage.setItem("pyithon-api-key-openai", "bad-key");
  });

  await page.route("https://api.openai.com/v1/chat/completions", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "invalid api key" } }),
    });
  });

  await page.goto(levelUrl(1, "en"));
  await page.locator("textarea").fill('print("Hello, World!")');
  await page.getByRole("button", { name: /Run Code/ }).click();

  await expect(page.getByText("Correct!", { exact: true })).toBeVisible();
  await expect(page.getByTestId("status-toast")).toHaveText("Your API key is invalid or expired. Go to Settings to enter a new key, or switch to Offline mode.");
  await expect(page.getByTestId("feedback-source-message")).toHaveText("API key issue - using built-in feedback.");
});

test("Korean invalid online API keys fall back to local feedback without blocking a correct answer", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("pyithon-offline", "false");
    window.localStorage.setItem("pyithon-provider", "openai");
    window.localStorage.setItem("pyithon-api-key-openai", "bad-key");
  });

  await page.route("https://api.openai.com/v1/chat/completions", async (route) => {
    await route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "invalid api key" } }),
    });
  });

  await page.goto(levelUrl(1, "ko"));
  await page.locator("textarea").fill('print("Hello, World!")');
  await page.getByRole("button", { name: "코드 실행" }).click();

  await expect(page.getByText("정답!", { exact: true })).toBeVisible();
  await expect(page.getByTestId("status-toast")).toHaveText("API 키가 잘못되었거나 만료되었습니다. 설정에서 새 키를 입력하거나 오프라인 모드로 전환하세요.");
  await expect(page.getByTestId("feedback-source-message")).toHaveText("API 키 문제 - 기본 피드백 사용 중");
});

test("switching languages clears stale output feedback so panels stay consistent", async ({ page }) => {
  await page.goto(levelUrl(1, "en"));
  await page.locator("textarea").fill('print("Hello, World!"');
  await page.getByRole("button", { name: /Run Code/ }).click();
  await expect(page.getByText("Not quite", { exact: true })).toBeVisible();

  await page.getByTestId("open-settings").click();
    await page.getByTestId("lang-ko").click({ force: true });
  await page.getByTestId("close-settings").click();

  await expect(page.getByText("코드를 실행하면 결과가 여기에 표시됩니다")).toBeVisible();
});

test("Korean syntax errors use localized fallback wording", async ({ page }) => {
  await page.goto(levelUrl(1, "ko"));
  await page.locator("textarea").fill('print("Hello, World!"');
  await page.getByRole("button", { name: "코드 실행" }).click();

  await expect(page.getByText(/Python 오류: 문법 오류:/)).toBeVisible();
  await expect(page.getByText(/닫히지 않았습니다/)).toBeVisible();
});

test("Korean unterminated string literal errors stay fully localized", async ({ page }) => {
  await page.goto(levelUrl(1, "ko"));
  await page.locator("textarea").fill('print("Hello, World!)');
  await page.getByRole("button", { name: "코드 실행" }).click();

  await expect(page.getByText("아쉬워요", { exact: true })).toBeVisible();
  await expect(page.getByText(/Python 오류: 문법 오류: 닫히지 않은 문자열입니다/)).toBeVisible();
  await expect(page.getByText(/번째 줄에서 감지됨/)).toBeVisible();
  await expect(page.getByText(/unterminated string literal/)).toBeHidden();
});
