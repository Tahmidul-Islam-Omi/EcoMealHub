// supabase.js
import { createClient } from '@supabase/supabase-js';
import supabaseEnv from './env.js';

const db = createClient(
    supabaseEnv.SupabaseUrl,
    supabaseEnv.SupabaseServiceRoleKey
);

export default db;
