import User from "../models/User.js";

export const getProfileById = async (userId) => {
    const user = await User.getProfileById(userId);
    return user;
}


export const updateProfileById = async (userId, update_data) => {
    const user = await User.updateProfileById(userId, update_data);
    return user;
}


export const getAnalysis = async (user_id) => {
    const analysis = await User.getAnalysisById(user_id);
    return analysis;

}
