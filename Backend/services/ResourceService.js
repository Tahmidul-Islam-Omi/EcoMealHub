import db from "../config/db.js";
import { ResourceTable } from "../models/Resources.js";
import Resources from "../models/Resources.js";

export const getAllResources = async () => {
    
    try{    
        const data=await Resources.getAll();
        console.log("data");
        return data;
    }
    catch(err){
        console.log(err);
        return [];
    }
    
    
}


export const createResource = async (resourceData) => {
    console.log(resourceData);
    
    const data = await Resources.create(resourceData);

    console.log("Resource data to be inserted:", resourceData);
    console.log("Inserted resource data:", data);
    return data;
}
