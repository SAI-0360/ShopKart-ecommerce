import dotenv from "dotenv";
import Order from "../models/order.model.js";
import User from "../models/customer.model.js";
import Product from "../models/product.model.js";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, city, state, pincode } = req.body.shippingAddress || {};

        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return res.status(400).json({ message: "All shipping address fields are required" })
        }

        const cleanPhone = String(phone).replace(/[\s\-\(\)\.]/g, '');
        const phoneMatch = cleanPhone.match(/^(?:\+91|0)?(\d{10})$/);
        if (!phoneMatch) {
            return res.status(400).json({ message: "Phone must be a valid 10-digit mobile number" });
        }

        if (!req.user.cart || req.user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        const customer = await User.findById(req.user._id).populate("cart.product");
        const cart = customer?.cart || [];

        for (const item of cart) {
            if (!item.product) {
                return res.status(400).json({ message: "Product no longer available" });
            }
            if (item.quantity > item.product.stock) {
                return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
            }
        }// not using forEach

        const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

        const orderItems = cart.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image
        }));

        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(totalAmount * 100), // in paise!
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        });

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress: {
                ...req.body.shippingAddress,
                phone: phoneMatch[1]
            },
            totalAmount,
            paymentStatus: "PENDING",
            status: "PENDING_PAYMENT",
            razorpayOrderId: razorpayOrder.id
        });

        return res.status(201).json({
            success: true,
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const verifyPayment = async (req, res) => {
    try {
        const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;

        if (!orderId || !razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const body = razorpayOrderId + "|" + razorpayPaymentId;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        // Compare signatures
        if (expectedSignature !== razorpaySignature) {
            order.paymentStatus = "FAILED";
            await order.save();
            return res.status(400).json({ message: "Payment verification failed" });
        }

        order.paymentStatus = "PAID";
        order.status = "PLACED";
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();

        // Clear the user's cart after successful payment
        await User.findByIdAndUpdate(req.user._id, { $set: { cart: [] } });

        // Decrease stock of products after successful payment  
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        return res.status(200).json({
            success: true,
            message: "Payment verified and order placed successfully",
            order
        });

    }
    catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error("Get my orders error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // IDOR Guard: Verify ownership
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized access to this order" });
        }

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Get order by id error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};