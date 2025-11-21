import * as LogService from "../services/LogService.js";


export const getLogsByUserId = async (req, res) => {
    try {
        const userId = req.user.id; //! need to change from auth middleware later
        const logs = await LogService.getLogsByUserId(userId);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

export const createLogEntry = async (req, res) => {
    try {
        const userId = req.user.id; //! need to change from auth middleware later
        
        const { meal_type, calory, waste, cost, log_date , food_items } = req.body;
        
        const newLog = await LogService.createLogEntry(userId, { meal_type, calory, waste, cost, log_date, food_items });
        res.status(201).json(newLog );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}