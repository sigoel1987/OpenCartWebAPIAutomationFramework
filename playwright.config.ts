import { defineConfig, devices } from '@playwright/test';
import reportingLabs from './reporting-labs.config';
import dotenv from 'dotenv';

/**
 * npm install dotenv --is an npm package-help me to provide env variables
 * ENV=qa npx playwright test --default env for qa - qa (maven selenium: mvn clean install -Denv="qa")
 * running tests in powershell------ $env:ENV="stage"; npx playwright test
 * running in git bash-------------- ENV=stage npx playwright test
 */

const ENV = process.env.ENV || "qa"; //help me to capture env variables
console.log('Running tests on Environment: ', ENV);
dotenv.config({ path: `config/.env.${ENV}` });

//what will be the default environment - qa
// if someone has not given any env while running -- npx playwright test then test will run on qa env defined default at line 7
//command to run tests on another environment (except default) : ENV=qa npx playwright test


export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list'],
    ['html',{outputFolder:"reports/html-report",open:"always"}],
    // ["allure-playwright", {
    //   outputFolder: "allure-results",
    //   suiteTitle: true,
    // }],
    // ['reporting-labs', reportingLabs]
  ],

  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    trace: 'on-first-retry',
    screenshot:'off',
    video:'off'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],


});
