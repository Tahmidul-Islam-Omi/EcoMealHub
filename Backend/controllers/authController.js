import AuthService from '../services/authService.js';

class AuthController {
    static async register(req, res) {
        try {
            const { full_name, email, password, user_type, household_size, location } = req.body;

            // Validation
            if (!full_name || !email || !password || !user_type) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing required fields: full_name, email, password, user_type'
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid email format'
                });
            }

            // Password validation
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            // User type validation
            const validUserTypes = ['donor', 'recipient', 'volunteer'];
            if (!validUserTypes.includes(user_type)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid user_type. Must be one of: donor, recipient, volunteer'
                });
            }

            const user = await AuthService.registerUser({
                full_name,
                email,
                password,
                user_type,
                household_size,
                location
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user
            });
        } catch (error) {
            console.error('Registration error:', error);
            
            if (error.message === 'User with this email already exists') {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

export default AuthController;
