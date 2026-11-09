import { test, expect } from "@playwright/test";

const TOTAL_LEVELS = 30;
const RUN_TIMEOUT = 60_000;
const TOPIC_1 = ['print("Hello, World!")', 'print("Python is fun")', 'print("Ready?")\nprint("Go!")', 'print("Hello")'];

function levelUrl(levelId, lang = "en", completed = [], rep = null) {
  const done = completed.length ? `&qaCompleted=${completed.join(",")}` : "";
  return `/?qa=1&qaSkipWelcome=1&qaLevel=${levelId}&qaLang=${lang}${done}${rep ? `&qaRep=${rep}` : ""}`;
}

const allBefore = (levelId) => Array.from({ length: levelId - 1 }, (_, index) => index + 1);

async function startRep(page, lang = "en") {
  await page.getByRole("button", { name: lang === "ko" ? "시작" : "Start", exact: true }).click();
  await expect(page.getByTestId("see-card")).toBeHidden();
}

async function setCode(page, code) {
  await page.locator(".cm-content").click();
  await page.keyboard.press("ControlOrMeta+a");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(code);
}

async function editorLines(page) {
  return page.locator(".cm-line").evaluateAll((lines) => lines.map((line) => line.textContent));
}

async function expectNoHorizontalScroll(page) {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
}

test("topic 1 full run ends in set done and unlocks topic 2", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto(levelUrl(1));
  await expect(page.getByTestId("set-chip")).toHaveText("1 · print()");
  await startRep(page);

  for (let rep = 0; rep < TOPIC_1.length; rep += 1) {
    await expect(page.getByTestId("rep-count")).toHaveText(`${rep + 1}/4`);
    await setCode(page, TOPIC_1[rep]);
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
    await expect(page.getByTestId("win-word")).toHaveText("CLEAN");
    await expect(page.getByTestId("win-xp")).toHaveText("+30");
    if (rep >= 1) await expect(page.getByTestId("win-combo")).toContainText(`${rep + 1} clean in a row`);
    if (rep === 0) {
      await page.getByTestId("win-next").click();
    } else {
      await page.waitForTimeout(500);
      await page.keyboard.press("Enter");
    }
    await expect(page.getByTestId("win-overlay")).toBeHidden();
  }

  await expect(page.getByTestId("set-done")).toBeVisible();
  await expect(page.getByTestId("set-bonus")).toHaveText("+50");
  await expect(page.getByTestId("unlocked")).toContainText("Variables");
  await expect(page.getByTestId("xp")).toContainText("170");

  await page.getByRole("button", { name: /Next topic/ }).click();
  await expect(page.getByTestId("set-chip")).toHaveText("2 · Variables");
  await startRep(page);
  await page.getByTestId("open-level-select").click();
  await expect(page.getByTestId("topic-1-count")).toHaveText("4/4");
  await expect(page.getByTestId("topic-2")).toHaveAttribute("data-locked", "false");
  await expect(page.getByTestId("topic-3")).toHaveAttribute("data-locked", "true");
});

