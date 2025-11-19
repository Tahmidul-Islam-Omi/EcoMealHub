import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class JwtUtils {
    static generateToken(payload, expiresIn = '7d') {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    }

    static verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    static decodeToken(token) {
        return jwt.decode(token);
    }
}

export default JwtUtils;
