import Order from "../models/order.model";
import User from "../models/customer.model";
import Product from "../models/product.model";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createPaymentOrder = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, city, state, pincode } = req.body.shippingAddress;

        if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
            return res.status(400).json({ message: "All shipping address fields are required" })
        }

        if (!req.user.cart || req.user.cart.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        const cart = req.user.cart;

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
            shippingAddress: req.body.shippingAddress,
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

