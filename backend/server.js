// server.js
// This is the ENTRY POINT of our backend
// It starts the Express server and connects everything together

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables from .env file FIRST before anything else
dotenv.config();

// Connect to MongoDB
connectDB();

// Create an Express application
const app = express();

// -----------------------------------------------
// MIDDLEWARE - code that runs on every request
// -----------------------------------------------

// Allow our React frontend (running on a different port) to talk to this backend
// Without cors(), the browser would block the requests
app.use(cors());

// Allow Express to read JSON request bodies (req.body)
app.use(express.json());

// -----------------------------------------------
// ROUTES - map URL paths to route handlers
// -----------------------------------------------

// Import all route files
const authRoutes = require("./routes/authRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Mount the routes with a base path prefix
// Supported with /api (standard) and without /api (fallback)
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/restaurants", restaurantRoutes);
app.use("/restaurants", restaurantRoutes);

app.use("/api/menu", menuRoutes);
app.use("/menu", menuRoutes);

app.use("/api/orders", orderRoutes);
app.use("/orders", orderRoutes);

// -----------------------------------------------
// ROOT ROUTE - just to test if server is running
// -----------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Zunoindia API 🍽️" });
});

// -----------------------------------------------
// 404 HANDLER - catches any unknown routes
// -----------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// -----------------------------------------------
// START THE SERVER
// -----------------------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 Zunoindia Backend running on http://localhost:${PORT}`);
  console.log(`📋 Environment: development`);
});