test("a miss shows output rows and one message", async ({ page }) => {
  await page.goto(levelUrl(1));
  await startRep(page);

  await page.getByTestId("run-button").click();
  const rows = page.getByTestId("output-row");
  await expect(rows.first()).toBeVisible({ timeout: RUN_TIMEOUT });
  await expect(rows.first()).toHaveAttribute("data-ok", "false");
  await expect(rows.first()).toContainText("Hi!");
  await expect(page.getByTestId("feedback-message")).toHaveCount(1);
  await expect(page.getByTestId("combo")).toBeHidden();

  await setCode(page, 'x = 1\nprint("Hello, World!"');
  await page.getByTestId("run-button").click();
  await expect(page.locator(".cm-errline")).toHaveCount(1, { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("feedback-message")).toHaveCount(1);
  await expect(page.getByTestId("output-row").last()).toHaveAttribute("data-ok", "false");
});

const FIX_REPS = [
  { name: "topic 1", level: 1, message: "Line 1: Hello is text, so it needs quotes.", errLine: "print(Hello)" },
  { name: "topic 3", level: 3, message: "Line 3: + can't join text and a number. Use str().", errLine: 'print(name + " is " + age)' },
  { name: "topic 4", level: 4, message: 'Line 1: expected "Hello, Sam", got "Hello, name".', errLine: null },
];

for (const { name, level, message, errLine } of FIX_REPS) {
  test(`${name} rep 4 starter shows the plain message`, async ({ page }) => {
    await page.goto(levelUrl(level, "en", allBefore(level), 4));
    await expect(page.getByTestId("rep-count")).toHaveText("4/4");
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("feedback-message")).toHaveText(message, { timeout: RUN_TIMEOUT });
    if (errLine) {
      await expect(page.locator(".cm-errline")).toHaveCount(1);
      await expect(page.locator(".cm-errline")).toHaveText(errLine);
    } else {
      await expect(page.locator(".cm-errline")).toHaveCount(0);
    }
  });
}

test("korean message shows for the topic 1 rep 4 starter", async ({ page }) => {
  await page.goto(levelUrl(1, "ko", [], 4));
  await expect(page.getByTestId("rep-count")).toHaveText("4/4");
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toHaveText("1번째 줄: 글자 Hello에는 따옴표가 필요해요.", { timeout: RUN_TIMEOUT });
  await expect(page.locator(".cm-errline")).toHaveCount(1);
});

test("a correct answer passes the topic 1 rep 4 fix", async ({ page }) => {
  await page.goto(levelUrl(1, "en", [], 4));
  await expect(page.getByTestId("rep-count")).toHaveText("4/4");
  await setCode(page, TOPIC_1[3]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
});

test("names from an earlier run do not leak into the next", async ({ page }) => {
  await page.goto(levelUrl(1, "en", [], 4));
  await setCode(page, 'Hello = "Hello"');
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("output-row").first()).toBeVisible({ timeout: RUN_TIMEOUT });

  await setCode(page, "print(Hello)");
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toHaveText("Line 1: Hello is text, so it needs quotes.", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-overlay")).toBeHidden();
});

test("a runaway loop shows the loop tip without flooding the output", async ({ page }) => {
  await page.goto(levelUrl(8, "en", [1, 2, 3, 4, 5, 6, 7]));
  await startRep(page);
  await setCode(page, "i = 0\ncount = 0\nwhile i < 6:\n    count += 1\n    print(i)");
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toContainText("Your loop never stops", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("output-row")).toHaveCount(21);
  await expect(page.getByTestId("output-more")).toContainText("more lines");
});

test("twenty lines then an error show every row and no more-lines note", async ({ page }) => {
  await page.goto(levelUrl(8, "en", [1, 2, 3, 4, 5, 6, 7]));
  await startRep(page);
  await setCode(page, "for n in range(20):\n    print(n)\nprint(total)");
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("feedback-message")).toBeVisible({ timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("output-row")).toHaveCount(21);
  await expect(page.getByTestId("output-more")).toHaveCount(0);
});

test("showing the answer makes the rep DONE for 5 XP", async ({ page }) => {
  await page.goto(levelUrl(1));
  await startRep(page);

  const hint = page.getByTestId("hint-button");
  await hint.click();
  await expect(hint).toHaveText("Example");
  await hint.click();
  await hint.click();
  await expect(hint).toBeDisabled();
  await expect(page.getByTestId("hint-panel")).toContainText('print("Hello, World!")');

  await setCode(page, TOPIC_1[0]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-word")).toHaveText("DONE", { timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-xp")).toHaveText("+5");
});

test("enter on a focused See code button stays on the rep", async ({ page }) => {
  await page.goto(levelUrl(1));
  await startRep(page);
  await setCode(page, TOPIC_1[0]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });

  await page.waitForTimeout(500);
  await page.getByRole("button", { name: "See code" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("win-overlay")).toBeHidden();
  await expect(page.getByTestId("rep-count")).toHaveText("1/4");
  await expect(page.getByTestId("next-rep")).toBeVisible();
});

