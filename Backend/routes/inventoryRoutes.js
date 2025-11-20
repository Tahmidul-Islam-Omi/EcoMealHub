import express from 'express';

import * as InventoryController from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', InventoryController.getInventoryItems); 

router.delete('/:item_id', InventoryController.deleteInventoryItem);

router.put('/:item_id', InventoryController.updateInventoryItem);

router.post('/', InventoryController.createUserInventoryItem);

router.get('/global', InventoryController.getGlobalInventoryItems);


export default router;