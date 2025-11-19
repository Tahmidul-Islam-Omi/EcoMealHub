import express from 'express';
import AuthController from '../controllers/authController.js';
import { ValidateRegistration, ValidateLogin } from '../middlewares/index.js';

const router = express.Router();

router.post('/register', ValidateRegistration.validate, AuthController.register);
router.post('/login', ValidateLogin.validate, AuthController.login);

export default router;
