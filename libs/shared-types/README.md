# @maple-plan/shared-types

Library with shared types and Zod schemas used across backend (`apps/api`) and frontend (`apps/web`).

Goals
- Keep request/response contracts (DTOs) in a single place.
- Reuse runtime validation (Zod) and TypeScript types on both client and server.
- Avoid leaking server-only implementations to the client (only schemas/types here).

How to import

From backend or frontend (after TypeScript path mapping):

```ts
import { createUserSchema, type CreateUserDto } from '@maple-plan/shared-types';
```

Validation (server)

In a NestJS controller you can use Zod directly (recommended when sharing schemas):

```ts
import { createUserSchema } from '@maple-plan/shared-types';
import { BadRequestException } from '@nestjs/common';

const parsed = createUserSchema.safeParse(req.body);
if (!parsed.success) throw new BadRequestException(parsed.error);
const dto = parsed.data; // typed as CreateUserDto
```

Validation (client)

You can perform client-side validation before sending the request:

```ts
import { createUserSchema } from '@maple-plan/shared-types';

const result = createUserSchema.safeParse(formValues);
if (!result.success) {
  // show validation errors
}
```

Notes and best practices
- Use `import type { ... }` in frontend code when possible to avoid importing runtime code.
- Keep only schemas and types here. Any server-only logic (Prisma clients, secrets, adapters) must remain in `apps/api` or `libs/shared-server`.
- If you need to share transform/mappers, keep them as pure functions and ensure they do not import Node-only APIs.

Example exported items

- `createUserSchema` (Zod schema) — runtime validation and parsing
- `CreateUserDto` (inferred type) — TypeScript type for request bodies
