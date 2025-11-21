import express from 'express';
import authRoutes from './authRoutes.js';
import passwordResetRoutes from './passwordResetRoutes.js';
import googleAuthRoutes from './googleAuthRoutes.js';
import ResourceRoute from "./ResouceRoute.js";
import inventoryRoutes from './inventoryRoutes.js';
import logRoutes from './logRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/auth', passwordResetRoutes);
router.use('/auth', googleAuthRoutes);
router.use('/resources', ResourceRoute);
router.use('/inventory', inventoryRoutes);
router.use('/logs', logRoutes);


export default router;
