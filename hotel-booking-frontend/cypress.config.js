import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      
    },
    // Mengizinkan Cypress mendeteksi file tes berakhiran .cy.js atau .cy.ts
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
});