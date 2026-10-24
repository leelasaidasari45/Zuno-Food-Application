// middleware/authMiddleware.js
// This file protects routes so only logged-in users can access them

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// protect - middleware that checks if the user has a valid JWT token
const protect = async (req, res, next) => {
  let token;

  // JWT tokens are sent in the Authorization header like: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Split "Bearer <token>" and grab just the token part
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using our secret key - if tampered, it throws an error
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user from the database using the ID stored in the token
      // .select("-password") means: give me everything EXCEPT the password
      req.user = await User.findById(decoded.id).select("-password");

      // Move on to the actual route handler
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// isRestaurant - middleware that checks if the logged-in user is a restaurant admin
const isRestaurant = (req, res, next) => {
  if (req.user && req.user.role === "restaurant") {
    next(); // yes they are a restaurant, let them through
  } else {
    res.status(403).json({ message: "Access denied. Restaurant accounts only." });
  }
};

// isCustomer - middleware that checks if the logged-in user is a customer
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === "customer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Customer accounts only." });
  }
};

module.exports = { protect, isRestaurant, isCustomer };
