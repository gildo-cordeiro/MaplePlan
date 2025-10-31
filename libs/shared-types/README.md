# @maple-plan/shared-types

Shared schemas and types used across the monorepo (backend `apps/api` and frontend `apps/web`).

Purpose
- Centralize request/response contracts (DTOs) and runtime validation so the frontend and backend share the same source of truth.
- Export only pure schemas and types (no Node-only logic or secrets).

What this lib contains
- Zod schemas (runtime validation and parsing)
- Inferred TypeScript types (via `z.infer<>`)
- Small pure helpers/mappers (if needed)

Quick import

```ts
import { createUserSchema, type CreateUserDto } from '@maple-plan/shared-types';
```

Usage examples

Server (NestJS controller)

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { createUserSchema } from '@maple-plan/shared-types';

// validate manually (or use the global Zod interceptor provided in the repo)
const parsed = createUserSchema.safeParse(body);
if (!parsed.success) throw new BadRequestException(parsed.error);
const dto: CreateUserDto = parsed.data;
```

Client (before sending request)

```ts
import { createUserSchema } from '@maple-plan/shared-types';

const result = createUserSchema.safeParse(formValues);
if (!result.success) {
  // show validation errors in the UI
}
```

Types vs classes
- We recommend using Zod schemas + inferred types for shared DTOs because they work at runtime (validation) and compile-time (types) and run both in browser and Node.
- If you need `class-validator`/`class-transformer` (Nest's default), keep those classes inside the backend and map between Zod types and classes at the controller boundary.

Build and development
- Build this lib (generates `.d.ts` files) so other projects can consume it:

```powershell
npx nx run shared-types:build
```

Notes
- Use `import type { ... }` on the frontend when only the type is needed to avoid pulling runtime code.
- Keep this lib purely portable: avoid Node-only APIs, filesystem, DB clients, or environment secrets.

Exports (examples)
- `createUserSchema` — Zod schema for creating users
- `CreateUserDto` — TypeScript type inferred from the schema

If you'd like, I can also add a small README section that documents each exported symbol in more detail (schemas, helper functions, example shapes). Tell me what level of detail you prefer.
