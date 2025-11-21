import WasteEstimation from '../models/WasteEstimation.js';

// Category-based spoilage factors
const CATEGORY_FACTORS = {
    'fruits': 1.5,
    'vegetables': 1.5,
    'dairy': 1.3,
    'meat': 1.4,
    'fish': 1.4,
    'seafood': 1.4,
    'grains': 0.5,
    'pasta': 0.5,
    'rice': 0.5,
    'canned': 0.3,
    'frozen': 0.4,
    'bakery': 1.2,
    'default': 1.0
};

// Standard serving size in grams
const STANDARD_SERVING_SIZE = 100;

/**
 * Calculate expiration risk score (0-100)
 */
const calculateExpirationRisk = (daysRemaining) => {
    if (daysRemaining === null || daysRemaining === undefined) return 10;
    if (daysRemaining <= 0) return 100;
    if (daysRemaining <= 2) return 90;
    if (daysRemaining <= 5) return 60;
    if (daysRemaining <= 10) return 30;
    return 10;
};

/**
 * Calculate usage frequency risk (0-100)
 */
const calculateUsageFrequencyRisk = (consumptionCount, days = 30) => {
    const frequencyFactor = (consumptionCount / days) * 100;
    
    if (frequencyFactor > 50) return 10; // Used frequently, low risk
    if (frequencyFactor > 20) return 30;
    if (frequencyFactor > 10) return 50;
    if (frequencyFactor > 5) return 70;
    return 90; // Rarely used, high risk
};

/**
 * Calculate quantity risk (0-100)
 */
const calculateQuantityRisk = (quantity, avgConsumptionRate) => {
    if (!avgConsumptionRate || avgConsumptionRate === 0) return 50;
    
    const weeklyUsage = avgConsumptionRate * 7;
    
    if (quantity > weeklyUsage * 2) return 70;
    if (quantity > weeklyUsage) return 40;
    return 10;
};

/**
 * Get category factor for waste calculation
 */
const getCategoryFactor = (category) => {
    const normalizedCategory = category?.toLowerCase() || '';
    return CATEGORY_FACTORS[normalizedCategory] || CATEGORY_FACTORS.default;
};

/**
 * Calculate waste probability (0-1)
 */
const calculateWasteProbability = (expirationRisk, usageRisk, quantityRisk) => {
    const weightedScore = (expirationRisk * 0.4) + (usageRisk * 0.3) + (quantityRisk * 0.3);
    return weightedScore / 100; // Convert to 0-1 range
};

/**
 * Estimate waste for a single item
 */
const estimateItemWaste = (item, consumptionData, categoryWasteData) => {
    const daysRemaining = item.expiration_day;
    const expirationRisk = calculateExpirationRisk(daysRemaining);
    
    // Find consumption frequency for this item
    const itemConsumption = consumptionData.find(c => c.item_id === item.item_id);
    const consumptionCount = itemConsumption?.consumption_count || 0;
    const historicalWaste = itemConsumption?.avg_waste_percentage || 0;
    
    const usageRisk = calculateUsageFrequencyRisk(consumptionCount, 30);
    
    // Calculate average consumption rate (quantity per day)
    const avgConsumptionRate = consumptionCount > 0 ? item.quantity / 30 : 0;
    const quantityRisk = calculateQuantityRisk(item.quantity, avgConsumptionRate);
    
    // Calculate waste probability
    const wasteProbability = calculateWasteProbability(expirationRisk, usageRisk, quantityRisk);
    
    // Get category factor
    const categoryFactor = getCategoryFactor(item.category);
    
    // Find historical waste for this category
    const categoryWaste = categoryWasteData.find(c => c.category === item.category);
    const categoryHistoricalWaste = categoryWaste?.avg_waste_percentage || 0;
    
    // Adjust probability with historical data
    const adjustedProbability = Math.min(
        wasteProbability * categoryFactor + (historicalWaste / 200),
        1.0
    );
    
    // Calculate estimated waste in grams (assuming quantity is in grams or convertible)
    const quantityInGrams = convertToGrams(item.quantity, item.unit);
    const estimatedWasteGrams = quantityInGrams * adjustedProbability;
    
    // Calculate money loss
    const costPerGram = (item.cost || 0) / STANDARD_SERVING_SIZE;
    const estimatedMoneyLoss = estimatedWasteGrams * costPerGram;
    
    return {
        item_id: item.item_id,
        item_name: item.item_name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        days_remaining: daysRemaining,
        expiration_risk: Math.round(expirationRisk),
        usage_risk: Math.round(usageRisk),
        quantity_risk: Math.round(quantityRisk),
        waste_probability: Math.round(adjustedProbability * 100),
        estimated_waste_grams: Math.round(estimatedWasteGrams * 10) / 10,
        estimated_money_loss: Math.round(estimatedMoneyLoss * 100) / 100,
        risk_level: getRiskLevel(adjustedProbability),
        consumption_count: consumptionCount,
        historical_waste_percentage: Math.round(historicalWaste * 10) / 10
    };
};

/**
 * Convert quantity to grams
 */
