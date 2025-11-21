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
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
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

**Week Dates (Saturday to Friday):**
${datesList}

**Requirements:**
1. Generate meals for breakfast, lunch, dinner, and snack for each day
2. Prioritize using items from the available inventory
3. Stay within the weekly budget of $${weekly_budget || 100}
4. Consider household size of ${household_size || 1} people
5. Respect dietary preference: ${diet_preference || 'none'}
6. If budget is insufficient, fill as many meals as possible within budget
7. Each meal should have realistic calorie counts
8. Meal titles should be simple and clear

**Output Format (MUST be valid JSON):**
{
  "meals": [
    {
      "date": "YYYY-MM-DD",
      "meal_type": "breakfast|lunch|dinner|snack",
      "meal_title": "Meal Name",
      "calories": 450
    }
  ]
}

Generate the meal plan now in the exact JSON format above. Do not include any additional text or explanation, only the JSON object.`;
    }
}

export default new GeminiService();
