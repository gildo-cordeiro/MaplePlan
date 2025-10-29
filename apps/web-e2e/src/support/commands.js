// ***********************************************
// Custom Cypress commands (JavaScript)
// ***********************************************

// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  // simple stub for e2e examples
  // replace with real auth if needed
  cy.log('Custom command example: Login', email, password);
});
