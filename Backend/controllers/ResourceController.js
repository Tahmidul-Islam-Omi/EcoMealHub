import { ResourceSchema } from "../models/ResourcesModel.js";
import * as ResourceService from "../services/ResourceService.js";

export const getResources = async (req, res) => {
    try {
        const resources = await ResourceService.getAllResources();
        res.json(resources);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

