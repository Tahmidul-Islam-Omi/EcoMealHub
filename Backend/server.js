import express from "express";
import cors from "cors";
import helmet from "helmet";
import { testConnection } from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { ErrorHandler } from "./middlewares/index.js";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1', apiRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use(ErrorHandler.notFound);

// Error handler
app.use(ErrorHandler.handle);

// Start server only after database connection is verified
const startServer = async () => {
    const isConnected = await testConnection();
    
    if (!isConnected) {
        console.error('Server startup aborted due to database connection failure');
        process.exit(1);
    }
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
        console.log(`📍 API endpoint: http://localhost:${PORT}/api/v1`);
    });
};

startServer();
