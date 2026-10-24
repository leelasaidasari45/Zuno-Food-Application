// routes/authRoutes.js
// Defines the URL paths for authentication (register/login)

const express = require("express");
const router = express.Router(); // Express Router lets us group related routes

const { registerUser, loginUser, getMe, updateUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/auth/register  --> call registerUser function
router.post("/register", registerUser);

// POST /api/auth/login  --> call loginUser function
router.post("/login", loginUser);

// GET /api/auth/me  --> get logged-in user (protected = must send token)
router.get("/me", protect, getMe);

// PUT /api/auth/update  --> update logged-in user (protected)
router.put("/update", protect, updateUser);

module.exports = router;
