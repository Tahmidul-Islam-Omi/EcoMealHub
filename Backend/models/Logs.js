import db from "../config/db.js";

class Logs {
    static async getLogsByUserId(user_id){
        const result = await db`
            SELECT * FROM consumption_logs WHERE user_id = ${user_id};`
        ;
        return result;
    }

    static async createLogEntry(user_id, meal_type, calory, waste, cost, log_date, food_items){
        const foodItemsArray = food_items.map(Number);
        const [newLog] = await db`
            INSERT INTO consumption_logs 
                (user_id, meal_type, calory, waste, cost, log_date, food_items)
            VALUES 
                (${user_id}, ${meal_type}, ${calory}, ${waste || 0}, ${cost}, ${log_date}, ${foodItemsArray})
            RETURNING *;
        `;
        return newLog;
    }

}

export default Logs