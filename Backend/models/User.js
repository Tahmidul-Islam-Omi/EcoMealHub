import sql from '../config/db.js';

class User {
    static async create(userData) {
        const { full_name, email, password_hash, user_type, household_size, location } = userData;
        
        const [user] = await sql`
            INSERT INTO users (
                full_name, 
                email, 
                password_hash, 
                user_type, 
                household_size, 
                location
            )
            VALUES (
                ${full_name}, 
                ${email}, 
                ${password_hash}, 
                ${user_type}::user_type_enum, 
                ${household_size}, 
                ${location}
            )
            RETURNING 
                id, 
                full_name, 
                email, 
                user_type, 
                household_size, 
                location, 
                created_at, 
                updated_at
        `;
        
        return user;
    }

    static async findByEmail(email) {
        const [user] = await sql`
            SELECT 
                id, 
                full_name, 
                email, 
                password_hash, 
                user_type, 
                household_size, 
                location, 
                created_at, 
                updated_at
            FROM users
            WHERE email = ${email}
        `;
        
        return user || null;
    }

    static async findById(id) {
        const [user] = await sql`
            SELECT 
                id, 
                full_name, 
                email, 
                password_hash, 
                user_type, 
                household_size, 
                location, 
                created_at, 
                updated_at
            FROM users
            WHERE id = ${id}
        `;
        
        return user || null;
    }

    static async updateById(id, updateData) {
        const fields = [];
        const values = [];
        
        Object.entries(updateData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(key);
                values.push(value);
            }
        });
        
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        
        const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
        
        const [user] = await sql`
            UPDATE users
            SET ${sql(updateData)}, updated_at = NOW()
            WHERE id = ${id}
            RETURNING 
                id, 
                full_name, 
                email, 
                user_type, 
                household_size, 
                location, 
                created_at, 
                updated_at
        `;
        
        return user || null;
    }

    static async deleteById(id) {
        const [user] = await sql`
            DELETE FROM users
            WHERE id = ${id}
            RETURNING id
        `;
        
        return user || null;
    }
}

export default User;
