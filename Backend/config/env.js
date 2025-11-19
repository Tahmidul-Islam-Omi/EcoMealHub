import dotenv from 'dotenv';

dotenv.config();

const supabaseEnv ={

    password: process.env.password,
    host : process.env.host,
    port : process.env.port,
    database : process.env.database,
    user : process.env.user,
    pool_mode : process.env.pool_mode
}


export default supabaseEnv;
