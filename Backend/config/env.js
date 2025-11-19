import dotenv from 'dotenv';

dotenv.config();

const supabaseEnv ={
    SupabaseUrl : process.env.SUPABASE_URL,
    SupabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    SupabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}


export default supabaseEnv;
