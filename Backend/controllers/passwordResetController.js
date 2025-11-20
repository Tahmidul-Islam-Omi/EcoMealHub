import PasswordResetService from '../services/passwordResetService.js';

class PasswordResetController {
    static async requestReset(req, res, next) {
        try {
            const { email } = req.body;

            const result = await PasswordResetService.requestPasswordReset(email);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async verifyCode(req, res, next) {
        try {
            const { email, code } = req.body;

            const result = await PasswordResetService.verifyResetCode(email, code);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    static async resetPassword(req, res, next) {
        try {
            const { email, code, newPassword } = req.body;

            const result = await PasswordResetService.resetPassword(email, code, newPassword);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }
}

export default PasswordResetController;
