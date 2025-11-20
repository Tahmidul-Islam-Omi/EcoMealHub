import { z } from 'zod';
import db from '../config/db.js';

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


class Resources {
    static async getAll() {
        const result = await db`SELECT * FROM resources;`;
        console.log(result);
        return result;
    }

    static async create(data) {
        const { title, description, url, category, user_id, accepted } = data;
        const result = await db`
            INSERT INTO resources (title, description, url, category, user_id, accepted) 
            VALUES (${title}, ${description}, ${url}, ${category}, ${user_id}, ${accepted})
            RETURNING *`;
        ;
        return result[0];
    }

    static async getByUserId(user_id) {
        const result = await db`
            SELECT * FROM ${ResourceTable} WHERE user_id = ${user_id};`
        ;
        return result;
    }

    static async acceptResource(id) {
        const result = await db`
            UPDATE ${ResourceTable} 
            SET accepted = true 
            WHERE id = ${id} 
            RETURNING *;
        `;
        return result[0];
    }
    
    static async delete(id) {
        const result = await db`
            DELETE FROM ${ResourceTable} WHERE id = ${id} RETURNING *;`
        
        return result[0];
    }

}

export default Resources;