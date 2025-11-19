import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { JwtUtils } from '../utills/index.js';

class AuthService {
    static async registerUser(userData) {
        const { full_name, email, password, user_type, household_size, location } = userData;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Create user
        const newUser = await User.create({
            full_name,
            email,
            password_hash,
            user_type,
            household_size: household_size || null,
            location: location || null
        });

        // Remove password from response
        const { password_hash: _, ...userWithoutPassword } = newUser;

        // Generate JWT token
        const token = JwtUtils.generateToken({
            id: newUser.id,
            email: newUser.email,
            user_type: newUser.user_type
        });

        return {
            user: userWithoutPassword,
            token
        };
    }

    static async loginUser(credentials) {
        const { email, password } = credentials;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }

        // Remove password from response
        const { password_hash: _, ...userWithoutPassword } = user;

        // Generate JWT token
        const token = JwtUtils.generateToken({
            id: user.id,
            email: user.email,
            user_type: user.user_type
        });

        return {
            user: userWithoutPassword,
            token
        };
    }
}

export default AuthService;
