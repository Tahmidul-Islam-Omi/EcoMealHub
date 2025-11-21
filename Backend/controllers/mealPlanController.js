import mealPlanService from '../services/mealPlanService.js';

class MealPlanController {
    static async generateMealPlan(req, res, next) {
        try {
            const userId = req.user.id; // From auth middleware

            const result = await mealPlanService.generateMealPlan(userId);

            res.status(201).json({
                success: true,
                message: 'Meal plan generated successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async getActiveMealPlan(req, res, next) {
        try {
            const userId = req.user.id;

            const result = await mealPlanService.getActiveMealPlan(userId);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'No active meal plan found'
                });
            }

            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    }

    static async regenerateMealPlan(req, res, next) {
        try {
            const userId = req.user.id;

            const result = await mealPlanService.regenerateMealPlan(userId);

            res.status(200).json({
                success: true,
                message: 'Meal plan regenerated successfully',
                data: result
            });
        } catch (error) {
            next(error);
        }
    }
}

export default MealPlanController;
