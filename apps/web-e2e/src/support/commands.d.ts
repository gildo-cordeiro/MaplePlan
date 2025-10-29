// Declaration for custom Cypress commands implemented in ../support/commands.js

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Log in using the test helper command.
     */
    login(email?: string, password?: string): Chainable<any>;
  }
}
