import db from '../config/db.js';

class User {
    static async create(userData) {
        const { 
            full_name, 
            email, 
            password_hash, 
            user_type, 
            household_size, 
            location,
            google_id = null,
            auth_provider = 'local'
        } = userData;
        
        const [user] = await db`
            INSERT INTO users (
                full_name, 
                email, 
                password_hash, 
                user_type, 
                household_size, 
                location,
                google_id,
                auth_provider
            )
            VALUES (
                ${full_name}, 
                ${email}, 
                ${password_hash}, 
                ${user_type}::user_type_enum, 
                ${household_size}, 
                ${location},
                ${google_id},
                ${auth_provider}
            )
            RETURNING 
                id, 
                full_name, 
                email, 
                user_type, 
                household_size, 
                location,
                google_id,
                auth_provider,
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
                google_id,
                auth_provider,
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
                google_id,
                auth_provider,
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
                google_id,
                auth_provider,
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

    static async getProfileById(id){
        const [user] = await db`
            SELECT 
                id, 
                full_name, 
                email, 
                user_type, 
                household_size, 
                location,
                weekly_budget,
                height,
                activity_level,
                diet_preference,
                weight,
                gender,
                created_at, 
                updated_at
            FROM users
            WHERE id = ${id}
        `;
        
        return user || null;
    }

    static async updateProfileById(id, update_data){
        if (Object.keys(update_data).length === 0) {
            throw new Error('No fields to update');
        }

        console.log(update_data);
        

        const allowedFields = [
            'household_size',
            'location',
            'weekly_budget',
            'height',
            'activity_level',
            'diet_preference',
            'weight',
            'gender'
        ];

        const filteredData = Object.keys(update_data)
            .filter(key => allowedFields.includes(key))
            .reduce((obj, key) => {
                obj[key] = update_data[key];
                return obj;
            }, {});

        if (Object.keys(filteredData).length === 0) {
            throw new Error('No valid fields to update');
        }

        const [user] = await db`
            UPDATE users
            SET ${db(filteredData)}, updated_at = NOW()
            WHERE id = ${id}
            RETURNING 
                id, 
                full_name, 
                email, 
                user_type, 
                household_size, 
                location,
                weekly_budget,
                height,
                activity_level,
                diet_preference,
                weight,
                gender,
                created_at, 
                updated_at
        `;

        return user || null;
    }

    static async getAnalysisById(id){
        const user = await db`
            SELECT 
                analysis
            FROM users
            WHERE id = ${id}
        `;
        console.log(user);
        
        return user || null;
    }
}

export default User;
