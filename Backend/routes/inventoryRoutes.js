import express from 'express';
import { AuthMiddleware } from '../middlewares/index.js';
import * as InventoryController from '../controllers/inventoryController.js';

const router = express.Router();

// All inventory routes require authentication
router.get('/', AuthMiddleware.authenticate, InventoryController.getInventoryItems); 

router.delete('/:item_id', AuthMiddleware.authenticate, InventoryController.deleteInventoryItem);

router.put('/:item_id', AuthMiddleware.authenticate, InventoryController.updateInventoryItem);

router.post('/', AuthMiddleware.authenticate, InventoryController.createUserInventoryItem);

router.get('/global', AuthMiddleware.authenticate, InventoryController.getGlobalInventoryItems);


export default router;