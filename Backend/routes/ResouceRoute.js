import express from 'express';
import { AuthMiddleware } from '../middlewares/index.js';
import * as ResourceController from '../controllers/ResourceController.js';

const router = express.Router();

// Public route - anyone can view resources
router.get('/', ResourceController.getResourcesLimited);

// Protected route - only authenticated users can create resources
router.post('/', AuthMiddleware.authenticate, ResourceController.createResource);


export default router;