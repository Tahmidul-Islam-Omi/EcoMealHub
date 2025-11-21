import express from 'express';
import * as UserController from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', UserController.getUserProfile);
router.put('/:id', UserController.updateUserProfile);

router.get

export default router;