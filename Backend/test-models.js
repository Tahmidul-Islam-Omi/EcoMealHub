import { listAvailableModels } from './services/geminiService.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Listing available Gemini models...');
console.log('API Key:', process.env.GEMINI_API_KEY ? 'Set' : 'Not set');

try {
  const models = await listAvailableModels();
  console.log('✅ Available models:');
  models.forEach((model, index) => {
    console.log(`${index + 1}. ${model.name}`);
  });
} catch (error) {
  console.error('❌ Error listing models:', error.message);
}
