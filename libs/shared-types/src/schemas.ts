import { z } from 'zod';

export const createUserSchema = z.object({ name: z.string(), email: z.string().email(), password: z.string().min(8) });

export const userSchema = createUserSchema.omit({ password: true }).extend({
  id: z.string(),
  createdAt: z.string(), // ou z.date() se preferir na camada interna
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UserDto = z.infer<typeof userSchema>;
