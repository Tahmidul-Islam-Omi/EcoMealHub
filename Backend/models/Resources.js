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
        const result = await db.query(`SELECT * FROM ${ResourceTable};`);
        return result.rows;
    }

    static async create(data) {
        const { title, description, url, category, user_id, accepted } = data;
        const result = await db.query(
            `INSERT INTO ${ResourceTable} (title, description, url, category, user_id, accepted) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
            [title, description, url, category, user_id, accepted]
        );
        return result.rows[0];
    }

    static async getByUserId(user_id) {
        const result = await db.query(
            `SELECT * FROM ${ResourceTable} WHERE user_id = $1;`,
            [user_id]
        );
        return result.rows;
    }

    static async acceptResource(id) {
        const result = await db.query(
            `UPDATE ${ResourceTable} SET accepted = true WHERE id = $1 RETURNING *;`,
            [id]
        );
        return result.rows[0];
    }
    
    static async delete(id) {
        const result = await db.query(
            `DELETE FROM ${ResourceTable} WHERE id = $1 RETURNING *;`,
            [id]
        );
        return result.rows[0];
    }

}

export default Resources;