const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Database
const sequelize = require("./config/database");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const leadRoutes = require("./routes/leadRoutes");
// Initialize Express
const app = express();

// Security middleware
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/leads", leadRoutes);

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexaFlow API is running.",
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;

// Start Server
const startServer = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log("PostgreSQL database connected successfully.");

    // Load models and associations
    require("./models");

    // Synchronize database models
    await sequelize.sync();
    console.log("Database models synchronized successfully.");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`NexaFlow API running at http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Unable to start server:", error.message);
    process.exit(1);
  }
};

startServer();