test("the level list round trip keeps the current attempt", async ({ page }) => {
  await page.goto(levelUrl(1));
  await startRep(page);
  await page.getByTestId("hint-button").click();
  await setCode(page, TOPIC_1[0]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
  await page.getByRole("button", { name: "See code" }).click();

  await page.getByTestId("open-level-select").click();
  await page.getByRole("button", { name: "Back to current level" }).click();
  expect(await editorLines(page)).toEqual([TOPIC_1[0]]);
  await expect(page.getByTestId("hint-panel")).toBeVisible();
  await expect(page.getByTestId("next-rep")).toBeVisible();
  await expect(page.getByTestId("win-overlay")).toBeHidden();
});

test("a run left for another topic does not pull progress back", async ({ page }) => {
  let release;
  const held = new Promise((resolve) => { release = resolve; });
  await page.route("**/pyodide.asm.wasm", async (route) => { await held; await route.continue(); });
  await page.goto(levelUrl(1, "en", [1]));
  await startRep(page);
  await setCode(page, TOPIC_1[0]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("run-button")).toBeDisabled();

  await page.getByTestId("open-level-select").click();
  await page.getByTestId("topic-2").click();
  await expect(page.getByTestId("set-chip")).toHaveText("2 · Variables");
  release();
  await startRep(page);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("output-row").first()).toBeVisible({ timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("set-chip")).toHaveText("2 · Variables");
  await expect(page.getByTestId("xp")).toHaveText(/(^|\D)0$/);
});

test("enter after a colon indents 4 spaces and backspace removes one unit", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only editor check");
  await page.goto(levelUrl(5));
  await startRep(page);
  await setCode(page, "");

  const content = page.locator(".cm-content");
  await expect(content).toHaveAttribute("autocapitalize", "off");
  await expect(content).toHaveAttribute("autocorrect", "off");
  await expect(content).toHaveAttribute("spellcheck", "false");

  await page.keyboard.type("if x > 1:");
  await page.keyboard.press("Enter");
  await expect.poll(() => editorLines(page)).toEqual(["if x > 1:", "    "]);
  await page.keyboard.type("y = 2");
  await page.keyboard.press("Enter");
  await expect.poll(() => editorLines(page)).toEqual(["if x > 1:", "    y = 2", "    "]);
  await page.keyboard.press("Backspace");
  await expect.poll(() => editorLines(page)).toEqual(["if x > 1:", "    y = 2", ""]);
});

test("384px phone keeps every topic in one column with Hint and Run reachable", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 384, height: 832 });

  for (let levelId = 1; levelId <= TOTAL_LEVELS; levelId += 1) {
    await page.goto(levelUrl(levelId, "en", allBefore(levelId)));
    await expect(page.getByTestId("see-card")).toBeVisible();
    const card = await page.getByTestId("see-card").boundingBox();
    expect(card.y + card.height).toBeLessThanOrEqual(832);
    await expectNoHorizontalScroll(page);
    await startRep(page);

    for (const id of ["rep-goal", "expected-output", "code-editor", "hint-button", "run-button"]) {
      const box = await page.getByTestId(id).boundingBox();
      expect(box.y, `${id} on topic ${levelId}`).toBeLessThan(832);
    }
    await expectNoHorizontalScroll(page);
  }

  await page.getByTestId("open-level-select").click();
  await expect(page.getByTestId("topic-30")).toBeVisible();
  await expectNoHorizontalScroll(page);
});

test("rep 1 of topics 1-5 shows 40 words or fewer before running", async ({ page }) => {
  for (let levelId = 1; levelId <= 5; levelId += 1) {
    await page.goto(levelUrl(levelId, "en", allBefore(levelId)));
    await startRep(page);
    const words = await page.evaluate(() => document.body.innerText.split(/\s+/).filter(Boolean).length);
    expect(words, `topic ${levelId}`).toBeLessThanOrEqual(40);
  }
});

