class ValidateRegistration {
    static validate(req, res, next) {
        const { full_name, email, password, user_type, household_size } = req.body;

        // Check required fields
        if (!full_name || !email || !password || !user_type) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: full_name, email, password, user_type'
            });
        }

        // Validate full_name
        if (full_name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Full name must be at least 2 characters long'
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

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Validate user_type
        const validUserTypes = ['individual', 'family', 'community'];
        if (!validUserTypes.includes(user_type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user_type. Must be one of: individual, family, community'
            });
        }

        // Validate household_size if provided
        if (household_size !== undefined && household_size !== null) {
            const householdNum = parseInt(household_size);
            if (isNaN(householdNum) || householdNum < 1 || householdNum > 50) {
                return res.status(400).json({
                    success: false,
                    message: 'Household size must be a number between 1 and 50'
                });
            }
        }

        next();
    }
}

export default ValidateRegistration;
