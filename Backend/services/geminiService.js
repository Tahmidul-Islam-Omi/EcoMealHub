import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes OCR-extracted text from food receipts/grocery lists and returns structured food item data
 * @param {string} ocrText - The text extracted from receipt/grocery list image
 * @returns {Promise<Object>} - Structured JSON object with food items
 */
export const analyzeFoodItemsFromText = async (ocrText) => {
  try {
    // Initialize with available free tier model
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash",
      generationConfig: {
        temperature: 0.1,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });

    // Create a concise prompt for food item extraction (optimized for free tier)
    const prompt = `Extract food items from this receipt/grocery text and return JSON only:

"${ocrText}"

Return format:
{
  "items": [
    {
      "item_name": "string or null",
      "quantity": "number or null", 
      "category": "string",
      "unit": "string or null",
      "cost": "number or null",
      "expiration_date": "YYYY-MM-DD or null"
    }
  ]
}

Rules:
- Only food items (ignore store info, totals, tax)
- Standardize names (proper case)
- Infer the category from the item name
- Extract individual item prices, not totals
- Use "pieces" if unit unclear
- Set null for missing data
- Return JSON only, no explanation`;

    // Generate response from Gemini with retry logic for rate limiting
    let result;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        break; // Success, exit retry loop
      } catch (error) {
        if (error.message.includes('429') && retryCount < maxRetries - 1) {
          // Rate limit hit, wait and retry
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
        } else {
          throw error; // Re-throw if not rate limit or max retries reached
        }
      }
    }
    
    const response = await result.response;
    const generatedText = response.text();

    // Parse the JSON response
    let parsedData;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse AI response as valid JSON');
    }

    // Validate the response structure
    if (!parsedData || !parsedData.items || !Array.isArray(parsedData.items)) {
      throw new Error('Invalid response structure from AI model');
    }

    // Validate and clean each item
    const processedItems = parsedData.items.map((item, index) => {
      return {
        item_name: item.item_name || null,
        quantity: item.quantity !== null && item.quantity !== undefined ? Number(item.quantity) : null,
        unit: item.unit || null,
        cost: item.cost !== null && item.cost !== undefined ? Number(item.cost) : null,
        expiration_date: item.expiration_date || null
      };
    }).filter(item => item.item_name); // Filter out items without names

    return {
      success: true,
      data: processedItems,
      message: `Successfully extracted ${processedItems.length} food items`
    };

  } catch (error) {
    console.error('Error in analyzeFoodItemsFromText:', error);
    
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to analyze food items from text',
      error: error.message
    };
  }
};

/**
 * Utility function to validate and sanitize food item data
 * @param {Object} item - Food item object to validate
 * @returns {Object} - Validated and sanitized item
 */
export const validateFoodItem = (item) => {
  return {
    item_name: typeof item.item_name === 'string' ? item.item_name.trim() : null,
    quantity: item.quantity && !isNaN(item.quantity) ? Number(item.quantity) : null,
    unit: typeof item.unit === 'string' ? item.unit.toLowerCase().trim() : null,
    cost: item.cost && !isNaN(item.cost) ? Number(item.cost) : null,
    expiration_date: item.expiration_date && /^\d{4}-\d{2}-\d{2}$/.test(item.expiration_date) ? item.expiration_date : null
  };
};

/**
 * Helper function to check if Gemini API is configured
 * @returns {boolean} - True if API key is available
 */
export const isGeminiConfigured = () => {
  return !!process.env.GEMINI_API_KEY;
};

/**
 * List available models for debugging
 * @returns {Promise<Array>} - List of available models
 */
export const listAvailableModels = async () => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.models || [];
  } catch (error) {
    console.error('Error listing models:', error);
    return [];
  }
};


/**
 * @param {string} consumptions_log - Text log of food consumptions
 * @returns {Promise<Object>} - Structured JSON object with food items
 */
export const analyzePatternFromText = async (consumptions_log) => {
  try {
    // Initialize with available free tier model
    const model = genAI.getGenerativeModel({ 
      model: "models/gemini-2.5-flash",
      generationConfig: {
        temperature: 0.3,
        topK: 1,
        topP: 1,
        maxOutputTokens: 3072,
      }
    });

    // find weekly trends in the consumption log, detect over consumption or under consumption of certain food items,
    //predict items likely to be wasted in 3-7 days using user pattern. flag any imbalance patterns(e.g. low vegies)
    
    const prompt = `
You are an expert food consumption analyst and nutrition advisor. Analyze the following user's food consumption log and provide detailed insights.

CONSUMPTION LOG:
${consumptions_log}

Your task is to:
1. Extract all food items with their quantities, units, costs, and expiration dates
2. Identify weekly consumption trends and patterns
3. Detect over-consumption or under-consumption of specific food categories
4. Predict items likely to be wasted in the next 3-7 days based on user patterns
5. Flag any nutritional imbalance patterns (e.g., low vegetables, high processed foods, etc.)
6. Predict likely nutrient deficiencies
7. Suggests food/meals to fill the gaps.

Return your analysis in the following JSON format:
{
  
  "trends": {
    "over_consumed": ["list of food items consumed excessively"],
    "under_consumed": ["list of food categories consumed insufficiently"],
    "waste_risk": [
      {
        "item": "string",
        "reason": "string (why it's at risk of being wasted)",
        "days_until_waste": number
      }
    ]
  },
  "nutritional_flags": [
    {
      "issue": "string (e.g., 'Low vegetable intake')",
      "severity": "string (low, medium, high)",
      "recommendation": "string"
    }
  ],
  "gap_prediction" :
  {
    "nutrient_deficiencies" : ["Iron", "vitamin D", "calcium"],
    "suggested_foods" : ["papaya", "guava" ,...]
  },

  "summary": "string (brief overview of consumption patterns)"
}

Rules:
- If a value is unknown or not mentioned, use null
- Ensure all dates are in YYYY-MM-DD format
- Be precise with quantities and units
- Provide actionable recommendations
- Consider typical shelf life and expiration patterns for predictions

Return ONLY valid JSON, no additional text or markdown.
    `;

    // Generate response from Gemini with retry logic for rate limiting
    let result;
    let retryCount = 0;
    const maxRetries = 3;
    console.log("under the hood");
    
    
    while (retryCount < maxRetries) {
      try {
        result = await model.generateContent(prompt);
        break; // Success, exit retry loop
      } catch (error) {
        if (error.message.includes('429') && retryCount < maxRetries - 1) {
          // Rate limit hit, wait and retry
          const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${retryCount + 1}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          retryCount++;
        } else {
          throw error; // Re-throw if not rate limit or max retries reached
        }
      }
    }
    
    const response = result.response;
    const generatedText = response.text();

    console.log(generatedText);
    

    // Parse the JSON response
    let parsedData;
    try {
      // Clean the response text (remove any markdown formatting)
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();

      console.log(cleanedText);
      
      parsedData = JSON.parse(cleanedText);
      console.log("parsed data :". parsedData);
      
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse AI response as valid JSON');
    }

    // Validate the response structure
    if (!parsedData || !parsedData.trends || !parsedData.nutritional_flags) {
      throw new Error('Invalid response structure from AI model');
    }

    
    return {
      success: true,
      data: parsedData,
      message: `Successfully analyzed consumption patterns`
    };

  } catch (error) {
    console.error('Error in analyzeFoodItemsFromText:', error);
    
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to analyze food items from text',
      error: error.message
    };
  }
};
