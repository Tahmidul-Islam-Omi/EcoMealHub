import db from "../config/db.js";

class MealPlan {
    static async create(user_id, week_start_date, week_end_date) {
        const [mealPlan] = await db`
            INSERT INTO meal_plans (user_id, week_start_date, week_end_date)
            VALUES (${user_id}, ${week_start_date}, ${week_end_date})
            RETURNING *
        `;
        return mealPlan;
    }

    static async getByUserId(user_id) {
        const [mealPlan] = await db`
            SELECT * FROM meal_plans 
            WHERE user_id = ${user_id}
            ORDER BY created_at DESC
            LIMIT 1
        `;
        return mealPlan || null;
    }

    static async deleteByUserId(user_id) {
        await db`
            DELETE FROM meal_plans WHERE user_id = ${user_id}
        `;
    }
}

export default MealPlan;
