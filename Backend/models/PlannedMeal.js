import db from "../config/db.js";

class PlannedMeal {
    static async bulkCreate(meals) {
        const result = await db`
            INSERT INTO planned_meals ${db(meals, 'meal_plan_id', 'meal_date', 'meal_type', 'meal_title', 'calories')}
            RETURNING *
        `;
        return result;
    }

    static async getByMealPlanId(meal_plan_id) {
        const meals = await db`
            SELECT * FROM planned_meals 
            WHERE meal_plan_id = ${meal_plan_id}
            ORDER BY meal_date, 
                CASE meal_type
                    WHEN 'breakfast' THEN 1
                    WHEN 'lunch' THEN 2
                    WHEN 'dinner' THEN 3
                    WHEN 'snack' THEN 4
                END
        `;
        return meals;
    }
}

export default PlannedMeal;
