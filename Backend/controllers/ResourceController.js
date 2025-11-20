import { ResourceSchema } from "../models/Resources.js";
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

export const createResource = async (req, res) => {
    try {
        const parsedData = ResourceSchema.parse(req.body);
        const newResource = await ResourceService.createResource(parsedData);
        res.status(201).json(newResource);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

