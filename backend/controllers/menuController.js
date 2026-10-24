// controllers/menuController.js
// Handles adding, updating, deleting and fetching menu items

const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

// -----------------------------------------------
// @route   POST /api/menu
// @desc    Add a new menu item to the restaurant
// @access  Private - Restaurant only
// -----------------------------------------------
const addMenuItem = async (req, res) => {
  try {
    // Find the restaurant owned by this logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Please set up your restaurant first" });
    }

    const { name, description, price, category, isVeg, image } = req.body;

    // Create the menu item and link it to this restaurant
    const item = await MenuItem.create({
      restaurant: restaurant._id,
      name,
      description,
      price,
      category,
      isVeg: isVeg !== undefined ? isVeg : true,
      image: image || "",
    });

    res.status(201).json({ message: "Menu item added", item });
  } catch (error) {
    console.error("Add Menu Item Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/menu/restaurant/:restaurantId
// @desc    Get all menu items for a specific restaurant (for customers)
// @access  Public
// -----------------------------------------------
const getMenuByRestaurant = async (req, res) => {
  try {
    // Find all items where restaurant = the given ID
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(items);
  } catch (error) {
    console.error("Get Menu Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/menu/my
// @desc    Get all menu items for the logged-in restaurant admin
// @access  Private - Restaurant only
// -----------------------------------------------
const getMyMenu = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "No restaurant found" });
    }

    const items = await MenuItem.find({ restaurant: restaurant._id });
    res.json(items);
  } catch (error) {
    console.error("Get My Menu Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   PUT /api/menu/:id
// @desc    Update a menu item (price, availability, etc.)
// @access  Private - Restaurant only
// -----------------------------------------------
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    // Make sure the logged-in restaurant owns this item
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant || item.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }

    // Update only fields that were sent
    const { name, description, price, category, isVeg, isAvailable, image } = req.body;

    if (name) item.name = name;
    if (description !== undefined) item.description = description;
    if (price) item.price = price;
    if (category) item.category = category;
    if (isVeg !== undefined) item.isVeg = isVeg;
    if (isAvailable !== undefined) item.isAvailable = isAvailable;
    if (image) item.image = image;

    const updated = await item.save();
    res.json({ message: "Item updated", item: updated });
  } catch (error) {
    console.error("Update Menu Item Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   DELETE /api/menu/:id
// @desc    Delete a menu item
// @access  Private - Restaurant only
// -----------------------------------------------
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Verify ownership before deleting
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant || item.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await item.deleteOne();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Delete Menu Item Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   PUT /api/menu/:id/toggle
// @desc    Quickly toggle an item's availability (available/not available)
// @access  Private - Restaurant only
// -----------------------------------------------
const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant || item.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Flip the availability - if true make false, if false make true
    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({ message: `Item is now ${item.isAvailable ? "available" : "unavailable"}`, item });
  } catch (error) {
    console.error("Toggle Availability Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addMenuItem,
  getMenuByRestaurant,
  getMyMenu,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
