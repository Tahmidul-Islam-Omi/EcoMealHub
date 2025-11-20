import express from 'express';

import * as ResourceController from '../controllers/ResourceController.js';

const router = express.Router();

router.get('/', ResourceController.getResourcesLimited);
// router.get('/limited', ResourceController.getResourcesLimited);
router.post('/', ResourceController.createResource);


export default router;