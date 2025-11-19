import db from "../config/db.js";
import { ResourceTable } from "../models/ResourcesModel.js";

export const getAllResources = async () => {
    
    try{    
        const data=await db.query(`SELECT * from ${ResourceTable};`);
        console.log(data.rows);
        return data.rows;
    }
    catch(err){
        console.log(err);
        return [];
    }
    
    
}


export const createResource = async (resourceData) => {
    const { rows: [data] } = await db.query(
        `INSERT INTO ${ResourceTable} (name, type, quantity, location, expiry_date, contact_info) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
        [
            resourceData.name,
            resourceData.type,
            resourceData.quantity,
            resourceData.location,
            resourceData.expiry_date,
            resourceData.contact_info
        ]
    );  

    console.log("Resource data to be inserted:", resourceData);
    console.log("Inserted resource data:", data);
    return data;


}
