import express from 'express';
import { 
    getSDGScore, 
    getWeeklyInsights, 
    getSDGTargets, 
    getSDGHistory 
} from '../controllers/sdgController.js';
import AuthMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes for SDG Impact Scoring Engine (temporarily public for testing)
router.get('/score', getSDGScore);
router.get('/insights', getWeeklyInsights);
router.get('/targets', getSDGTargets); // Public endpoint
router.get('/history', getSDGHistory);

export default router;
