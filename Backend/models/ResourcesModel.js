import { z } from 'zod';

export const ResourceSchema = z.object({
    id: z.number().int().positive().optional(),
    title: z.string().min(1).max(400),
    description: z.string().min(1),
    url: z.string().url().optional().nullable(),
    category: z.string().max(255).optional().nullable(),
    user_id: z.number().int().positive().optional(),
    accepted: z.boolean().default(false),
    created_at: z.date().optional()
});

export const ResourceTable = 'resources';
