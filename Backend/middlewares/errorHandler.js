class ErrorHandler {
    static handle(err, req, res, next) {
        console.error('Error:', err);

        // JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        // Database errors
        if (err.code === '23505') { // PostgreSQL unique violation
            return res.status(409).json({
                success: false,
                message: 'Resource already exists'
            });
        }

        if (err.code === '23503') { // PostgreSQL foreign key violation
            return res.status(400).json({
                success: false,
                message: 'Invalid reference to related resource'
            });
        }

        if (err.code === '22P02') { // PostgreSQL invalid input syntax
            return res.status(400).json({
                success: false,
                message: 'Invalid data format'
            });
        }

        // Custom application errors
        if (err.message === 'User with this email already exists') {
            return res.status(409).json({
                success: false,
                message: err.message
            });
        }

        if (err.message === 'User not found') {
            return res.status(404).json({
                success: false,
                message: err.message
            });
        }

        if (err.message === 'Invalid email or password') {
            return res.status(401).json({
                success: false,
                message: err.message
            });
        }

        // Default error
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    static notFound(req, res) {
        res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    }
}

export default ErrorHandler;
