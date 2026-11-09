import { defineConfig } from '@playwright/test';

const demo = process.env.WEB_FLOW_DEMO === '1';
const demoUrl = 'http://127.0.0.1:4176';

export default defineConfig({
  testDir: demo ? './demo' : './checks',
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],
  use: {
    baseURL: demo ? demoUrl : process.env.WEB_FLOW_URL,
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: demo ? {
    command: 'node demo/server.mjs',
    url: demoUrl,
    reuseExistingServer: false,
  } : undefined,
});