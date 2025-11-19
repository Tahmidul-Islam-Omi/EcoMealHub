import express from "express";
import cors from "cors";
import helmet from "helmet";
import { testConnection } from "./config/db.js";
import apiRoutes from "./routes/index.js";

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
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

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
