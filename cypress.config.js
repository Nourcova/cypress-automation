const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl:"https://app.ku-ai-instructor.azzammourad.org",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
