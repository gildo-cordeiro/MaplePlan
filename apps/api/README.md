# MaplePlan — API (backend)

This is the backend NestJS application for the MaplePlan monorepo.

Quick commands

- Start in dev (with nodemon / watch via Nx):
  - npx nx serve api

- Run unit tests:
  - npx nx test api

- Run API e2e (Jest-based):
  - npx nx test api-e2e

- Build for production:
  - npx nx build api

Notes

- Project is located at `apps/api`.
- The project uses NestJS + Webpack for the local build; assets live under `apps/api/src/assets` (there is a .gitkeep).
- Node version: see `.nvmrc` at repository root.
- If you see multiple Jest configs (TS + CJS), prefer the `.cjs` one for CI; the repo standard uses CommonJS configs for CI compatibility.
