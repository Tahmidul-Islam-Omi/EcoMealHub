import * as UserService from '../services/userService.js';
import * as LogService from '../services/LogService.js';
import * as GeminiService from '../services/geminiService.js';



export const getUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const userProfile = await UserService.getProfileById(userId);
        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updated_data = req.body;
        const userProfile = await UserService.updateProfileById(userId, updated_data);
        res.json(userProfile);
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
}

export const generateAiPattern = async (req, res) =>{
    try {
        const userLogs = await LogService.getLogsByUserId(req.user.id);  

        const userLogsString = userLogs.map(log => JSON.stringify(log)).join("\n---\n");
        console.log(userLogsString);
        const LlmText = await GeminiService.analyzePatternFromText(userLogsString);
        console.log(LlmText);
        res.json(LlmText);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
        
    }
}

export const getAiPattern = async (req, res) => {
    try {

        const aiPattern = await UserService.getAnalysis(req.user.id);
        console.log(aiPattern);
        res.json(aiPattern);
        

        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}