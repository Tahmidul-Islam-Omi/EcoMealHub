import express from 'express';
import { AuthMiddleware } from '../middlewares/index.js';

import * as LogController from '../controllers/logController.js';

const router = express.Router();

router.get('/', AuthMiddleware.authenticate, LogController.getLogsByUserId);

router.post('/', AuthMiddleware.authenticate, LogController.createLogEntry);

export default router;