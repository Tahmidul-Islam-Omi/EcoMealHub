import * as inventoryService from '../services/inventoryService.js';
import { analyzeFoodItemsFromText } from '../services/geminiService.js';


export const getInventoryItems = async (req, res) => {
    try {
        const userId = req.user.id; //! need to change from auth middleware later
        // const userId = 1; //! need to change from auth middleware later
        const items = await inventoryService.getAllInventoryByUser(userId);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateInventoryItem = async (req, res) => {
    try {
        const userId = req.user.id; //! need to change from auth middleware later
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
        const userId = req.user.id; //! need to change from auth middleware later
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
        const userId = req.user.id; //! need to change from auth middleware later
        const { item_id, quantity, unit, custom_cost, expiration_day } = req.body;
        var cost = custom_cost;
        if (!custom_cost) {
            cost = null;
        }
        if(!expiration_day){
            expiration_day = null;
        }
        const newItem = await inventoryService.createUserInventoryItem(userId, item_id, quantity, unit, cost, expiration_day);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getGlobalInventoryItems = async (req, res) => {
    try {
        const items = await inventoryService.getAllGlobalInventoryItems();
        res.json(items);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}   


export const createGlobalInventoryItem = async (req, res) => {
    try {
                const { item_name, category, expiration_days, cost, image } = req.body;
        // console.log(image);
        
        

        const item = {
            item_name, category, expiration_days, cost, image_url: "abc"
        }
        
        const newItem = await inventoryService.createGlobalInventoryItem(item);
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * Analyzes OCR-extracted text using Gemini AI and returns structured food item data
 * POST /api/v1/inventory/text-analysis
 * Body: { text: "OCR extracted text" }
 */
export const analyzeTextForFoodItems = async (req, res) => {
    try {
        const { text } = req.body;

        // Validate input
        if (!text || typeof text !== 'string' || text.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Text is required and must be a non-empty string',
                data: []
            });
        }

        console.log('Analyzing OCR text:', text.substring(0, 100) + '...');

        // Use Gemini service to analyze the text
        const result = await analyzeFoodItemsFromText(text.trim());

        // Return the result from Gemini service
        if (result.success) {
            console.log(`Successfully extracted ${result.data.length} food items`);
            res.status(200).json(result);
        } else {
            console.error('Failed to analyze text:', result.message);
            res.status(422).json(result); // 422 Unprocessable Entity for AI processing errors
        }

    } catch (error) {
        console.error('Error in analyzeTextForFoodItems:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while analyzing text',
            data: [],
            error: error.message
        });
    }
};

/**
 * Test endpoint to check available Gemini models
 * GET /api/v1/inventory/test-models
 */
export const testGeminiModels = async (req, res) => {
    try {
        const { listAvailableModels } = await import('../services/geminiService.js');
        const models = await listAvailableModels();
        
        res.json({
            success: true,
            available_models: models.map(m => m.name),
            total_models: models.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

/**
 * Adds OCR-extracted food items to user's inventory
 * POST /api/v1/inventory/add-ocr-items
 * Body: { items: [{ item_name, quantity, unit, cost, expiration_date }] }
 */
export const addOcrItemsToInventory = async (req, res) => {
    try {
        const userId = req.user.id; //! need to change from auth middleware later
        const { items } = req.body;

        // Validate input
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Items array is required and must contain at least one item'
            });
        }

        console.log(`Adding ${items.length} OCR-extracted items to inventory for user ${userId}`);

        const addedItems = [];
        const failedItems = [];

        // Get all global inventory items once
        const existingGlobalItems = await inventoryService.getAllGlobalInventoryItems();

        // Process each item
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            try {
                // Validate item structure
                if (!item.item_name) {
                    failedItems.push({ item, reason: 'Missing item name' });
                    continue;
                }

                console.log(`Processing item ${i}: ${item.item_name}`);

                // Search for existing global item by name
                let globalItem = existingGlobalItems.find(gi => 
                    gi.item_name.toLowerCase() === item.item_name.toLowerCase()
                );

                // If not found, create a new global inventory item
                if (!globalItem) {
                    console.log(`Global item not found for "${item.item_name}", creating new one`);
                    
                    const newGlobalItem = {
                        item_name: item.item_name,
                        category: 'other', // Default category for OCR items
                        expiration_days: 7, // Default expiration days
                        cost: item.cost || 0,
                        image_url: null // Always null for OCR items
                    };
                    
                    globalItem = await inventoryService.createGlobalInventoryItem(newGlobalItem);
                    
                    // Add to the existing items array for future searches in this batch
                    existingGlobalItems.push(globalItem);
                    
                    console.log(`Created new global item: ${item.item_name} with ID: ${globalItem.id}`);
                }

                // Calculate expiration_day (days from current date)
                let expirationDay = null;
                if (item.expiration_date) {
                    const currentDate = new Date();
                    const expirationDate = new Date(item.expiration_date);
                    
                    // Calculate difference in days
                    const timeDifference = expirationDate.getTime() - currentDate.getTime();
                    expirationDay = Math.ceil(timeDifference / (1000 * 3600 * 24));
                    
                    console.log(`Calculated expiration_day for ${item.item_name}: ${expirationDay} days from now`);
                }

                // Add to user inventory using createUserInventoryItem
                const userInventoryItem = await inventoryService.createUserInventoryItem(
                    userId,
                    globalItem.id, // item_id from global inventory
                    item.quantity || 1, // quantity from OCR
                    item.unit || 'pieces', // unit from OCR
                    item.cost || null, // custom_cost from OCR
                    expirationDay // expiration_day calculated from expiration_date
                );

                addedItems.push({
                    ...userInventoryItem,
                    item_name: item.item_name,
                    global_item_id: globalItem.id,
                    calculated_expiration_day: expirationDay,
                    original_data: item
                });

                console.log(`Successfully added ${item.item_name} to user inventory`);

            } catch (itemError) {
                console.error(`Error adding item ${item.item_name}:`, itemError);
                failedItems.push({ 
                    item, 
                    reason: itemError.message || 'Unknown error' 
                });
            }
        }

        // Prepare response
        const response = {
            success: addedItems.length > 0,
            message: `Successfully added ${addedItems.length} items${failedItems.length > 0 ? `, ${failedItems.length} failed` : ''}`,
            data: {
                added_items: addedItems,
                failed_items: failedItems,
                summary: {
                    total_processed: items.length,
                    successfully_added: addedItems.length,
                    failed: failedItems.length
                }
            }
        };

        if (addedItems.length > 0) {
            res.status(201).json(response);
        } else {
            res.status(400).json(response);
        }

    } catch (error) {
        console.error('Error in addOcrItemsToInventory:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error while adding OCR items',
            error: error.message
        });
    }
};

