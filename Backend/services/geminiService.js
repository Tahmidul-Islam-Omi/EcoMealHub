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
