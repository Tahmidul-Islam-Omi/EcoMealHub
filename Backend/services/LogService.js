import Logs from '../models/Logs.js';

export const getLogsByUserId = async (user_id)=>{
    try {
        const data = await Logs.getLogsByUserId(user_id);
        console.log(data);
        return data;
        
    } catch (error) {
        console.log(err);
        return [];
        
    }
}

export const createLogEntry = async (user_id, log_data) => {
    try {
        console.log(log_data);
        const { meal_type, calory, waste, cost, log_date, food_items } = log_data;
        const newLog = await Logs.createLogEntry(user_id, meal_type, calory, waste, cost, log_date, food_items);
        return newLog;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}
