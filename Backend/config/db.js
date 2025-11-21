// db.js
import postgres from 'postgres';

import supabaseEnv from './env.js';

// Create PostgreSQL connection
const db = postgres({
    host: supabaseEnv.host,
    port: supabaseEnv.port,
    database: supabaseEnv.database,
    user: supabaseEnv.user,
    password: supabaseEnv.password,
    poolMode: supabaseEnv.pool_mode,
    ssl: { rejectUnauthorized: false }
});

// Function to test database connection
export const testConnection = async () => {
    try {
        await db`SELECT NOW()`;
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        return false;
    }
};

export default db;
