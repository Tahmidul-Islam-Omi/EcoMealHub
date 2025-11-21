import db from "../config/db.js";

const ConsumptionLogsTable = 'consumption_logs';
const UserInventoryTable = 'user_inventory';
const GlobalInventoryTable = 'global_inventory';

class WasteEstimation {
    // Get user's inventory with expiration and cost details
    static async getUserInventoryWithDetails(user_id) {
        return await db`
            SELECT 
                ui.id,
                ui.user_id,
                ui.item_id,
                ui.quantity,
                ui.unit,
                ui.expiration_day,
                ui.created_at,
                gi.item_name,
                gi.category,
                gi.expiration_days,
                gi.calories,
                COALESCE(ui.custom_cost, gi.cost) as cost,
                gi.image_url
            FROM ${db(UserInventoryTable)} ui
            JOIN ${db(GlobalInventoryTable)} gi ON ui.item_id = gi.id
            WHERE ui.user_id = ${user_id}
        `;
    }

    // Get consumption frequency for specific items
    static async getConsumptionFrequency(user_id, days = 30) {
        return await db`
            SELECT 
                UNNEST(food_items) as item_id,
                COUNT(*) as consumption_count,
                AVG(waste) as avg_waste_percentage
            FROM ${db(ConsumptionLogsTable)}
            WHERE user_id = ${user_id}
                AND log_date >= CURRENT_DATE - ${days}
            GROUP BY UNNEST(food_items)
        `;
    }

    // Get historical waste data by category
    static async getWasteByCategory(user_id, days = 30) {
        return await db`
            SELECT 
                gi.category,
                AVG(cl.waste) as avg_waste_percentage,
                COUNT(*) as log_count
            FROM ${db(ConsumptionLogsTable)} cl
            CROSS JOIN UNNEST(cl.food_items) as item_id
            JOIN ${db(GlobalInventoryTable)} gi ON gi.id = item_id
            WHERE cl.user_id = ${user_id}
                AND cl.log_date >= CURRENT_DATE - ${days}
            GROUP BY gi.category
        `;
    }

    // Get total historical waste
    static async getTotalWaste(user_id, days = 30) {
        const [result] = await db`
            SELECT 
                SUM(waste) as total_waste_percentage,
                SUM(cost * (waste / 100)) as total_money_wasted,
                COUNT(*) as total_logs
            FROM ${db(ConsumptionLogsTable)}
            WHERE user_id = ${user_id}
                AND log_date >= CURRENT_DATE - ${days}
        `;
        return result || { total_waste_percentage: 0, total_money_wasted: 0, total_logs: 0 };
    }

    // Get items expiring within specified days
    static async getExpiringItems(user_id, days = 7) {
        return await db`
            SELECT 
                ui.id,
                ui.item_id,
                ui.quantity,
                ui.unit,
                ui.expiration_day,
                gi.item_name,
                gi.category,
                gi.calories,
                COALESCE(ui.custom_cost, gi.cost) as cost,
                gi.image_url
            FROM ${db(UserInventoryTable)} ui
            JOIN ${db(GlobalInventoryTable)} gi ON ui.item_id = gi.id
            WHERE ui.user_id = ${user_id}
                AND ui.expiration_day IS NOT NULL
                AND ui.expiration_day <= ${days}
            ORDER BY ui.expiration_day ASC
        `;
    }
}

export default WasteEstimation;
