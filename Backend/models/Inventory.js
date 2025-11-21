import db from "../config/db.js";

const GlobalInventoryTable = 'global_inventory';
const UserInventoryTable = 'user_inventory';

class GlobalInventory {
    static async getAll() {
        return await db`SELECT * FROM ${db(GlobalInventoryTable)}`;
    }

    static async getById(id) {
        const [item] = await db`
            SELECT * FROM ${db(GlobalInventoryTable)}
            WHERE id = ${id}
        `;
        return item || null;
    }

    static async create(item_name, category, expiration_days, cost, image_url){
        const [item] = await db`
            INSERT INTO ${db(GlobalInventoryTable)} (item_name, category, expiration_days, cost, image_url)
            VALUES (${item_name}, ${category}, ${expiration_days}, ${cost}, ${image_url})
            RETURNING *
        `;
        return item;
    }
    
}

class UserInventory {
    static async getByUserId(user_id) {
        return await db`
            SELECT 
            ui.id, 
            ui.user_id, 
            ui.item_id, 
            ui.quantity, 
            ui.unit, 
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

    static async addItem(user_id, item_id, quantity, unit, custom_cost) {
        const [item] = await db`
            INSERT INTO ${db(UserInventoryTable)} (user_id, item_id, quantity, unit, custom_cost)
            VALUES (${user_id}, ${item_id}, ${quantity}, ${unit}, ${custom_cost})
            RETURNING *
        `;
        return item;
    }

    static async updateItemQuantity(user_id, item_id, quantity) {
        const [item] = await db`
            UPDATE ${db(UserInventoryTable)}
            SET quantity = ${quantity}
            WHERE user_id = ${user_id} AND item_id = ${item_id}
            RETURNING *
        `;
        return item;
    }

    static async updateItemCustomCost(user_id, item_id, updateData) {

        const [item] = await db`
          UPDATE ${db(UserInventoryTable)}
            SET custom_cost = ${updateData.custom_cost},
                quantity = ${updateData.quantity},
                unit = ${updateData.unit}
            WHERE user_id = ${user_id} AND item_id = ${item_id}
            RETURNING *
        `;
        return item;
    }

    static async deleteItem(user_id, item_id) {
        const [item] = await db`
            DELETE FROM ${db(UserInventoryTable)}
            WHERE user_id = ${user_id} AND item_id = ${item_id}
            RETURNING *
        `;
        return item;
    }

}

export { GlobalInventory, UserInventory };

