import db from '../config/db.js';

class PasswordReset {
    static async create(email, code, expiresAt) {
        try {
            // Delete any existing reset codes for this email
            await db`
                DELETE FROM password_resets 
                WHERE email = ${email}
            `;

            // Create new reset code
            const result = await db`
                INSERT INTO password_resets (email, code, expires_at, created_at)
                VALUES (${email}, ${code}, ${expiresAt}, NOW())
                RETURNING *
            `;

            return result[0];
        } catch (error) {
            console.error('Error creating password reset:', error);
            throw error;
        }
    }

    static async findByEmailAndCode(email, code) {
        try {
            const result = await db`
                SELECT * FROM password_resets
                WHERE email = ${email} 
                AND code = ${code}
                AND expires_at > NOW()
                AND used = false
                ORDER BY created_at DESC
                LIMIT 1
            `;

            return result[0] || null;
        } catch (error) {
            console.error('Error finding password reset:', error);
            throw error;
        }
    }

    static async markAsUsed(id) {
        try {
            const result = await db`
                UPDATE password_resets
                SET used = true, updated_at = NOW()
                WHERE id = ${id}
                RETURNING *
            `;

            return result[0];
        } catch (error) {
            console.error('Error marking reset as used:', error);
            throw error;
        }
    }

    static async deleteExpired() {
        try {
            await db`
                DELETE FROM password_resets
                WHERE expires_at < NOW()
            `;
        } catch (error) {
            console.error('Error deleting expired resets:', error);
            throw error;
        }
    }
}

export default PasswordReset;
