import { Resend } from 'resend';
import { emailConfig } from '../config/env.js';

const resend = new Resend(emailConfig.resendApiKey);

class EmailService {
    static async sendPasswordResetCode(email, code, userName) {
        try {
            const { data, error } = await resend.emails.send({
                from: emailConfig.fromEmail,
                to: email,
                subject: 'Password Reset Code - EcoMealHub',
                html: `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                            .header { background: linear-gradient(135deg, #10b981 0%, #6366f1 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
                            .code-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
                            .code { font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 5px; }
                            .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🌱 EcoMealHub</h1>
                                <p>Password Reset Request</p>
                            </div>
                            <div class="content">
                                <p>Hello ${userName || 'User'},</p>
                                <p>We received a request to reset your password. Use the code below to reset your password:</p>
                                <div class="code-box">
                                    <div class="code">${code}</div>
                                </div>
                                <p><strong>This code will expire in 10 minutes.</strong></p>
                                <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                                <div class="footer">
                                    <p>© 2024 EcoMealHub. All rights reserved.</p>
                                    <p>Sustainable eating for a better tomorrow</p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `
            });

            if (error) {
                throw new Error(`Failed to send email: ${error.message}`);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Email sending error:', error);
            throw error;
        }
    }
}

export default EmailService;
