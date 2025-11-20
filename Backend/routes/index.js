import express from 'express';
import authRoutes from './authRoutes.js';
import ResourceRoute from "./ResouceRoute.js";
import inventoryRoutes from './inventoryRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/resources', ResourceRoute);
router.use('/inventory', inventoryRoutes);

export default router;
