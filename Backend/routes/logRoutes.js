import express from 'express';

import * as LogController from '../controllers/logController.js';

const router = express.Router();

router.get('/', LogController.getLogsByUserId);

router.post('/', LogController.createLogEntry);

export default router;