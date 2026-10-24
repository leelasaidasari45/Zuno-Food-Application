// controllers/authController.js
// This file handles user registration and login logic

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to create a JWT token for a user
// The token contains the user's ID and expires in 7 days
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// -----------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new user (customer or restaurant)
// @access  Public (anyone can call this)
// -----------------------------------------------
const registerUser = async (req, res) => {
  // Destructure the data sent in the request body
  const { name, email, password, role, phone } = req.body;

  try {
    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create the new user in the database
    // Password gets hashed automatically by our User model's pre-save hook
    const user = await User.create({ name, email, password, role, phone });

    // Send back the user info and a token so they are instantly logged in
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// -----------------------------------------------
// @route   POST /api/auth/login
// @desc    Login an existing user
// @access  Public
// -----------------------------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If no user found, or password doesn't match, send error
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If login is successful, send back user data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// -----------------------------------------------
// @route   GET /api/auth/me
// @desc    Get logged-in user's profile
// @access  Private (requires token)
// -----------------------------------------------
const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    phone: req.user.phone,
  });
};

// -----------------------------------------------
// @route   PUT /api/auth/update
// @desc    Update logged-in user's details
// @access  Private (requires token)
// -----------------------------------------------
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update only the fields that were sent
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    // If user wants to update password
    if (req.body.password) {
      user.password = req.body.password; // pre-save hook will hash it
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
    });
  } catch (error) {
    console.error("Update User Error:", error.message);
    res.status(500).json({ message: "Server error during update" });
  }
};

module.exports = { registerUser, loginUser, getMe, updateUser };
