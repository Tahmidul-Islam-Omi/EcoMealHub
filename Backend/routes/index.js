import express from 'express';
import authRoutes from './authRoutes.js';
import passwordResetRoutes from './passwordResetRoutes.js';
import googleAuthRoutes from './googleAuthRoutes.js';
import ResourceRoute from "./ResouceRoute.js";
import inventoryRoutes from './inventoryRoutes.js';
import logRoutes from './logRoutes.js';
import userRoutes from './userRoutes.js'
import mealPlanRoutes from './mealPlanRoutes.js';
import wasteEstimationRoutes from './wasteEstimationRoutes.js';
import chatBotRoute from './chatBotRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/auth', passwordResetRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/resources', ResourceRoute);
router.use('/inventory', inventoryRoutes);
router.use('/logs', logRoutes);
router.use('/user', userRoutes);
router.use('/meal-plans', mealPlanRoutes);
router.use('/waste-estimation', wasteEstimationRoutes);

router.use('/chat', chatBotRoute);

export default router;
