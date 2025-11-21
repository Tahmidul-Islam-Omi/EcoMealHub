import * as inventoryService from './inventoryService.js';
import * as LogService from './LogService.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * SDG Impact Scoring Engine
 * Evaluates user progress in waste reduction and nutrition improvement
 */
export class SDGService {
    /**
     * Calculate Personal SDG Score (0-100 scale)
     * @param {number} userId - User ID
     * @returns {Promise<Object>} - SDG score and breakdown
     */
    static async calculatePersonalSDGScore(userId) {
        try {
            console.log(`Calculating SDG score for user: ${userId}`);
            
            // Get user data for the last 30 days
            const inventoryData = await inventoryService.getAllInventoryByUser(userId);
            const consumptionLogs = await LogService.getLogsByUserId(userId);
            
            console.log(`Found ${inventoryData.length} inventory items and ${consumptionLogs.length} logs`);
            
            // Filter logs for last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            const recentLogs = consumptionLogs.filter(log => 
                new Date(log.created_at || log.log_date) >= thirtyDaysAgo
            );

            console.log(`Filtered to ${recentLogs.length} recent logs`);

            // Calculate individual SDG components with enhanced logic
            const wasteReductionScore = this.calculateWasteReductionScore(inventoryData, recentLogs);
            const nutritionScore = this.calculateNutritionScore(recentLogs, inventoryData);
            const sustainabilityScore = this.calculateSustainabilityScore(inventoryData, recentLogs);
            const budgetEfficiencyScore = this.calculateBudgetEfficiencyScore(recentLogs, inventoryData);

            // Weighted average calculation
            const totalScore = Math.round(
                (wasteReductionScore * 0.30) +    // 30% - Waste reduction
                (nutritionScore * 0.25) +         // 25% - Nutrition quality
                (sustainabilityScore * 0.25) +    // 25% - Sustainability practices
                (budgetEfficiencyScore * 0.20)    // 20% - Budget efficiency
            );

            return {
                success: true,
                data: {
                    totalScore: Math.min(100, Math.max(0, totalScore)),
                    breakdown: {
                        wasteReduction: {
                            score: wasteReductionScore,
                            weight: 30,
                            description: "Food waste minimization through inventory management"
                        },
                        nutrition: {
                            score: nutritionScore,
                            weight: 25,
                            description: "Nutritional quality and meal planning"
                        },
                        sustainability: {
                            score: sustainabilityScore,
                            weight: 25,
                            description: "Sustainable food choices and diversity"
                        },
                        budgetEfficiency: {
                            score: budgetEfficiencyScore,
                            weight: 20,
                            description: "Cost-effective food management"
                        }
                    },
                    metrics: {
                        totalInventoryItems: inventoryData.length,
                        totalLogs: consumptionLogs.length,
                        recentLogs: recentLogs.length,
                        inventoryTurnover: inventoryData.length > 0 ? (recentLogs.length / inventoryData.length) : 0
                    },
                    lastUpdated: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('Error calculating SDG score:', error);
            return {
                success: false,
                message: error.message || 'Failed to calculate SDG score',
                data: {
                    totalScore: 0,
                    breakdown: {
                        wasteReduction: { score: 0, weight: 30, description: "Data unavailable" },
                        nutrition: { score: 0, weight: 25, description: "Data unavailable" },
                        sustainability: { score: 0, weight: 25, description: "Data unavailable" },
                        budgetEfficiency: { score: 0, weight: 20, description: "Data unavailable" }
                    }
                }
            };
        }
    }

    /**
     * Enhanced waste reduction score based on inventory management and consumption logs
     */
    static calculateWasteReductionScore(inventory, logs) {
        let score = 50; // Base score
        let details = {
            expiredItemsPenalty: 0,
            soonExpiringBonus: 0,
            inventoryTurnoverBonus: 0,
            consistentUsageBonus: 0
        };

        if (inventory.length === 0) {
            return { score: 30, details: { ...details, reason: "No inventory data" } };
        }

        // 1. Penalty for expired items (based on inventory tracking)
        const currentDate = new Date();
        const expiredItems = inventory.filter(item => {
            if (!item.expiration_date && !item.expiration_days) return false;
            
            let expiryDate;
            if (item.expiration_date) {
                expiryDate = new Date(item.expiration_date);
            } else {
                expiryDate = new Date(item.created_at);
                expiryDate.setDate(expiryDate.getDate() + (item.expiration_days || 7));
            }
            return expiryDate < currentDate;
        });
        
        const expiredPercentage = (expiredItems.length / inventory.length) * 100;
        const expiredPenalty = Math.min(30, expiredPercentage * 2); // Max 30 point penalty
        score -= expiredPenalty;
        details.expiredItemsPenalty = expiredPenalty;

        // 2. Bonus for managing soon-to-expire items
        const soonExpiringItems = inventory.filter(item => {
            if (!item.expiration_date && !item.expiration_days) return false;
            
            let expiryDate;
            if (item.expiration_date) {
                expiryDate = new Date(item.expiration_date);
            } else {
                expiryDate = new Date(item.created_at);
                expiryDate.setDate(expiryDate.getDate() + (item.expiration_days || 7));
            }
            
            const daysUntilExpiry = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
            return daysUntilExpiry >= 0 && daysUntilExpiry <= 3;
        });

        // Check if user consumed items recently (good practice)
        const recentConsumption = logs.filter(log => {
            const logDate = new Date(log.created_at || log.log_date);
            const daysSinceLog = Math.ceil((currentDate - logDate) / (1000 * 60 * 60 * 24));
            return daysSinceLog <= 7;
        });

        if (soonExpiringItems.length > 0 && recentConsumption.length > 0) {
            const soonExpiringBonus = Math.min(20, soonExpiringItems.length * 5);
            score += soonExpiringBonus;
            details.soonExpiringBonus = soonExpiringBonus;
        }

        // 3. Inventory turnover rate (frequent consumption is good)
        if (logs.length > 0) {
            const turnoverRate = logs.length / inventory.length;
            if (turnoverRate > 0.5) {
                const turnoverBonus = Math.min(15, turnoverRate * 10);
                score += turnoverBonus;
                details.inventoryTurnoverBonus = turnoverBonus;
            }
        }

        // 4. Consistent usage pattern (regular logging shows planning)
        if (logs.length >= 5) {
            const logDates = logs.map(log => new Date(log.created_at || log.log_date));
            const dateRange = Math.max(...logDates) - Math.min(...logDates);
            const daysSpanned = Math.ceil(dateRange / (1000 * 60 * 60 * 24));
            
            if (daysSpanned > 0) {
                const avgLogsPerDay = logs.length / daysSpanned;
                if (avgLogsPerDay >= 0.5 && avgLogsPerDay <= 3) { // Reasonable logging frequency
                    const consistencyBonus = 10;
                    score += consistencyBonus;
                    details.consistentUsageBonus = consistencyBonus;
                }
            }
        }

        return {
            score: Math.min(100, Math.max(0, Math.round(score))),
            details
        };
    }

    /**
     * Enhanced nutrition score based on consumption logs and inventory variety
     */
    static calculateNutritionScore(logs, inventory) {
        let score = 50; // Base score
        let details = {
            calorieBalanceBonus: 0,
            mealFrequencyBonus: 0,
            inventoryDiversityBonus: 0,
            costEfficiencyBonus: 0
        };

        if (logs.length === 0) {
            return { score: 30, details: { ...details, reason: "No consumption logs" } };
        }

        // 1. Calorie balance assessment
        const totalCalories = logs.reduce((sum, log) => sum + (parseFloat(log.calories) || parseFloat(log.calory) || 0), 0);
        const avgDailyCalories = totalCalories / Math.max(1, logs.length);

        // Optimal calorie range per meal (assuming 3 meals per day: 600-800 calories per meal)
        if (avgDailyCalories >= 400 && avgDailyCalories <= 1000) {
            const calorieBonus = 20;
            score += calorieBonus;
            details.calorieBalanceBonus = calorieBonus;
        } else if (avgDailyCalories < 200 || avgDailyCalories > 1200) {
            score -= 10; // Penalty for extreme values
        }

        // 2. Meal frequency and consistency
        const uniqueDays = new Set(logs.map(log => {
            const date = new Date(log.created_at || log.log_date);
            return date.toDateString();
        })).size;
        
        const mealsPerDay = logs.length / Math.max(1, uniqueDays);
        if (mealsPerDay >= 1.5 && mealsPerDay <= 4) {
            const frequencyBonus = Math.min(15, Math.round(mealsPerDay * 5));
            score += frequencyBonus;
            details.mealFrequencyBonus = frequencyBonus;
        }

        // 3. Inventory diversity (variety indicates balanced nutrition)
        if (inventory.length > 0) {
            const uniqueCategories = new Set(
                inventory.map(item => item.category).filter(Boolean)
            ).size;
            
            const uniqueItems = new Set(
                inventory.map(item => item.item_name?.toLowerCase()).filter(Boolean)
            ).size;

            const diversityScore = Math.min(20, (uniqueCategories * 3) + (uniqueItems * 0.5));
            score += diversityScore;
            details.inventoryDiversityBonus = diversityScore;
        }

        // 4. Cost efficiency per calorie (budget-conscious nutrition)
        const totalCost = logs.reduce((sum, log) => sum + (parseFloat(log.cost) || 0), 0);
        if (totalCalories > 0 && totalCost > 0) {
            const costPerCalorie = totalCost / totalCalories;
            if (costPerCalorie <= 0.02) { // Less than 2 cents per calorie
                const efficiencyBonus = 15;
                score += efficiencyBonus;
                details.costEfficiencyBonus = efficiencyBonus;
            }
        }

        return {
            score: Math.min(100, Math.max(0, Math.round(score))),
            details
        };
    }

    /**
     * Enhanced sustainability score based on inventory choices and consumption patterns
     */
    static calculateSustainabilityScore(inventory, logs) {
        let score = 50; // Base score
        let details = {
            freshProduceBonus: 0,
            varietyBonus: 0,
            seasonalityBonus: 0,
            trackingConsistencyBonus: 0
        };

        if (inventory.length === 0) {
            return { score: 40, details: { ...details, reason: "No inventory data" } };
        }

        // 1. Fresh produce percentage (fruits and vegetables)
        const freshProduceCategories = ['vegetables', 'fruits', 'produce', 'fresh'];
        const freshProduce = inventory.filter(item => {
            const category = item.category?.toLowerCase() || '';
            return freshProduceCategories.some(cat => category.includes(cat));
        });
        
        const freshProducePercentage = (freshProduce.length / inventory.length) * 100;
        let produceBonus = 0;
        if (freshProducePercentage >= 40) {
            produceBonus = 25; // High fresh produce
        } else if (freshProducePercentage >= 25) {
            produceBonus = 15; // Moderate fresh produce
        } else if (freshProducePercentage >= 15) {
            produceBonus = 8; // Some fresh produce
        }
        score += produceBonus;
        details.freshProduceBonus = produceBonus;

        // 2. Food category variety (diverse diet is more sustainable)
        const uniqueCategories = new Set(
            inventory.map(item => item.category?.toLowerCase()).filter(Boolean)
        ).size;
        
        const varietyBonus = Math.min(20, uniqueCategories * 4);
        score += varietyBonus;
        details.varietyBonus = varietyBonus;

        // 3. Seasonality bonus (shorter expiration items suggest fresh, seasonal food)
        const shortExpirationItems = inventory.filter(item => {
            if (item.expiration_days) {
                return item.expiration_days <= 7; // Fresh items expire quickly
            }
            if (item.expiration_date) {
                const expiryDate = new Date(item.expiration_date);
                const createdDate = new Date(item.created_at);
                const daysDiff = Math.ceil((expiryDate - createdDate) / (1000 * 60 * 60 * 24));
                return daysDiff <= 7;
            }
            return false;
        });

        const seasonalPercentage = (shortExpirationItems.length / inventory.length) * 100;
        if (seasonalPercentage >= 30) {
            const seasonalBonus = 15;
            score += seasonalBonus;
            details.seasonalityBonus = seasonalBonus;
        }

        // 4. Consistent tracking shows sustainable mindset
        if (logs.length >= 10) {
            const trackingBonus = Math.min(15, Math.floor(logs.length / 5));
            score += trackingBonus;
            details.trackingConsistencyBonus = trackingBonus;
        }

        return {
            score: Math.min(100, Math.max(0, Math.round(score))),
            details
        };
    }

    /**
     * Enhanced budget efficiency score based on cost management and value
     */
    static calculateBudgetEfficiencyScore(logs, inventory) {
        let score = 50; // Base score
        let details = {
            costPerMealBonus: 0,
            spendingConsistencyBonus: 0,
            valueEfficiencyBonus: 0,
            inventoryValueBonus: 0
        };

        if (logs.length === 0) {
            return { score: 40, details: { ...details, reason: "No consumption logs" } };
        }

        // 1. Cost per meal efficiency
        const totalCost = logs.reduce((sum, log) => sum + (parseFloat(log.cost) || 0), 0);
        const avgCostPerMeal = totalCost / logs.length;

        if (avgCostPerMeal <= 4) {
            details.costPerMealBonus = 25; // Excellent efficiency
        } else if (avgCostPerMeal <= 7) {
            details.costPerMealBonus = 15; // Good efficiency
        } else if (avgCostPerMeal <= 10) {
            details.costPerMealBonus = 8; // Fair efficiency
        } else {
            details.costPerMealBonus = -5; // Poor efficiency
        }
        score += details.costPerMealBonus;

        // 2. Spending consistency (predictable budget management)
        const costs = logs.map(log => parseFloat(log.cost) || 0).filter(cost => cost > 0);
        if (costs.length > 3) {
            const avgCost = costs.reduce((a, b) => a + b, 0) / costs.length;
            const variance = costs.reduce((sum, cost) => sum + Math.pow(cost - avgCost, 2), 0) / costs.length;
            const standardDeviation = Math.sqrt(variance);
            const coefficientOfVariation = avgCost > 0 ? standardDeviation / avgCost : 1;
            
            if (coefficientOfVariation <= 0.3) { // Low variance
                const consistencyBonus = 15;
                score += consistencyBonus;
                details.spendingConsistencyBonus = consistencyBonus;
            }
        }

        // 3. Value efficiency (cost vs calories and nutrition)
        const totalCalories = logs.reduce((sum, log) => sum + (parseFloat(log.calories) || parseFloat(log.calory) || 0), 0);
        if (totalCalories > 0 && totalCost > 0) {
            const costPerCalorie = totalCost / totalCalories;
            if (costPerCalorie <= 0.015) { // Excellent value
                details.valueEfficiencyBonus = 15;
            } else if (costPerCalorie <= 0.025) { // Good value
                details.valueEfficiencyBonus = 10;
            } else if (costPerCalorie <= 0.035) { // Fair value
                details.valueEfficiencyBonus = 5;
            }
            score += details.valueEfficiencyBonus;
        }

        // 4. Inventory cost management
        if (inventory.length > 0) {
            const inventoryWithCost = inventory.filter(item => item.cost || item.custom_cost);
            const avgInventoryCost = inventoryWithCost.reduce((sum, item) => {
                return sum + (parseFloat(item.cost) || parseFloat(item.custom_cost) || 0);
            }, 0) / Math.max(1, inventoryWithCost.length);

            if (avgInventoryCost > 0 && avgInventoryCost <= avgCostPerMeal * 1.5) {
                const inventoryBonus = 10; // Good inventory cost management
                score += inventoryBonus;
                details.inventoryValueBonus = inventoryBonus;
            }
        }

        return {
            score: Math.min(100, Math.max(0, Math.round(score))),
            details
        };
    }

    /**
     * Generate weekly insights using AI
     */
    static async generateWeeklyInsights(userId) {
        try {
            const scoreData = await this.calculatePersonalSDGScore(userId);
            const inventoryData = await inventoryService.getAllInventoryByUser(userId);
            const logs = await LogService.getLogsByUserId(userId);

            // Get recent logs (last 7 days)
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const recentLogs = logs.filter(log => new Date(log.created_at || log.log_date) >= weekAgo);

            const model = genAI.getGenerativeModel({ 
                model: "models/gemini-2.5-flash"
            });

            const prompt = `Analyze this user's food sustainability data and provide weekly insights:

SDG Score: ${scoreData.data.totalScore}/100
Score Breakdown:
- Waste Reduction: ${scoreData.data.breakdown.wasteReduction.score}/100
- Nutrition: ${scoreData.data.breakdown.nutrition.score}/100  
- Sustainability: ${scoreData.data.breakdown.sustainability.score}/100
- Budget Efficiency: ${scoreData.data.breakdown.budgetEfficiency.score}/100

Current Inventory: ${inventoryData.length} items
Weekly Consumption: ${recentLogs.length} meals logged
Total Logs: ${logs.length} meals
Average Weekly Spending: $${recentLogs.reduce((sum, log) => sum + (parseFloat(log.cost) || 0), 0).toFixed(2)}

Generate insights in this JSON format:
{
  "weeklyScore": number,
  "improvements": [
    {
      "category": "waste" | "nutrition" | "sustainability" | "budget",
      "insight": "specific observation about user's performance",
      "impact": "high" | "medium" | "low"
    }
  ],
  "achievements": [
    "specific positive accomplishments this week"
  ],
  "nextSteps": [
    {
      "action": "specific actionable recommendation",
      "expectedImprovement": "potential score increase (e.g., '+10 points')",
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "weeklyTrend": "improving" | "stable" | "declining"
}

Focus on specific, actionable insights. Mention food categories, spending patterns, and waste reduction opportunities.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const generatedText = response.text();

            // Parse AI response
            let insights;
            try {
                const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
                insights = JSON.parse(cleanedText);
            } catch (parseError) {
                console.error('Error parsing AI insights:', parseError);
                // Fallback insights
                insights = this.generateFallbackInsights(scoreData.data, inventoryData, recentLogs);
            }

            return {
                success: true,
                data: {
                    ...insights,
                    generatedAt: new Date().toISOString(),
                    scoreData: scoreData.data
                }
            };

        } catch (error) {
            console.error('Error generating weekly insights:', error);
            throw new Error('Failed to generate weekly insights');
        }
    }

    /**
     * Generate fallback insights when AI fails
     */
    static generateFallbackInsights(scoreData, inventory, recentLogs) {
        const improvements = [];
        const nextSteps = [];
        const achievements = [];

        // Analyze each component and suggest improvements
        if (scoreData.breakdown.wasteReduction.score < 70) {
            improvements.push({
                category: "waste",
                insight: `With ${inventory.length} items in inventory, focus on using items before they expire`,
                impact: "high"
            });
            nextSteps.push({
                action: "Check expiration dates and plan meals using items expiring in 2-3 days",
                expectedImprovement: "+15 points",
                difficulty: "easy"
            });
        } else {
            achievements.push("Excellent waste management with your current inventory");
        }

        if (scoreData.breakdown.nutrition.score < 70) {
            improvements.push({
                category: "nutrition",
                insight: `Logged ${recentLogs.length} meals this week - aim for more balanced nutrition`,
                impact: "medium"
            });
            nextSteps.push({
                action: "Add more vegetables and fruits to your grocery list",
                expectedImprovement: "+12 points",
                difficulty: "easy"
            });
        }

        if (scoreData.breakdown.sustainability.score < 70) {
            improvements.push({
                category: "sustainability",
                insight: "Increase food variety and fresh produce in your inventory",
                impact: "medium"
            });
            nextSteps.push({
                action: "Focus on seasonal fruits and vegetables for your next shopping trip",
                expectedImprovement: "+10 points",
                difficulty: "medium"
            });
        }

        if (scoreData.breakdown.budgetEfficiency.score < 70) {
            improvements.push({
                category: "budget",
                insight: "Optimize your food spending for better cost efficiency",
                impact: "medium"
            });
            nextSteps.push({
                action: "Plan meals around cost-effective ingredients like grains and legumes",
                expectedImprovement: "+8 points",
                difficulty: "easy"
            });
        }

        if (recentLogs.length >= 5) {
            achievements.push("Consistent meal logging shows great tracking habits");
        }

        if (inventory.length >= 10) {
            achievements.push("Well-stocked inventory shows good meal planning");
        }

        return {
            weeklyScore: scoreData.totalScore,
            improvements,
            achievements,
            nextSteps,
            weeklyTrend: scoreData.totalScore >= 70 ? "stable" : "improving"
        };
    }

    /**
     * Get SDG goals and targets
     */
    static getSDGTargets() {
        return {
            success: true,
            data: {
                targets: [
                    {
                        id: "2.1",
                        title: "End Hunger",
                        description: "Ensure access to safe, nutritious food",
                        userAction: "Maintain balanced nutrition in your meals"
                    },
                    {
                        id: "2.2", 
                        title: "End Malnutrition",
                        description: "Address all forms of malnutrition",
                        userAction: "Track and improve your dietary diversity"
                    },
                    {
                        id: "12.3",
                        title: "Reduce Food Waste", 
                        description: "Halve global food waste at retail and consumer level",
                        userAction: "Minimize food waste through better planning"
                    },
                    {
                        id: "3.4",
                        title: "Promote Well-being",
                        description: "Reduce premature mortality from non-communicable diseases",
                        userAction: "Maintain healthy eating patterns"
                    }
                ],
                scoreMapping: {
                    "90-100": "SDG Champion - Leading by example",
                    "75-89": "SDG Achiever - Making significant impact", 
                    "60-74": "SDG Contributor - Good progress",
                    "45-59": "SDG Learner - Room for improvement",
                    "0-44": "SDG Beginner - Starting your journey"
                }
            }
        };
    }
}
