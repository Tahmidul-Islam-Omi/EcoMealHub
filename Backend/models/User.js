import db from '../config/db.js';

class User {
    static async create(userData) {
        const { full_name, email, password_hash, user_type, household_size, location } = userData;
        
        const [user] = await db`
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
        const [user] = await db`
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
        const [user] = await db`
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
        if (Object.keys(updateData).length === 0) {
            throw new Error('No fields to update');
        }
        
        const [user] = await db`
            UPDATE users
            SET ${db(updateData)}, updated_at = NOW()
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
        const [user] = await db`
            DELETE FROM users
            WHERE id = ${id}
            RETURNING id
        `;
        
        return user || null;
    }
}

export default User;
