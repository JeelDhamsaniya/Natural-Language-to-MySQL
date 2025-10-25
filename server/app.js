import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

// Import config
import { testConnection } from "./config/database.js";

// Import routes
import databaseRoutes from "./routes/databaseRoutes.js";
import queryRoutes from "./routes/queryRoutes.js";

// Import middlewares
import { requestLogger, errorLogger } from "./middlewares/logger.js";

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

// Health check route
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Debug route to check if routes are loaded
app.get("/debug", (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods),
      });
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods),
          });
        }
      });
    }
  });
  res.json({
    success: true,
    routes: routes,
    env: {
      VERCEL: process.env.VERCEL,
      DB_HOST: process.env.DB_HOST ? "Set" : "Not set",
      GEMINI_API_KEY: process.env.GEMINI_API_KEY ? "Set" : "Not set",
    },
  });
});

// API Routes
app.use("/api/database", databaseRoutes);
app.use("/api/query", queryRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Error handler
app.use(errorLogger);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.error(
        "⚠️  Failed to connect to database. Please check your .env configuration."
      );
      console.log(
        "Server will start anyway, but database operations will fail."
      );
    }

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Database: ${process.env.DB_HOST}`);
      console.log(
        `🤖 AI Service: ${
          process.env.GEMINI_API_KEY ? "Google Gemini API" : "Not configured"
        }`
      );
      console.log(`\nAvailable endpoints:`);
      console.log(`  GET  /health`);
      console.log(`  GET  /api/database/tables`);
      console.log(`  GET  /api/database/schema`);
      console.log(`  POST /api/database/tables`);
      console.log(`  POST /api/query/generate`);
      console.log(`  POST /api/query/execute`);
      console.log(`  POST /api/query/analyze`);
      console.log(`\n✨ Ready to accept requests!\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only start server if not in serverless environment (Vercel)
if (process.env.VERCEL !== "1") {
  startServer();
}

export default app;
