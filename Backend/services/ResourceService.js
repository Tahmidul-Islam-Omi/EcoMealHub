import db from "../config/db.js";
import { ResourceTable } from "../models/ResourcesModel.js";

export const getAllResources = async () => {
    const { data, error } = await db
        .from(ResourceTable)
        .select("*");

    if (error) {
        throw new Error(error.message);
    }
    
    return data;
}

