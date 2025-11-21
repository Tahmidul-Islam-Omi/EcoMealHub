import { decode } from 'jsonwebtoken';
import { JwtUtils } from '../utills/index.js';

class AuthMiddleware {
    static authenticate(req, res, next) {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Access denied. No token provided.'
                });
            }

            // Extract token
            const token = authHeader.split(' ')[1];

            // Verify token
            const decoded = JwtUtils.verifyToken(token);

            // Attach user info to request
            req.user = decoded;
            console.log(decode);
            

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    }
}

export default AuthMiddleware;
