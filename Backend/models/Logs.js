import db from "../config/db.js";

class Logs {
    static async getLogsByUserId(user_id){
        const result = await db`
            SELECT * FROM consumption_logs WHERE user_id = ${user_id};`
        ;
        return result;
    }

    static async createLogEntry(user_id, meal_type, calory, waste, cost, log_date) {
        const [newLog] = await db`
            INSERT INTO consumption_logs 
                (user_id, meal_type, calory, waste, cost, log_date)
            VALUES 
                (${user_id}, ${meal_type}, ${calory}, ${waste || 0}, ${cost}, ${log_date})
            RETURNING *;
        `;
        return newLog;
    }

}

export default Logs