import { defineConfig } from "cypress";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config(); // memuat .env lokal (untuk STRIPE_SECRET_KEY saat run di laptop)

export default defineConfig({
  e2e: {
    supportFile: false,
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    env: {
      // URL backend (samakan dengan VITE_API_BASE_URL frontend). Di CI bisa di-override pakai CYPRESS_apiUrl.
      apiUrl: "https://kelompok16-hotel-backend-bugsabada3dpafb0.indonesiacentral-01.azurewebsites.net",
    },
    setupNodeEvents(on, config) {
      on("task", {
        // Konfirmasi PaymentIntent pakai Stripe TEST MODE (kartu test pm_card_visa) -> status 'succeeded'
        async confirmStripePayment(paymentIntentId) {
          const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
          if (!key) throw new Error("STRIPE_SECRET_KEY belum di-set di environment");
          const stripe = new Stripe(key);
          const pi = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: "pm_card_visa",
            return_url: "https://example.com",
          });
          return pi.status; // diharapkan 'succeeded'
        },
      });
      return config;
    },
  },
});