/// <reference types="cypress" />

describe('Frontend Staging E2E Testing', () => {
  
  // Tes 1: Memastikan halaman utama bisa dibuka
  it('1. Harus berhasil memuat halaman utama MernHolidays', () => {
    cy.visit('/');
    cy.contains('MernHolidays').should('be.visible');
    cy.contains('Find Your Perfect Dream Stay').should('be.visible');
  });

  // Tes 2: Mencoba klik tombol Log In
  it('2. Harus bisa membuka halaman Login saat tombol Log In diklik', () => {
    cy.visit('/');
    
    // Robot Cypress akan mencari tombol bertuliskan "Log In" lalu mengkliknya
    cy.contains('Log In').click();

    // Memastikan setelah diklik, URL-nya berubah mengandung kata "/sign-in" atau "/login"
    cy.url().should('include', '/sign-in'); 
    
    // Memastikan form login-nya muncul di layar
    cy.contains('Create your account').should('be.visible'); 
  });

});