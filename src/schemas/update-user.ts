import { z } from 'zod';

export const updateUserSchema = z.object({
    name: z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .optional(),
    bio: z.string().optional(),
    link: z.string().url('URL must be valid').optional(),
});
