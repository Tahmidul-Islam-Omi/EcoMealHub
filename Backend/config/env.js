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

export const emailConfig = {
    resendApiKey: process.env.RESEND_API_KEY || 're_U31yU1uA_JVkeoWf5usAY8xk5H1xmAe8z',
    fromEmail: process.env.FROM_EMAIL || 'onboarding@resend.dev'
}

export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}

export default supabaseEnv;
