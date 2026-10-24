// routes/menuRoutes.js
// Defines the URL paths for menu item operations

const express = require("express");
const router = express.Router();

const {
  addMenuItem,
  getMenuByRestaurant,
  getMyMenu,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
} = require("../controllers/menuController");

const { protect, isRestaurant } = require("../middleware/authMiddleware");

// Public route - customers can see a restaurant's menu without logging in
// GET /api/menu/restaurant/:restaurantId
router.get("/restaurant/:restaurantId", getMenuByRestaurant);

// Protected restaurant-only routes
// GET /api/menu/my  --> restaurant admin gets their own menu
router.get("/my", protect, isRestaurant, getMyMenu);

// POST /api/menu  --> add a new item
router.post("/", protect, isRestaurant, addMenuItem);

// PUT /api/menu/:id  --> update an item
router.put("/:id", protect, isRestaurant, updateMenuItem);

// PUT /api/menu/:id/toggle  --> toggle availability
router.put("/:id/toggle", protect, isRestaurant, toggleAvailability);

// DELETE /api/menu/:id  --> delete an item
router.delete("/:id", protect, isRestaurant, deleteMenuItem);

module.exports = router;
