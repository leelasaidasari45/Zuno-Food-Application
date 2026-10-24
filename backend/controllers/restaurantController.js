// controllers/restaurantController.js
// Handles all restaurant-related operations

const Restaurant = require("../models/Restaurant");

// -----------------------------------------------
// @route   POST /api/restaurants/setup
// @desc    Restaurant admin sets up their restaurant profile
// @access  Private - Restaurant only
// -----------------------------------------------
const setupRestaurant = async (req, res) => {
  const { name, address, categories, numberOfTables, phone, description, prepTime, image } = req.body;

  try {
    // Check if this user already has a restaurant set up
    const existing = await Restaurant.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ message: "Restaurant already set up. Use update instead." });
    }

    // Create a new restaurant linked to the logged-in user (owner)
    const restaurant = await Restaurant.create({
      owner: req.user._id,
      name,
      address,
      categories: categories || [],
      numberOfTables: numberOfTables || 10,
      phone: phone || "",
      description: description || "",
      prepTime: prepTime || 15,
      image: image || "",
    });

    res.status(201).json({ message: "Restaurant set up successfully", restaurant });
  } catch (error) {
    console.error("Setup Restaurant Error:", error.message);
    res.status(500).json({ message: "Server error setting up restaurant" });
  }
};

// -----------------------------------------------
// @route   GET /api/restaurants/my
// @desc    Get the restaurant profile of the logged-in admin
// @access  Private - Restaurant only
// -----------------------------------------------
const getMyRestaurant = async (req, res) => {
  try {
    // Find the restaurant where owner = the logged-in user's ID
    const restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      // Return empty defaults so the Settings page can fill them in
      return res.json({
        name: "",
        address: "",
        phone: req.user.phone || "",
        description: "",
        image: "",
        numberOfTables: 10,
        prepTime: 15,
        categories: [],
        isOpen: true,
      });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Get My Restaurant Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   PUT /api/restaurants/update
// @desc    Update or create restaurant details
// @access  Private - Restaurant only
// -----------------------------------------------
const updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({ owner: req.user._id });

    const { name, address, categories, numberOfTables, phone, description, prepTime, isOpen, image } = req.body;

    // If restaurant doesn't exist yet, create it!
    if (!restaurant) {
      restaurant = await Restaurant.create({
        owner: req.user._id,
        name: name || "My Restaurant",
        address: address || "",
        categories: categories || [],
        numberOfTables: numberOfTables !== undefined ? Number(numberOfTables) : 10,
        phone: phone || "",
        description: description || "",
        prepTime: prepTime !== undefined ? Number(prepTime) : 15,
        isOpen: typeof isOpen === "boolean" ? isOpen : true,
        image: image || "",
      });
      return res.json({ message: "Restaurant details saved!", restaurant });
    }

    // Update only fields that were sent in the request
    if (name !== undefined) restaurant.name = name;
    if (address !== undefined) restaurant.address = address;
    if (categories !== undefined) restaurant.categories = categories;
    if (numberOfTables !== undefined) restaurant.numberOfTables = Number(numberOfTables);
    if (phone !== undefined) restaurant.phone = phone;
    if (description !== undefined) restaurant.description = description;
    if (prepTime !== undefined) restaurant.prepTime = Number(prepTime);
    if (typeof isOpen === "boolean") restaurant.isOpen = isOpen;
    if (image !== undefined) restaurant.image = image;

    const updated = await restaurant.save();
    res.json({ message: "Restaurant updated", restaurant: updated });
  } catch (error) {
    console.error("Update Restaurant Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/restaurants
// @desc    Get ALL restaurants (for customer home page)
// @access  Public
// -----------------------------------------------
const getAllRestaurants = async (req, res) => {
  try {
    // Optionally filter by category: /api/restaurants?category=Pizza
    const { category } = req.query;

    let filter = {}; // empty filter = get all

    // If a category is passed, filter restaurants that have that category in their array
    if (category && category !== "All") {
      filter.categories = { $in: [category] }; // $in checks if array contains the value
    }

    const restaurants = await Restaurant.find(filter).select("-owner"); // hide owner ID

    res.json(restaurants);
  } catch (error) {
    console.error("Get All Restaurants Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/restaurants/:id
// @desc    Get a single restaurant by its ID
// @access  Public
// -----------------------------------------------
const getRestaurantById = async (req, res) => {
  try {
    // req.params.id is the :id part from the URL
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (error) {
    console.error("Get Restaurant Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  setupRestaurant,
  getMyRestaurant,
  updateRestaurant,
  getAllRestaurants,
  getRestaurantById,
};