test("hints step through every topic without raw escapes", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop-only sweep");
  test.setTimeout(120_000);

  for (let levelId = 1; levelId <= TOTAL_LEVELS; levelId += 1) {
    await page.goto(levelUrl(levelId, "en", allBefore(levelId)));
    await startRep(page);
    await page.getByTestId("hint-button").click();
    const text = await page.getByTestId("hint-panel").innerText();
    expect(text.includes("\\n")).toBeFalsy();
  }
});

test("intro shows on first visit only", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /Start Learning/ })).toBeVisible();
  await page.getByRole("button", { name: /Start Learning/ }).click();
  await expect(page.getByTestId("see-card")).toBeVisible();

  await page.reload();
  await expect(page.getByTestId("rep-goal")).toBeVisible();
  await expect(page.getByRole("button", { name: /Start Learning/ })).toBeHidden();
});

test("old saves migrate and keep their unlocks", async ({ page }) => {
  await page.addInitScript(() => {
    if (window.sessionStorage.getItem("seeded")) return;
    window.sessionStorage.setItem("seeded", "1");
    window.localStorage.setItem("pyithon-progress", JSON.stringify({ completedLevels: [1, 2, 3], currentLevel: 3, streak: 1, bestStreak: 2, totalXP: 300, hasStarted: true }));
  });
  await page.goto("/");
  await expect(page.getByTestId("set-chip")).toHaveText("4 · input()");
  await expect(page.getByTestId("xp")).toContainText("300");
  await startRep(page);
  await page.getByTestId("open-level-select").click();
  await expect(page.getByTestId("topic-3-count")).toHaveText("4/4");
  await expect(page.getByTestId("topic-4")).toHaveAttribute("data-locked", "false");
  await expect(page.getByTestId("topic-5")).toHaveAttribute("data-locked", "true");
});

test("initial QA load stays free of console and page errors", async ({ page }) => {
  const consoleErrors = [];
  const pageErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(levelUrl(1));
  await startRep(page);
  await expect(page.getByTestId("rep-goal")).toBeVisible();

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});

test("settings dialog supports keyboard close and theme switch", async ({ page }) => {
  await page.goto(levelUrl(1));
  await startRep(page);

  const settingsButton = page.getByTestId("open-settings");
  await settingsButton.focus();
  await settingsButton.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Settings" });
  await expect(dialog).toBeVisible();
  await expect(page.getByTestId("close-settings")).toBeFocused();
  await page.getByTestId("theme-light").click();
  await expect(page.getByTestId("theme-light")).toHaveAttribute("aria-checked", "true");

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("rep-goal")).toBeVisible();
  expect(await page.evaluate(() => window.localStorage.getItem("pyithon-theme"))).toBe("light");
});

test("a late editor focus never steals focus from settings", async ({ page }) => {
  await page.addInitScript(() => {
    const raf = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (cb) => raf((ts) => setTimeout(() => cb(ts), 200));
  });
  await page.goto(levelUrl(1));
  await startRep(page);
  await page.getByTestId("open-settings").click();
  await page.waitForTimeout(400);
  await expect(page.getByTestId("close-settings")).toBeFocused();
});