const convertToGrams = (quantity, unit) => {
    const unitLower = unit?.toLowerCase() || 'g';
    
    const conversionFactors = {
        'g': 1,
        'gram': 1,
        'grams': 1,
        'kg': 1000,
        'kilogram': 1000,
        'kilograms': 1000,
        'lb': 453.592,
        'pound': 453.592,
        'pounds': 453.592,
        'oz': 28.3495,
        'ounce': 28.3495,
        'ounces': 28.3495,
        'ml': 1, // Approximate for liquids
        'l': 1000,
        'liter': 1000,
        'liters': 1000,
        'piece': 100, // Assume 100g per piece
        'pieces': 100,
        'unit': 100,
        'units': 100
    };
    
    return quantity * (conversionFactors[unitLower] || 100);
};

/**
 * Get risk level label
 */
const getRiskLevel = (probability) => {
    if (probability >= 0.7) return 'high';
    if (probability >= 0.3) return 'medium';
    return 'low';
};

/**
 * Get current waste estimation
 */
export const getCurrentWasteEstimation = async (userId) => {
    try {
        const inventory = await WasteEstimation.getUserInventoryWithDetails(userId);
        const consumptionData = await WasteEstimation.getConsumptionFrequency(userId, 30);
        const categoryWasteData = await WasteEstimation.getWasteByCategory(userId, 30);
        
        const estimations = inventory.map(item => 
            estimateItemWaste(item, consumptionData, categoryWasteData)
        );
        
        const totalWasteGrams = estimations.reduce((sum, item) => sum + item.estimated_waste_grams, 0);
        const totalMoneyLoss = estimations.reduce((sum, item) => sum + item.estimated_money_loss, 0);
        
        const highRiskItems = estimations.filter(item => item.risk_level === 'high');
        const mediumRiskItems = estimations.filter(item => item.risk_level === 'medium');
        const lowRiskItems = estimations.filter(item => item.risk_level === 'low');
        
        return {
            total_items: estimations.length,
            total_estimated_waste_grams: Math.round(totalWasteGrams * 10) / 10,
            total_estimated_money_loss: Math.round(totalMoneyLoss * 100) / 100,
            high_risk_count: highRiskItems.length,
            medium_risk_count: mediumRiskItems.length,
            low_risk_count: lowRiskItems.length,
            items: estimations.sort((a, b) => b.waste_probability - a.waste_probability)
        };
    } catch (error) {
        console.error('Error in getCurrentWasteEstimation:', error);
        throw new Error('Failed to calculate current waste estimation');
    }
};

/**
 * Get weekly waste projection
 */
export const getWeeklyWasteProjection = async (userId) => {
    try {
        const expiringItems = await WasteEstimation.getExpiringItems(userId, 7);
        const consumptionData = await WasteEstimation.getConsumptionFrequency(userId, 30);
        const categoryWasteData = await WasteEstimation.getWasteByCategory(userId, 30);
        
        const estimations = expiringItems.map(item => 
            estimateItemWaste(item, consumptionData, categoryWasteData)
        );
        
        const totalWasteGrams = estimations.reduce((sum, item) => sum + item.estimated_waste_grams, 0);
        const totalMoneyLoss = estimations.reduce((sum, item) => sum + item.estimated_money_loss, 0);
        
        return {
            period: 'weekly',
            days: 7,
            items_expiring: estimations.length,
            total_estimated_waste_grams: Math.round(totalWasteGrams * 10) / 10,
            total_estimated_money_loss: Math.round(totalMoneyLoss * 100) / 100,
            items: estimations.sort((a, b) => a.days_remaining - b.days_remaining)
        };
    } catch (error) {
        console.error('Error in getWeeklyWasteProjection:', error);
        throw new Error('Failed to calculate weekly waste projection');
    }
};

/**
 * Get monthly waste projection
 */
export const getMonthlyWasteProjection = async (userId) => {
    try {
        const expiringItems = await WasteEstimation.getExpiringItems(userId, 30);
        const consumptionData = await WasteEstimation.getConsumptionFrequency(userId, 30);
        const categoryWasteData = await WasteEstimation.getWasteByCategory(userId, 30);
        
        const estimations = expiringItems.map(item => 
            estimateItemWaste(item, consumptionData, categoryWasteData)
        );
        
        const totalWasteGrams = estimations.reduce((sum, item) => sum + item.estimated_waste_grams, 0);
        const totalMoneyLoss = estimations.reduce((sum, item) => sum + item.estimated_money_loss, 0);
        
        // Group by week
        const weeklyBreakdown = [
            { week: 1, items: estimations.filter(i => i.days_remaining <= 7) },
            { week: 2, items: estimations.filter(i => i.days_remaining > 7 && i.days_remaining <= 14) },
            { week: 3, items: estimations.filter(i => i.days_remaining > 14 && i.days_remaining <= 21) },
            { week: 4, items: estimations.filter(i => i.days_remaining > 21 && i.days_remaining <= 30) }
        ].map(week => ({
            week: week.week,
            items_count: week.items.length,
            estimated_waste_grams: Math.round(week.items.reduce((sum, i) => sum + i.estimated_waste_grams, 0) * 10) / 10,
            estimated_money_loss: Math.round(week.items.reduce((sum, i) => sum + i.estimated_money_loss, 0) * 100) / 100
        }));
        
        return {
            period: 'monthly',
            days: 30,
            items_expiring: estimations.length,
            total_estimated_waste_grams: Math.round(totalWasteGrams * 10) / 10,
            total_estimated_money_loss: Math.round(totalMoneyLoss * 100) / 100,
            weekly_breakdown: weeklyBreakdown,
            items: estimations.sort((a, b) => a.days_remaining - b.days_remaining)
        };
    } catch (error) {
        console.error('Error in getMonthlyWasteProjection:', error);
        throw new Error('Failed to calculate monthly waste projection');
    }
};

