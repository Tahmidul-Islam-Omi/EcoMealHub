class ValidateLogin {
    static validate(req, res, next) {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: email, password'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format'
            });
        }

        // Validate password not empty
        if (password.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Password cannot be empty'
            });
        }

        next();
    }
}

export default ValidateLogin;