test("enter in settings over set done activates the focused button", async ({ page }) => {
  await page.goto(levelUrl(1, "en", [], 4));
  await setCode(page, TOPIC_1[3]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
  await page.getByTestId("win-next").click();
  await expect(page.getByTestId("set-done")).toBeVisible();

  await page.getByTestId("open-settings").click();
  await page.getByTestId("theme-light").focus();
  await page.waitForTimeout(500);
  await page.keyboard.press("Enter");
  await expect(page.getByTestId("theme-light")).toHaveAttribute("aria-checked", "true");
  await expect(page.getByTestId("set-done")).toBeVisible();
});

test("Korean mode localizes labels and content", async ({ page }) => {
  await page.goto(levelUrl(1, "ko"));
  await expect(page.getByTestId("see-card")).toBeVisible();
  await startRep(page, "ko");

  await expect(page.getByTestId("rep-goal")).toHaveText(/Hello, World!/);
  await expect(page.getByTestId("rep-goal")).not.toHaveText(/Change it/);
  await expect(page.getByRole("button", { name: "설정 열기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "사운드 켜기" })).toBeVisible();
  await expect(page.getByRole("button", { name: "설명 다시 보기" })).toBeVisible();
  await expect(page.getByTestId("hint-button")).toHaveText("힌트");
  await expect(page.getByTestId("run-button")).toContainText("실행");
  await expect(page.locator(".cm-content")).toHaveAttribute("aria-label", "에디터");

  await page.getByTestId("open-settings").click();
  await expect(page.getByRole("dialog", { name: "설정" })).toBeVisible();
  await expect(page.getByRole("button", { name: "설정 닫기" })).toBeVisible();
  await page.getByTestId("close-settings").click();

  await page.getByTestId("open-level-select").click();
  await expect(page.getByRole("button", { name: "현재 레벨로 돌아가기" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "모든 레벨" })).toBeVisible();
});

for (const lang of ["en", "ko"]) {
  test(`invalid API keys fall back to local feedback (${lang})`, async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("pyithon-offline", "false");
      window.localStorage.setItem("pyithon-provider", "openai");
      window.localStorage.setItem("pyithon-api-key-openai", "bad-key");
    });
    await page.route("https://api.openai.com/v1/chat/completions", (route) => route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: { message: "invalid api key" } }),
    }));

    await page.goto(levelUrl(1, lang));
    await startRep(page, lang);
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("feedback-source-message")).toHaveText(
      lang === "ko" ? "API 키 문제 - 기본 피드백 사용 중" : "API key issue - using built-in feedback.",
      { timeout: RUN_TIMEOUT },
    );

    await setCode(page, TOPIC_1[0]);
    await page.getByTestId("run-button").click();
    await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
  });
}

const FIXED_NOW = new Date(2026, 4, 10, 12, 0, 0);

function seedProgress(page, days, lang = "en", theme = "dark", extra = {}) {
  return page.addInitScript(({ days: seeded, lang: seededLang, theme: seededTheme, extra: more }) => {
    window.localStorage.setItem("pyithon-progress", JSON.stringify({
      version: 2, current: 0, topics: {}, xp: 40, combo: 0, bestCombo: 0, hasStarted: true, days: seeded, ...more,
    }));
    window.localStorage.setItem("pyithon-lang", seededLang);
    window.localStorage.setItem("pyithon-theme", seededTheme);
  }, { days, lang, theme, extra });
}

test("History rolls over to a new day at local midnight", async ({ page }) => {
  await page.clock.install({ time: new Date(2026, 4, 10, 23, 58, 0) });
  await seedProgress(page, { "2026-05-10": { reps: 3, clean: 2 } });
  await page.goto("/");
  await startRep(page);
  await page.getByTestId("streak").click();
  await expect(page.getByTestId("today-line")).toHaveText("Today: 3 reps, 2 clean");
  await page.clock.runFor("03:00");
  await expect(page.getByTestId("today-line")).toHaveText("Nothing yet today. One rep starts the streak clock.");
  await expect(page.getByTestId("streak-now")).toHaveText("1");
});

