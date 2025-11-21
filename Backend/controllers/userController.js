import * as UserService from '../services/userService.js';



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

// export const generateAiPattern 