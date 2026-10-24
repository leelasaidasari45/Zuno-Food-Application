// routes/restaurantRoutes.js
// Defines the URL paths for restaurant operations

const express = require("express");
const router = express.Router();

const {
  setupRestaurant,
  getMyRestaurant,
  updateRestaurant,
  getAllRestaurants,
  getRestaurantById,
} = require("../controllers/restaurantController");

const { protect, isRestaurant } = require("../middleware/authMiddleware");

// Public routes (no token needed)
// GET /api/restaurants  --> list all restaurants (with optional ?category=Pizza filter)
router.get("/", getAllRestaurants);

// GET /api/restaurants/:id  --> get one restaurant by ID
router.get("/:id", getRestaurantById);

// Protected routes (need token + must be restaurant role)
// POST /api/restaurants/setup  --> create restaurant profile
router.post("/setup", protect, isRestaurant, setupRestaurant);

// GET /api/restaurants/my  --> get my restaurant profile
// NOTE: "my" route must come BEFORE "/:id" to avoid conflicts
router.get("/my/profile", protect, isRestaurant, getMyRestaurant);

// PUT /api/restaurants/update  --> update my restaurant
router.put("/update", protect, isRestaurant, updateRestaurant);

module.exports = router;
