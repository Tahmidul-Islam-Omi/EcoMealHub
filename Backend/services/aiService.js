import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not defined in environment variables');
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async generateWeeklyMealPlan(userData, inventoryItems, weekDates) {
        const prompt = this.buildPrompt(userData, inventoryItems, weekDates);
        
        try {
            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const text = response.text();
            
            // Parse JSON from response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Failed to parse meal plan from AI response');
            }
            
            const mealPlan = JSON.parse(jsonMatch[0]);
            return mealPlan;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw new Error('Failed to generate meal plan from AI');
        }
    }

    buildPrompt(userData, inventoryItems, weekDates) {
        const { weekly_budget, household_size, diet_preference } = userData;
        
        const inventoryList = inventoryItems.map(item => 
            `- ${item.item_name}: ${item.quantity} ${item.unit} (Cost: $${item.cost || item.custom_cost || 0})`
        ).join('\n');

        const datesList = weekDates.map(d => d.toISOString().split('T')[0]).join(', ');

        return `You are a meal planning AI assistant. Generate a weekly meal plan based on the following constraints:

**User Information:**
- Household Size: ${household_size || 1} people
- Weekly Budget: $${weekly_budget || 100}
- Dietary Preference: ${diet_preference || 'No specific preference'}

**Available Inventory:**
${inventoryList || 'No inventory items available'}

**Week Dates (Saturday to Friday) - 7 DAYS:**
${datesList}

**CRITICAL Requirements:**
1. Generate EXACTLY 4 meals (breakfast, lunch, dinner, snack) for EACH of the 7 days above = 28 meals total
2. Use the EXACT dates provided above in YYYY-MM-DD format
3. Prioritize using items from the available inventory
4. Stay within the weekly budget of $${weekly_budget || 100}
5. Consider household size of ${household_size || 1} people
6. Respect dietary preference: ${diet_preference || 'none'}
7. Each meal should have realistic calorie counts (breakfast: 300-500, lunch: 400-600, dinner: 500-800, snack: 100-200)
8. Meal titles should be simple and clear (e.g., "Oatmeal with Berries", "Grilled Chicken Salad")

**Output Format (MUST be valid JSON with exactly 28 meals):**
{
  "meals": [
    {
      "date": "YYYY-MM-DD",
      "meal_type": "breakfast",
      "meal_title": "Meal Name",
      "calories": 450
    },
    {
      "date": "YYYY-MM-DD",
      "meal_type": "lunch",
      "meal_title": "Meal Name",
      "calories": 550
    },
    {
      "date": "YYYY-MM-DD",
      "meal_type": "dinner",
      "meal_title": "Meal Name",
      "calories": 650
    },
    {
      "date": "YYYY-MM-DD",
      "meal_type": "snack",
      "meal_title": "Meal Name",
      "calories": 150
    }
    // ... repeat for all 7 days (28 meals total)
  ]
}

Generate the complete meal plan now with all 28 meals in the exact JSON format above. Do not include any additional text or explanation, only the JSON object.`;
    }
}

export default new GeminiService();
