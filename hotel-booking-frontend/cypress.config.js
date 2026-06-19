import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // 🛡️ Menonaktifkan pelindung CORS agar robot bisa masuk dan mengetik di dalam Iframe Stripe
    chromeWebSecurity: false, 
    
    // 📁 Menonaktifkan file support karena proyek kelompok 16 tidak menggunakan cypress/support/e2e.js
    supportFile: false, 
    
    // 🔍 Mengizinkan Cypress mendeteksi seluruh berkas pengujian di folder e2e
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    
    setupNodeEvents(on, config) {
      return config;
    },
  },
});