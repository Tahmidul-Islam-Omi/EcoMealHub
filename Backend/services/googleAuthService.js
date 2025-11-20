import { googleConfig } from '../config/env.js';
import User from '../models/User.js';
import { JwtUtils } from '../utills/index.js';

class GoogleAuthService {
    static async handleGoogleCallback(googleProfile) {
        try {
            const { id: googleId, email, name, picture } = googleProfile;

            // Check if user exists by email
            let user = await User.findByEmail(email);

            if (user) {
                // User exists - handle account linking
                if (!user.google_id) {
                    // Link Google account to existing email/password account
                    await User.updateById(user.id, {
                        google_id: googleId,
                        auth_provider: user.password_hash ? 'both' : 'google'
                    });

                    user = await User.findById(user.id);
                }
                // User already has Google linked, just login
            } else {
                // Create new user with Google
                user = await User.create({
                    full_name: name,
                    email: email,
                    password_hash: null,
                    google_id: googleId,
                    auth_provider: 'google',
                    user_type: 'individual',
                    household_size: 1,
                    location: ''
                });
            }

            // Generate JWT token
            const token = JwtUtils.generateToken({
                id: user.id,
                email: user.email,
                user_type: user.user_type
            });

            return {
                user: {
                    id: user.id,
                    full_name: user.full_name,
                    email: user.email,
                    user_type: user.user_type,
                    household_size: user.household_size,
                    location: user.location,
                    auth_provider: user.auth_provider
                },
                token
            };
        } catch (error) {
            console.error('Google auth error:', error);
            throw error;
        }
    }

    static getGoogleAuthURL() {
        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        
        const options = {
            redirect_uri: googleConfig.callbackURL,
            client_id: googleConfig.clientId,
            access_type: 'offline',
            response_type: 'code',
            prompt: 'consent',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
            ].join(' '),
        };

        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    }

    static async getGoogleUser(code) {
        try {
            // Exchange code for tokens
            const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    code,
                    client_id: googleConfig.clientId,
                    client_secret: googleConfig.clientSecret,
                    redirect_uri: googleConfig.callbackURL,
                    grant_type: 'authorization_code',
                }),
            });

            const tokens = await tokenResponse.json();

            if (!tokens.access_token) {
                throw new Error('Failed to get access token');
            }

            // Get user info
            const userResponse = await fetch(
                `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
                {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`,
                    },
                }
            );

            const googleUser = await userResponse.json();
            return googleUser;
        } catch (error) {
            console.error('Error getting Google user:', error);
            throw new Error('Failed to authenticate with Google');
        }
    }
}

export default GoogleAuthService;
