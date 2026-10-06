import mongoose from 'mongoose';
import Product from '../models/product.model.js';
import User from '../models/customer.model.js';

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user._id;
        const quantity = req.body?.quantity ? Number(req.body.quantity) : 1;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: 'Invalid product ID' });
        }

        // Validate quantity format
        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be a positive integer' });
        }

        // Find Product & User
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if item exists in cart
        const existingCartItem = user.cart.find(
            item => item.product.toString() === productId
        );

        const newQuantity = (existingCartItem?.quantity || 0) + quantity;

        // Stock validation
        if (newQuantity > product.stock) {
            return res.status(400).json({ message: 'Cannot exceed available stock' });
        }

        // Update or push
        if (existingCartItem) {
            existingCartItem.quantity = newQuantity;
        } else {
            user.cart.push({ product: productId, quantity });
        }

        await user.save();

        // Populate and return
        await user.populate({
            path: 'cart.product',
            select: 'name price image stock'
        });

        return res.status(200).json({
            success: true,
            message: 'Cart updated',
            cart: user.cart
        });

    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const removeFromCart = async (req, res) => {

}