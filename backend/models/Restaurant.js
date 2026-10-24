// models/Restaurant.js
// This model stores all restaurant details

const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    // owner links this restaurant to the User who created it
    owner: {
      type: mongoose.Schema.Types.ObjectId, // stores the ID of a User document
      ref: "User",                          // refers to the "User" collection
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    // categories help customers filter restaurants on the home page
    // e.g. ["Burger", "Pizza", "Indian"]
    categories: {
      type: [String], // array of strings
      default: [],
    },
    numberOfTables: {
      type: Number,
      default: 10,
    },
    // image URL for the restaurant banner
    image: {
      type: String,
      default: "",
    },
    // rating shown to customers
    rating: {
      type: Number,
      default: 0,
    },
    // prepTime in minutes, shown on the restaurant page
    prepTime: {
      type: Number,
      default: 15,
    },
    // isOpen tells the customer if the restaurant is accepting orders
    isOpen: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
module.exports = Restaurant;
