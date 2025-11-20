import express from 'express';
import PasswordResetController from '../controllers/passwordResetController.js';
import { ValidatePasswordReset } from '../middlewares/index.js';

const router = express.Router();

// Request password reset (sends code to email)
router.post(
    '/forgot-password',
    ValidatePasswordReset.validateRequestReset,
    PasswordResetController.requestReset
);

// Verify reset code
router.post(
    '/verify-code',
    ValidatePasswordReset.validateVerifyCode,
    PasswordResetController.verifyCode
);

// Reset password with code
router.post(
    '/reset-password',
    ValidatePasswordReset.validateResetPassword,
    PasswordResetController.resetPassword
);

export default router;