/**
 * Get actionable insights
 */
export const getWasteInsights = async (userId) => {
    try {
        const inventory = await WasteEstimation.getUserInventoryWithDetails(userId);
        const consumptionData = await WasteEstimation.getConsumptionFrequency(userId, 30);
        const categoryWasteData = await WasteEstimation.getWasteByCategory(userId, 30);
        const historicalWaste = await WasteEstimation.getTotalWaste(userId, 30);
        
        const estimations = inventory.map(item => 
            estimateItemWaste(item, consumptionData, categoryWasteData)
        );
        
        // Generate insights
        const insights = [];
        
        // Critical items (expiring soon)
        const criticalItems = estimations.filter(i => i.days_remaining !== null && i.days_remaining <= 2);
        if (criticalItems.length > 0) {
            insights.push({
                type: 'urgent',
                message: `${criticalItems.length} item(s) expiring within 2 days`,
                items: criticalItems.map(i => i.item_name),
                action: 'Use these items immediately to avoid waste'
            });
        }
        
        // High waste category
        const highWasteCategory = categoryWasteData.sort((a, b) => b.avg_waste_percentage - a.avg_waste_percentage)[0];
        if (highWasteCategory && highWasteCategory.avg_waste_percentage > 20) {
            insights.push({
                type: 'warning',
                message: `High waste in ${highWasteCategory.category} category`,
                percentage: Math.round(highWasteCategory.avg_waste_percentage * 10) / 10,
                action: `Consider buying less ${highWasteCategory.category} or using them more frequently`
            });
        }
        
        // Rarely used items
        const rarelyUsedItems = estimations.filter(i => i.consumption_count === 0 && i.days_remaining !== null && i.days_remaining <= 7);
        if (rarelyUsedItems.length > 0) {
            insights.push({
                type: 'info',
                message: `${rarelyUsedItems.length} item(s) never used and expiring soon`,
                items: rarelyUsedItems.map(i => i.item_name),
                action: 'Find recipes or donate these items'
            });
        }
        
        // Potential savings
        const potentialSavings = estimations.reduce((sum, i) => sum + i.estimated_money_loss, 0);
        if (potentialSavings > 0) {
            insights.push({
                type: 'savings',
                message: `Potential savings of $${Math.round(potentialSavings * 100) / 100}`,
                action: 'Follow the recommendations to reduce waste'
            });
        }
        
        return {
            insights,
            historical_data: {
                total_waste_percentage: Math.round((historicalWaste.total_waste_percentage || 0) * 10) / 10,
                total_money_wasted: Math.round((historicalWaste.total_money_wasted || 0) * 100) / 100,
                total_logs: historicalWaste.total_logs || 0
            },
            category_waste: categoryWasteData.map(c => ({
                category: c.category,
                avg_waste_percentage: Math.round(c.avg_waste_percentage * 10) / 10,
                log_count: c.log_count
            }))
        };
    } catch (error) {
        console.error('Error in getWasteInsights:', error);
        throw new Error('Failed to generate waste insights');
    }
};

/**
 * Get historical waste trends
 */
export const getWasteHistory = async (userId, days = 90) => {
    try {
        const historicalWaste = await WasteEstimation.getTotalWaste(userId, days);
        const categoryWasteData = await WasteEstimation.getWasteByCategory(userId, days);
        
        return {
            period_days: days,
            total_waste_percentage: Math.round((historicalWaste.total_waste_percentage || 0) * 10) / 10,
            total_money_wasted: Math.round((historicalWaste.total_money_wasted || 0) * 100) / 100,
            total_logs: historicalWaste.total_logs || 0,
            average_waste_per_log: historicalWaste.total_logs > 0 
                ? Math.round((historicalWaste.total_waste_percentage / historicalWaste.total_logs) * 10) / 10 
                : 0,
            category_breakdown: categoryWasteData.map(c => ({
                category: c.category,
                avg_waste_percentage: Math.round(c.avg_waste_percentage * 10) / 10,
                log_count: c.log_count
            })).sort((a, b) => b.avg_waste_percentage - a.avg_waste_percentage)
        };
    } catch (error) {
        console.error('Error in getWasteHistory:', error);
        throw new Error('Failed to retrieve waste history');
    }
};
