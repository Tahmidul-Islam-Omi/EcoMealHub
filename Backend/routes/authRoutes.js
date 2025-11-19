import express from 'express';
import AuthController from '../controllers/authController.js';
import { ValidateRegistration } from '../middlewares/index.js';

const router = express.Router();

router.post('/register', ValidateRegistration.validate, AuthController.register);

export default router;
