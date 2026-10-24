// routes/orderRoutes.js
// Defines the URL paths for order operations

const express = require("express");
const router = express.Router();

const {
  placeOrder,
  payOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getAnalytics,
} = require("../controllers/orderController");

const { protect, isRestaurant, isCustomer } = require("../middleware/authMiddleware");

// All order routes are protected (must be logged in)

// Customer routes
// POST /api/orders  --> place a new order
router.post("/", protect, isCustomer, placeOrder);

// POST /api/orders/:id/pay  --> simulate payment
router.post("/:id/pay", protect, isCustomer, payOrder);

// GET /api/orders/my  --> customer sees their own orders
router.get("/my", protect, isCustomer, getMyOrders);

// Restaurant routes
// GET /api/orders/restaurant/all  --> restaurant sees all their orders
router.get("/restaurant/all", protect, isRestaurant, getRestaurantOrders);

// GET /api/orders/restaurant/analytics  --> restaurant sees analytics
router.get("/restaurant/analytics", protect, isRestaurant, getAnalytics);

// PUT /api/orders/:id/status  --> restaurant updates order status
router.put("/:id/status", protect, isRestaurant, updateOrderStatus);

// Shared route (both customer and restaurant can view)
// GET /api/orders/:id  --> get a single order
// This must come LAST so it doesn't conflict with the routes above
router.get("/:id", protect, getOrderById);

module.exports = router;
