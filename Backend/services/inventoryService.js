import { GlobalInventory, UserInventory } from "../models/Inventory.js";

export const getAllInventoryByUser = async (userId) => {
    try {
        const items = await UserInventory.getByUserId(userId);
        return items;
    }
    catch (err) {
        console.log(err);
        return [];
    }
};

export const updateUserInventoryItem = async (user_id, itemId, updateData) => {
    try {
        const updatedItem = await UserInventory.updateItemCustomCost(user_id, itemId, updateData);
        return updatedItem;
    }
    catch (err) {
        console.log(err);
        throw new Error('Failed to update inventory item');
    }
}

export const deleteUserInventoryItem = async (user_id, itemId) => {
    try {
        const deletedItem = await UserInventory.deleteItem(user_id, itemId);
        return deletedItem;
    }
    catch (err) {
        console.log(err);
        throw new Error('Failed to delete inventory item');
    }
}

export const createUserInventoryItem = async (user_id, item_id, quantity, unit, custom_cost) => {
    try {
        const newItem = await UserInventory.addItem(user_id, item_id, quantity, unit, custom_cost);
        return newItem;
    }
    catch (err) {
        console.log(err);
        throw new Error('Failed to create inventory item');
    }
}


