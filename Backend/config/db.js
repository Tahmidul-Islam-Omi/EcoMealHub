// db.js
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

// Create PostgreSQL connection
const db = postgres({
    host: process.env.host,
    port: process.env.port,
    database: process.env.database,
    user: process.env.user,
    password: process.env.password,
    ssl: 'require'
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