test("first pass of a day starts the streak and fills today in History", async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW);
  await page.goto(levelUrl(1));
  await startRep(page);
  await expect(page.getByTestId("streak")).toHaveAccessibleName("Open history: 0-day streak");
  await setCode(page, TOPIC_1[0]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-day-streak")).toHaveText("Day 1 streak");
  await expect(page.getByTestId("streak")).toHaveText("1");
  await expectNoHorizontalScroll(page);

  await page.getByTestId("win-next").click();
  await setCode(page, TOPIC_1[1]);
  await page.getByTestId("run-button").click();
  await expect(page.getByTestId("win-overlay")).toBeVisible({ timeout: RUN_TIMEOUT });
  await expect(page.getByTestId("win-day-streak")).toHaveCount(0);
  await page.getByTestId("win-next").click();

  await page.getByTestId("streak").click();
  await expect(page.getByTestId("streak-now")).toHaveText("1");
  await expect(page.getByTestId("streak-best")).toHaveText("1");
  await expect(page.getByTestId("today-line")).toHaveText("Today: 2 reps, 2 clean");
  const today = page.locator('[data-testid="heat-cell"][data-date="2026-05-10"]');
  await expect(today).toHaveAttribute("data-level", "1");
  await expect(today).toHaveAttribute("aria-label", "May 10: 2 reps, 2 clean");
  await expect(page.getByTestId("heat-cell")).toHaveCount(84);
  await expectNoHorizontalScroll(page);

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page.getByTestId("rep-count")).toHaveText("3/4");
});

for (const theme of ["dark", "light"]) {
  test(`a seeded save shows streak and best (${theme})`, async ({ page }) => {
    await page.clock.setFixedTime(FIXED_NOW);
    await seedProgress(page, {
      "2026-04-01": { reps: 1, clean: 1 }, "2026-04-02": { reps: 2, clean: 0 }, "2026-04-03": { reps: 4, clean: 4 }, "2026-04-04": { reps: 12, clean: 6 },
      "2026-05-08": { reps: 1, clean: 0 }, "2026-05-09": { reps: 3, clean: 3 },
    }, "en", theme);
    await page.goto("/");
    await startRep(page);
    await expect(page.getByTestId("streak")).toHaveText("2");
    await expectNoHorizontalScroll(page);

    await page.getByTestId("streak").click();
    await expect(page.getByTestId("streak-now")).toHaveText("2");
    await expect(page.getByTestId("streak-best")).toHaveText("4");
    await expect(page.getByTestId("today-line")).toHaveText("Nothing yet today. One rep starts the streak clock.");
    const level = (date) => page.locator(`[data-testid="heat-cell"][data-date="${date}"]`);
    await expect(level("2026-04-04")).toHaveAttribute("data-level", "4");
    await expect(level("2026-04-03")).toHaveAttribute("data-level", "2");
    await expect(level("2026-05-09")).toHaveAttribute("data-level", "2");
    await expect(level("2026-05-10")).toHaveAttribute("data-level", "0");
    await expect(level("2026-05-10")).toHaveAttribute("aria-label", "May 10: rest day");
    await expectNoHorizontalScroll(page);
  });
}

test("a missed full day resets the streak but keeps best (ko)", async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW);
  await seedProgress(page, { "2026-05-06": { reps: 1, clean: 0 }, "2026-05-07": { reps: 1, clean: 0 }, "2026-05-08": { reps: 1, clean: 0 } }, "ko");
  await page.goto("/");
  await startRep(page, "ko");
  await expect(page.getByTestId("streak")).toHaveText("0");
  await page.getByTestId("streak").click();
  await expect(page.getByRole("heading", { name: "기록" })).toBeVisible();
  await expect(page.getByTestId("streak-now")).toHaveText("0");
  await expect(page.getByTestId("streak-best")).toHaveText("3");
  await expect(page.getByTestId("today-line")).toHaveText("오늘은 아직 없어요. 한 문제면 연속이 시작돼요.");
});

test("the top bar fits a 384px phone with xp, combo and streak", async ({ page }) => {
  await page.setViewportSize({ width: 384, height: 800 });
  await page.clock.setFixedTime(FIXED_NOW);
  await seedProgress(page, { "2026-05-09": { reps: 3, clean: 3 }, "2026-05-10": { reps: 1, clean: 1 } }, "en", "dark", { xp: 5240, combo: 3 });
  await page.goto("/");
  await startRep(page);
  await expect(page.getByTestId("streak")).toHaveText("2");
  await expect(page.getByTestId("combo")).toBeVisible();
  await expect(page.getByTestId("open-settings")).toBeVisible();
  await expectNoHorizontalScroll(page);
});
