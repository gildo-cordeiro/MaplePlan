# MaplePlan — Web (frontend)

This is the Next.js frontend application (app router) for MaplePlan.

Quick commands

- Start dev server:
  - npx nx dev web

- Run unit tests (Jest):
  - npx nx test web

- Build for production:
  - npx nx build web

- Run web e2e tests (Cypress):
  - npx nx run web-e2e:e2e
  - or: npx cypress run --config-file apps/web-e2e/cypress.config.cjs --spec "apps/web-e2e/src/e2e/**"

Notes

- Project is located at `apps/web`.
- Node version: see `.nvmrc` in the repo root (use Node 20+ as recommended).
- The e2e project lives in `apps/web-e2e` (Cypress). We intentionally keep a CommonJS Cypress config (`cypress.config.cjs`) for CI compatibility.
