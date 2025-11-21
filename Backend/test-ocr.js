import { analyzeFoodItemsFromText } from './services/geminiService.js';

console.log('🧪 Testing OCR Text Analysis...');

const testText = "Milk 1 gallon $3.99\nBread 1 loaf $2.50\nBananas 2 lbs $2.99";

try {
  const result = await analyzeFoodItemsFromText(testText);
  console.log('✅ Result:', JSON.stringify(result, null, 2));
} catch (error) {
  console.error('❌ Error:', error.message);
}
