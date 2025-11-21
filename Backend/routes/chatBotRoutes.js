import express from 'express';
const router = express.Router();

import { GoogleGenAI } from "@google/genai";
import { ChatBotMiddleware } from '../middlewares/index.js';

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Chatbot endpoint
router.post('/', ChatBotMiddleware.generateRuleTips, async (req, res) => {
    try {
        const { memory, messages } = req.body;
        const ruleTips = req.ruleTips || "";
        const retrieved = [];

        const prompt = `
            You are NourishBot, a sustainability, nutrition, and food waste reduction assistant.

            Capabilities:
            - Food waste reduction advice
            - Nutrition balancing
            - Budget meal planning
            - Creative leftover transformations
            - Local food sharing guidance
            - Environmental impact explanations

            Session memory:
            ${JSON.stringify(memory)}
            
            Retrieved Info:
            ${JSON.stringify(retrieved || [])}

            Rules / Expert Tips:
            ${req.ruleTips}

            User message:
            ${messages}

            Respond as NourishBot. Don't use any unnecessary symbols such as *, try to use newline character or \\n instead.
            Response should be concise and informative(within 120 words).
            `;


        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        res.json({ reply: response.text });
    } catch (error) {
        console.error('Error in chatbot endpoint:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;