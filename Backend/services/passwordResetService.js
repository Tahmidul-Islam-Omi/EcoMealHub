import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import EmailService from '../utills/emailService.js';

class PasswordResetService {
    static generateResetCode() {
        // Generate a 6-digit code
        return crypto.randomInt(100000, 999999).toString();
    }

    static async requestPasswordReset(email) {
        try {
            // Check if user exists
            const user = await User.findByEmail(email);
            
            if (!user) {
                throw new Error('No account found with this email address');
            }

            // Generate reset code
            const code = this.generateResetCode();
            
            // Set expiration time (10 minutes from now)
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

            // Save reset code to database
            await PasswordReset.create(email, code, expiresAt);

            // Send email with reset code
            await EmailService.sendPasswordResetCode(email, code, user.full_name);

            return {
                success: true,
                message: 'Verification code has been sent to your email'
            };
        } catch (error) {
            console.error('Password reset request error:', error);
            throw error;
        }
    }

    static async verifyResetCode(email, code) {
        try {
            const resetRecord = await PasswordReset.findByEmailAndCode(email, code);

            if (!resetRecord) {
                throw new Error('Invalid or expired reset code');
            }

            return {
                success: true,
                message: 'Code verified successfully',
                resetId: resetRecord.id
            };
        } catch (error) {
            console.error('Code verification error:', error);
            throw error;
        }
    }

    static async resetPassword(email, code, newPassword) {
        try {
            // Verify the code
            const resetRecord = await PasswordReset.findByEmailAndCode(email, code);

            if (!resetRecord) {
                throw new Error('Invalid or expired reset code');
            }

            // Find user
            const user = await User.findByEmail(email);

            if (!user) {
                throw new Error('User not found');
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update user password (note: column name is password_hash)
            await User.updateById(user.id, { password_hash: hashedPassword });

            // Mark reset code as used
            await PasswordReset.markAsUsed(resetRecord.id);

            return {
                success: true,
                message: 'Password reset successfully'
            };
        } catch (error) {
            console.error('Password reset error:', error);
            throw error;
        }
    }
}

export default PasswordResetService;
