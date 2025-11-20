import express from 'express';
import authRoutes from './authRoutes.js';
import passwordResetRoutes from './passwordResetRoutes.js';
import ResourceRoute from "./ResouceRoute.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/auth', passwordResetRoutes);
router.use('/resources', ResourceRoute);

export default router;
