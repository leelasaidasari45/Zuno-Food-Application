// controllers/orderController.js
// Handles creating orders, payment simulation, status updates, and history

const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

// -----------------------------------------------
// @route   POST /api/orders
// @desc    Customer places a new order
// @access  Private - Customer only
// -----------------------------------------------
const placeOrder = async (req, res) => {
  const { restaurantId, items, tableNumber, arrivalTime, specialInstructions } = req.body;

  try {
    // Verify the restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Calculate the total amount by fetching each item's current price from DB
    // This is important - we don't trust the price sent from the frontend
    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const menuItem = await MenuItem.findById(cartItem.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ message: `Item ${cartItem.menuItemId} not found` });
      }
      if (!menuItem.isAvailable) {
        return res.status(400).json({ message: `${menuItem.name} is currently not available` });
      }

      const itemTotal = menuItem.price * cartItem.quantity;
      totalAmount += itemTotal;

      // Store a snapshot of item details (so even if restaurant updates price later, order is unchanged)
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: cartItem.quantity,
        isVeg: menuItem.isVeg,
      });
    }

    // Advance is 50% of total
    const advanceAmount = totalAmount * 0.5;

    // Create the order in the database
    const order = await Order.create({
      customer: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount,
      advanceAmount,
      tableNumber,
      arrivalTime: new Date(arrivalTime),
      specialInstructions: specialInstructions || "",
      status: "pending",
      paymentStatus: "pending",
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Place Order Error:", error.message);
    res.status(500).json({ message: "Server error placing order" });
  }
};

// -----------------------------------------------
// @route   POST /api/orders/:id/pay
// @desc    Simulate advance payment for an order
// @access  Private - Customer only
// -----------------------------------------------
const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure only the customer who placed this order can pay
    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.paymentStatus !== "pending") {
      return res.status(400).json({ message: "Order already paid" });
    }

    // Simulate payment - generate a fake payment ID
    const fakePaymentId = "PAY_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9).toUpperCase();

    order.paymentStatus = "advance_paid";
    order.paymentId = fakePaymentId;
    order.status = "confirmed"; // Once paid, restaurant can see it as confirmed

    await order.save();

    res.json({
      message: "Payment successful! Order confirmed.",
      paymentId: fakePaymentId,
      order,
    });
  } catch (error) {
    console.error("Pay Order Error:", error.message);
    res.status(500).json({ message: "Server error processing payment" });
  }
};

// -----------------------------------------------
// @route   GET /api/orders/my
// @desc    Get all orders placed by the logged-in customer
// @access  Private - Customer only
// -----------------------------------------------
const getMyOrders = async (req, res) => {
  try {
    // populate() replaces the restaurant ID with the actual restaurant data
    const orders = await Order.find({ customer: req.user._id })
      .populate("restaurant", "name address image") // get restaurant name, address, image
      .sort({ createdAt: -1 }); // newest first

    res.json(orders);
  } catch (error) {
    console.error("Get My Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/orders/:id
// @desc    Get a single order by ID (for order status page)
// @access  Private - Customer or Restaurant
// -----------------------------------------------
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("restaurant", "name address image phone")
      .populate("customer", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only the customer who placed it or the restaurant owner can see it
    const restaurant = await Restaurant.findById(order.restaurant._id);
    const isOwner = restaurant && restaurant.owner.toString() === req.user._id.toString();
    const isCustomer = order.customer._id.toString() === req.user._id.toString();

    if (!isOwner && !isCustomer) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    console.error("Get Order Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/orders/restaurant/all
// @desc    Get all orders for the logged-in restaurant
// @access  Private - Restaurant only
// -----------------------------------------------
const getRestaurantOrders = async (req, res) => {
  try {
    // First find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Find all orders for this restaurant
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("customer", "name email phone") // get customer info
      .sort({ arrivalTime: 1 }); // sort by arrival time (soonest first)

    res.json(orders);
  } catch (error) {
    console.error("Get Restaurant Orders Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   PUT /api/orders/:id/status
// @desc    Restaurant updates the status of an order
// @access  Private - Restaurant only
// -----------------------------------------------
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  // List of allowed status transitions
  const allowedStatuses = ["confirmed", "preparing", "ready", "completed", "cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Make sure this order belongs to the restaurant admin's restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant || order.restaurant.toString() !== restaurant._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.status = status;
    await order.save();

    res.json({ message: `Order status updated to "${status}"`, order });
  } catch (error) {
    console.error("Update Order Status Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// -----------------------------------------------
// @route   GET /api/orders/restaurant/analytics
// @desc    Get simple analytics for the restaurant dashboard
// @access  Private - Restaurant only
// -----------------------------------------------
const getAnalytics = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    // Total orders
    const totalOrders = await Order.countDocuments({ restaurant: restaurant._id });

    // Today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0); // set to midnight to get start of today
    const todayOrders = await Order.countDocuments({
      restaurant: restaurant._id,
      createdAt: { $gte: today }, // $gte = greater than or equal (from midnight)
    });

    // Total revenue from completed orders
    const revenueResult = await Order.aggregate([
      { $match: { restaurant: restaurant._id, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Upcoming orders (confirmed/preparing, arrival time in future)
    const upcomingOrders = await Order.find({
      restaurant: restaurant._id,
      status: { $in: ["confirmed", "preparing"] },
      arrivalTime: { $gte: new Date() },
    }).populate("customer", "name");

    res.json({ totalOrders, todayOrders, totalRevenue, upcomingOrders });
  } catch (error) {
    console.error("Analytics Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  placeOrder,
  payOrder,
  getMyOrders,
  getOrderById,
  getRestaurantOrders,
  updateOrderStatus,
  getAnalytics,
};
