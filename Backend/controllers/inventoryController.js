import * as inventoryService from '../services/inventoryService.js';

export const getInventoryItems = async (req, res) => {
    try {
        const userId = 1; //! need to change from auth middleware later
        const items = await inventoryService.getAllInventoryByUser(userId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateInventoryItem = async (req, res) => {
    try {
        const userId = 1; //! need to change from auth middleware later
        const itemId = parseInt(req.params.item_id);
        const updateData = req.body.update_data;
        
        const updatedItem = await inventoryService.updateUserInventoryItem(userId, itemId, updateData);
        console.log(itemId, updateData, "from controller");
        const items = await inventoryService.getAllInventoryByUser(userId);
        
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteInventoryItem = async (req, res) => {
    try {
        const userId = 1; //! need to change from auth middleware later
        const itemId = parseInt(req.params.item_id);
        console.log(itemId);
        
        console.log("tt1");
        
        const deletedItem = await inventoryService.deleteUserInventoryItem(userId, itemId);
        res.json(deletedItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const createUserInventoryItem = async (req, res) => {
    try {
        const userId = 1; //! need to change from auth middleware later
        var { item_id, quantity, unit, custom_cost } = req.body;
        if (!custom_cost) {
            custom_cost = null;
        }
        
        const newItem = await inventoryService.createUserInventoryItem(userId, item_id, quantity, unit, custom_cost);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}