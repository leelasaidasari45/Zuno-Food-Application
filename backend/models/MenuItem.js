// models/MenuItem.js
// This model stores all food items that belong to a restaurant

const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    // Which restaurant does this item belong to?
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
    },
    // category of this item, e.g. "Burger", "Pizza"
    category: {
      type: String,
      required: true,
    },
    // isVeg: true = veg, false = non-veg
    isVeg: {
      type: Boolean,
      default: true,
    },
    // isAvailable: restaurant can toggle items on/off
    isAvailable: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);
module.exports = MenuItem;
