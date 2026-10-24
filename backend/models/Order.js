// models/Order.js
// This model stores all orders placed by customers

const mongoose = require("mongoose");

// Each item in the order cart
const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: { type: String, required: true },  // snapshot of item name at order time
  price: { type: Number, required: true }, // snapshot of price at order time
  quantity: { type: Number, required: true, default: 1 },
  isVeg: { type: Boolean, default: true },
});

const orderSchema = new mongoose.Schema(
  {
    // Who placed this order?
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Which restaurant is this order for?
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    // The list of items in this order
    items: [orderItemSchema],

    // Total bill amount
    totalAmount: {
      type: Number,
      required: true,
    },
    // 50% advance the customer pays
    advanceAmount: {
      type: Number,
      required: true,
    },
    // Table number selected by customer
    tableNumber: {
      type: Number,
      required: true,
    },
    // When does the customer plan to arrive?
    arrivalTime: {
      type: Date,
      required: true,
    },
    // Order status - restaurant updates this
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ["pending", "advance_paid", "fully_paid"],
      default: "pending",
    },
    // Unique payment reference (simulated for now)
    paymentId: {
      type: String,
      default: "",
    },
    // Any special instructions from the customer
    specialInstructions: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
