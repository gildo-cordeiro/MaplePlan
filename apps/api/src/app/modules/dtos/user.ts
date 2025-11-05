import { z } from 'zod';

export const createUserSchema = z
  .object({ name: z.string(), email: z.string().email(), password: z.string().min(8) })
  .refine((data) => {
    // enforce password complexity: at least one lowercase, one uppercase, one number and one special char
    const pwd = data.password;
    const complexity = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    return complexity.test(pwd);
  }, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    path: ['password'],
  });

export const userSchema = createUserSchema.omit({ password: true }).extend({
  id: z.string(),
  createdAt: z.string(), // or z.date() if you prefer internal Date
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UserDto = z.infer<typeof userSchema>;
