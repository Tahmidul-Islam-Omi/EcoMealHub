// index.js
import express from "express";
import ResourceRoute from "./routes/ResouceRoute.js";
import cors from "cors";

import db from "./config/db.js";

const app = express();

const corsOptions = {
    origin: '*', // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.use(express.json());



app.get("/test", async (req, res) => {
    // basic test query
    const { rows } = await db.query('SELECT * FROM USERS;');
    res.json(rows);
});


app.get("/success", async (req, res) => {
  res.json({ message: "Backend running + Supabase client loaded" });
});


app.use("/api/v1/resources", ResourceRoute);

app.listen(3000, () => console.log("Server running on port 3000"));