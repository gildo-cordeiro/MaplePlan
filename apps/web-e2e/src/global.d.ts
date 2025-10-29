/// <reference types="cypress" />
// Global declarations for web-e2e to augment Cypress Chainable with custom commands
declare namespace Cypress {
  interface Chainable<Subject = any> {
    login(email?: string, password?: string): Chainable<any>;
  }
}
