// Type declarations for custom Cypress commands used in web-e2e
// This declares `cy.login(...)` so TypeScript stops complaining.

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom login command used in E2E tests.
     * @param email optional user email
     * @param password optional password
     */
    login(email?: string, password?: string): Chainable<any>;
  }
}
