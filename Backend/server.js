// index.js
import express from "express";
import db, { testConnection } from "./config/db.js";

const app = express();
app.use(express.json());

app.get("/test", async (req, res) => {
    // basic test query
    const { data, error } = await db
        .from("users")
        .select("*");

    if (error) return res.status(400).json({ error });

    res.json(data);
});

// Start server only after database connection is verified
const startServer = async () => {
    const isConnected = await testConnection();
    
    if (!isConnected) {
        console.error('Server startup aborted due to database connection failure');
        process.exit(1);
    }
    
    app.listen(3000, () => console.log("Server running on port 3000"));
};

startServer();
