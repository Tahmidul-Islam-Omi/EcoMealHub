import express from 'express';
import { AuthMiddleware } from '../middlewares/index.js';
import * as WasteEstimationController from '../controllers/wasteEstimationController.js';

const router = express.Router();

// All waste estimation routes require authentication
router.get('/current', AuthMiddleware.authenticate, WasteEstimationController.getCurrentWasteEstimation);

router.get('/weekly', AuthMiddleware.authenticate, WasteEstimationController.getWeeklyProjection);

router.get('/monthly', AuthMiddleware.authenticate, WasteEstimationController.getMonthlyProjection);

router.get('/insights', AuthMiddleware.authenticate, WasteEstimationController.getWasteInsights);

router.get('/history', AuthMiddleware.authenticate, WasteEstimationController.getWasteHistory);

export default router;
