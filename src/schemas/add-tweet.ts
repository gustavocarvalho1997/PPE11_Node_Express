import { z } from 'zod';

export const addTweetSchema = z.object({
    body: z.string({ message: 'Body is required' }),
    answer: z.string().optional(),
});
