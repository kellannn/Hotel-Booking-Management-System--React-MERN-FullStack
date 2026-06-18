import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false, // <-- ini yang hilang; proyek tidak punya cypress/support/e2e.js
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      return config;
    },
  },
});