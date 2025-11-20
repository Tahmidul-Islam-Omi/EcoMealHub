import GoogleAuthService from '../services/googleAuthService.js';

class GoogleAuthController {
    // Redirect user to Google OAuth consent screen
    static googleAuth(req, res) {
        try {
            const url = GoogleAuthService.getGoogleAuthURL();
            res.redirect(url);
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Failed to initiate Google authentication'
            });
        }
    }

    // Handle Google OAuth callback
    static async googleCallback(req, res) {
        try {
            const { code } = req.query;

            if (!code) {
                return res.redirect('http://localhost:5173/login?error=no_code');
            }

            // Get Google user data
            const googleUser = await GoogleAuthService.getGoogleUser(code);

            // Handle user creation/login and get JWT
            const { user, token } = await GoogleAuthService.handleGoogleCallback(googleUser);

            // Redirect to frontend with token
            const frontendURL = `http://localhost:5173/auth/google/success?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
            res.redirect(frontendURL);

        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect('http://localhost:5173/login?error=auth_failed');
        }
    }
}

export default GoogleAuthController;
