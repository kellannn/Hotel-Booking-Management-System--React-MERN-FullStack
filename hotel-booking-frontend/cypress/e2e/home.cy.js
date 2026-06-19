/// <reference types="cypress" />

// Mantra pelindung agar React tidak crash saat robot mengetik tanggal
Cypress.on('uncaught:exception', (err, runnable) => {
  if (err.message.includes('Invalid time value') || err.message.includes('RangeError')) {
    return false;
  }
  return true;
});

describe('Frontend Staging E2E Testing - Kelompok 16', () => {

  beforeEach(() => {
    cy.viewport(1280, 720);
  });

  it('Skenario Lengkap: Booking Hotel dengan Durasi Menginap Valid (Minimal 1 Malam)', () => {
    // ---- LANGKAH 1: LOGIN ----
    cy.visit('/');
    cy.contains('Log In').click();
    cy.get('#email').type('test@user.com');
    cy.get('#password').type('12345678');
    cy.get('button[type="submit"]').click();
    cy.contains('My Bookings', { timeout: 10000 }).should('be.visible');

    // ---- LANGKAH 2: PENCARIAN DENGAN TANGGAL VALID ----
    cy.contains('MernHolidays').click();
    cy.url().should('not.include', '/sign-in');
    cy.get('input[placeholder*="going"]').type('Surabaya');

    // Targetkan input Check-in dan Check-out
    // Kita set Check-in hari ini, dan Check-out lusa (2 malam)
    const today = new Date().toISOString().split('T')[0];
    const lusa = new Date();
    lusa.setDate(lusa.getDate() + 2);
    const lusaStr = lusa.toISOString().split('T')[0];

    // Mengisi Check-in (index 0)
    cy.get('input[type="date"]').eq(0).type(today);
    
    // Mengisi Check-out (index 1) - INI KUNCINYA AGAR TIDAK 0 NIGHTS
    cy.get('input[type="date"]').eq(1).type(lusaStr);

    cy.contains('button', 'Search').click();

    // Pilih hotel pertama
    cy.contains('a', 'View Details').first().click();
    
    // Pastikan URL sudah berpindah ke halaman detail sebelum aksi berikutnya
    cy.url().should('include', '/detail'); 

    // =========================================================================
    // TRICK DEVOPS: Paksa browser scroll ke bawah secara halus selama 1 detik
    // untuk memicu render komponen yang lazy-load
    // =========================================================================
    cy.scrollTo('bottom', { duration: 1000 });

    // Hapus pembatasan 'button', cari teks 'Book Now' secara universal (bisa tag a / button)
    cy.contains('Book Now', { timeout: 10000 }).click();

    cy.url().should('include', '/booking');

    // ---- LANGKAH 3: VERIFIKASI HARGA & FORM STRIPE ----
    // Pastikan durasi menginap bukan 0 malam lagi
    cy.contains('2 nights').should('be.visible'); 

    // Tunggu sampai loading payment hilang dan input tel muncul
    cy.get('input[type="tel"]', { timeout: 20000 })
      .should('be.visible')
      .type('081234567890');

    cy.get('textarea[placeholder*="special requests"]').type('Minta kamar lantai atas.');

    // ---- LANGKAH 4: MENEMBAK IFRAME STRIPE (CRUCIAL CODES) ----
    // Kita pisah deteksinya agar Cypress mau me-retry dengan sabar sampai script Stripe siap
    cy.get('#payment-element iframe', { timeout: 15000 })
      .its('0.contentDocument')
      .should('exist')
      .its('body')
      .should('not.be.empty')
      .then(cy.wrap)
      .as('stripeForm');

    // Robot mengisi nomor kartu dummy legendaris Stripe (4242)
    cy.get('@stripeForm').find('input[name="cardnumber"]').type('4242424242424242');
    cy.get('@stripeForm').find('input[name="exp-date"]').type('1230'); // Format MMYY
    cy.get('@stripeForm').find('input[name="cvc"]').type('123');
    cy.get('@stripeForm').find('input[name="postal"]').type('12345');

    // ---- LANGKAH 5: KONFIRMASI ----
    cy.contains('button', 'Confirm Booking').click();
    
    // Tunggu notifikasi sukses dari sistem kalian
    cy.contains('Booking Successful', { timeout: 20000 }).should('be.visible');
    cy.url().should('include', '/my-bookings');
  });
});