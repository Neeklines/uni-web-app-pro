import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .email('Niepoprawny email'),

    password: z
        .string()
        .min(6, 'Hasło musi mieć co najmniej 6 znaków'),
});

export const registerSchema = loginSchema.extend({
    // later: confirmPassword etc.
});