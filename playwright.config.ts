import { defineConfig, devices } from '@playwright/test';
import { BASE_URL } from '@utils/env';
import { ADMIN_STORAGE_STATE } from '@utils/paths';

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

  // Locally capped at 2: with 4 browser projects, the CPU-based default ran so many browsers at
  // once against one OrangeHRM container that actions froze mid-fill (environment, not test bugs).
  // Pinned to 1 in CI until Phase D gives us data isolation - parallel tests sharing one DB collide.
  workers: IS_CI ? 1 : 2,

  reporter: [
    ['list'], // readable terminal output
    ['html', { open: 'never' }], // npm run report to view
  ],

  use: {
    baseURL: BASE_URL, // lets specs do page.goto('/auth/login')
    trace: IS_CI ? 'on-first-retry' : 'retain-on-failure', // local: trace on any failure. CI: only on retry.
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000, // per click/fill, not per test
    navigationTimeout: 30_000,
    ignoreHTTPSErrors: true, // local container has no valid cert
  },

  projects: [
    // Runs first. Logs in through the UI and writes the session to ADMIN_STORAGE_STATE.
    // No storageState of its own - it must start logged OUT, that's the whole job.
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: ADMIN_STORAGE_STATE, // every test starts already logged in
      },
      dependencies: ['setup'], // don't start until 'setup' has finished
      testIgnore: /.*\.setup\.ts/, // setup already ran it; don't run it again here
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: ADMIN_STORAGE_STATE, // every test starts already logged in
      },
      dependencies: ['setup'], // don't start until 'setup' has finished
      testIgnore: /.*\.setup\.ts/, // setup already ran it; don't run it again here
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: ADMIN_STORAGE_STATE, // every test starts already logged in
      },
      dependencies: ['setup'], // don't start until 'setup' has finished
      testIgnore: /.*\.setup\.ts/, // setup already ran it; don't run it again here
    },
    {
      name: 'mobile',
      grep: /@mobile/, //mobile runs only tests tagged @mobile (see README)
      use: {
        ...devices['Pixel 7'],
        storageState: ADMIN_STORAGE_STATE, // every test starts already logged in
      },
      dependencies: ['setup'], // don't start until 'setup' has finished
      testIgnore: /.*\.setup\.ts/, // setup already ran it; don't run it again here
    },
  ],

  outputDir: './test-results',
});
