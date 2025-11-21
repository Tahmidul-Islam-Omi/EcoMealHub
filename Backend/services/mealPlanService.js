import MealPlan from '../models/MealPlan.js';
import PlannedMeal from '../models/PlannedMeal.js';
import User from '../models/User.js';
import { UserInventory } from '../models/Inventory.js';
import geminiService from './aiService.js';

class MealPlanService {
    // Calculate current week (Saturday to Friday)
    getWeekDates() {
        const today = new Date();
        const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
        
        // Calculate days since last Saturday
        const daysSinceSaturday = (currentDay + 1) % 7;
        
        // Get Saturday of current week
        const saturday = new Date(today);
        saturday.setDate(today.getDate() - daysSinceSaturday);
        saturday.setHours(0, 0, 0, 0);
        
        // Get Friday of current week
        const friday = new Date(saturday);
        friday.setDate(saturday.getDate() + 6);
        friday.setHours(23, 59, 59, 999);
        
        // Generate all 7 dates
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(saturday);
            date.setDate(date.getDate() + i);
            weekDates.push(date);
        }
        
        return {
            startDate: saturday,
            endDate: friday,
            weekDates
        };
    }

    async generateMealPlan(userId) {
        try {
            // 1. Fetch user data
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            // 2. Fetch user inventory
            const inventoryItems = await UserInventory.getByUserId(userId);

            // 3. Get current week dates
            const { startDate, endDate, weekDates } = this.getWeekDates();

            // 4. Delete existing meal plan (CASCADE will delete planned_meals too)
            await MealPlan.deleteByUserId(userId);

            // 5. Generate meal plan using Gemini AI
            const aiMealPlan = await geminiService.generateWeeklyMealPlan(
                {
                    weekly_budget: user.weekly_budget,
                    household_size: user.household_size,
                    diet_preference: user.diet_preference
                },
                inventoryItems,
                weekDates
            );

            // 6. Create new meal plan record
            const mealPlan = await MealPlan.create(
                userId,
                startDate.toISOString().split('T')[0],
                endDate.toISOString().split('T')[0]
            );

            // 7. Insert planned meals
            const mealsToInsert = aiMealPlan.meals.map(meal => ({
                meal_plan_id: mealPlan.id,
                meal_date: meal.date,
                meal_type: meal.meal_type,
                meal_title: meal.meal_title,
                calories: meal.calories
            }));

            await PlannedMeal.bulkCreate(mealsToInsert);

            // 8. Fetch complete meal plan with meals
            const plannedMeals = await PlannedMeal.getByMealPlanId(mealPlan.id);

            return {
                mealPlan,
                meals: plannedMeals
            };
        } catch (error) {
            console.error('Meal Plan Service Error:', error);
            throw error;
        }
    }

    async getActiveMealPlan(userId) {
        try {
            const mealPlan = await MealPlan.getByUserId(userId);
            
            if (!mealPlan) {
                return null;
            }

            const meals = await PlannedMeal.getByMealPlanId(mealPlan.id);

            return {
                mealPlan,
                meals
            };
        } catch (error) {
            console.error('Get Meal Plan Error:', error);
            throw error;
        }
    }

    async regenerateMealPlan(userId) {
        // Same as generate, will replace existing
        return await this.generateMealPlan(userId);
    }
}

export default new MealPlanService();
