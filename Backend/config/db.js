// supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const db = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Function to test database connection
export const testConnection = async () => {
    try {
        const { data, error } = await db
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

export default db;
