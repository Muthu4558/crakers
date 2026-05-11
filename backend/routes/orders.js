const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cracker = require("../models/Cracker");
const { auth, adminAuth } = require("../middleware/auth");

// ─────────────────────────────────────────────────────────
// POST /api/orders/verify-payment
// Called after mock Razorpay popup succeeds on frontend.
// Saves order with paymentStatus=Completed, status=Confirmed.
// No real Razorpay SDK or signature check needed (demo mode).
// ─────────────────────────────────────────────────────────
router.post("/verify-payment", auth, async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
    } = req.body;

    if (!razorpayPaymentId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    // Build order items & verify stock
    let calculatedTotal = 0;
    const orderItems = [];

    for (let item of items) {
      const cracker = await Cracker.findById(item.crackerId);
      if (!cracker)
        return res
          .status(404)
          .json({ message: `Cracker not found: ${item.crackerId}` });
      if (cracker.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock: ${cracker.name}` });

      orderItems.push({
        cracker: item.crackerId,
        quantity: item.quantity,
        price: cracker.price,
      });
      calculatedTotal += cracker.price * item.quantity;
    }

    // Create confirmed + paid order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount: totalAmount || calculatedTotal,
      shippingAddress,
      paymentMethod: paymentMethod || "Razorpay",
      paymentStatus: "Completed",
      status: "Confirmed",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    await order.save();

    // Deduct stock
    for (let item of items) {
      await Cracker.findByIdAndUpdate(item.crackerId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("verify-payment error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────
// POST /api/orders  (Cash on Delivery)
// ─────────────────────────────────────────────────────────
router.post("/", auth, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    if (paymentMethod !== "Cash on Delivery") {
      return res
        .status(400)
        .json({ message: "Use /verify-payment for online payments" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (let item of items) {
      const cracker = await Cracker.findById(item.crackerId);
      if (!cracker)
        return res
          .status(404)
          .json({ message: `Cracker not found: ${item.crackerId}` });
      if (cracker.stock < item.quantity)
        return res
          .status(400)
          .json({ message: `Insufficient stock: ${cracker.name}` });

      orderItems.push({
        cracker: item.crackerId,
        quantity: item.quantity,
        price: cracker.price,
      });
      totalAmount += cracker.price * item.quantity;
    }

    const order = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: "Cash on Delivery",
      paymentStatus: "Pending",
      status: "Pending",
    });

    await order.save();

    for (let item of items) {
      await Cracker.findByIdAndUpdate(item.crackerId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/orders/user/my-orders
// ─────────────────────────────────────────────────────────
router.get("/user/my-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.cracker")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/orders  (Admin)
// ─────────────────────────────────────────────────────────
router.get("/", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email phone")
      .populate("items.cracker")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────
// GET /api/orders/:id
// ─────────────────────────────────────────────────────────
router.get("/:id", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate("items.cracker");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (
      order.user._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────
// PUT /api/orders/:id  (Admin update)
// ─────────────────────────────────────────────────────────
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(paymentStatus && { paymentStatus }) },
      { new: true, runValidators: true },
    ).populate("items.cracker");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ─────────────────────────────────────────────────────────
// PUT /api/orders/:id/cancel
// ─────────────────────────────────────────────────────────
router.put("/:id/cancel", auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });
    if (!["Pending", "Confirmed"].includes(order.status)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.status = "Cancelled";
    await order.save();

    // Restore stock
    for (let item of order.items) {
      await Cracker.findByIdAndUpdate(item.cracker, {
        $inc: { stock: item.quantity },
      });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
