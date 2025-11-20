
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

export const getResourcesLimited = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided
        console.log(limit);
        
        const resources = await ResourceService.getAllResourcesLimited(limit);
        // console.log(resources);
        
        
        res.json(resources);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createResource = async (req, res) => {
    try {
        const parsedData = {
            ...req.body,
            user_id: req.body.user_id ? parseInt(req.body.user_id) : null,
            url: req.body.url || null,
            type : req.body.type || 'article',
            accepted: false
        };
        
        const newResource = await ResourceService.createResource(parsedData);
        console.log("test test");
        res.status(201).json(newResource);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getResourcesByUser = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const resources = await ResourceService.getResourcesByUser(userId);
        res.json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
