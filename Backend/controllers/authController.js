import AuthService from '../services/authService.js';

class AuthController {
    static async register(req, res, next) {
        try {
            const { full_name, email, password, user_type, household_size, location } = req.body;

            const { user, token } = await AuthService.registerUser({
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
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log('###########Received login request:', { email, password });

            const { user, token } = await AuthService.loginUser({
                email,
                password
            });

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
