import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    middleName: z.string().nullable().optional(),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    extensionName: z.string().nullable().optional(),
    username: z.string().min(4, { message: 'Username must be at least 4 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    contactNo: z
      .string()
      .max(13)
      .regex(/^[0-9\s]*$/, {
        message: 'Must be a string containing only numbers',
      })
      .nullable()
      .optional(),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    password2: z.string().min(1, { message: 'Password confirmation is required' }),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Passwords do not match',
    path: ['password2'],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
