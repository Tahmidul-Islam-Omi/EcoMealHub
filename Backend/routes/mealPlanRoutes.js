import express from 'express';
import { AuthMiddleware } from '../middlewares/index.js';
import MealPlanController from '../controllers/mealPlanController.js';

const router = express.Router();

// All meal plan routes require authentication
router.post('/generate', AuthMiddleware.authenticate, MealPlanController.generateMealPlan);

router.get('/active', AuthMiddleware.authenticate, MealPlanController.getActiveMealPlan);

router.post('/regenerate', AuthMiddleware.authenticate, MealPlanController.regenerateMealPlan);

export default router;
