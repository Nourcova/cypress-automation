const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:"https://app.ku-ai-instructor.azzammourad.org",
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      // implement node event listeners here
    },
  },
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/report',
    charts: true,
    reportPageTitle: 'Khalifa Univercity Automation',
    embeddedScreenshots: true,
    inlineAssets: true,
    video: true,
    saveAllAttempts: false,
   },
});
