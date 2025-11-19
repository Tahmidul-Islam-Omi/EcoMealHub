// index.js
import express from "express";
import db from "./config/db.js";

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

app.listen(3000, () => console.log("Server running on port 5000"));
