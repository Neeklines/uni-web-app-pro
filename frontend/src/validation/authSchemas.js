import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .email('Niepoprawny email'),

    password: z
        .string()
        .min(3, 'Hasło musi mieć co najmniej 3 znaki'),
});

export const registerSchema = loginSchema.extend({
    // later: confirmPassword etc.
});