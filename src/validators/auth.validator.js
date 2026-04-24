import { z } from 'zod';

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1)
  }),
  params: z.object({}).default({}),
  query: z.object({}).default({})
});

export { loginSchema };
