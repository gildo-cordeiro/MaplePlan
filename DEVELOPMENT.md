Development commands and notes

Use these common commands while developing locally:

```sh
# Start the web dev server
npx nx serve @maple-plan/web

# Start the api dev server
npx nx serve @maple-plan/api

# Run a project's unit tests
npx nx test @maple-plan/api
npx nx test @maple-plan/web

# Run API e2e (Jest)
npx nx run @maple-plan/api-e2e:e2e

# Run Web e2e (Cypress, headless CI mode)
npx nx run @maple-plan/web-e2e:e2e --configuration=ci
```

Notes:

- I standardized the Nx targets for `web` to use the `@nx/next` executors and added a dedicated Cypress executor for `web-e2e`.
- I added `apps/api/dist/` to `.gitignore` to avoid committing generated artifacts.
- Unit tests for `api` and `web` passed in this environment (I used `--forceExit` for the web jest run to work around a lingering async handle).
- API e2e (Jest) passed. Web e2e (Cypress) currently fails inside the Cypress TypeScript compilation step on this machine due to a ts-node/TS config mismatch (details below).

E2E blocker (summary):

- The workspace `tsconfig.base.json` uses `customConditions` and the Nx tooling injects TS_NODE_COMPILER_OPTIONS that are not compatible with the version of `ts-node` bundled with the Cypress binary. This causes Cypress's ts-node to fail when compiling TypeScript specs/config.

Suggested remedies:

- Remove `customConditions` from `tsconfig.base.json` if you don't need it.
- Configure the Cypress executor to use a JS config and/or adjust the environment so `TS_NODE_COMPILER_OPTIONS` includes `moduleResolution: 'node16'` (I tried adding a CJS config and a TS_NODE override, but the Cypress binary still used an incompatible ts-node environment).
- As a temporary workaround, run web e2e tests manually (outside Nx) after starting the dev server:

```sh
# in one terminal
npx nx serve @maple-plan/web

# in another terminal
npx cypress run --config-file apps/web-e2e/cypress.config.cjs --spec "apps/web-e2e/src/e2e/**"
```
