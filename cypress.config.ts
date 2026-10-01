import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.demoblaze.com',
    // The site's API lives on a different host, so baseUrl cannot be used for API calls
    env: { apiUrl: 'https://api.demoblaze.com' },
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    // The live site is occasionally slow or flaky; retry only in headless/CI runs
    retries: { runMode: 2, openMode: 0 },
  },
})
