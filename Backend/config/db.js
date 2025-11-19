// db.js
import { createClient } from '@supabase/supabase-js';
import postgres from 'postgres';
import { Pool } from 'pg';

import supabaseEnv from './env.js';


const db = new Pool({
    host: supabaseEnv.host,
    port: supabaseEnv.port,
    database: supabaseEnv.database,
    user: supabaseEnv.user,
    password: supabaseEnv.password,
    poolMode: supabaseEnv.pool_mode
});

export default db;
