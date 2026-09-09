import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// Place Order for frontend using Razorpay
const placeOrder = async (req, res) => {
  try {
    // Creating a New Order from orderModel
    const newOrder = new orderModel({
      userId: req.body.userId, // userId received from Auth middleware
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Saving the received order in the DB
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.json({
        success: false,
        message:
          "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env",
      });
    }

    const currency = req.body.currency || "INR";
    const options = {
      amount: Math.round(req.body.amount * 100), // Amount in paise
      currency: currency,
      receipt: newOrder._id.toString(),
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: razorpayOrder,
      orderId: newOrder._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay placeOrder error:", error);
    res.json({
      success: false,
      message: error.message || "Error placing order!",
    });
  }
};

// Verifying Razorpay payment signature
const verifyOrder = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
    success,
  } = req.body;

  try {
    if (success === "false" || success === false) {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment Cancelled!" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({
        success: false,
        message: "Payment details missing!",
      });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment Verified Successfully!" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Invalid Payment Signature!" });
    }
  } catch (error) {
    console.error("Razorpay verifyOrder error:", error);
    res.json({
      success: false,
      message: error.message || "Error verifying payment!",
    });
  }
};

// User's order API for frontend
const userOrders = async (req, res) => {
  try {
    // Find all order of particular user
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

// Listing orders for admin panel
// API to fetch all the orders details of all users.
const listOrders = async (req, res) => {
  try {
    // accessing all the order's data in the orders var
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    // Finding the order using Id, then updating the status value
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: "Status Updated!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error!" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
