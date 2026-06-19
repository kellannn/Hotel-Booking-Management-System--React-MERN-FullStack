/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Invalid time value') || err.message.includes('RangeError')) return false;
  return true;
});

const EMAIL = 'test@user.com';
const PASSWORD = '12345678';

describe('Frontend Staging E2E Testing - Kelompok 16', () => {
  beforeEach(() => cy.viewport(1280, 720));

  // ---- TEST 1: Alur UI user sampai halaman pembayaran ----
  it('Alur UI: login -> cari -> detail -> Book Now -> halaman pembayaran tampil', () => {
    cy.visit('/');
    cy.contains('Log In').click();
    cy.get('#email').type(EMAIL);
    cy.get('#password').type(PASSWORD);
    cy.get('button[type="submit"]').click();
    cy.contains('My Bookings', { timeout: 10000 }).should('be.visible');

    cy.contains('MernHolidays').click(); // navigasi client-side (jangan reload)
    cy.url().should('not.include', '/sign-in');
    cy.get('input[placeholder*="going"]').type('Surabaya');

    const today = new Date().toISOString().split('T')[0];
    const lusa = new Date(); lusa.setDate(lusa.getDate() + 2);
    cy.get('input[type="date"]').eq(0).type(today);
    cy.get('input[type="date"]').eq(1).type(lusa.toISOString().split('T')[0]);
    cy.contains('button', 'Search').click();

    cy.contains('a', 'View Details').first().click();
    cy.url().should('include', '/detail');
    cy.scrollTo('bottom', { duration: 1000 });
    cy.contains('Book Now', { timeout: 10000 }).click();
    cy.url().should('include', '/booking');

    cy.contains('2 nights').should('be.visible');
    cy.get('input[type="tel"]', { timeout: 20000 }).should('be.visible').type('081234567890');
    cy.get('textarea[placeholder*="special requests"]').type('Minta kamar lantai atas.');

    // Stripe = iframe pihak ketiga (tak bisa diakses skrip). Cukup pastikan ter-render.
    cy.contains('Price Summary').should('be.visible');
    cy.contains('Total Cost').should('be.visible');
    cy.get('#payment-element iframe', { timeout: 20000 }).should('exist');
  });

  // ---- TEST 2: Booking SUKSES end-to-end (Stripe test mode, level API) ----
  it('Booking berhasil dibuat (Stripe test mode) dan muncul di My Bookings', () => {
    const api = Cypress.env('apiUrl');
    const checkIn = new Date().toISOString();
    const out = new Date(); out.setDate(out.getDate() + 2);
    const checkOut = out.toISOString();

    // 1. Login via API -> token Bearer
    cy.request('POST', `${api}/api/auth/login`, { email: EMAIL, password: PASSWORD })
      .its('body.token').then((token) => {
        const headers = { Authorization: `Bearer ${token}` };

        // 2. Ambil hotel Surabaya
        cy.request(`${api}/api/hotels/search?destination=Surabaya`)
          .its('body.data').then((hotels) => {
            expect(hotels.length, 'ada hotel Surabaya').to.be.greaterThan(0);
            const hotelId = hotels[0]._id;

            // 3. Buat payment intent
            cy.request({
              method: 'POST',
              url: `${api}/api/hotels/${hotelId}/bookings/payment-intent`,
              headers,
              body: { numberOfNights: 2, checkIn, checkOut },
            }).its('body').then((pi) => {
              // 4. Konfirmasi pembayaran via Stripe TEST MODE (Node task)
              cy.task('confirmStripePayment', pi.paymentIntentId).should('eq', 'succeeded');

              // 5. Buat booking (backend verifikasi PI succeeded -> lolos)
              cy.request({
                method: 'POST',
                url: `${api}/api/hotels/${hotelId}/bookings`,
                headers,
                body: {
                  paymentIntentId: pi.paymentIntentId,
                  totalCost: pi.totalCost,
                  firstName: 'Test', lastName: 'User', email: EMAIL,
                  adultCount: 1, childCount: 0, checkIn, checkOut,
                },
              }).its('status').should('eq', 200); // <-- BOOKING BERHASIL

              // 6. Verifikasi muncul di My Bookings
              cy.request({ url: `${api}/api/my-bookings`, headers })
                .its('status').should('eq', 200);
            });
          });
      });
  });
});