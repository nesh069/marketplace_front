import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60000,
  retries: 0,
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "npm run dev",
      port: 5173,
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command:
        'cd ../marketplace_back && .venv/bin/python manage.py runserver 0.0.0.0:8000',
      port: 8000,
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});
