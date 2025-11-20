import express from 'express';

import { getResources, createResource } from '../controllers/ResourceController.js';

const router = express.Router();

router.get('/', getResources);

router.post('/', createResource);


export default router;