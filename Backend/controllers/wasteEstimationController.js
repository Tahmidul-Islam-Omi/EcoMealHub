import * as wasteEstimationService from '../services/wasteEstimationService.js';

/**
 * Get current waste estimation for user's inventory
 */
export const getCurrentWasteEstimation = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // Get from auth middleware
        const estimation = await wasteEstimationService.getCurrentWasteEstimation(userId);
        res.json(estimation);
    } catch (error) {
        console.error('Error in getCurrentWasteEstimation controller:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get weekly waste projection
 */
export const getWeeklyProjection = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // Get from auth middleware
        const projection = await wasteEstimationService.getWeeklyWasteProjection(userId);
        res.json(projection);
    } catch (error) {
        console.error('Error in getWeeklyProjection controller:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get monthly waste projection
 */
export const getMonthlyProjection = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // Get from auth middleware
        const projection = await wasteEstimationService.getMonthlyWasteProjection(userId);
        res.json(projection);
    } catch (error) {
        console.error('Error in getMonthlyProjection controller:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get actionable waste insights
 */
export const getWasteInsights = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // Get from auth middleware
        const insights = await wasteEstimationService.getWasteInsights(userId);
        res.json(insights);
    } catch (error) {
        console.error('Error in getWasteInsights controller:', error);
        res.status(500).json({ error: error.message });
    }
};

/**
 * Get historical waste trends
 */
export const getWasteHistory = async (req, res) => {
    try {
        const userId = req.user?.id || 1; // Get from auth middleware
        const days = parseInt(req.query.days) || 90;
        
        if (days < 1 || days > 365) {
            return res.status(400).json({ error: 'Days must be between 1 and 365' });
        }
        
        const history = await wasteEstimationService.getWasteHistory(userId, days);
        res.json(history);
    } catch (error) {
        console.error('Error in getWasteHistory controller:', error);
        res.status(500).json({ error: error.message });
    }
};
