import express from 'express';

import { getResources } from '../controllers/ResourceController.js';

const router = express.Router();

router.get('/', getResources);

export default router;