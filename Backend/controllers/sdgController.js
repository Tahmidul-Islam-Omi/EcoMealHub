import { SDGService } from '../services/sdgService.js';

/**
 * Get user's current SDG score
 * GET /api/v1/sdg/score
 */
export const getSDGScore = async (req, res) => {
    try {
        const userId = req.user.id; // req.user.id; // TODO: Get from auth middleware
        
        console.log(`Calculating SDG score for user ${userId}`);
        
        // For testing, return a simplified response structure
        const mockResult = {
            success: true,
            data: {
                totalScore: 78,
                breakdown: {
                    wasteReduction: { score: 85, details: { summary: "Good inventory turnover" } },
                    nutrition: { score: 72, details: { summary: "Balanced meal logging" } },
                    sustainability: { score: 80, details: { summary: "Diverse food choices" } },
                    budgetEfficiency: { score: 75, details: { summary: "Cost-effective spending" } }
                }
            }
        };
        
        res.status(200).json(mockResult);
    } catch (error) {
        console.error('Error getting SDG score:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to calculate SDG score'
        });
    }
};

/**
 * Get weekly insights for user
 * GET /api/v1/sdg/insights
 */
export const getWeeklyInsights = async (req, res) => {
    try {
        const userId = 1; // req.user.id; // TODO: Get from auth middleware
        
        console.log(`Generating weekly insights for user ${userId}`);
        
        const result = await SDGService.generateWeeklyInsights(userId);
        
        res.status(200).json(result);
    } catch (error) {
        console.error('Error generating weekly insights:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to generate weekly insights'
        });
    }
};

/**
 * Get SDG targets and information
 * GET /api/v1/sdg/targets
 */
export const getSDGTargets = async (req, res) => {
    try {
        const result = SDGService.getSDGTargets();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error getting SDG targets:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get SDG targets'
        });
    }
};

/**
 * Get historical SDG scores (mock implementation for now)
 * GET /api/v1/sdg/history
 */
export const getSDGHistory = async (req, res) => {
    try {
        const userId = 1; // req.user.id; // TODO: Get from auth middleware
        
        // For now, return current score as history
        // In a real implementation, you'd store historical scores in database
        const currentScore = await SDGService.calculatePersonalSDGScore(userId);
        
        const history = [
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, currentScore.data.totalScore - 10) },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, currentScore.data.totalScore - 8) },
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, currentScore.data.totalScore - 5) },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, currentScore.data.totalScore - 3) },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), score: Math.max(0, currentScore.data.totalScore - 1) },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), score: currentScore.data.totalScore },
            { date: new Date().toISOString(), score: currentScore.data.totalScore }
        ];
        
        res.status(200).json({
            success: true,
            data: {
                history,
                trend: history[history.length - 1].score > history[0].score ? 'improving' : 
                       history[history.length - 1].score < history[0].score ? 'declining' : 'stable'
            }
        });
    } catch (error) {
        console.error('Error getting SDG history:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get SDG history'
        });
    }
};
