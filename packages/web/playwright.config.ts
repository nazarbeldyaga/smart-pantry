import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e', // або './tests', як ви вказали при встановленні
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // Вказуємо адресу нашого запущеного фронтенду
    baseURL: 'http://localhost:3001',

    trace: 'on-first-retry',
  },

  // Налаштування для запуску веб-сервера (опціонально)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
