/// <reference types="cypress" />

describe('Frontend Staging E2E Testing', () => {

  it('1. Harus berhasil memuat halaman utama MernHolidays', () => {
    cy.visit('/');
    cy.contains('MernHolidays').should('be.visible');
    // Hero terpisah 2 elemen: "Find Your Perfect" (<h1>) + "Dream Stay" (<span>)
    cy.contains('Find Your Perfect').should('be.visible');
    cy.contains('Dream Stay').should('be.visible');
  });

  it('2. Harus bisa membuka halaman Login saat tombol Log In diklik', () => {
    cy.visit('/');
    cy.contains('Log In').click();
    cy.url().should('include', '/sign-in');
    // Teks asli halaman sign-in:
    cy.contains('Welcome Back').should('be.visible');
    cy.contains('Create one here').should('be.visible'); // link ke /register
  });

});