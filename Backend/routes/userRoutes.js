import express from 'express';
import * as UserController from '../controllers/userController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/analyze', AuthMiddleware.authenticate, UserController.getAiPattern);
router.get('/:id', AuthMiddleware.authenticate,  UserController.getUserProfile);
router.put('/:id', AuthMiddleware.authenticate, UserController.updateUserProfile);

export default router;