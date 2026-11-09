import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PW_PORT) || 4173;
const baseURL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./test/e2e",
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    launchOptions: { args: ["--mute-audio"] },
  },
  webServer: {
    command: `npm run build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1100 },
      },
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["Pixel 7"],
      },
    },
  ],
});
