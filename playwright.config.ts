import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load .env before defineConfig runs, so process.env is populated when the
// config object below is evaluated. Order matters here.
dotenv.config();

// Fail loudly at config time rather than getting a confusing error 30s into a run.
function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}. Copy .env.example to .env.`);
  return value;
}

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:8080';
const IS_CI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  // Per-test timeout. OrangeHRM on a cold container is slow; 30s default is tight.
  timeout: 45_000,

  expect: {
    // Timeout for a single expect() auto-retry loop. Separate from the test timeout.
    timeout: 10_000,
  },

  // Refuse to run if someone committed test.only. CI-only so local debugging stays easy.
  forbidOnly: IS_CI,

  // Retries hide flake. Zero locally so you SEE flake; 1 in CI so infra blips
  // don't block a PR. Phase F revisits this deliberately.
  retries: IS_CI ? 1 : 0,

  // Undefined => Playwright picks based on CPU cores. Pinned to 1 in CI until
  // Phase D gives us data isolation - parallel tests sharing one OrangeHRM DB collide.
  workers: IS_CI ? 1 : undefined,

  reporter: [
    ['list'], // readable terminal output
    ['html', { open: 'never' }], // npm run report to view
  ],

  use: {
    baseURL: BASE_URL, // lets specs do page.goto('/auth/login')
    trace: 'on-first-retry', // full trace when something fails; cheap
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000, // per click/fill, not per test
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true, // local container has no valid cert
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Firefox / WebKit / mobile viewports land in Phase C, once page objects exist.
    // Adding them now just multiplies the noise from a single login test.
  ],

  outputDir: './test-results',
});

// Exported so tests/fixtures can read credentials from one place.
export const credentials = {
  username: required('ORANGEHRM_ADMIN_USER'),
  password: required('ORANGEHRM_ADMIN_PASSWORD'),
};
