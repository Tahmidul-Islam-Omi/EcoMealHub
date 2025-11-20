import express from 'express';
import GoogleAuthController from '../controllers/googleAuthController.js';

const router = express.Router();

// Initiate Google OAuth
router.get('/google', GoogleAuthController.googleAuth);

// Google OAuth callback
router.get('/google/callback', GoogleAuthController.googleCallback);

export default router;
